<template>
    <el-container class="container productMaintenance" v-loading="loading" :element-loading-text="loadingText">
        <el-header class="my-header">
            <section class="section">
                <span>产品名称：</span>
                <el-input size="small" v-model="searchConfig.pdNm" class="my-input" placeholder="请输入产品名称"></el-input>
            </section>
            <section class="section">
                <span>产品所属系统：</span>
                <el-select @change="selectPdBlngSbj" size="small" class="my-select" placeholder="请选择产品所属系统" v-model="searchConfig.pdBlngSbj">
                    <el-option v-for="item in pdBlngSbjOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </section>
            <section class="section my-tree-box" v-if="searchConfig.pdBlngSbj">
                <span>产品类型：</span>
                <el-tree @node-expand="nodeExpand" id="my-tree" class="my-tree" :data="pdTpOption" :props="defaultProps"
                    accordion>
                    <span slot-scope="{node, data}">
                        <el-checkbox v-model="data.checked" @change="checkoutChange(data)" :label="data.label" v-if="!data.children"></el-checkbox>
                        <span v-if="data.children">{{data.label}}</span>
                    </span>
                </el-tree>
            </section>
            <br />
            <section class="section">
                <span>产品状态：</span>
                <el-select size="small" class="my-select" placeholder="请选择产品状态" v-model="searchConfig.avlSt">
                    <el-option v-for="item in avlStOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </section>
            <section class="section handle-section">
                <el-button type="primary" size="small" @click="search">搜索</el-button>
                <el-button type="primary" size="small" @click="addAndEdit('add')">新增</el-button>
            </section>
        </el-header>
        <el-main style="heigth: 400px; padding: 0 20px;">
            <el-table :data="tableConfig.tableData" :header-row-class-name="tableConfig.tableHeaderClass" stripe style="width: 100%">
                <el-table-column v-for="(item, i) in tableConfig.tableHead" :key="i" :prop="item.prop" :label="item.label"
                    :width="item.width"></el-table-column>
                <el-table-column prop="avlSt" label="产品可用状态" width="150">
                    <template slot-scope="scope">
                        <span class="can-use" v-if="scope.row.avlSt === '0'">可用</span>
                        <span class="cannot-use" v-else>不可用</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" @click="query(scope.row)">查看</el-button>
                        <el-button type="text" @click="addAndEdit(scope.row)">修改</el-button>
                        <el-button type="text" @click="deletePro(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginatioinConfig.start"
                :page-sizes="paginatioinConfig.sizes" :page-size="paginatioinConfig.maxRows" layout="total, sizes, prev, pager, next, jumper"
                :total="paginatioinConfig.total" style="width: 600px; margin: 0 auto;"></el-pagination>
        </el-footer>
        <!-- 新增编辑弹窗 -->
        <el-dialog :title="dialogConfig.title" top="2vh" :visible.sync="dialogConfig.visible" center>
            <div class="content">
                <!-- 新增 -->
                <addAndEdit @getData="getData" v-if="dialogConfig.content === 'addAndEdit'" ref="addAndEdit" />
                <!-- 详情 -->
                <query v-if="dialogConfig.content === 'query'" ref="query" />
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="dialogConfig.btnShow" @click="dialogConfig.visible = false">取 消</el-button>
                <el-button type="primary" @click="submitEdit">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
    import addAndEdit from "./components/addAndEdit";
    import query from "./components/query";
    import {
        productMaintenance
    } from '@/api'
    import {
        getPdTp
    } from '@/utils/myFn';
    export default {
        name: "productMaintenance",
        components: {
            addAndEdit,
            query
        },
        data() {
            return {
                loading: false,
                loadingText: "拼命加载中...",
                searchConfig: {
                    pdNm: '',
                    pdBlngSbj: '',
                    pdTp: '',
                    avlSt: ''
                },
                pdBlngSbjOption: [{
                        value: '',
                        label: '全部'
                    }, {
                        value: "1",
                        label: "智能设备云"
                    },
                    {
                        value: "2",
                        label: "双录云"
                    }
                ],
                pdTpOption: [],
                defaultProps: {
                    children: "children",
                    label: "label"
                },
                avlStOption: [{
                    value: '',
                    label: '全部'
                }, {
                    value: "0",
                    label: "可用"
                }, {
                    value: '1',
                    label: '不可用'
                }],
                tableConfig: {
                    tableHead: [{
                            prop: "pdNm",
                            label: "产品名称",
                            width: "",
                            align: "center",
                            showOverflowTooltip: true,
                            fixed: false
                        },
                        {
                            prop: "pdBlngSbj",
                            label: "产品所属主体",
                            width: "",
                            align: "center",
                            showOverflowTooltip: true,
                            fixed: false
                        },
                        {
                            prop: "pdTp",
                            label: "产品类型",
                            width: "",
                            align: "center",
                            showOverflowTooltip: true,
                            fixed: false
                        }
                    ],
                    tableData: [],
                    tableHeaderClass: "my-table-header"
                },
                dialogConfig: {
                    title: "新增",
                    visible: false,
                    content: "addAndEdit",
                    btnShow: true
                },
                paginatioinConfig: {
                    total: 0,
                    maxRows: 10, //当页条数
                    sizes: [10, 20, 30],
                    start: 1 //起始条数
                }
            };
        },
        methods: {

            //获取列表数据
            async getData() {
                this.dialogConfig.visible = false
                const {
                    pdBlngSbj,
                    pdTp,
                    pdNm,
                    avlSt
                } = this.searchConfig
                const {
                    start,
                    maxRows
                } = this.paginatioinConfig
                try {
                    this.loading = true
                    const res = await this.$http({
                        method: 'get',
                        url: productMaintenance.query,
                        params: {
                            pdBlngSbj,
                            pdTp,
                            pdNm,
                            avlSt,
                            pageIndex: start,
                            pageSize: maxRows
                        },
                    })
                    if (res.status !== 200) throw res.statusText
                    const {
                        data
                    } = res.data
                    const {
                        total,
                        startRow,
                        list
                    } = data
                    this.paginatioinConfig.total = total
                    this.paginatioinConfig.start = startRow
                    let obj = {}
                    this.tableConfig.tableData = list.map(item => {
                        obj = Object.assign({}, item)
                        obj.pdBlngSbj = this.filterPdBlngSbj(obj.pdBlngSbj)
                        return obj
                    })
                    this.loading = false
                } catch (err) {
                    this.loading = false
                    console.log(err)
                    this.$message.error('系统异常，请稍后再试')
                }
            },

            //过滤产品所属主体
            filterPdBlngSbj(value) {
                switch (value) {
                    case '1':
                        return '智能设备云'
                    case '2':
                        return '双录云'
                }
            },

            //新增或修改
            addAndEdit(row) {
                this.dialogConfig.content = "addAndEdit";
                this.dialogConfig.title = row !== 'add' ? "修改" : "新增";
                this.dialogConfig.btnShow = true;
                this.dialogConfig.visible = true;
                setTimeout(() => {
                    row === 'add' ? this.$refs['addAndEdit'].initAdd() : this.$refs['addAndEdit'].initEdit(row)
                }, 0)
            },

            //新增、修改、详情弹出框确定按钮
            submitEdit() {
                if(this.dialogConfig.content !== 'query') {
                    this.$refs['addAndEdit'].submit()
                }else {
                    this.dialogConfig.visible = false
                }
            },

            //查询详情
            query(row) {
                this.dialogConfig.content = "query";
                this.dialogConfig.btnShow = false;
                this.dialogConfig.title = "详情";
                this.dialogConfig.visible = true;
                setTimeout(() => {
                    this.$refs['query'].getData(row.pdId)
                }, 0)
            },

            //删除
            async deletePro(row) {
                try {
                    await this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                } catch {
                    return
                }
                try {
                    const res = await this.$http({
                        method: 'delete',
                        url: productMaintenance.deletePro(row.pdId, row.authAhrId)
                    })
                    if (res.data.sysTxStatus !== '00') throw res.data.sysTxStatus
                    this.$message.success('删除成功')
                    this.getData()
                } catch (err) {
                    console.log(err)
                    this.$message.error('系统异常，请稍后再试')
                }
            },

            //获取产品类型
            async selectPdBlngSbj() {
                this.setIndex(9999)
                if (!this.searchConfig.pdBlngSbj) {
                    this.searchConfig.pdTp = ''
                    return
                }
                try {
                    this.pdTpOption = await getPdTp(this.searchConfig.pdBlngSbj, {
                        scope: 1,
                        tpId: '0'
                    })
                } catch (err) {
                    console.log(err)
                    this.$message.error('系统异常，请稍后再试')
                }
            },

            //产品类型选择
            checkoutChange(data) {
                const checked = data.checked
                this.changePdTp(this.pdTpOption)
                data.checked = checked
                this.searchConfig.pdTp = checked ? data.id : ''
            },

            changePdTp(arr) {
                arr.forEach(item => {
                    if (item.children) return this.changePdTp(item.children)
                    item.checked = false
                })
            },

            //选择每页条数            
            handleSizeChange(val) {
                this.paginatioinConfig.maxRows = val;
                this.getData();
            },

            //页数改变
            handleCurrentChange(val) {
                this.paginatioinConfig.start = val;
                this.getData();
            },

            //搜索
            search() {
                this.setIndex(0)
                this.getData()
            },

            //点击树节点
            nodeExpand() {
                this.setIndex(9999)
            },

            setIndex(val) {
                const treeNode = document.getElementById('my-tree')
                if (treeNode) treeNode.style.zIndex = val
            },

            init() {
                this.getData()
            }
        },
        created() {
            this.init();
        },
    };
</script>

<style lang="scss" scoped>
    .container {
        width: 100%;
        background-color: #fff;
    }

    .container.productMaintenance {
        min-width: 900px;
    }

    .my-header {
        height: auto !important;

        .section {
            display: inline-block;
            margin-right: 20px;
        }

        .handle-section {
            float: right;
        }

        .my-input {
            width: 150px;
            height: 32px;
        }

        .my-select {
            width: 150px;
            height: 32px;
        }

        .my-tree-box.section {
            position: relative;
            width: 230px;

            .my-tree {
                position: absolute;
                min-width: 140px;
                top: 0;
                left: 80px;
                z-index: 9999;
            }
        }

    }

    .can-use {
        color: #008000;
    }

    .cannot-use {
        color: #BCBCBC;
    }
</style>
<style lang="scss">
    .my-table-header {
        th {
            color: #fff !important;
            background: #2085d8 !important;
            font-weight: normal;
        }
    }

    .my-tree-box {
        .el-tree__empty-block {
            min-height: 50px !important;
        }
    }

    .productMaintenance {
        .el-dialog {
            min-width: 540px;
            height: 90% !important;
        }

        .el-dialog__body {
            height: calc(100% - 180px);
            overflow: auto;
        }
    }
</style>