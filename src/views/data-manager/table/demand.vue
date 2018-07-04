<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.title')" v-model="listQuery.demandName">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="danger" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      <el-button class="filter-item" type="warning" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column type="expand">
      <template slot-scope="scope">
        <el-form label-position="left" >
          <el-form-item label="需求描述">
            <span>{{ scope.row.description }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>

      <el-table-column align="center" type="index" width="65" >
      </el-table-column>
      <el-table-column min-width="150px" :label="'需求名称'" >
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.demandName}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" :label="'项目名称'" >
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.projectName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="'数据类型'">
        <template slot-scope="scope">
          <span>{{scope.row.dataTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="'数量'">
        <template slot-scope="scope">
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="'标记？'">
        <template slot-scope="scope">
          <span>{{scope.row.needTag | tagFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" :label="'开始时间'">
        <template slot-scope="scope">
          <span>{{scope.row.startDate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" :label="'结束时间'">
        <template slot-scope="scope">
          <span>{{scope.row.startDate}}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" :label="'备注'">
        <template slot-scope="scope">
          <span>{{scope.row.memo}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="handleDetail(scope.row)">{{'查看'}}</el-button>
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
    <el-dialog :title="'查看'" :visible.sync="detailFormVisible">
      <el-form  ref="dataForm" :model="temp" label-position="left" label-width="120px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="'需求名称：'">
          {{temp.demandName}}
        </el-form-item>
        <el-form-item :label="'需求描述：'">
          {{temp.description}}
        </el-form-item>
        <el-form-item :label="'备注：'">
           {{temp.memo}}
        </el-form-item>
         <el-form-item :label="'背景&手势：'">
           <el-tree :data="temp.detailResult"></el-tree>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailFormVisible = false">{{'关闭'}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="90px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="'项目编号'" prop="demandNo">
          <el-input v-model="temp.demandNo"></el-input>
        </el-form-item>
        <el-form-item :label="'项目名称'" prop="demandName">
          <el-input v-model="temp.demandName"></el-input>
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
import { fetchList, fetchDetail, createDemand, updateDemand, removeDemand } from '@/api/demand'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'demandTable',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        demandName: undefined
        //sort: '+id'
      },
      statusOptions: ['CREATED', 'draft', 'deleted'],
      showReviewer: false,
      defaultProps: {
          children: 'children',
          label: 'label'
      },
      temp: {
        id: undefined,
        demandName:'',
        projectName:'',
        startDate:'',
        endDate:'',
        amount:'',
        needTag:'',
        description:'',
        memo:'',
        status:''
      },
      dialogFormVisible: false,
      detailFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rules: {
        demandName: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }],
        demandNo: [{ required: true, message: '项目编号不能为空', trigger: 'blur' }]
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
    },
    tagFilter(tag) {
      const needTagMap = {
        true: '是',
        false: '否'
      }
      return needTagMap[tag]
    }
  },
  created() {
    this.getList()
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
        demandName: '',
        demandNo:'',
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
          createDemand(this.temp).then((result) => {
            //this.list.unshift(this.temp)
            this.list.unshift(result.data)
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
    handleDetail(row) {
      this.temp = Object.assign({}, row)
      // this.listLoading = true
      // fetchDetail(this.temp.id).then(response => {
      //   this.list = response.data.data
      //   this.total = response.data.count
      //   this.listLoading = false
      //   this.detailFormVisible = true
      // })
       this.detailFormVisible = true
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      //console.log(this.temp.id)
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
          //tempData.gmtModified = parseTime(new Date().getTime,'{y}-{m}-{d} {h}:{i}')
          updateDemand(tempData).then((result) => {
            for (const v of this.list) {
              if (v.id === result.data.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, result.data)
                break
              }
            }
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
          removeDemand(row.id).then(() => {
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
        const filterVal = ['gmtCreate', 'gmtModified', 'demandNo','demandName', 'memo']
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
