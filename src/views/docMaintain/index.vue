<template>
    <el-container class="container" v-loading="loading" :element-loading-text="loadingText">
        <el-header>
            <el-button @click="showDialog('add')" class="header-btn" type="primary" icon="el-icon-plus">新增文档</el-button>
        </el-header>
        <el-main>
            <el-table :data="tableConfig.tableData" :header-row-class-name="tableConfig.tableHeaderClass" stripe style="width: 100%">
                <el-table-column 
                    v-for="(item, i) in tableConfig.tableHead" 
                    :key="i" 
                    :prop="item.prop" 
                    :label="item.label"
                    :width="item.width">
                </el-table-column>
                <el-table-column 
                    prop="docTp" 
                    label="文档类型">
                    <template slot-scope="scope">
                        <span>{{scope.row.docTp | filterTp}}</span>
                    </template>    
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <span title="编辑" class="handle-font" @click="showDialog('edit', scope.row)">
                            <i class="el-icon-edit"></i>
                        </span>
                        <span title="下载" class="handle-font" @click="downDoc(scope.row)">
                            <i class="el-icon-download"></i>
                        </span>
                        <span title="删除" class="handle-font" @click="deleteDoc(scope.row)">
                            <i class="el-icon-delete"></i>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginatioinConfig.start"
                :page-sizes="paginatioinConfig.sizes" :page-size="paginatioinConfig.maxRows" layout="total, sizes, prev, pager, next, jumper"
                :total="paginatioinConfig.total" style="width: 600px; margin: 0 auto;"></el-pagination>
        </el-footer>
        <el-dialog class="my-dialog" :title="dialogTitle" :visible.sync="dialogConfig.visible" width="40%" center>
            <el-main class="my-dialog-main">
                <section>
                    <span class="lf">文档类型</span>
                    <el-select class="my-dialog-select" v-model="dialogConfig.docTp" placeholder="请选择文档类型">
                      <el-option
                        v-for="item in docTpOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </section>
                <section>
                    <span class="lf">文档名称</span>
                    <el-input v-model="dialogConfig.docNm" placeholder="请输入文档名称"></el-input>
                </section>
                <section>
                    <span class="lf">文档简介</span>
                    <el-input v-model="dialogConfig.docBrf" type="textarea" placeholder="请输入文档简介" :autosize="{minRows: 2, maxRows: 6}"></el-input>
                </section>
                <section>
                    <span class="lf">上传文档</span>
                    <el-upload class="upload-demo" 
                        :action="action" 
                        :limit="1" 
                        :on-exceed="exceed"
                        :http-request="myUpload" 
                        :before-upload="beforeUpload" 
                        :file-list="dialogConfig.fileList">
                        <el-button class="header-btn" icon="el-icon-plus">新增文档</el-button>
                    </el-upload>
                </section>
            </el-main>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addAndEdit">确 定</el-button>
                <el-button @click="dialogConfig.visible = false">取 消</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
    import {
        docMaintain
    } from "@/api";
    import {
        setTimeout
    } from 'timers';
    import {
        filePath
    } from '@/config'
    export default {
        data() {
            return {
                tableConfig: {
                    tableHead: [{
                            prop: "docNm",
                            label: "名称",
                            width: "",
                            align: "center",
                            showOverflowTooltip: true,
                            fixed: false
                        },
                        {
                            prop: "mntPsnNm",
                            label: "上传者",
                            width: "",
                            align: "center",
                            showOverflowTooltip: true,
                            fixed: false
                        },
                        {
                            prop: "mntTms",
                            label: "上传时间",
                            width: "",
                            align: "center",
                            showOverflowTooltip: true,
                            fixed: false
                        }
                    ],
                    tableData: [],
                    tableHeaderClass: "my-table-header"
                },
                paginatioinConfig: {
                    total: 0,
                    maxRows: 10, //当页条数
                    sizes: [10, 20, 30],
                    start: 1 //起始条数
                },
                dialogTitle: "",
                dialogConfig: {
                    visible: false,
                    fileList: [],
                    docNm: "",
                    docBrf: "",
                    docSrc: "",
                    docTp: "",
                    docTpCopy: '',
                },
                docTpOptions: [
                    {
                        value: '1',
                        label: '操作指南'
                    },
                    {
                        value: '2',
                        label: '开发支持'
                    },
                    {
                        value: '3',
                        label: '上线问题'
                    }
                ],
                isEdit: false,
                editDocId: null,
                loading: false,
                loadingText: "拼命加载中...",
                action: `/upload?savePath=doc/${sessionStorage.userId}/`
            };
        },
        methods: {
            //获取表格数据
            getData() {
                this.loading = true;
                this.$axios({
                        url: docMaintain.query,
                        method: "post",
                        data: {
                            pageSize: this.paginatioinConfig.maxRows.toString(), //当页条数
                            pageNum: this.paginatioinConfig.start.toString() //起始条数
                        },
                        PBreq: "com.ccb.cloud.protobuf.proto.iequip.Doc",
                        PBres: "com.ccb.cloud.protobuf.proto.Page"
                    })
                    .then(res => {
                        this.loading = false;
                        if (res.headers.SYS_TX_STATUS != '00') {
                            return this.$message.error(res.headers.SYS_RESP_DESC)
                        }
                        this.paginatioinConfig.total = res.data.total;
                        let data = res.data.data;
                        this.tableConfig.tableData = data.map(item => {
                            return this.$myDecode(
                                item.value,
                                "com.ccb.cloud.protobuf.proto.iequip.Doc"
                            );
                        });
                        console.log(this.tableConfig.tableData);
                    })
                    .catch(err => {
                        this.loading = false;
                        this.$message.error('系统错误，请稍后再试')
                    });
            },

            //每页行数改变
            handleSizeChange(val) {
                this.paginatioinConfig.maxRows = val;
                this.getData();
            },

            //当前页改变
            handleCurrentChange(val) {
                this.paginatioinConfig.start = val;
                this.getData();
            },

            //显示弹窗
            showDialog(type, row) {
                this.isEdit = type === "edit" ? true : false;
                this.dialogTitle = type === "edit" ? "编辑文档" : "新增文档";
                for (let k in this.dialogConfig) {
                    if (k != "fileList") {
                        if (k !== "visible") {
                            this.dialogConfig[k] = "";
                        } else {
                            this.dialogConfig[k] = true;
                        }
                    } else {
                        this.dialogConfig[k] = [];
                    }
                }
                //编辑文档查询
                if (row) {
                    const {
                        docId
                    } = row;
                    this.editDocId = docId;
                    this.editQuery(docId)
                        .then(res => {
                            if(res.headers.SYS_TX_STATUS != '00') {
                                return this.$message.error(res.headers.SYS_RESP_DESC)
                            }
                            let {
                                data
                            } = res;
                            console.log(data);
                            this.dialogConfig.docNm = data.docNm;
                            this.dialogConfig.docBrf = data.docBrf;
                            this.dialogConfig.docSrc = data.docSrc;
                            this.dialogConfig.docTp = data.docTp
                        })
                        .catch(err => {
                            this.$message.error("系统异常，请稍后再试");
                        });
                }
            },

            //dialog确定按钮
            addAndEdit() {
                if(!this.dialogConfig.docTp) {
                    return this.$message.warning('请选择文档类型')
                }
                if(!this.dialogConfig.docNm.trim()) {
                    return this.$message.warning('文档名称不能为空')
                }
                if(!this.dialogConfig.docBrf.trim()) {
                    return this.$message.warning('文档简介不能为空')
                }
                if(!this.dialogConfig.docSrc) {
                    return this.$message.warning('上传文档不能为空')
                }
                if (this.isEdit) {
                    this.edit()
                        .then(res => {
                            this.$message.success("编辑文档成功");
                            this.dialogConfig.visible = false;
                            this.getData();
                        })
                        .catch(err => {
                            this.$message.success("系统异常，请稍后再试");
                        });
                } else {
                    this.addDoc()
                        .then(res => {
                            if(res.headers.SYS_TX_STATUS != '00') {
                                return this.$message.error(res.headers.SYS_RESP_DESC)
                            }
                            this.getData();
                            this.$message.success("新增成功");
                            this.dialogConfig.visible = false;
                        })
                        .catch(err => {
                            this.$message.error("系统异常，请稍后再试");
                        });
                }
            },

            //新增文档
            addDoc() {
                const self = this;
                let {
                    docNm,
                    docBrf,
                    docSrc,
                    docTp
                } = this.dialogConfig;
                return self.$axios({
                    method: "post",
                    url: docMaintain.add,
                    data: {
                        docNm,
                        docBrf,
                        docSrc,
                        docTp,
                        docBlngSbj: '1'//设备云
                    },
                    PBreq: "com.ccb.cloud.protobuf.proto.iequip.Doc"
                })

            },

            //编辑文档查询
            editQuery(docId) {
                return this.$axios({
                    method: "get",
                    url: docMaintain.editQuery(docId),
                    PBreq: "com.ccb.cloud.protobuf.proto.iequip.Doc",
                    PBres: "com.ccb.cloud.protobuf.proto.iequip.Doc"
                })

            },

            //编辑文档
            edit() {
                const self = this;
                return self.$axios({
                    method: "patch",
                    url: docMaintain.editDoc(self.editDocId),
                    data: {
                        docTp: self.dialogConfig.docTp,
                        docNm: self.dialogConfig.docNm,
                        docBrf: self.dialogConfig.docBrf,
                        docSrc: self.dialogConfig.docSrc
                    },
                    PBreq: "com.ccb.cloud.protobuf.proto.iequip.Doc"
                })

            },

            //下载文档
            downDoc(row) {
                let origin = window.location.origin
                let url = `${origin}/download?filePath=${filePath}${row.docSrc.replace(/\\/g, '/')}`;
                window.open(url);
            },

            //删除文档
            deleteDoc(row) {
                const {
                    docId
                } = row;
                this.$confirm('此操作将永久删除该文档, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    this.$axios({
                        method: "delete",
                        url: docMaintain.deleteDoc(docId)
                    })
                    .then(res => {
                        if(res.headers.SYS_TX_STATUS != '00') {
                            return this.$message.error(res.headers.SYS_RESP_DESC)
                        }
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getData();
                    })
                    .catch(err => {
                        this.$message.error('系统异常，请稍后再试')
                    });
                })
                
            },

            //自定义上传方法
            myUpload(content) {
                let formData = new FormData();
                formData.append('file', content.file);
                formData.append('fileName', new Date().getTime() + content.file.name)
                this.$http({
                    method: 'post',
                    url: `/upload?savePath=doc/${sessionStorage.userId}/`,
                    data: formData
                }).then(res => {
                    console.log(res);
                    // this.dialogConfig.docTp = this.dialogConfig.docTpCopy
                    this.dialogConfig.docSrc = res.data.path
                    this.$message.success('上传文件成功')
                }).catch(err => {
                    console.log(err);
                    this.$message.error('系统异常，请稍后再试')
                })
            },

            //上传文档前
            beforeUpload(file) {
                // if (this.dialogConfig.docSrc) {
                //     let flag = false;
                //     this.$confirm("新增文档将替换掉原文档，是否继续？", "提示", {
                //         confirmButtonText: "确定",
                //         cancelButtonText: "取消",
                //         type: "warning"
                //     }).catch(() => {
                //         flag = true;
                //     });
                //     if (flag) return false;
                // }
                if (file.type !== "application/pdf") {
                    this.$message.warning("上传文件类型只能为pdf");
                    return false;
                }
                if (Math.ceil(file.size / 1024 / 1024) > 2) {
                    this.$message.warning('上传文件大小不能超过 2M')
                    return false
                }
                this.dialogConfig.docTpCopy = file.type.slice(file.type.indexOf('/') + 1)
                return true
            },

            //文档上传成功
            // handleSucc(res, file, fileList) {
            //     console.log(res);
            //     const self = this;
            //     if (res.BK_STATUS == "00") {
            //         let arr = fileList.map(item => {
            //             return {
            //                 path: item.response.path,
            //                 type: item.raw.type
            //             };
            //         });
            //         let docSrc = "",
            //             docTp = "";
            //         arr.forEach(item => {
            //             docSrc += `${item.path},`;
            //             docTp += `${item.type},`;
            //         });
            //         self.dialogConfig.docSrc =
            //             (docSrc.charAt(docSrc.length - 1) === "," &&
            //                 docSrc.slice(0, docSrc.length - 1)) ||
            //             docSrc;
            //         self.dialogConfig.docTp =
            //             (docTp.charAt(docTp.length - 1) === "," &&
            //                 docTp.slice(0, docTp.length - 1)) ||
            //             docTp;
            //         self.dialogConfig.docTp = self.dialogConfig.docTp.slice(self.dialogConfig.docTp.indexOf('/') + 1)
            //     }
            // },

            //上传文档失败
            // handleFaild(err) {
            //     console.log(err);
            // },

            //文档上传超出个数
            exceed() {
                this.$message.warning("上传文档数不超过一个");
            },

            //初始化
            init() {
                this.getData();
            }
        },
        created() {
            this.init();
        },
        filters: {
            filterTp(tp) {
                switch(tp) {
                    case '1':
                        return '操作指南'
                    case '2':
                        return '开发支持'
                    case '3':
                        return '上线问题'
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .container {
        width: 100%;
        height: 100%;
        padding: 10px 0 0 0;
        background-color: #fff;
    }

    .header-btn {
        float: right;
        height: 40px;
        background-color: #fff;
        font-family: "MicrosoftYaHei", "Microsoft YaHei";
        font-weight: 400;
        font-style: normal;
        color: #000000;
    }

    .handle-font {
        font-size: 16px;
        cursor: pointer;

        &:nth-child(1) {
            margin-right: 10px;
        }

        &:nth-child(2) {
            margin-right: 10px;
        }
    }

    .my-dialog {
        .my-dialog-main {
            border-top: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
        }

        section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;

            .lf {
                width: 90px;
                line-height: 50px;
            }

            &:nth-child(1) {
                justify-content: flex-start;
                .lf {
                    width: 76px;
                }
            }

            &:last-child  {
                justify-content: flex-start;
                .lf {
                    width: 76px;
                }
            }
        }
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
</style>