<template>
    <el-container 
        class="container"
        v-loading="loading"
        :element-loading-text="loadingText">
        <el-header class="my-header">
            <section class="section">
                <span>申请时间：</span>
                <el-date-picker
                  v-model="searchConfig.lclCrdTms"
                  type="datetime"
                  size="small"
                  class="my-date-pic"
                  :value-format="'yyyy-MM-dd HH:mm:ss'"
                  :picker-options="setStartTimeOptions"
                  placeholder="选择申请时间"
                  >
                </el-date-picker>
            </section>
            <section class="section">
                <span>处理时间：</span>
                <el-date-picker
                  v-model="searchConfig.adtTms"
                  type="datetime"
                  size="small"
                  class="my-date-pic"
                  :value-format="'yyyy-MM-dd HH:mm:ss'"
                  :picker-options="setEndTimeOptions"
                  placeholder="选择处理时间"
                  >
                </el-date-picker>
            </section>
            <br/>
            <section class="section">
                <span>企业名称：</span>
                <el-input v-model="searchConfig.sbjNm" class="my-input enterprise-name" placeholder="请输入企业名称"></el-input>
            </section>
            <section class="section">
                <span>请求状态：</span>
                <el-select 
                    v-model="searchConfig.rlnmAuthenSt"
                    size="small"
                    class="my-select"
                    placeholder="请选择请求状态"
                    >
                  <el-option
                    v-for="item in rlnmAuthenStOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </section>
            <section class="section">
                <el-button type="primary"  size="small" height="32" @click="getData">搜索</el-button>
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
                  label="处理状态"
                  prop="status"
                  width="100">
                  <template slot-scope="scope">
                    <span :class="scope.row.rlnmAuthenSt === '1' ? 'pass' 
                            : scope.row.rlnmAuthenSt === '2' ? 'refuse' 
                            : 'untreated' ">{{ scope.row.rlnmAuthenSt | rlnmAuthenStFilter }}</span>
                    </template>
              </el-table-column>
              <el-table-column
                  fixed="right"
                  label="操作"
                  width="100">
                  <template slot-scope="scope">
                    <span @click="showDialog(scope.row)" v-if="scope.row.rlnmAuthenSt === '0'" class="my-handle"><i class="el-icon-edit"></i>处理</span>
                    <span @click="showDialog(scope.row)" v-else  class="my-handle"><i class="el-icon-tickets"></i>详情</span>
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
        <!-- <realNameDialog 
            @closeDialog="closeDialog" 
            :visible="dialogConfig.visible" 
            :infoLeft="dialogConfig.infoLeft" 
            :infoRight="dialogConfig.infoRight" 
            :row="dialogConfig.row"
            @approve="approve"
        /> -->
        <!-- 详情页弹窗 -->
        <el-dialog class="my-dialog" title="实名认证申请详情" :visible.sync="dialogConfig.visible">
            <div class="content">
                <realName-dialog :data="dialogConfig.rowInfo" />
            </div>
             <el-dialog
                width="30%"
                title="拒绝"
                :visible.sync="dialogConfig.innerVisible"
                append-to-body>
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" v-model="dialogConfig.rlnmAuthenMsg" placeholder="请输入拒绝理由"></el-input>
                    <el-button class="refuse" @click="approve('3')">拒绝</el-button>
            </el-dialog>
            <div slot="footer" class="dialog-footer">
                <el-button v-if="dialogConfig.row && dialogConfig.row.rlnmAuthenSt == '0'" class="agree" @click="approve('1')">同意</el-button>
                <el-button v-if="dialogConfig.row && dialogConfig.row.rlnmAuthenSt == '0'" class="refuse" @click="approve('2')">拒绝</el-button>
                <el-button v-else class="sure" @click="dialogConfig.visible = false">确定</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
import realNameDialog from './components/realname-dialog';
import {realNameApi} from '@/api'
export default {
    name: 'realName',
    components: { realNameDialog },
    data() {
        const self = this;
        return {
            searchConfig: {
                rlnmAuthenSt: '',
                lclCrdTms: '',
                adtTms: '',
                sbjNm: '',
            },
            sbjNmOptioin: [],
            rlnmAuthenStOption: [
                {
                    value: '',
                    label: '全部'
                },
                {
                    value: '0',
                    label: '未处理'
                },
                {
                    value: '1',
                    label: '已通过'
                },
                {
                    value: '2',
                    label: '已拒绝'
                }
            ],
            tableConfig: {
                tableHead: [
                        {
                            prop: 'acctId',
                            label: '申请人账号',
                            width: '',
                            align: 'center',
                            showOverflowTooltip: true,
                            fixed: false,
                        },
                        {
                            prop: 'entNm',
                            label: '企业名称',
                            width: '',
                            align: 'center',
                            showOverflowTooltip: true,
                            fixed: false,
                        },
                        {
                            prop: 'adtTms',
                            label: '申请时间',
                            width: '',
                            align: 'center',
                            showOverflowTooltip: true,
                            fixed: false,
                        },
                        {
                            prop: 'acctTp',
                            label: '申请人身份类型',
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
                maxRows: 10,    //当页条数
                sizes: [10, 20, 30],
                start: 1   //起始条数
            },
            dialogConfig: {
                row: null,
                rowInfo: null,
                visible: false,
                innerVisible: false,
                rlnmAuthenMsg: ''
            },
            loading: false,
            loadingText: '拼命加载中...',
            setStartTimeOptions: {
                disabledDate(time) {
                    if (self.searchConfig.adtTms) {
                        let adtTms = self.searchConfig.adtTms.replace(/\-/g, '/')
                        return time.getTime() > new Date(adtTms.slice(0,10)).getTime() || time.getTime() > new Date().getTime();
                    } else {
                        return time.getTime() < new Date('1970/01/01 00:00:00') || time.getTime() > new Date().getTime();
                    }
                }
            },
            setEndTimeOptions: {
                disabledDate(time) {
                    if (self.searchConfig.lclCrdTms) {
                        let lclCrdTms = self.searchConfig.lclCrdTms.replace(/\-/g, '/')
                        return time.getTime() < new Date(lclCrdTms.slice(0,10)).getTime() || time.getTime() > new Date().getTime();
                    } else {
                        return time.getTime() < new Date('1970/01/01 00:00:00') || time.getTime() > new Date().getTime();
                    }
                }
            },
        }
    },
    methods: {
  
        //获取实名认证列表
        getData() {
            if(this.searchConfig.lclCrdTms && this.searchConfig.adtTms) {
                if(this.searchConfig.lclCrdTms > this.searchConfig.adtTms) {
                    return this.$message.warning('申请时间不能大于处理时间')
                }
            }
            this.loading = true;
            let params = {};
            for(let k in this.searchConfig) {
                params[k] = this.searchConfig[k]
            }
            params.start = this.paginatioinConfig.start.toString();
            params.maxRows = this.paginatioinConfig.maxRows.toString();
            this.$axios({
                method: 'post',
                url: realNameApi.queryEntity,
                data: params,
                PBreq: 'com.ccb.cloud.protobuf.proto.iequip.ConditionQuery',
                PBres: 'com.ccb.cloud.protobuf.proto.Page',
                headers: {
                    'Content-type': 'application/x-protobuf',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }).then(res => {
                this.loading = false;
                if(res.headers.SYS_TX_STATUS != '00') {
                    return this.$message.error(res.headers.SYS_RESP_DESC)
                }
                this.paginatioinConfig.total = res.data.total;
                let data = res.data.data;
                this.tableConfig.tableData = data.map(item => {
                    return this.$myDecode(item.value, 'com.ccb.cloud.protobuf.proto.iequip.AcctRlnm')
                })
            }).catch(err => {
                this.loading = false;
                console.log(err);
                this.$message.error('系统异常，请稍后再试');
            })
        },

        handleSizeChange(val) {
            this.paginatioinConfig.maxRows = val;
            this.getData();
        },
        handleCurrentChange(val) {
            this.paginatioinConfig.start = val;
            this.getData();
        },

        //显示弹窗
        showDialog(row) {
            this.dialogConfig.row = row;
            const {rlnmAdtId} = row
            this.$axios({
                method: 'get',
                url: realNameApi.rlnmAdtIdGet(rlnmAdtId),
                PBres: 'com.ccb.cloud.protobuf.proto.iequip.AcctRlnm'
            }).then(res => {
                console.log(res);
                if(res.headers.SYS_TX_STATUS != '00') {
                    return this.$message.error(res.headers.SYS_RESP_DESC)
                }
                this.dialogConfig.visible = true;
                this.dialogConfig.rowInfo = res.data;
            }).catch(err => {
                this.loading = false;
                console.log(err);
                this.$message.error('系统异常，请稍后再试')
            })
        },

        //实名认证审批
        approve(type) {
            const {rlnmAdtId} = this.dialogConfig.row
            let params = Object.assign({}, this.dialogConfig.rowInfo)
            params.rlnmAuthenSt = type;
            if(type === '2') {
                this.dialogConfig.rlnmAuthenMsg = ''
                this.dialogConfig.innerVisible = true;
                return
            }else if(type === '3'){
                let msg = this.dialogConfig.rlnmAuthenMsg.trim()
                if(!msg) return this.$message.warning('请输入拒绝理由')
                params.rlnmAuthenMsg = this.dialogConfig.rlnmAuthenMsg;
                params.rlnmAuthenSt = '2';  //type 为 1 的时候，同意，为 2 的时候，拒绝
            }
            this.$axios({
                method: 'patch',
                url: realNameApi.rlnmAuthenStPatch(rlnmAdtId),
                data: params,
                PBreq: 'com.ccb.cloud.protobuf.proto.iequip.AcctRlnm'
            }).then(res => {
                this.dialogConfig.innerVisible = false
                this.dialogConfig.visible = false
                if(res.headers.SYS_TX_STATUS != '00') {
                    return this.$message.error(res.headers.SYS_RESP_DESC)
                }
                this.getData();
            }).catch(err => {
                console.log(err);
                this.$message.error('系统异常，请稍后再试')
            })
        },

        closeDialog() {
            this.dialogConfig.visible = false;
        },
        
        init() {
            this.getData();
        }
    },
    created() {
        this.init();
    },
    filters: {
        rlnmAuthenStFilter(status) {
            switch(status) {
                case '1' :
                    return '已通过'
                case '2' :
                    return '已拒绝'
                case '0' :
                    return '未处理'
            }
            return '未处理'
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
            .my-date-pic {
                width: 150px;
                height: 32px;
            }
            .my-select {
                width: 150px;
                height: 32px;
            }
            .my-input {
                width: 150px;
                height: 32px;
            }
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
    .sure {
        background-color: #2A95DF;
        color: #fff;
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
</style>

<style lang="scss">
    .my-table-header {
        th {
            color: #fff !important;
            background: #2085D8 !important;
            font-weight: normal;
        }
    }
    .my-dialog {
        .el-dialog__header {
            background-color: #D7D7D7;
        }
    }
    .enterprise-name {
        .el-input__inner {
            height: 100%;
        }
    }
</style>

