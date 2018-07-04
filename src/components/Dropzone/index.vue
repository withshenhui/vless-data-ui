<template>
  <div :ref="id" :action="url" class="dropzone" :id="id">
    <input type="file" name="file">
  </div>
</template>

<script>
import Dropzone from 'dropzone'
import 'dropzone/dist/dropzone.css'

Dropzone.autoDiscover = false

export default {
  data() {
    return {
      dropzone: '',
      initOnce: true,
      ofile:null,
      nfile:null
    }
  },
  mounted() {
    const element = document.getElementById(this.id)
    const vm = this
    this.dropzone = new Dropzone(element, {
      clickable: this.clickable,
      thumbnailWidth: this.thumbnailWidth,
      thumbnailHeight: this.thumbnailHeight,
      maxFiles: this.maxFiles,
      maxFilesize: this.maxFilesize,
      dictRemoveFile: '删除',
      addRemoveLinks: this.showRemoveLink,
      acceptedFiles: this.acceptedFiles,
      autoProcessQueue: this.autoProcessQueue,
      dictDefaultMessage: '<i style="margin-top: 4em;display: inline-block" class="material-icons">' + this.defaultMsg + '</i><br>拖拽文件到此处上传',
      dictMaxFilesExceeded: '只能上传一张图片',
      previewTemplate: '<div class="dz-preview dz-file-preview">  <div class="dz-image" style="width:' + this.thumbnailWidth + 'px;height:' + this.thumbnailHeight + 'px" ><img style="width:' + this.thumbnailWidth + 'px;height:' + this.thumbnailHeight + 'px" data-dz-thumbnail /></div>  <div class="dz-details"><div class="dz-size"><span data-dz-size></span></div> <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>  <div class="dz-error-message"><span data-dz-errormessage></span></div>  <div class="dz-success-mark"> <i class="material-icons">done</i> </div>  <div class="dz-error-mark"><i class="material-icons">error</i></div></div>',
      init() {
        const val = vm.defaultImg
        console.log("enter init="+val)
        if (!val) return
        vm.ofile = { name: 'name', size: 12345, url: val }
        this.options.addedfile.call(this, vm.ofile)
        this.options.thumbnail.call(this, vm.ofile, val)
        vm.ofile.previewElement.classList.add('dz-success')
        vm.ofile.previewElement.classList.add('dz-complete')
        vm.initOnce = false
        console.log("init=ofile="+vm.ofile.url)
      },
      accept: (file, done) => {
        /* 七牛*/
        // const token = this.$store.getters.token;
        // getToken(token).then(response => {
        //   file.token = response.data.qiniu_token;
        //   file.key = response.data.qiniu_key;
        //   file.url = response.data.qiniu_url;
        //   done();
        // })
        done()
      },
      sending: (file, xhr, formData) => {
        // formData.append('token', file.token);
        // formData.append('key', file.key);
        //vm.initOnce = false
      }
    })

    if (this.couldPaste) {
      document.addEventListener('paste', this.pasteImg)
    }

    this.dropzone.on('success', (file,result) => {
      //this.removeAllFiles()
      vm.$emit('dropzone-success', file, result,vm.dropzone.element)
    })
    this.dropzone.on('addedfile', file => {
      // console.log("add file")
      // this.ofile.url=file.url
      // this.nfile.url=this.ofile.url
      // console.log("add file="+this.ofile.url)
      vm.$emit('dropzone-fileAdded', file)
    })
    this.dropzone.on('removedfile', file => {
      console.log("delete file")
      vm.$emit('dropzone-removedFile', file)
    })
    this.dropzone.on('error', (file, error, xhr) => {
      vm.$emit('dropzone-error', file, error, xhr)
    })
    this.dropzone.on('successmultiple', (file, error, xhr) => {
      vm.$emit('dropzone-successmultiple', file, error, xhr)
    })
  },
  methods: {
    removeAllFiles() {
      this.dropzone.removeAllFiles(true)
    },
    processQueue() {
      this.dropzone.processQueue()
    },
    pasteImg(event) {
      const items = (event.clipboardData || event.originalEvent.clipboardData).items
      if (items[0].kind === 'file') {
        this.dropzone.addFile(items[0].getAsFile())
      }
    }
    // ,initImages(val) {
    //   if (!val) return
    //   console.log("initImages="+val)
    //   this.nfile = { name: 'name', size: 12345, url: val }
    //   console.log("new="+this.nfile.url)
    //   if(this.ofile!=null){
    //     console.log("method old="+this.ofile.url)
    //     this.dropzone.options.removedfile.call(this.dropzone, this.ofile )
    //   }
          
    //    console.log("new2="+this.nfile.url)
    //    if(this.ofile.url!=this.nfile.url){
    //      console.log("add=")
    //      this.dropzone.options.addedfile.call(this.dropzone, this.nfile )
    //     this.dropzone.options.thumbnail.call(this.dropzone, this.nfile, val)
    //     this.nfile.previewElement.classList.add('dz-success')
    //     this.nfile.previewElement.classList.add('dz-complete')
    //    }
        

    //   // if(this.ofile!=null&&this.ofile.url!=this.nfile.url){
    //   //   console.log("new2="+this.nfile.url)
    //   //   this.dropzone.options.addedfile.call(this.dropzone, this.nfile )
    //   //   this.dropzone.options.thumbnail.call(this.dropzone, this.nfile, val)
    //   //   this.nfile.previewElement.classList.add('dz-success')
    //   //   this.nfile.previewElement.classList.add('dz-complete')
    //   // }
    //   this.ofile=this.nfile

    // }

  },
  destroyed() {
    document.removeEventListener('paste', this.pasteImg)
    this.dropzone.destroy()
  },
  watch: {
    defaultImg(newVal) {
      this.nfile = { name: 'name', size: 12345, url: newVal }
      if(this.showFlag){
        if(this.ofile!=null&&this.ofile.url!=this.nfile.url){
          console.log("add=")
          this.dropzone.options.removedfile.call(this.dropzone, this.ofile )
          this.dropzone.options.addedfile.call(this.dropzone, this.nfile )
          this.dropzone.options.thumbnail.call(this.dropzone, this.nfile, this.nfile.url)
          this.nfile.previewElement.classList.add('dz-success')
          this.nfile.previewElement.classList.add('dz-complete')
        }
      }
      this.ofile=this.nfile

      // if(this.ofile!=null)
      //  console.log("watch="+newVal+",old="+this.ofile.url)
      // else
      //  console.log("watch="+newVal+",null")
      // if (newVal!=null) {
      //   //this.initOnce = false
      //   //this.dropzone.options.removedfile.call(this.dropzone, this.this.ofile )
      //   //this.ofile=this.nfile
      //   this.ofile.url=newVal
      //   if(this.ofile!=null){
      //     console.log("old="+this.ofile.url)
      //   }else{
      //     console.log("old=null")
      //   }
      //   //return
      // }else{
      //   return
      // }
       
      // //if (!this.initOnce) return
      // if(this.showFlag){
      //   console.log("show="+this.showFlag)
      //   this.initImages(newVal)
      //   //this.ofile=this.nfile
      //   //this.initOnce = false
      // }
      // //this.ofile=this.nfile
    }
  },
  props: {
    id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    clickable: {
      type: Boolean,
      default: true
    },
    defaultMsg: {
      type: String,
      default: '上传图片'
    },
    acceptedFiles: {
      type: String
    },
    thumbnailHeight: {
      type: Number,
      default: 100
    },
    thumbnailWidth: {
      type: Number,
      default: 100
    },
    showRemoveLink: {
      type: Boolean,
      default: true
    },
    maxFilesize: {
      type: Number,
      default: 10
    },
    maxFiles: {
      type: Number,
      default: 1
    },
    autoProcessQueue: {
      type: Boolean,
      default: true
    },
    useCustomDropzoneOptions: {
      type: Boolean,
      default: false
    },
    defaultImg: {
      default: false
    },
    couldPaste: {
      default: false
    },
    showFlag: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
    .dropzone {
        border: 2px solid #E5E5E5;
        font-family: 'Roboto', sans-serif;
        color: #777;
        transition: background-color .2s linear;
        padding: 5px;
        
    }

    .dropzone:hover {
        background-color: #F6F6F6;
    }

    i {
        color: #CCC;
    }

    .dropzone .dz-image img {
        width: 100%;
        height: 100%;
    }

    .dropzone input[name='file'] {
        display: none;
    }

    .dropzone .dz-preview .dz-image {
        border-radius: 0px;
    }

    .dropzone .dz-preview:hover .dz-image img {
        transform: none;
        -webkit-filter: none;
        width: 100%;
        height: 100%;
    }

    .dropzone .dz-preview .dz-details {
        bottom: 0px;
        top: 0px;
        color: white;
        background-color: rgba(33, 150, 243, 0.8);
        transition: opacity .2s linear;
        text-align: left;
    }

    .dropzone .dz-preview .dz-details .dz-filename span, .dropzone .dz-preview .dz-details .dz-size span {
        background-color: transparent;
    }

    .dropzone .dz-preview .dz-details .dz-filename:not(:hover) span {
        border: none;
    }

    .dropzone .dz-preview .dz-details .dz-filename:hover span {
        background-color: transparent;
        border: none;
    }

    .dropzone .dz-preview .dz-remove {
        position: absolute;
        z-index: 30;
        color: white;
        margin-left: 15px;
        padding: 10px;
        top: inherit;
        bottom: 15px;
        border: 2px white solid;
        text-decoration: none;
        text-transform: uppercase;
        font-size: 0.8rem;
        font-weight: 800;
        letter-spacing: 1.1px;
        opacity: 0;
    }

    .dropzone .dz-preview:hover .dz-remove {
        opacity: 1;
    }

    .dropzone .dz-preview .dz-success-mark, .dropzone .dz-preview .dz-error-mark {
        margin-left: -40px;
        margin-top: -50px;
    }

    .dropzone .dz-preview .dz-success-mark i, .dropzone .dz-preview .dz-error-mark i {
        color: white;
        font-size: 5rem;
    }
</style>
