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
      <el-table-column width="160px" align="center" :label="'修改时间'">
        <template slot-scope="scope">
          <span>{{scope.row.gmtModified}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" :label="'类型'" >
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.actionName}}</span>
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
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchActionTypeList, createActionType, updateActionType, removeActionType } from '@/api/actionType'
import {mapGetters} from 'vuex'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'ActionTypeTable',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      // list: null,
      // total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        actionName: undefined
        //sort: '+id'
      },
      statusOptions: [{'key':'CREATED','value':'新建'}, {'key':'DISABLED','value':'禁用'}],
      showReviewer: false,
      temp: {
        id: undefined,
        memo: '',
        gmtCreate:'',
        actionName: '',
        status: 'CREATED'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        actionName: [{ required: true, message: 'name is required', trigger: 'blur' }]
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
    this.getList()
  },
  computed: {
    ...mapGetters({
      list:'actionTypeList',
      total:'actionTypeTotal'
    })
  },
  methods: {
    getList() {
      console.log("get actionType")
      this.listLoading = true
      /*
      fetchActionTypeList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.count
        this.listLoading = false
      })*/
      this.$store.dispatch('GetActionTypeList', this.listQuery).then(() => {
            this.listLoading = false
          }).catch(() => {
            this.listLoading = false
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // createActionType(this.temp).then((result) => {
          //   //this.list.unshift(this.temp)
          //   this.list.unshift(result.data)
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: '成功',
          //     message: '创建成功',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
          this.$store.dispatch('CreateActionType', this.temp).then(() => {
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          this.$store.dispatch('UpdateActionType', tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
          //tempData.gmtModified = parseTime(new Date().getTime,'{y}-{m}-{d} {h}:{i}')
          // updateActionType(tempData).then((result) => {
          //   for (const v of this.list) {
          //     if (v.id === result.data.id) {
          //       const index = this.list.indexOf(v)
          //       this.list.splice(index, 1, result.data)
          //       break
          //     }
          //   }
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: '成功',
          //     message: '更新成功',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // removeActionType(row.id).then(() => {
          //   const index = this.list.indexOf(row)
          //   this.list.splice(index, 1)
          //   this.$notify({
          //     title: '成功',
          //     message: '删除成功',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
          this.$store.dispatch('RemoveActionType', row.id).then(() => {
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
        const tHeader = ['创建时间', '修改时间', '标题', '备注', '状态']
        const filterVal = ['gmtCreate', 'gmtModified', 'actionName', 'memo', 'status']
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
