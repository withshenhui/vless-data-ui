<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.title')" v-model="listQuery.projectName">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="danger" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      <!--<el-button class="filter-item" type="warning" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>-->
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
      <el-table-column min-width="150px" :label="'项目编号'" >
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.projectNo}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" :label="'项目名称'" >
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.projectName}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" :label="'所属人'" >
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.projectOwnerId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="'需求列表'">
        <template slot-scope="scope">
          <span class="link-type" @click="handleActionList(scope.row)">需求列表</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="'备注'">
        <template slot-scope="scope">
          <span>{{scope.row.memo}}</span>
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

    <el-dialog :title="'需求列表'" :visible.sync="actionListVisible">
     <el-table :key='actionListKey' :data="detailTemp.actionList" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column min-width="150px" :label="'手形手势编号'" >
        <template slot-scope="scope">
        <span>{{scope.row.actionNo}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" :label="'手形手势名称'" >
        <template slot-scope="scope">
         <span>{{scope.row.actionName}}</span>
        </template>
      </el-table-column>
    </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="actionListVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="90px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="'项目编号'" prop="projectNo">
          <el-input v-model="temp.projectNo"></el-input>
        </el-form-item>
        <el-form-item :label="'项目名称'" prop="projectName">
          <el-input v-model="temp.projectName"></el-input>
        </el-form-item>
        <el-form-item :label="'需求列表'" prop="actionList">
          <el-select v-model="temp.actionList"  multiple placeholder="请选择">
            <el-option
              v-for="item in actionAllList"
              :key="item.id"
              :label="item.actionName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.memo')">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input" v-model="temp.memo">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, createProject, updateProject, removeProject } from '@/api/project'
import waves from '@/directive/waves' // 水波纹指令
import {mapGetters} from 'vuex'
import { parseTime } from '@/utils'

export default {
  name: 'projectTable',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      actionListKey:1,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        projectName: undefined
        //sort: '+id'
      },
      statusOptions: ['CREATED', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        memo: '',
        gmtCreate:'',
        projectNo: '',
        projectName:'',
        status:''
      },
      detailTemp: {
        id: undefined,
        memo: '',
        gmtCreate:'',
        projectNo: '',
        projectName:'',
        actionIds:[]
      },
      dialogFormVisible: false,
      actionListVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rules: {
        projectName: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }],
        actionList: [{ required: true, message: '需求列表不能为空', trigger: 'change' }],
        projectNo: [{ required: true, message: '项目编号不能为空', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        CREATED: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getList()
    this.getActionList()
  },
  computed: {
    ...mapGetters({
      actionAllList:'actionList',
      actionAllTotal:'actionTotal'
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.count
        this.listLoading = false
      })
    },
    getActionList() {
        this.$store.dispatch('GetActionList', null).then(() => {
          }).catch(() => {
        })
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
        projectName: '',
        projectNo:'',
        actionList:[],
        status: '',
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.status="CREATED"
          createProject(this.temp).then((result) => {
            //this.list.unshift(this.temp)
            //this.list.unshift(result.data)
             this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleActionList(row) {
      this.detailTemp = Object.assign({}, row) // copy obj
      this.actionListVisible = true

    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      console.log("row="+row.status)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      var arrayObj = new Array()
      for(var a in this.temp.actionList){
        arrayObj.push(this.temp.actionList[a].id)
      }
      //arrayObj.splice(0, 1)
      //this.temp.actionList=arrayObj
      this.temp.actionList=arrayObj
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          //tempData.gmtModified = parseTime(new Date().getTime,'{y}-{m}-{d} {h}:{i}')
          updateProject(tempData).then((result) => {
             this.getList()
            // for (const v of this.list) {
            //   if (v.id === result.data.id) {
            //     const index = this.list.indexOf(v)
            //     this.list.splice(index, 1, result.data)
            //     break
            //   }
            // }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
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
          removeProject(row.id).then(() => {
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
        const tHeader = ['创建时间', '修改时间','项目编号', '项目名称', '备注']
        const filterVal = ['gmtCreate', 'gmtModified', 'projectNo','projectName', 'memo']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'data-type-list'
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
    }
  }
}
</script>
