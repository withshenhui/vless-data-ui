<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.title')" v-model="listQuery.actionName">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="danger" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      <el-button class="filter-item" type="warning" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" type="index" width="65">
      </el-table-column>
      <el-table-column width="160px" align="center" :label="$t('table.gmtCreate')">
        <template slot-scope="scope">
          <span>{{scope.row.gmtCreate}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" :label="'编号'" >
        <template slot-scope="scope">
          <span>{{scope.row.actionNo}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" :label="'名称'" >
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.actionName}}</span>
        </template>
      </el-table-column>
       <el-table-column min-width="150px" :label="'类型名称'" >
        <template slot-scope="scope">
          <span>{{scope.row.actionTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="'备注'">
        <template slot-scope="scope">
          <span>{{scope.row.memo}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" :label="$t('table.status')" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusValueFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleDelete(scope.row)">{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="90px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="'图片'" prop="actionImages">
          <dropzone defaultMsg="上传图片" ref="Dropzone" :defaultImg="temp.actionImages" v-on:dropzone-removedFile="dropzoneR" v-on:dropzone-success="dropzoneS" id="myVueDropzone" :url="uploadUrl">
          </dropzone>
        </el-form-item>
         <el-form-item :label="'行为类型'" prop="actionTypeName">
          <el-select class="filter-item"  ref="typeSelect" v-model="temp.actionTypeName" placeholder="Please select">
            <el-option v-for="item in  actionTypeOptions" :key="item.id" :label="item.actionName" :value="item.actionName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="'编号'" prop="actionNo">
          <el-input v-model="temp.actionNo"></el-input>
        </el-form-item>        
        <el-form-item :label="'名称'" prop="actionName">
          <el-input v-model="temp.actionName"></el-input>
        </el-form-item>

        <el-form-item :label="$t('table.status')">
          <el-select class="filter-item" v-model="temp.status" placeholder="Please select">
            <el-option v-for="item in  statusOptions" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.memo')">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input" v-model="temp.memo">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createDataCancel">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogEditVisible">
      <el-form :rules="rules" ref="editForm" :model="editTemp" label-position="left" label-width="90px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="'图片'" prop="actionImages">
          <dropzone defaultMsg="上传图片" ref="editDropzone" :showFlag="showFlag" :defaultImg="editTemp.actionImages" v-on:dropzone-removedFile="dropzoneR" v-on:dropzone-success="dropzoneS" id="editDropzone" :url="uploadUrl">
          </dropzone>
        </el-form-item>
         <el-form-item :label="'行为类型'" prop="actionTypeName">
          <el-select class="filter-item"  ref="typeSelect" v-model="editTemp.actionTypeName" placeholder="Please select">
            <el-option v-for="item in  actionTypeOptions" :key="item.id" :label="item.actionName" :value="item.actionName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="'编号'" prop="actionNo">
          <el-input v-model="editTemp.actionNo"></el-input>
        </el-form-item>        
        <el-form-item :label="'名称'" prop="actionName">
          <el-input v-model="editTemp.actionName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.status')">
          <el-select class="filter-item" v-model="editTemp.status" placeholder="Please select">
            <el-option v-for="item in  statusOptions" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.memo')">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input" v-model="editTemp.memo">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDataCancel">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Dropzone from '@/components/Dropzone'
import { fetchList, createAction, updateAction, removeAction } from '@/api/action'
import { fetchActionTypeList } from '@/api/actionType'
import {mapGetters} from 'vuex'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'actionTable',
  directives: {
    waves
  },
  components: { Dropzone },
  data() {
    return {
      uploadUrl:process.env.BASE_API+"/rest/upload",
      tableKey: 0,
      // list: null,
      // total: null,
      listLoading: true,
      // actionTypeOptions,
      // actionTypeKeyValue:[],
      listQuery: {
        page: 1,
        limit: 20,
        actionName: undefined,
        actionTypeName:undefined
        //sort: '+id'
      },
      statusOptions: [{'key':'CREATED','value':'新建'}, {'key':'DISABLED','value':'禁用'}],
      showReviewer: false,
      temp: {
        id: undefined,
        memo: '',
        gmtCreate:'',
        actionNo:'',
        actionName: '',
        actionTypeName:'',
        actionTypeId:'',
        actionImages:null,
        status: 'CREATED'
      },
      editTemp: {
        id: undefined,
        memo: '',
        gmtCreate:'',
        actionNo:'',
        actionName: '',
        actionTypeName:'',
        actionTypeId:'',
        actionImages:null,
        status: 'CREATED'
      },
      dialogFormVisible: false,
      dialogEditVisible: false,
      showFlag:true,
      uploadFlag:false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rules: {
        actionTypeName: [{ required: true, message: '类型不能为空', trigger: 'change' }],
        actionNo: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
        actionName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        actionImages: [{ required: true, message: '图片不能为空', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        CREATED: 'success',
        DISABLED: 'danger'
      }
      return statusMap[status]
    }
    ,statusValueFilter(status) {
      const statusMap = {
        CREATED: '新建',
        DISABLED: '禁用'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getList(),
    this.getActionTypeList()
  },
    computed: {
    ...mapGetters({
      actionTypeOptions:'actionTypeList',
      actionTypeKeyValue:'actionTypeKeyValue',
      list:'actionList',
      total:'actionTotal'
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.data
      //   this.total = response.data.count
      //   this.listLoading = false
      // })
      this.$store.dispatch('GetActionList', this.listQuery).then(() => {
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
     getActionTypeList() {
        if(this.actionTypeOptions==null||this.actionTypeOptions.length==0){
          this.$store.dispatch('GetActionTypeList', null).then(() => {
            }).catch(() => {
          })
        }
          
      // fetchActionTypeList(this.listQuery).then(response => {
      //   this.actionTypeOptions = response.data.data
      //   this.actionTypeKeyValue=response.data.data.reduce((acc, cur) => {
      //   acc[cur.actionName] = cur.id
      //   return acc
      //   }, {})
      // })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        memo: '',
        actionName: '',
        status: 'CREATED',
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createDataCancel() {
      this.dialogFormVisible = false
       this.$nextTick(() => {
        this.$refs.Dropzone.removeAllFiles()
      })
    },    
    editDataCancel() {
      this.dialogEditVisible = false
       if(this.uploadFlag)
          this.$refs.editDropzone.removeAllFiles()
    this.showFlag=true
      //this.editTemp.actionImages=null
    },  
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        this.temp.actionTypeId=this.actionTypeKeyValue[this.temp.actionTypeName]
        if(this.temp.actionImages.startsWith("http"))
            this.temp.actionImages=this.temp.actionImages.substring(this.temp.actionImages.lastIndexOf("/")+1,this.temp.actionImages.length)
        if (valid) {
          createAction(this.temp).then((result) => {
            this.getList()
            //this.list.unshift(this.temp)
            //this.list.unshift(result.data)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.$refs.Dropzone.removeAllFiles()
          })
        }
        
      })
    },
    handleUpdate(row) {
      this.editTemp = Object.assign({}, row) // copy obj
      if(this.editTemp.actionImages=="")
        this.editTemp.actionImages=null
      else
        this.editTemp.actionImages=process.env.BASE_API+"/"+this.editTemp.actionImages
      this.dialogStatus = 'update'
      this.dialogEditVisible = true
      this.$nextTick(() => {
        this.$refs['editForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.editTemp)
          tempData.actionTypeId=this.actionTypeKeyValue[tempData.actionTypeName]
          if(tempData.actionImages.startsWith("http"))
            tempData.actionImages=this.editTemp.actionImages.substring(this.editTemp.actionImages.lastIndexOf("/")+1,this.editTemp.actionImages.length)
          //tempData.gmtModified = parseTime(new Date().getTime,'{y}-{m}-{d} {h}:{i}')
          updateAction(tempData).then(() => {
            this.getList()
            // for (const v of this.list) {
            //   if (v.id === this.temp.id) {
            //     const index = this.list.indexOf(v)
            //     this.list.splice(index, 1, this.temp)
            //     break
            //   }
            // }
            this.dialogEditVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.showFlag=true // for (const v of this.list) {
            //   if (v.id === this.temp.id) {
            //     const index = this.list.indexOf(v)
            //     this.list.splice(index, 1, this.temp)
            //     break
            //   }
            // }
            this.uploadFlag=false
            this.$nextTick(() => {
              this.$refs.editDropzone.removeAllFiles()
              this.editTemp.actionImages=null
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeAction(row.id).then(() => {
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['创建时间', '标题', '编号', '类型', '备注', '状态']
        const filterVal = ['gmtCreate', 'actionName','actionNo', 'actionTypeName', 'memo', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'action-type-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    dropzoneS(file,result) {
      this.$message({ message: 'Upload success:'+result.result, type: 'success' })
      if(this.dialogFormVisible){
        this.temp.actionImages=process.env.BASE_API+"/"+result.result
      }else if(this.dialogEditVisible){
        this.editTemp.actionImages=process.env.BASE_API+"/"+result.result
        this.showFlag=false
        this.uploadFlag=true
      }
        
       
      //console.log("s="+this.temp.actionImages)

    },
    dropzoneR(file) {
      //this.$message({ message: 'Delete success', type: 'success' })
      if(this.dialogFormVisible){
        this.temp.actionImages=null
      }else if(this.dialogEditVisible){
       this.editTemp.actionImages=null
       this.showFlag=false
      }
    }
  }
}
</script>
