<template>
    <el-container 
        class="container"
        v-loading="loading"
        :element-loading-text="loadingText">
        <el-header class="my-header publish-header">
            <section class="section">
                <span>开始时间：</span>
                <el-date-picker
                  v-model="searchConfig.beginTms"
                  type="date"
                  size="small"
                  class="my-date-pic"
                  :value-format="'yyyy-MM-dd'"
                  :picker-options="setStartTimeOptions"
                  placeholder="选择开始时间">
                </el-date-picker>
            </section>
            <section class="section">
                <span>结束时间：</span>
                <el-date-picker
                  v-model="searchConfig.endTms"
                  type="date"
                  size="small"
                  class="my-date-pic"
                  :value-format="'yyyy-MM-dd'"
                  :picker-options="setEndTimeOptions"
                  placeholder="选择结束时间">
                </el-date-picker>
            </section>
            <br/>
            <section class="section">
                <span>项目名称：</span>
                <el-input size="small" class="my-input" v-model="searchConfig.appNm" placeholder="请输入项目名称"></el-input>
            </section>
            <section class="section">
                <span>项目类型：</span>
                <el-select 
                    v-model="searchConfig.appTp"
                    size="small"
                    class="my-select"
                    placeholder="请选择项目类型">
                  <el-option
                    v-for="item in appTpOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </section>
            <section class="section">
                <span>项目状态：</span>
                <el-select 
                    v-model="searchConfig.appSt"
                    size="small"
                    class="my-select"
                    placeholder="请选择项目状态">
                  <el-option
                    v-for="item in appStOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </section>
            <section class="section">
                <el-button class="search" size="small" height="32" @click="getData">搜索</el-button>
            </section>
        </el-header>
        <el-main style="heigth: 400px; padding: 0 20px;">
            <el-table
              :data="tableConfig.tableData"
              :header-row-class-name="tableConfig.tableHeaderClass"
              stripe
              style="width: 100%">
              <el-table-column
                v-for="(item, i) in tableConfig.tableHead"
                :key="i"
                :prop="item.prop"
                :label="item.label"
                :width="item.width">
              </el-table-column>
              <el-table-column
                :prop="'appTp'"
                :label="'项目类型'"
                >
                <template slot-scope="scope">
                    <span>{{scope.row.appTp | appTpFilter}}</span>
                </template>
              </el-table-column>
              <el-table-column
                  label="处理状态"
                  prop="appSt"
                  width="100">
                  <template slot-scope="scope">
                    <span :class="scope.row.appSt === '1' ? 'pass' 
                            : scope.row.appSt === '2' ? 'refuse' 
                            : 'untreated' ">{{ scope.row.appSt | appStFilter }}</span>
                    </template>
              </el-table-column>
              <el-table-column
                  fixed="right"
                  label="操作"
                  width="100">
                  <template slot-scope="scope">
                    <!-- <span v-if="scope.row.appSt === '0'" class="my-handle"><i class="el-icon-edit"></i>处理</span> -->
                    <!-- <span v-else  class="my-handle" @click="showDialog(scope.row)"><i class="el-icon-tickets"></i>详情</span> -->
                    <span class="my-handle" @click="showDialog(scope.row)"><i class="el-icon-edit"></i>处理</span>
                  </template>
              </el-table-column>
            </el-table>
        </el-main>
        <el-footer>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="paginatioinConfig.start"
              :page-sizes="paginatioinConfig.sizes"
              :page-size="paginatioinConfig.maxRows"
              layout="total, sizes, prev, pager, next, jumper"
              :total="paginatioinConfig.total"
              style="width: 600px; margin: 0 auto;"
              >
            </el-pagination>
        </el-footer>
        <!-- 详情页弹窗 -->
        <el-dialog class="my-dialog" title="项目发布审批详情" :visible.sync="dialogConfig.visible">
            <div class="content">
                <project-dialog :data="dialogConfig.rowInfo" />
            </div>
            <el-dialog
                width="30%"
                title="冻结"
                :visible.sync="dialogConfig.innerVisible"
                append-to-body>
                <el-form :model="dialogConfig.formData" :rules="dialogConfig.rules" ref="form">
                    <el-form-item label="冻结理由" prop="appStDesc">
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" v-model="dialogConfig.formData.appStDesc" placeholder="请输入冻结理由"></el-input>
                    </el-form-item>
                </el-form>
                <el-button @click="approve('冻结')" class="inner-refuse" height="32" size="small">确定</el-button>
            </el-dialog>
            <div slot="footer" class="dialog-footer">
                <el-button @click="approve('1')" v-if="dialogConfig.rowInfo.appSt == '1'" class="refuse" height="32" size="small">冻结</el-button>
                <el-button @click="approve('解冻')" v-else height="32" size="small" class="agree">解冻</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
import {projectManage} from '@/api'
import projectDialog from './components/project-dialog'
import {$myDecode} from '@/utils/myAxios'
export default {
    name: 'project',
    components: {projectDialog},
    data() {
        const self = this;
        return {
            searchConfig: {
                beginTms: '',
                endTms: '',
                appNm: '',
                appSt: '',
                appTp: ''
            },
            appTpOption: [
                {
                    value: '',
                    label: '全部'
                },
                {
                    label: '报刊杂志',
                    value: '1'
                },
                {
                    label: '餐饮',
                    value: '2'
                },
                {
                    label: '社交',
                    value: '3'
                },
                {
                    label: '摄影',
                    value: '4'
                }
            ],
            appStOption: [
                {
                    value: '',
                    label: '全部'
                },
                {
                    value: '1',
                    label: '正常'
                },
                {
                    value: '2',
                    label: '冻结'
                }
            ],
            tableConfig: {
                tableHead: [
                        {
                            prop: 'insNm',
                            label: '企业名称',
                            width: '',
                            align: 'center',
                            showOverflowTooltip: true,
                            fixed: false,
                        },
                        {
                            prop: 'lclCrtTms',
                            label: '创建时间',
                            width: '',
                            align: 'center',
                            showOverflowTooltip: true,
                            fixed: false,
                        },
                        {
                            prop: 'appNm',
                            label: '项目名称',
                            width: '',
                            align: 'center',
                            showOverflowTooltip: true,
                            fixed: false,
                        }
                ],
                tableData:[],
                tableHeaderClass:  'my-table-header'
            },
            paginatioinConfig: {
                total: 0,
                maxRows: 10,   //每页行数
                sizes: [10, 20, 30],
                start: 1  //当前页
            },
            dialogConfig: {
                visible: false,
                row: '',
                rowInfo: '',
                innerVisible: false,
                formData: {
                    appStDesc: ''
                },
                rules: {
                    appStDesc: [{ required: true, message: "请输入冻结理由", trigger: "blur" }]
                }
            },
            loading: false,
            loadingText: '拼命加载中...',
            setStartTimeOptions: {
                disabledDate(time) {
                    if (self.searchConfig.endTms) {
                        let endTms = self.searchConfig.endTms.replace(/\-/g, '/')
                        return time.getTime() > new Date(endTms.slice(0,10)).getTime() || time.getTime() > new Date().getTime();
                    } else {
                        return time.getTime() < new Date('1970/01/01 00:00:00') || time.getTime() > new Date().getTime();
                    }
                }
            },
            setEndTimeOptions: {
                disabledDate(time) {
                    if (self.searchConfig.beginTms) {
                        let beginTms = self.searchConfig.beginTms.replace(/\-/g, '/')
                        return time.getTime() < new Date(beginTms.slice(0,10)).getTime() || time.getTime() > new Date().getTime();
                    } else {
                        return time.getTime() < new Date('1970/01/01 00:00:00') || time.getTime() > new Date().getTime();
                    }
                }
            },
        }
    },
    methods: {
        getDate(time) {
            return new Date(parseInt(time))
                .toLocaleString()
                .replace(/:\d{1,2}$/, " ");
        },
        handleSizeChange(val) {
            this.paginatioinConfig.maxRows = val;
            this.getData();
        },
        handleCurrentChange(val) {
            this.paginatioinConfig.start = val;
            this.getData();
        },
        //查询列表
        getData() {
            if(this.searchConfig.beginTms && this.searchConfig.endTms) {
                if(this.searchConfig.endTms < this.searchConfig.beginTms) {
                    return this.$message.warning('开始时间不能大于结束时间')
                }
            }
            this.loading = true;
            let params = {
                maxRows: this.paginatioinConfig.maxRows,
                start: this.paginatioinConfig.start
            }
            Object.assign(params, this.searchConfig);
            params.beginTms = new Date(params.beginTms).getTime();
            params.endTms = new Date(params.endTms).getTime();
            this.$axios({
                method: 'post',
                url: projectManage.query,
                data: params,
                PBreq: 'com.ccb.cloud.protobuf.proto.iequip.App',
                PBres: 'com.ccb.cloud.protobuf.proto.Page'
            }).then(res => {
                this.loading = false;
                console.log(res);
                const {SYS_RESP_DESC, SYS_TX_STATUS} = res.headers
                if(SYS_TX_STATUS != '00') return this.$message.error(SYS_RESP_DESC)
                this.paginatioinConfig.total = res.data.total;
                let data = res.data.data;
                this.tableConfig.tableData = data.map(item => {
                    return $myDecode(item.value, 'com.ccb.cloud.protobuf.proto.iequip.App')
                })
                this.tableConfig.tableData.map(item => {
                    item.lclCrtTms = this.getDate(item.lclCrtTms)
                })
            }).catch(err => {
                this.loading = false;
                console.log(err);
                if(err === '获取不到该用户的信息,当前用户可能未登录') {
                    this.$message.error('请登录')
                    // this.$router.push('/loginIn')
                    return 
                }
                this.$message.error('系统错误，请稍后再试')
            })
        },

        //显示dialog
        showDialog(row) {
            this.dialogConfig.row = row;
            this.dialogConfig.rowInfo = row;
            this.dialogConfig.formData.appStDesc = ''
            this.$axios({
                method: 'get',
                url: projectManage.editQuery(row.appId),
                PBres: 'com.ccb.cloud.protobuf.proto.iequip.App'
            }).then(res => {
                this.dialogConfig.visible = true;
                console.log(res);
                let {data} = res;
                this.dialogConfig.rowInfo = data;
            }).catch(err => {
                console.log(err);
                this.$message.error('系统异常，请稍后再试')
            })
        },

        approve(type) {
            if(type == '1') {
                this.dialogConfig.innerVisible = true;
            }else if(type == '解冻') {
                this.upDateAppStatus(this.dialogConfig.row.appId, '1')
                    .then(res => {
                        if(res.headers.SYS_TX_STATUS != '00') {
                            return this.$message.error('系统异常，请稍后再试')
                        }
                        this.$message.success('解冻成功')
                        this.dialogConfig.visible = false;
                        this.getData();
                    }).catch(err => {
                        console.log(err);
                    })
            }else if(type == '冻结') {
                this.$refs['form'].validate(valid => {
                    if(!valid) return
                    this.upDateAppStatus(this.dialogConfig.row.appId, '2', this.dialogConfig.formData.appStDesc)
                        .then(res => {
                            if(res.headers.SYS_TX_STATUS != '00') {
                                return this.$message.error('系统异常，请稍后再试')
                            }
                            this.$message.success('冻结成功')
                            this.dialogConfig.innerVisible = false;
                            this.dialogConfig.visible = false;
                            this.getData();
                        })
                        .catch(err => {
                            console.log(err);
                            this.$message.error('系统异常，请稍后再试')
                        })
                })
                
            }
        },

        //更新项目状态
        upDateAppStatus(appId, appSt, appStDesc) {
            return new Promise((resolve, reject) => {
                this.$axios({
                    method: 'patch',
                    data: {
                        appStDesc: appStDesc || ''
                    },
                    url: projectManage.updateStatus(appId, appSt),
                    PBreq: 'com.ccb.cloud.protobuf.proto.iequip.App'
                }).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        }
    },
    created() {
        this.getData();
    },
    filters: {
        appStFilter(status) {
            switch(status) {
                case '1' :
                    return '正常'
                case '2' :
                    return '冻结'
            }
            // return '未处理'
        },
        appTpFilter(type) {
            switch(type) {
                case '1' :
                    return '报刊杂志'
                case '2' :
                    return '餐饮'
                case '3' :
                    return '社交'
                case '4' :
                    return '摄影'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .container {
        width: 100%;
        height: 100%;
        padding: 0;
        background-color: #fff;
    }
    .my-header {
        height: 110px !important;
        .section {
            display: inline-block;
            margin-right: 20px;
        }   
        .my-date-pic {
            width: 150px;
            height: 32px;
        }
        .my-input {
            width: 150px;
            height: 32px;
        }
        .my-select {
            width: 150px;
            height: 32px;
        }
        .search {
            background-color: #2a95df;
            color: #fff;
        }
        
    }
    
    
    .my-handle {
        color: #2A95DF;
        cursor: pointer;
    }
    .untreated {
        color: #BCBCBC;
    }

    .pass {
        color: #008000;
    }

    .refuse {
        color: #CC0000;
    }
    .my-dialog {
        .content {
            width: 100%;
            height: 100%;
        }
        .dialog-footer {
            display: flex;
            justify-content: center;
            .agree {
                background-color: #008000;
                color: #fff;
            }
            .refuse {
                background-color: #CC0000;
                color: #fff;
            }
        }
        
    }
    .inner-refuse {
        background-color: #CC0000;
        color: #fff;
        margin-left: calc(50% - 28px);
    }
</style>

<style lang="scss">
    .my-table-header {
        th {
            color: #fff !important;
            background: #2085D8 !important;
            font-weight: normal;
        }
    }
</style>

