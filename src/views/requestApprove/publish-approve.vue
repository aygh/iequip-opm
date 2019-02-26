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
                  type="datetime"
                  size="small"
                  class="my-date-pic"
                  placeholder="选择开始时间"
                  :value-format="'yyyy-MM-dd HH:mm:ss'"
                  :picker-options="setStartTimeOptions"
                  >
                </el-date-picker>
            </section>
            <section class="section">
                <span>结束时间：</span>
                <el-date-picker
                  v-model="searchConfig.endTms"
                  type="datetime"
                  size="small"
                  class="my-date-pic"
                  placeholder="选择结束时间"
                  :value-format="'yyyy-MM-dd HH:mm:ss'"
                  :picker-options="setEndTimeOptions"
                  >
                </el-date-picker>
            </section>
            <br/>
            <section class="section">
                <span>项目名称：</span>
                <el-input size="small" class="my-input" v-model="searchConfig.appNm" placeholder="请输入项目名称"></el-input>
            </section>
            <section class="section">
                <!-- 机构名称 -->
                <span>企业名称：</span>
                <el-input size="small" class="my-input" v-model="searchConfig.insNm" placeholder="请输入机构名称"></el-input>
            </section>
            <section class="section">
                <span>版本状态：</span>
                <el-select 
                    v-model="searchConfig.verAuthenSt"
                    size="small"
                    class="my-select"
                    placeholder="请选择审核状态">
                  <el-option
                    v-for="item in verAuthenStOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </section>
            <section class="section">
                <el-button type="primary" size="small" height="32" @click="getData">搜索</el-button>
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
                  label="版本状态"
                  prop="verSt"
                  width="100">
                  <template slot-scope="scope">
                    <span :class="scope.row.verSt === '1' ? 'untreated' 
                            : scope.row.verSt === '2' ? 'refuse' 
                            : 'pass' ">{{ scope.row.verSt | verStFilter }}</span>
                    </template>
              </el-table-column>
              <el-table-column
                  fixed="right"
                  label="操作"
                  width="100">
                  <template slot-scope="scope">
                    <span v-if="scope.row.verSt == '1'" class="my-handle" @click="showDialog(scope.row)"><i class="el-icon-edit"></i>处理</span>
                    <span v-else class="my-handle" @click="showDialog(scope.row)"><i class="el-icon-tickets"></i>详情</span>
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
        <el-dialog class="my-dialog"
            title="项目发布审批详情"
            :visible.sync="dialogConfig.visible">
            <div class="content">
                <publish-dialog :data="dialogConfig.rowInfo" />
            </div>
            <el-dialog
                width="30%"
                title="拒绝"
                :visible.sync="dialogConfig.innerVisible"
                append-to-body>
                <el-form :model="dialogConfig.formData" :rules="dialogConfig.rules" ref="form">
                    <el-form-item label="拒绝理由" prop="oprDesc">
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" v-model="dialogConfig.formData.oprDesc" placeholder="请输入拒绝理由"></el-input>
                    </el-form-item>
                </el-form>
                <el-button @click="approve('拒绝')" class="inner-refuse" height="32" size="small">确定</el-button>
            </el-dialog>
            <div slot="footer" class="dialog-footer">
                <el-button v-if="dialogConfig.row.verSt =='1'" @click="approve('agree')"  height="32" size="small" class="agree">同意</el-button>
                <el-button v-if="dialogConfig.row.verSt =='1'" @click="approve('refuse')" class="refuse" height="32" size="small">拒绝</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
import {publishProject} from '@/api'
import publishDialog from './components/publish-dialog'
import {filterTime} from '@/utils/myFilter'
export default {
    name: 'publish',
    components: {publishDialog},
    data() {
        const self = this;
        return {
            searchConfig: {
                beginTms: '',
                endTms: '',
                appNm: '',
                verAuthenSt: '',
                insNm: ''
            },
            verAuthenStOption: [
                {
                    value: '',
                    label: '全部'
                },
                {
                    value: '1',
                    label: '待审核'
                },
                {
                    value: '2',
                    label: '拒绝'
                },
                {
                    value: '3',
                    label: '可发布'
                },
                {
                    value: '4',
                    label: '待生产版本发布'
                },
                {
                    value: '5',
                    label: '生产版本发布中'
                },
                {
                    value: '6',
                    label: '生产版本已发布'
                },
                {
                    value: '7',
                    label: '待灰度版本发布'
                },
                {
                    value: '8',
                    label: '灰度版本发布中'
                },
                {
                    value: '9',
                    label: '灰度版本已发布'
                },
                {
                    value: '10',
                    label: '版本发布失败'
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
                            label: '申请时间',
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
                        },
                        {
                            prop: 'version',
                            label: '版本号',
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
                    oprDesc: ''
                },
                rules: {
                    oprDesc: [{ required: true, message: "请输入冻结理由", trigger: "blur" }]
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
            const self = this;
            if(self.searchConfig.beginTms && self.searchConfig.endTms) {
                if(self.searchConfig.endTms < self.searchConfig.beginTms) {
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
                url: publishProject.query,
                data: params,
                PBreq: 'com.ccb.cloud.protobuf.proto.iequip.SelectParam',
                PBres: 'com.ccb.cloud.protobuf.proto.Page'
            }).then(res => {
                this.loading = false;
                const {SYS_RESP_DESC, SYS_TX_STATUS} = res.headers
                if(SYS_TX_STATUS != '00') return this.$message.error(SYS_RESP_DESC)
                this.paginatioinConfig.total = res.data.total;
                let data = res.data.data;
                this.tableConfig.tableData = data.map(item => {
                    let result = this.$myDecode(item.value, 'com.ccb.cloud.protobuf.proto.iequip.AppVer')
                    result.lclCrtTms = filterTime(result.lclCrtTms);
                    return result
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
            let {verId} = row;
            this.getInfoByVerId(verId)
                .then(res => {
                    console.log(res);
                    let {data} = res;
                    this.dialogConfig.rowInfo = data;
                    this.dialogConfig.visible = true;
                }).catch(err => {
                    console.log(err);
                })
        },

        //具体版本的详情信息查询
        getInfoByVerId(verId) {
            return new Promise((resolve, reject) => {
                this.$axios({
                    method: 'get',
                    url: publishProject.getVersion(verId),
                    PBres: 'com.ccb.cloud.protobuf.proto.iequip.AppVer'
                }).then(res => {
                    resolve(res);    
                }).catch(err => {
                    reject(err);
                })
            })
        },

        approve(type) {
            let option = {
                verId: this.dialogConfig.row.verId,
                verSt: this.dialogConfig.row.verSt,
                oprDesc : ''
            }
            if(type === 'agree') {
                option.oprTp = '3'    
            }else if (type == '拒绝') {
                option.oprTp = '4'
                option.oprDesc = this.dialogConfig.formData.oprDesc
            }else if(type == 'refuse') {
                this.dialogConfig.formData.oprDesc = ''
                this.dialogConfig.innerVisible = true
                return
            }
            this.handleVers(option)
                .then(res => {
                    console.log(res);
                    if(res.data.retRsltDsc != 'SUCCESS') return this.$message.error(res.data.retRsltDsc)
                    this.dialogConfig.innerVisible = false;
                    this.dialogConfig.visible = false;
                    this.getData()
                })
                .catch(err => {
                    console.log(err);
                })
        },

        //版本操作服务
        handleVers({verId, oprTp, oprDesc}) {
            return new Promise((resolve, reject) => {
                this.$axios({
                    method: 'patch',
                    url: publishProject.handle(verId),
                    data: {
                        oprTp, //3通过 4拒绝
                        oprDesc
                    },
                    PBreq: 'com.ccb.cloud.protobuf.proto.iequip.VerStParam',
                    PBres: 'com.ccb.cloud.protobuf.proto.iequip.RetRslt'
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
        verStFilter(status) {
            switch(status) {
                case '1' :
                    return '待审核'
                case '2' :
                    return '拒绝'
                case '3' :
                    return '可发布'
                case '4' :
                    return '待生产版本发布'
                case '5' :
                    return '生产版本发布中'
                case '6' :
                    return '生产版本已发布'
                case '7' :
                    return '待灰度版本发布'
                case '8' :
                    return '灰度版本发布中'
                case '9' :
                    return '灰度版本已发布'
                case '10' :
                    return '版本发布失败'
            }
            // return '未处理'
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

