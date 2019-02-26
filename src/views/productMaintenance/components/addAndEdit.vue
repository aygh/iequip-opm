<template>
    <el-container class="container product" v-loading="loading" :element-loading-text="loadingText">
        <el-form :model="formData" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="产品名称" prop="pdNm">
                <el-input v-model="formData.pdNm" placeholder="请输入产品名称"></el-input>
            </el-form-item>
            <el-form-item label="产品可见状态" prop="avlSt">
                <el-select size="small" class="my-select" placeholder="请选择产品可见状态" v-model="formData.avlSt">
                    <el-option v-for="item in avlStOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="产品所属系统" prop="pdBlngSbj">
                <el-select @change="selectPdBlngSbj" size="small" class="my-select" placeholder="请选择产品所属系统" v-model="formData.pdBlngSbj">
                    <el-option v-for="item in pdBlngSbjOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="产品类型" prop="pdTpOption" v-if="formData.pdBlngSbj">
                <el-tree :data="pdTpOption" :props="defaultProps" accordion>
                    <span slot-scope="{node, data}">
                        <el-checkbox v-model="data.checked" @change="checkoutChange(data)" :label="data.label" v-if="!data.children"></el-checkbox>
                        <span v-if="data.children">{{data.label}}</span>
                    </span>
                </el-tree>
            </el-form-item>
            <el-form-item label="产品序号" prop="pdDispNo">
                <el-input v-model="formData.pdDispNo" size="small" placeholder="产品序号0~999"></el-input>
            </el-form-item>
            <el-form-item label="产品简介" prop="pdBrf">
                <el-input v-model="formData.pdBrf" type="textarea" size="small" placeholder="产品简介300字以内"></el-input>
            </el-form-item>
            <el-form-item label="产品LOGO" prop="pdLogoSrc">
                <el-upload class="pd-logo-uploader" :action="logoAction" :show-file-list="false" :limit="1"
                    :http-request="myLogoUpload" :before-upload="beforeLogoUpload">
                    <img v-if="formData.pdLogoSrc" :src="formData.pdLogoSrc" class="pd-logo">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="产品使用说明" prop="pdUrl">
                <el-upload :action="proAction" :file-list="proList" :before-upload="beforePdUpload" :limit="1"
                    :http-request="myProUpload" :on-remove="removeFile">
                    <el-button type="primary">使用说明上传</el-button>
                </el-upload>
                <a :href="proShowUrl" v-if="proShowUrl" target="_blank">查看使用说明</a>
            </el-form-item>
        </el-form>
    </el-container>
</template>

<script>
    import {
        productMaintenance
    } from '@/api'
    import {
        getPdTp,
        myUpload
    } from '@/utils/myFn';
    import {
        filePath
    } from '@/config'
    export default {
        data() {
            return {
                formData: {
                    pdNm: "",
                    pdBlngSbj: "",
                    pdTp: '',
                    pdDispNo: '',
                    pdBrf: '',
                    pdLogoSrc: '',
                    pdUrl: '',
                    avlSt: '0'
                },
                rules: {
                    pdNm: [{
                        required: true,
                        message: '请输入产品名称',
                        trigger: 'blur'
                    }],
                    pdDispNo: [{
                        required: true,
                        message: '请填写产品序号',
                        trigger: 'blur'
                    }],
                    pdBrf: [{
                        required: true,
                        message: '请填写产品简介',
                        trigger: 'blur'
                    }]
                },
                proList: [],
                pdBlngSbjOption: [{
                        value: "1",
                        label: "智能设备云"
                    },
                    {
                        value: "2",
                        label: "双录云"
                    }
                ],
                avlStOption: [{
                    value: '0',
                    label: '可用'
                }, {
                    value: '1',
                    label: '不可用'
                }],
                pdTpOption: [],
                defaultProps: {
                    children: "children",
                    label: "label"
                },
                addOrEdit: true,
                logoAction: `/upload?savePath=productLogo/${sessionStorage.userId}/`,
                proAction: `/upload?savePath=productFile/${sessionStorage.userId}/`,
                proFileName: '',
                proShowUrl: '',
                loading: false,
                loadingText: "拼命加载中...",
            };
        },
        methods: {

            //logo 上传前
            beforeLogoUpload(file) {
                const {
                    type,
                    size
                } = file
                if (!type.includes('png') && !type.includes('jpeg')) {
                    this.$message.warning('上传logo图片格式限定jpg、png')
                    return false
                }
                if (Math.ceil(size / 1024 / 1024) > 2) {
                    this.$message.warning('上传图片大小不能超过 2M')
                    return false
                }
                return true
            },

            //产品 上传前
            beforePdUpload(file) {
                const {
                    type,
                    name
                } = file
                if (!type.includes('html') && !type.includes('pdf')) {
                    this.$message.warning('上传文件格式限定pdf、html')
                    return false
                }
                this.proFileName = name
                return true
            },

            removeFile() {
                this.formData.pdUrl = ''
                this.proList = []
            },

            //logo 上传
            async myLogoUpload(content) {
                try {
                    const res = await myUpload(content, this.logoAction)
                    console.log(res)
                    const {
                        path
                    } = res.data
                    const {origin} = window.location
                    this.formData.pdLogoSrc = `${origin}/download?filePath=${filePath}${path.replace(/\\/g, '/')}`
                    this.$message.success('上传logo成功')
                } catch (err) {
                    console.log(err)
                    this.$message.error('上传logo失败')
                }
            },

            //产品上传
            async myProUpload(content) {
                try {
                    const res = await myUpload(content, this.proAction)
                    console.log(res)
                    const {
                        path,
                        file
                    } = res.data
                    this.formData.pdUrl = path
                    const {origin} = window.location
                    this.proList = [{
                        name: this.proFileName ? this.proFileName : '文件名',
                        url: `${origin}/download?filePath=${filePath}${path.replace(/\\/g, '/')}`
                    }]
                    this.proShowUrl = `${origin}/download?filePath=${filePath}${path.replace(/\\/g, '/')}`
                    this.$message.success('上传文件成功')
                } catch (err) {
                    console.log(err)
                    this.$message.error('上传文件失败')
                }
            },

            //新增、修改弹出框确定按钮
            submit() {
                this.addOrEdit ? this.add() : this.edit()
            },

            //新增
            async add() {
                try {
                    await this.validate()
                } catch {
                    return
                }
                try {
                    const res = await this.$http({
                        method: 'post',
                        url: productMaintenance.add,
                        data: this.formData
                    })
                    const {
                        sysTxStatus,
                        sysRespDesc
                    } = res.data
                    if (sysTxStatus === '00') {
                        this.$message.success('新增成功')
                        this.$emit('getData')
                    } else {
                        this.$message.warning(sysRespDesc)
                    }
                } catch (err) {
                    if (err) console.log(err)
                    this.$message.error('系统异常，请稍后再试')
                }
            },

            //编辑
            async edit() {
                try {
                    await this.validate()
                } catch {
                    return
                }
                const data = Object.assign({}, this.formData)
                const pdBlngSbj = this.pdBlngSbjOption.filter(item => {
                    return item.label === data.pdBlngSbj
                })
                data.pdBlngSbj = pdBlngSbj[0] ? pdBlngSbj[0].value : ''
                try {
                    const res = await this.$http({
                        method: 'patch',
                        url: productMaintenance.edit(this.formData.pdId),
                        data
                    })
                    const {
                        sysTxStatus,
                        sysRespDesc
                    } = res.data
                    if (sysTxStatus === '00') {
                        this.$message.success('修改成功')
                        this.$emit('getData')
                    } else {
                        this.$message.warning(sysRespDesc)
                    }
                } catch (err) {
                    console.log(err)
                    this.$message.error('系统异常，请稍后再试')
                }
            },

            //表单验证
            validate() {
                return new Promise((resolve, reject) => {
                    this.$refs['form'].validate(valid => {
                        valid ? resolve() : reject()
                    })
                })
            },

            //产品类型选择
            checkoutChange(data) {
                const checked = data.checked
                this.changePdTp(this.pdTpOption)
                data.checked = checked
                this.formData.pdTp = checked ? data.id : ''
            },

            //checked 变成 false
            changePdTp(arr) {
                arr.forEach(item => {
                    if (item.children) return this.changePdTp(item.children)
                    item.checked = false
                })
            },

            //获取产品类型
            async selectPdBlngSbj() {
                if (!this.formData.pdBlngSbj) return
                try {
                    this.loading = true
                    this.pdTpOption = await getPdTp(this.formData.pdBlngSbj, {
                        scope: 1,
                        tpId: '0'
                    })
                    this.loading = false
                } catch (err) {
                    console.log(err)
                    this.loading = false
                    this.$message.error('系统异常，请稍后再试')
                }
            },

            //初始化 新增
            initAdd() {
                this.addOrEdit = true
                for (let k in this.formData) {
                    if (k === 'avlSt') {
                        this.formData[k] = '0'
                    } else {
                        this.formData[k] = ''
                    }
                }
                this.proShowUrl = ''
            },

            //初始化 修改
            async initEdit(row) {
                this.addOrEdit = false
                if (row.pdBlngSbj) {
                    this.formData.pdBlngSbj = row.pdBlngSbj === '智能设备云' ? '1' : '2'
                    await this.selectPdBlngSbj()
                    this.setChecked(row.pdTp)
                }
                this.formData = Object.assign({}, row)
                const {origin} = window.location
                this.proShowUrl = this.formData.pdUrl ?  `${origin}/download?filePath=${filePath}${this.formData.pdUrl.replace(/\\/g, '/')}`: ''
            },

            setChecked(id) {
                this.forEachPdTpOption(this.pdTpOption, id)
            },

            forEachPdTpOption(arr, id) {
                for (let val of arr) {
                    if (val.children) {
                        this.forEachPdTpOption(val.children, id)
                    } else {
                        if (val.id === id) {
                            val.checked = true
                            break
                        }
                    }
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .container {
        width: 100%;
        height: 100%;

        .section {
            display: block;
            margin-right: 20px;
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
</style>
<style lang="scss">
    .pd-logo-uploader .el-upload {
        border: 1px solid #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .pd-logo-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .pd-logo {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>