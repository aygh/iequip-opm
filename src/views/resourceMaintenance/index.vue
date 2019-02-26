<template>
  <el-container class="container" v-loading="loading" :element-loading-text="loadingText">
    <el-header class="header resource-header">
      <section class="section">
        <span class="title">资源名称：</span>
        <el-input
          size="small"
          class="my-input"
          v-model="searchConfig.resNm"
          placeholder="请输入资源名称"
          maxlength="20"
          clearable
        ></el-input>
      </section>
      <section class="section">
        <span class="title">资源所属系统：</span>
        <el-select v-model="searchConfig.stmId" size="small" class="my-select">
          <el-option
            v-for="item in resourceSysOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </section>
      <section class="section">
        <span class="title">资源类型：</span>
        <el-select v-model="searchConfig.resTpId" size="small" class="my-select">
          <el-option
            v-for="item in resTpIdOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </section>
      <section class="section">
        <span class="title">资源状态：</span>
        <el-select v-model="searchConfig.avlSt" size="small" class="my-select">
          <el-option
            v-for="item in avlStOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </section>
      <section class="section">
        <el-button class="search" size="small" height="32" @click="getReData">搜索</el-button>
      </section>
    </el-header>
    <div class="buttons" style="padding-left:20px;margin-bottom:10px;">
      <el-button type="primary" size="medium" @click="addResource">新增</el-button>
      <el-button type="primary" size="medium" @click="modifyRe">修改</el-button>
      <el-button type="primary" size="medium" @click="deleteRe">删除</el-button>
      <el-button type="primary" size="medium" @click="showDetail">查看详情</el-button>
      <el-button type="primary" size="medium" @click="showIns">查看使用说明</el-button>
    </div>
    <el-main style="heigth: 400px; padding: 0 20px;">
      <el-table
        :data="tableConfig.tableData"
        :header-row-class-name="tableConfig.tableHeaderClass"
        stripe
        style="width: 100%"
        @select="selectResource"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column
          v-for="(item, i) in tableConfig.tableHead"
          :key="i"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        ></el-table-column>
        <el-table-column :prop="'stmId'" :label="'资源所属系统'">
          <template slot-scope="scope">
            <span>{{scope.row.stmId | stmIdFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column :prop="'resTpId'" :label="'资源类型'">
          <template slot-scope="scope">
            <span>{{scope.row.resTpId | resTpIdFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column :prop="'avlSt'" :label="'资源状态'">
          <template slot-scope="scope">
            <span>{{scope.row.avlSt | avlStFilter}}</span>
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
      ></el-pagination>
    </el-footer>
    <!-- 新增资源弹窗 -->
    <el-dialog class="my-dialog" title="新增资源" :visible.sync="dialogConfig.visible.addDialog" :before-close="clearFormRules">
      <el-form ref="addResourceInfo" :model="addResourceInfo" label-width="120px" :rules="checkRules">
        <el-form-item label="资源名称" style="width:600px;" prop="resNm">
          <el-input
            placeholder="请输入资源名称"
            v-model="addResourceInfo.resNm"
            maxlength="20"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="资源访问方法" style="width:600px;" prop="resOptp">
          <el-select v-model="addResourceInfo.resOptp" placeholder="请选择资源所属系统">
            <el-option
              v-for="item in resOptpOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源状态" style="width:600px;" prop="avlSt">
          <el-select v-model="addResourceInfo.avlSt" placeholder="请选择资源状态">
            <el-option
              v-for="item in avlStOption.filter(i => i.value)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源所属系统" prop="stmId">
          <el-select v-model="addResourceInfo.stmId" placeholder="请选择资源所属系统">
            <el-option
              v-for="item in resourceSysOption.filter(i => i.value)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源类型" prop="resTpId">
          <el-select v-model="addResourceInfo.resTpId" placeholder="请选择资源类型">
            <el-option
              v-for="item in resTpIdOption.filter(i => i.value)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源描述" style="width:600px;" prop="resDsc">
          <el-input
            type="textarea"
            v-model="addResourceInfo.resDsc"
            maxlength="300"
            :autosize="{ minRows: 4, maxRows: 12}"
            size="medium"
            placeholder="请输入资源描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="资源使用说明" prop="resRte">
          <el-upload
            :limit="1"
            :action="resourceFileAction"
            :on-exceed="handleExceed"
            :before-upload="beforeAvatarUpload"
            :on-success="resSucc"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="输出为产品" prop="initPd">
          <el-select v-model="addResourceInfo.initPd" placeholder="请选择是否输出为产品">
            <el-option
              v-for="item in initPd"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" style="width:600px;" v-show="addResourceInfo.initPd == '1'" prop="pdNm" >
          <el-input
            placeholder="请输入产品名称"
            v-model="addResourceInfo.pdNm"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="产品所属系统" v-show="addResourceInfo.initPd == '1'" prop="pdBlngSbj">
          <el-select v-model="addResourceInfo.pdBlngSbj" placeholder="请选择产品所属系统">
            <el-option
              v-for="item in resourceSysOption.filter(i => i.value)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品类型" v-show="addResourceInfo.initPd == '1'">
          <el-tree v-model="addResourceInfo.pdTp"></el-tree>
        </el-form-item>
        <el-form-item label="产品序号" v-show="addResourceInfo.initPd == '1'" prop="pdDispNo">
          <el-input
            placeholder="请输入产品序号"
            style="width:221px;"
            v-model.number="addResourceInfo.pdDispNo"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品简介"
          style="width:600px;"
          v-show="addResourceInfo.initPd == '1'"
          prop='pdBrf'
        >
          <el-input
            type="textarea"
            v-model="addResourceInfo.pdBrf"
            placeholder="请输入产品简介"
            maxlength="300"
            :autosize="{ minRows: 4, maxRows: 12}"
            size="medium"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品Logo" v-show="addResourceInfo.initPd == '1'" prop="pdLogoSrc">
          <el-upload
            :limit="1"
            class="avatar-uploader"
            :action="logoAction"
            :show-file-list="false"
            :on-success="logoSucc"
            :before-upload="beforeAvatarUploadPro"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="产品使用说明" v-show="addResourceInfo.initPd == '1'" prop='pdUrl'>
          <el-upload
            :limit="1"
            :action="productFileAction"
            :on-exceed="handleExceed"
            :before-upload="beforeAvatarUpload"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button height="32" size="small" class="confirmEdit" @click="submitForm('addResourceInfo')">确定</el-button>
        <el-button height="32" size="small" class="cancelEdit" @click="cancleNewRe('addResourceInfo')">取消</el-button>
      </div>
    </el-dialog>
    <!-- 修改资源弹窗 -->
    <el-dialog class="my-dialog" title="修改资源" :visible.sync="dialogConfig.visible.modifyDialog">
      <el-form ref="modifyReInfo" :model="modifyReInfo" label-width="120px" :rules="rules">
        <el-form-item label="资源名称" style="width:600px;" prop="resNm">
          <el-input placeholder="请输入资源名称" v-model="modifyReInfo.resNm" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="资源描述" style="width:600px;" >
          <el-input
            type="textarea"
            v-model="modifyReInfo.resDsc"
            maxlength="300"
            :autosize="{ minRows: 4, maxRows: 12}"
            size="medium"
            placeholder="请输入资源描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="资源类型" prop="resTpId">
          <el-select v-model="modifyReInfo.resTpId" placeholder="请选择资源类型">
            <el-option
              v-for="item in resTpIdOption.filter(i => i.value)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源所属系统" prop="stmId">
          <el-select v-model="modifyReInfo.stmId" placeholder="请选择资源所属系统">
            <el-option
              v-for="item in resourceSysOption.filter(i => i.value)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源访问方法" prop="resOptp">
          <el-select v-model="modifyReInfo.resOptp" placeholder="请选择资源状态">
            <el-option
              v-for="item in resOptpOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源状态" prop="avlSt">
          <el-select v-model="modifyReInfo.avlSt" placeholder="请选择资源状态">
            <el-option
              v-for="item in avlStOption.filter(i => i.value)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源使用说明" prop="pdUrl">
          <!-- 展示资源的使用说明，并可以替换 -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button height="32" size="small" class="confirmEdit" @click="confirmEdit('modifyReInfo')">确定</el-button>
        <el-button height="32" size="small" class="cancelEdit" @click="cancelEdit">取消</el-button>
      </div>
    </el-dialog>
    <!-- 删除资源弹窗 -->
    <el-dialog class="my-dialog" title="删除资源" :visible.sync="dialogConfig.visible.deleteDialog">
      <p>
        是否删除ID为
        <b v-for="item in selectReId" :key="item.resId">&nbsp;&nbsp;{{item.resId}}&nbsp;&nbsp;</b>的资源？
      </p>
      <div slot="footer" class="dialog-footer">
        <el-button height="32" size="small" class="confirmDelete" @click="confirmDelete">确定</el-button>
        <el-button height="32" size="small" class="cancelEdit" @click="cancelEdit">取消</el-button>
      </div>
    </el-dialog>
    <!-- 查看资源详情弹窗 -->
    <el-dialog class="my-dialog" title="资源详情" :visible.sync="dialogConfig.visible.detailDialog">
      <el-form ref="addResourceInfo" :model="addResourceInfo" label-width="100px" v-for="item in reDetail" :key="item.resId">
        <el-form-item label="资源名称" style="width:600px;">
          <el-tag type="info">{{item.resNm}}</el-tag>
        </el-form-item>
        <el-form-item label="资源LOGO" style="width:600px;"></el-form-item>
        <el-form-item label="资源描述" style="width:600px;">
          <el-tag type="info">{{item.resDsc | resDscFilter}}</el-tag>
        </el-form-item>
        <el-form-item label="资源所属系统" style="width:600px;">
          <el-tag type="info">{{item.stmId | stmIdFilter }}</el-tag>
        </el-form-item>
        <el-form-item label="资源类型" style="width:600px;">
          <el-tag type="info">{{item.resTpId | resTpIdFilter }}</el-tag>
        </el-form-item>
        <el-form-item label="资源状态" style="width:600px;">
          <el-tag type="info">{{item.avlSt | avlStFilter}}</el-tag>
        </el-form-item>
        <el-form-item label="资源生命周期" style="width:600px;">
          <el-button @click="rePeriod" type="text">查看资源生命周期</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button height="32" size="small" class="cancelEdit" @click="cancelEdit" type="primary">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 资源生命周期弹窗 -->
    <el-dialog class="my-dialog" title="资源生命周期" :visible.sync="dialogConfig.visible.periodDialog">
      <el-form ref="addResourceInfo" :model="addResourceInfo" label-width="100px"></el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          height="32"
          size="small"
          class="cancelEdit"
          @click="closePeriod"
          type="primary"
        >关闭</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { filePath } from "@/config";

export default {
  name: "resourceMaintenance",
  data() {
    return {
      imageUrl: "",
      fileList: [],
      loading: false,
      loadingText: "拼命加载中...",
      selectReId: [],
      searchConfig: {
        resNm: "",
        stmId: "",
        resTpId: "",
        avlSt: "",
        pageSize: 10,
        pageIndex: 1,
      },
      // 资源系统数据
      resourceSysOption: [
        {
          value: "",
          label: "全部"
        },
        {
          label: "智能设备云",
          value: "1"
        },
        {
          label: "双录云",
          value: "2"
        }
      ],
      // 资源访问方法数据
      resOptpOption: [
        {
          label: "GET",
          value: "GET"
        },
        {
          label: "POST",
          value: "POST"
        }
      ],
      // 资源类型数据
      resTpIdOption: [
        {
          value: "",
          label: "全部"
        },
        {
          label: "页面级资源",
          value: "1"
        },
        {
          label: "外设资源",
          value: "2"
        },
        {
          label: "静态资源",
          value: "3"
        },
        {
          label: "REST资源",
          value: "4"
        },
        {
          label: "其他",
          value: "5"
        }
      ],
      // 资源状态数据
      avlStOption: [
        {
          value: "",
          label: "全部"
        },
        {
          label: "可用",
          value: "1"
        },
        {
          label: "不可用",
          value: "2"
        }
      ],
      // 是否输出为产品
      initPd: [
        {
          label: "是",
          value: "1"
        },
        {
          label: "否",
          value: "2"
        }
      ],
      tableConfig: {
        tableHead: [
          {
            prop: "resId",
            label: "资源ID",
            width: "",
            showOverflowTooltip: true,
            fixed: false
          },
          {
            prop: "resNm",
            label: "资源名称",
            width: "",
            align: "right",
            showOverflowTooltip: true,
            fixed: false
          }
        ],
        // 资源列表数据
        tableData: [],
        tableHeaderClass: "my-table-header"
      },
      //   分页配置
      paginatioinConfig: {
        total: 0,
        maxRows: 1, //每页行数
        size: 10,
        sizes: [10, 20, 30],
        start: 1 //当前页
      },
      //   编辑弹窗配置
      dialogConfig: {
        visible: {
          addDialog: false,
          deleteDialog: false,
          modifyDialog: false,
          detailDialog: false,
          instructionDialog: false,
          periodDialog: false
        },
        row: "",
        rowInfo: "",
        innerVisible: false,
        formData: {
          appStDesc: ""
        }
      },
      // 新增资源要素
      addResourceInfo: {
        stmId: "",
        resTpId: "",
        resNm: "",
        resDsc: "",
        resOptp: "",
        // 资源使用说明
        resRte: "",
        initPd: "",
        // 产品扩展要素
        pdNm: "",
        pdBlngSbj: "",
        pdTp: "",
        pdDispNo: "",
        pdBrf: "",
        pdLogoSrc: "",
        pdUrl: ""
      },
      checkRules:{},
      rules: {
          stmId: [
            { required: true, message: '请选择资源所属系统', trigger: 'change' }
          ],
          resOptp: [
            { required: true, message: '选择资源访问方法', trigger: 'change' }
          ],
          avlSt: [
            { required: true, message: '选择资源状态', trigger: 'change' }
          ],
          resTpId: [
            { required: true, message: '选择资源类型', trigger: 'change' }
          ],
          resNm: [
            { required: true, message: '请输入资源名称', trigger: 'change' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          resDsc: [
            { min: 10, max: 300, message: '长度在 10 到 300 个字符', trigger: 'blur' }
          ],
          resRte: [
            // { required: true, message: '请上传资源使用说明', trigger: 'change' },
          ],
          initPd: [
            { required: true, message: '请选择是否输出为产品', trigger: 'change' },
          ]
        },
      pdRules: {
        pdNm: [
            { required: true, message: '请输入产品名称', trigger: 'change' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          pdBlngSbj: [
            { required: true, message: '请选择产品所属系统', trigger: 'change' }
          ],
          pdTp: [
            { required: true, message: '选择产品类型', trigger: 'change' }
          ],
          pdDispNo: [
            { required: true, message: '序号不能为空', trigger: 'change', },
            {type: 'number',message: '序号必须为数字值'},
            // { min: 1, max: 3, message: '长度在 1 到 3 个字符', trigger: 'blur'}
          ],
          pdBrf: [
            { min: 10, max: 300, message: '长度在 10 到 300 个字符', trigger: 'blur' }
          ],
          pdLogoSrc: [
            // { required: true, message: '请上传产品LOGO', trigger: 'change', },
          ],
          pdUrl: [
            // { required: true, message: '请上传产品使用说明', trigger: 'change', },
          ],
      },
      // 修改资源要素
      modifyReInfo: {
        resNm: "",
        resDsc: "",
        resTpId: "",
        stmId: "",
        resOptp: "",
        avlSt: "",
        resRte: ""
      },
      // 资源详情数据
      reDetail: [],
      logoAction: `/upload?savePath=productLogo/${sessionStorage.userId}/`,
      productFileAction: `/upload?savePath=productFile/${sessionStorage.userId}/`,
      resourceFileAction: `/upload?savePath=resourceFile/${sessionStorage.userId}/`
    };
  },
  methods: {
    //   查询资源列表
    getReData() {
      this.getReList()
    },
    // 编辑资源
    editResource(row) {
      console.log(row);
      this.dialogConfig.visible = true;
    },
    // 列表显示条数变化
    handleSizeChange(val) {
      this.paginatioinConfig.maxRows = val;
    },
    // 页数变化
    handleCurrentChange(val) {
      this.tableConfig.tableData = [];
      this.paginatioinConfig.start = val;
      this.searchConfig.pageSize = this.paginatioinConfig.size
      this.searchConfig.pageIndex = this.paginatioinConfig.start
      this.getReList()
    },
    // 取消新增资源
    cancelEdit(formName) {
      this.dialogConfig.visible.modifyDialog = false
      this.dialogConfig.visible.deleteDialog = false
      this.dialogConfig.visible.detailDialog = false
    },
    cancleNewRe(formName) {
      this.dialogConfig.visible.addDialog = false
      this.$refs[formName].resetFields()
    },
    // 新增资源弹窗
    addResource() {
      this.addResourceInfo = {
        stmId: "",
        resTpId: "",
        resNm: "",
        resDsc: "",
        resOptp: "",
        // 资源使用说明
        resRte: "",
        initPd: "",
        // 产品扩展要素
        pdNm: "",
        pdBlngSbj: "",
        pdTp: "",
        pdDispNo: "",
        pdBrf: "",
        pdLogoSrc: "",
        pdUrl: ""
      }
      this.dialogConfig.visible.addDialog = true;
    },
    submitForm(formName) {
      if (this.addResourceInfo.initPd === '1') {
        this.checkRules = {}
        this.checkRules = {...this.rules,...this.pdRules}
      } else if (this.addResourceInfo.initPd === '2') {
        this.checkRules = {}
        this.checkRules = {...this.rules }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('submit')
          // 新增资源请求
          this.$http({
            method: 'post',
            url: '/product/v1/resource',
            data: this.addResourceInfo
          }).then( res => {
            console.log(res)
            if (res.data.sysTxStatus !== '00') {
              this.$message.warning(res.data.sysRespDesc)
            } else {
              this.$refs['addResourceInfo'].resetFields()
              this.dialogConfig.visible.addDialog = false
              this.getReList()
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          return false
        }
      })
      console.log(this.addResourceInfo)
    },
    clearFormRules () {
      this.$refs['addResourceInfo'].resetFields()
      this.dialogConfig.visible.addDialog = false
    },
    // 上传资源使用说明
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件`);
    },
    resSucc (file,fileList) {
      this.addResourceInfo.resRte = fileList.name
      // http://128.160.180.155:8082/getFile?filePath=e:/ccb-upload-file/input/${file.path.replace(/\\/g,%20%27/%27)}
    },
    beforeAvatarUpload(file) {
      const isPDF = file.type === "application/pdf";
      const isHTML = file.type === "text/html";
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isPDF && !isHTML) {
        this.$message.error("上传的文件只能是 PDF或 html 格式!");
      }
      if (!isLt5M) {
        this.$message.error("上传文件大小不能超过 5MB!");
      }
      return (isPDF || isHTML) && isLt5M;
    },
    // 选中资源
    selectResource(row) {
      this.selectReId = [];
      console.log(row)
      row.map(item => {
        this.selectReId = row
      });
    },
    handleSelectionChange(val) {
      this.selectReId = [];
      val.map(item => {
        this.selectReId.push(item.resId);
      });
    },
    // 上传产品Logo
    logoSucc(res, file) {
      console.log(file);
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    pdSucc (res, file) {
      console.log(file)
    },
    beforeAvatarUploadPro(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片只能是 JPG或者PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 修改资源
    modifyRe() {
      if (this.selectReId.length > 1) {
        this.$message.warning(`限制选择 1 个资源进行修改`);
      } else if (this.selectReId.length == 0) {
        this.$message.warning(`请选择需要修改的资源`);
      } else {
        this.dialogConfig.visible.modifyDialog = true;
        this.modifyReInfo.resNm = this.selectReId[0].resNm
        this.modifyReInfo.resDsc = this.selectReId[0].resDsc
        this.modifyReInfo.resTpId = this.selectReId[0].resTpId
        this.modifyReInfo.stmId = this.selectReId[0].stmId
        this.modifyReInfo.resOptp = this.selectReId[0].resOptp
        this.modifyReInfo.avlSt = this.selectReId[0].avlSt
        console.log(this.selectReId)
      }
    },
    confirmEdit (formName) {
      this.modifyReInfo.authRscId = this.selectReId[0].authRscId
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('submit')
          this.$http({
            method: 'PATCH',
            url: 'product/v1/resources/' + this.selectReId[0].resId,
            data: this.modifyReInfo
          }).then(res => {
            console.log(res)
            if (res.data.sysTxStatus === "00") {
              this.$message.success(`资源更新成功`)
              this.dialogConfig.visible.modifyDialog = false
              this.getReList()
            } else {
              this.$message.warning(res.data.sysRespDesc)
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          return false
        }
      })
      
    },
    // 删除资源
    deleteRe() {
      if (this.selectReId.length == 0) {
        this.$message.warning(`请选择需要删除的资源`);
      } else if (this.selectReId.length > 1) {
        this.$message.warning(`请选择一个资源进行删除`);
      } else {
        this.dialogConfig.visible.deleteDialog = true;
      }
    },
    confirmDelete () {
      this.$http({
        method: "DELETE",
        url: "product/v1/resources/" + this.selectReId[0].resId + "/" + this.selectReId[0].authRscId,
      }).then(res => {
        console.log(res)
        if (res.data.sysTxStatus === "00") {
          this.dialogConfig.visible.deleteDialog = false
          this.$message.success('资源删除成功')
          this.getReList()
        } else {
          this.$message.warning(res.data.sysRespDesc)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getReDetail () {
      this.$http({
          method: 'GET',
          url: 'product/v1/resources/' + this.selectReId[0].resId
        }).then(res => {
          console.log(res)
          this.reDetail = []
          this.reDetail.push(res.data.data)
        }).catch(err => {
          console.log(err)
        })
    },
    // 资源详情弹窗
    showDetail() {
      if (this.selectReId.length == 0) {
        this.$message.warning(`请选择需要查看的具体资源`);
      } else if (this.selectReId.length > 1) {
        this.$message.warning(`限制选择 1 个资源查看详情`);
      } else {
        this.dialogConfig.visible.detailDialog = true;
        this.getReDetail()
      }
    },
    // 资源生命周期弹窗
    rePeriod() {
      console.log("查看生命周期");
      this.dialogConfig.visible.periodDialog = true;
    },
    closePeriod() {
      this.dialogConfig.visible.periodDialog = false;
    },
    // 查看资源使用说明
    showIns() {
      if (this.selectReId.length > 1) {
          this.$message.warning(`限制选择 1 个资源`);
        } else if (this.selectReId.length == 0) {
          this.$message.warning(`请选择需要查看的资源`);
        } else {
          console.log("查看使用说明");
          window.open('@/assets/index.html')
        }
    },
    // 请求资源列表数据
    getReList () {
      this.loading = true
      this.$http({
        method: 'get',
        url: '/product/v1/resources',
        params: this.searchConfig
      }).then(res => {
          console.log(res);
          this.tableConfig.tableData = res.data.data.list
          this.paginatioinConfig.total = res.data.data.total
          if (res.data.sysTxStatus === '00') {
            this.loading = false;
          } else {
            this.$message.warning(res.data.sysRespDesc)
            this.loading = false;
          }
      }).catch(err => {
          console.log(err);
          this.$message.error('系统异常，请稍后再试')
            this.loading = false;
      })
    }
  },
  created() {
    this.getReList();
    this.checkRules = {...this.rules}
  },
  filters: {
    resTpIdFilter(type) {
      switch (type) {
        case "1":
          return "页面级资源";
        case "2":
          return "外设资源";
        case "3":
          return "静态资源";
        case "4":
          return "REST资源";
        case "5":
          return "其他";
      }
    },
   stmIdFilter(type) {
      switch (type) {
        case "1":
          return "智能设备云";
        case "2":
          return "双录云";
      }
    },
    avlStFilter(status) {
      switch (status) {
        case "1":
          return "可用";
        case "2":
          return "不可用";
      }
    },
    resDscFilter (content) {
      switch (content) {
        case null:
          return "暂无资源描述";
        case content:
          return content;
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 0;
  background-color: #fff;
}
.header {
  .section {
    display: inline-block;
    margin-right: 1.25rem;
    .title {
      font-size: 0.875rem;
    }
    .my-input {
      width: 9.375rem;
      height: 2rem;
    }
    .my-select {
      width: 9.375rem;
      height: 2rem;
    }
    .search {
      background-color: #2a95df;
      color: #fff;
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
  .cell {
    text-align: center;
  }
}
.handle {
  margin-right: 0.625rem;
  cursor: pointer;
}
.cell {
  text-align: center;
}
// 编辑资源弹窗
.modifyInput {
  width: 50%;
}
.modifyBox {
  height: 2.5rem;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 1.75rem;
  color: #8c939d;
  width: 11.125rem;
  height: 11.125rem;
  line-height: 11.125rem;
  text-align: center;
}
.avatar {
  width: 11.125rem;
  height: 11.125rem;
  display: block;
}
.el-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0 !important;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width:calc(100% - 30px);
  display: flex;
  flex-direction: column;
  .el-dialog__body {
    overflow: auto;
  }
}
</style>
