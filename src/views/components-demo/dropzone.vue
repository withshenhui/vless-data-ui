<template>
  <div class="components-container">
    <div class="editor-container">
      <dropzone  v-on:dropzone-removedFile="dropzoneR" v-on:dropzone-success="dropzoneS" id="myVueDropzone" url="http://localhost:8080/api/upload"></dropzone>
    </div>
  </div>
</template>

<script>
import Dropzone from '@/components/Dropzone'
import { upload } from '@/api/upload'

export default {
  name: 'dropzone-demo',
  components: { Dropzone },
  methods: {
    dropzoneS(file,result) {
      console.log(result)
      this.$message({ message: 'Upload success:'+file.name, type: 'success' })
    },
    dropzoneR(file) {
      //console.log(file)
      //this.$message({ message: 'Delete success', type: 'success' })
    }
  }
}
</script>


