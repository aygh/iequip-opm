<template>
  <el-container
    style="width: 100%; height: 100%; background-color: #fff;"
    v-loading="loading"
    :element-loading-text="loadingText"
  >
    <el-header style="display:flex;">
      <section class="section" style="display:flex;">
        <el-date-picker
          v-model="searchDeviceInfo.beginTms"
          type="date"
          class="my-date-pic"
          placeholder="选择开始时间"
          style="width: 150px;"
        ></el-date-picker>
        <el-date-picker
          v-model="searchDeviceInfo.endTms"
          type="date"
          class="my-date-pic"
          placeholder="选择结束时间"
          style="width: 150px;margin-left:10px;"
        ></el-date-picker>
      </section>
      <el-input
        placeholder="请输入设备编号"
        prefix-icon="el-icon-search"
        style="width:200px;margin-left:10px;height:50px;"
        v-model="searchDeviceInfo.devId"
      ></el-input>
      <el-input
        placeholder="MAC地址"
        prefix-icon="el-icon-search"
        style="width:150px;margin-left:10px;height:50px;"
        v-model="searchDeviceInfo.devMac"
      ></el-input>
      <el-input
        placeholder="企业名称"
        prefix-icon="el-icon-search"
        style="width:150px;margin-left:10px;height:50px;"
        v-model="searchDeviceInfo.entNm"
      ></el-input>
      <section class="section" style="margin-left:10px;display:flex;">
        <span style="width:80px;">设备状态：</span>
        <el-select
          v-model="searchDeviceInfo.devStatus"
          style="width: 100px; height: 32px"
          placeholder="全部"
        >
          <el-option
            v-for="item in deviceState"
            :key="item.value"
            :label="item.state"
            :value="item.value"
          ></el-option>
        </el-select>
      </section>
      <section>
        <el-button type="primary" style="margin-left: 10px;" @click="getDevice">查询</el-button>
      </section>
    </el-header>
    <div class="buttons" style="padding-left:20px;margin-bottom:10px;">
      <el-button @click="addDeviceBox">新增</el-button>
      <el-button @click="startUsing">启用</el-button>
      <el-button @click="stopUsing">停用</el-button>
      <el-button @click="recompose">修改设备信息</el-button>
    </div>
    <el-main style="heigth: 500px; padding: 0 20px;">
      <el-table
        ref="multipleTable"
        :data="tableData3"
        tooltip-effect="dark"
        style="width:100%;"
        @select="selectDevice"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" ></el-table-column>
        <el-table-column label="设备编号" >
          <template slot-scope="scope">{{ scope.row.devId }}</template>
        </el-table-column>
        <el-table-column prop="devMac" label="MAC地址" ></el-table-column>
        <el-table-column prop="entNm" label="企业名称" ></el-table-column>
        <el-table-column prop="lclCrtTms" label="注册时间" show-overflow-tooltip ></el-table-column>
        <el-table-column label="设备状态" prop="status" >
          <template slot-scope="scope">
            <span
              :class="scope.row.status == '正常' ? 'pass' 
                            : scope.row.status == '停用' ? 'refuse' 
                            : 'untreated' "
            >{{ scope.row.devStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <span
              @click="showDialog(scope.row)"
              v-if="scope.row.status === '未处理'"
              class="my-handle"
            >
              <i class="el-icon-edit"></i>处理
            </span>
            <span @click="showDialog(scope.row)" v-else class="my-handle" style="cursor:pointer;">
              <i class="el-icon-tickets"></i>详情
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paginatioinConfig.currentPage"
        :page-sizes="paginatioinConfig.sizes"
        :page-size="paginatioinConfig.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paginatioinConfig.total"
        style="width: 600px; margin: 0 auto;"
      ></el-pagination>
    </el-footer>
    <!-- 新增设备弹窗 -->
    <el-dialog
      title="新增设备"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      class="addDevice"
    >
      <section>
        <span class="tit">设备唯一标示</span>
        <el-input placeholder="请输入MAC地址或厂商序列号" style="width:400px;" v-model="newDeviceInfo.devMac"></el-input>
      </section>
      <section>
        <span class="tit">终端名称</span>
        <el-input placeholder="请输入终端名称" style="width:400px;" v-model="newDeviceInfo.devNm"></el-input>
      </section>
      <section>
        <span class="tit">厂商</span>
        <el-select
          v-model="newDeviceInfo.devFirm"
          @change="changeManufacturer"
          filterable
          placeholder="请选择厂商"
        >
          <el-option
            v-for="item in manufacturer"
            :key="item.value"
            :label="item.label"
            :value="item.lable"
          ></el-option>
        </el-select>
      </section>
      <section>
        <span class="tit">型号</span>
        <el-select v-model="newDeviceInfo.modelId" placeholder="请选择">
          <el-option
            v-for="item in typeOptions"
            :key="item.modelId"
            :label="item.modelCode"
            :value="item.modelId"
          >{{item.modelCode}}</el-option>
        </el-select>
      </section>
      <section>
        <span class="tit">绑定企业</span>
        <el-select
          v-model="newDeviceInfo.devCompany"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethodCom"
          :loading="loading"
        >
          <el-option
            v-for="item in bindCompany"
            :key="item.value"
            :label="item.insChnFullnm"
            :value="item.insId"
          >{{item.insChnFullnm}}</el-option>
        </el-select>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddDevice">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设备信息修改 -->
    <el-dialog
      title="设备信息修改"
      :visible.sync="dialogVisible1"
      :before-close="handleClose"
      class="addDevice"
      style="min-height:350px"
    >
      <section>
        <span class="tit">终端名称</span>
        <el-input
          v-model="recomposeInfo.devName"
          placeholder="请输入修改名称"
          style="width: 400px;margin-bottom:10px;"
        ></el-input>
        <span class="tit">备注</span>
        <el-input
          placeholder="请输入备注"
          v-model="recomposeInfo.remark"
          style="width:400px;margin-bottom:10px;"
        ></el-input>
        <span class="tit">绑定企业</span>
        <el-select
          v-model="recomposeInfo.insId"
          clearable
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethodCom"
          :loading="loading"
        >
          <el-option
            v-for="(item,index) in bindCompany"
            :key="index"
            :label="item.insChnFullnm"
            :value="item.insId"
          >{{item.insChnFullnm}}</el-option>
        </el-select>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="confirmRecompose">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 启用设备 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible2"
      :before-close="handleClose"
      class="addDevice"
      style="height:300px;"
    >
      <span>您确定要启用
        <b v-for="item in devLists" :key="item.devId">{{item.devId}}&nbsp;&nbsp;</b>设备吗？
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="confirmStartUsing">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 停用设备 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible3"
      :before-close="handleClose"
      class="addDevice"
      style="height:300px;"
    >
      <span>您确定要停用
        <b v-for="item in devLists" :key="item.devId">{{item.devId}}&nbsp;&nbsp;</b>设备吗？
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="confirmStopUsing">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设备详情弹窗 -->
    <div class="deviceDetail">
      <el-dialog
        title="设备详情"
        :visible.sync="dialogVisible4"
        width="30%"
        :before-close="handleClose"
      >
        <div>
          <dl>
            <dt>设备编号</dt>
            <dd>{{this.devDetailInfo.devId}}</dd>
          </dl>
          <dl>
            <dt>机构Id</dt>
            <dd>{{this.devDetailInfo.insId}}</dd>
          </dl>
          <dl>
            <dt>终端名称</dt>
            <dd>{{this.devDetailInfo.devName}}</dd>
          </dl>
          <dl>
            <dt>企业名称</dt>
            <dd>{{this.devDetailInfo.entNm}}</dd>
          </dl>
          <dl>
            <dt>设备状态</dt>
            <dd>{{this.devDetailInfo.devStatus}}</dd>
          </dl>
          
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible4 = false">关闭</el-button>
        </span>
      </el-dialog>
    </div>
  </el-container>
</template>

<script>
import { $myDecode } from "@/utils/myAxios";

export default {
  name: "deviceManage",
  data() {
    return {
      loading: false,
      loadingText: "拼命加载中...",
      // 厂商模糊查询
      options4: [],
      options5: [],
      value9: [],
      list: [],
      list2: [],
      loading: false,
      hasManufacturer: false,
      manufacturer: [],
      manufacturerDeviceInfo: [],
      bindCompany: [],
      selectDevicelList: [],
      devStatusList: [],
      devLists: [],
      devDetailInfo: [],
      // 设备查询数据
      searchDeviceInfo: {
        beginTms: "",
        endTms: "",
        devId: "",
        devMac: "",
        entNm: "",
        devStatus: ""
      },
      recomposeInfo: {
        devName: "",
        remark: "",
        insId: ""
      },
      // end
      rlnmAuthenSt: "",
      value6: "",
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible3: false,
      dialogVisible4: false,
      deviceState: [
        {
          value: "",
          state: "全部"
        },
        {
          value: "0",
          state: "正常"
        },
        {
          value: "1",
          state: "停用"
        }
      ],
      tableData3: [],
      multipleSelection: [],
      tableConfig: {
        tableHead: [
          {
            prop: "deviceNumber",
            label: "设备编号",
            width: "",
            align: "center",
            showOverflowTooltip: true,
            fixed: false
          },
          {
            prop: "macAdress",
            label: "MAC地址",
            width: "",
            align: "center",
            showOverflowTooltip: true,
            fixed: false
          },
          {
            prop: "creatTime",
            label: "注册时间",
            width: "",
            align: "center",
            showOverflowTooltip: true,
            fixed: false
          }
        ],
        tableHeaderClass: "my-table-header"
      },
      paginatioinConfig: {
        total: 0,
        size: 8,
        sizes: [10, 20, 30],
        pageSize: 10,
        currentPage: 1
      },
      newDeviceInfo: {
        devMac: "",
        devFirm: "",
        modelId: "",
        devCompany: "",
        devBindCompany: "",
        devNm: ""
      },
      typeOptions: []
    };
  },
  methods: {
    // 设备详情信息
    showDialog(row) {
      this.devDetailInfo = [];
      let devId = row.devId
      this.tableData3.map(item => {
        if (item.devId === devId) {
          this.devDetailInfo = item
          this.dialogVisible4 = true;
        }
      })
    },
    changeManufacturer() {
      this.newDeviceInfo.modelId = "";
      let manufacturerList = [];
      this.manufacturer.map(item => {
        manufacturerList.push(item.lable);
      });
      let index = manufacturerList.indexOf(this.newDeviceInfo.devFirm);
      this.typeOptions = this.manufacturerDeviceInfo[index];
    },
    showDeviceInfo() {
      console.log("show");
    },
    // 绑定企业模糊查询
    remoteMethodCom(query) {
      this.bindCompany = [];
      this.$axios({
        method: "get",
        url: "iequip/v1/portal/terms/orgs?insVagNm=" + query,
        data: {},
        PBres: "com.ccb.cloud.protobuf.proto.Page"
      })
        .then(res => {
          res.data.data.map(item => {
            this.bindCompany.push(
              $myDecode(
                item.value,
                "com.ccb.cloud.protobuf.proto.iequip.OrgInfo"
              )
            );
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 设备列表查询服务
    getDevice() {
      this.loading = true;
      let params = {
        pageSize: this.paginatioinConfig.pageSize,
        pageIndex: this.paginatioinConfig.currentPage
      };
      Object.assign(params, this.searchDeviceInfo);
      let start = new Date(params.beginTms).getTime();
      let end = new Date(params.endTms).getTime();
      if (end < start) {
        this.loading = false;
        this.$message.warning({
          message: "请选择正确的结束时间",
          center: true
        });
        return;
      } else {
        params.beginTms = this.filterTime(new Date(params.beginTms).getTime());
        params.endTms = this.filterTime(new Date(params.endTms).getTime());
        if (params.beginTms === null) {
          params.beginTms = "";
        }
        if (params.beginTms === "NaN-NaN-NaN") {
          params.beginTms = "";
        }
        if (params.endTms === "NaN-NaN-NaN") {
          params.endTms = "";
        }
        this.$axios({
          method: "POST",
          url: "iequip/v1/portal/terms/queryEntity",
          data: params,
          PBreq: "com.ccb.cloud.protobuf.proto.iequip.Iequip",
          PBres: "com.ccb.cloud.protobuf.proto.Page"
        })
          .then(resp => {
            this.loading = false;
            this.paginatioinConfig.total = resp.data.total;
            this.tableData3 = [];
            resp.data.data.map(item => {
              let result = $myDecode(
                item.value,
                "com.ccb.cloud.protobuf.proto.iequip.Iequip"
              );
              result.lclCrtTms = this.getDate(result.lclCrtTms);
              if (result.devStatus === "0") {
                result.devStatus = "正常";
              } else {
                result.devStatus = "停用";
              }
              this.tableData3 = this.tableData3.concat(result);
            });
            console.log(this.tableData3)
          })
          .catch(err => {
            this.loading = false;
            console.log(err);
          });
      }
    },
    filterTime(t) {
      let yyyy = new Date(t).getFullYear();
      let mm = new Date(t).getMonth() + 1;
      if (mm < 10) {
        mm = "0" + mm;
      }
      let dd = new Date(t).getDate();
      if (mm == 1) {
        yyyy -= 1;
        mm = 12;
      }
      if (dd < 10) {
        dd = "0" + dd;
      }
      return `${yyyy}-${mm}-${dd}`;
    },
    // 时间戳转换
    getDate(time) {
      return new Date(parseInt(time))
        .toLocaleString()
        .replace(/:\d{1,2}$/, " ");
    },
    // pagination点击事件
    handleSizeChange(val) {
      this.tableData3 = [];
      this.paginatioinConfig.pageSize = val;
      this.getDevice();
    },
    handleCurrentChange(val) {
      this.tableData3 = [];
      this.paginatioinConfig.currentPage = val;
      this.getDevice();
    },

    handleSelectionChange(val) {
      // 判断选中状态
      val.map(item => {
        if (this.multipleSelection.indexOf(item.deviceNumber) > -1) {
          this.multipleSelection = this.multipleSelection.splice(
            item.deviceNumber
          );
        } else {
          this.multipleSelection = this.multipleSelection.concat(
            item.deviceNumber
          );
        }
      });
    },
    // 添加设备弹窗
    addDeviceBox() {
      this.newDeviceInfo.devFirm = "";
      this.newDeviceInfo.devMac = "";
      this.newDeviceInfo.devCompany = "";
      this.newDeviceInfo.modelId = "";
      this.newDeviceInfo.devNm = "";
      this.dialogVisible = true;
      this.addDevice();
    },
    addDevice() {
      // 请求厂商及附带设备型号数据
      this.$axios({
        method: "get",
        url: "iequip/v1/portal/termModels",
        data: {},
        PBres: "com.ccb.cloud.protobuf.proto.iequip.ModelList"
      })
        .then(res => {
          this.manufacturer = [];
          this.manufacturerDeviceInfo = [];
          res.data.modelList.map((item, index) => {
            this.manufacturer.push({ lable: item.vendorNm, value: index });
            this.manufacturerDeviceInfo.push(item.modelCodeLists);
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 新增设备
    confirmAddDevice() {
      let devMac = this.newDeviceInfo.devMac;
      let insId = this.newDeviceInfo.devCompany;
      let modelId = this.newDeviceInfo.modelId;
      let devNm = this.newDeviceInfo.devNm;
      if (devMac === "" || insId === "" || modelId === "") {
        this.$message.error({
          message: "设备注册信息不能为空",
          center: true
        });
      } else {
        this.$axios({
          method: "post",
          url: "iequip/v1/portal/terms",
          data: {
            devMac: devMac,
            // 绑定企业ID
            insId: insId,
            // 厂商对应的型号ID
            modelId: modelId,
            devName: devNm
          },
          PBreq: "com.ccb.cloud.protobuf.proto.iequip.Iequip",
          PBres: "com.ccb.cloud.protobuf.proto.iequip.RetRslt"
        })
          .then(res => {
            console.log(res);
            if (res.headers.SYS_TX_STATUS === "00") {
              this.$message.success({
                message: "注册成功",
                center: true
              });
              this.getDevice();
            } else if (res.headers.SYS_TX_STATUS === "01") {
              this.$message.warning({
                message: "注册失败，设备名称或MAC地址已存在",
                center: true
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
        this.dialogVisible = false;
      }
    },

    hasId(row) {
      console.log(row);
    },
    // 勾选设备
    selectDevice(row) {
      console.log(row)
      this.selectDevicelList = [];
      row.map(item => {
        this.selectDevicelList.push({
          devId: item.devId,
          devStatus: item.devStatus,
          devNm: item.devName,
          entNm: item.entNm,
          remark:item.remark
        });
      });
      this.recomposeInfo.devName = this.selectDevicelList[0].devNm;
      this.recomposeInfo.insId = this.selectDevicelList[0].entNm;
      this.recomposeInfo.remark = this.selectDevicelList[0].remark
    },
    // 启用设备弹窗
    startUsing() {
      this.devStatusList = [];
      this.devLists = [];
      this.selectDevicelList.map(item => {
        this.devStatusList.push(item.devStatus);
        if (item.devStatus === "停用") {
          this.devLists.push({ devId: item.devId, devStatus: "0" });
        }
      });
      if (this.devStatusList.indexOf("正常") > -1) {
        this.$message.warning({
          message: "勾选设备中已存在启用设备,请确认",
          center: true
        });
      } else {
        if (this.devStatusList.length > 0) {
          this.dialogVisible2 = true;
        } else {
          this.$message.warning({
            message: "请选择设备",
            center: true
          });
        }
      }
    },
    // 确定启用设备
    confirmStartUsing() {
      this.$axios({
        method: "PATCH",
        url: "iequip/v1/portal/terms/device/start",
        data: {
          iequipList: this.devLists
        },
        PBreq: "com.ccb.cloud.protobuf.proto.iequip.IequipList",
        PBres: "com.ccb.cloud.protobuf.proto.iequip.RetRslt"
      })
        .then(res => {
          console.log(res);
          this.getDevice();
        })
        .catch(err => {
          console.log(err);
        });
      this.dialogVisible2 = false;
    },
    // 停用设备弹窗
    stopUsing() {
      this.devStatusList = [];
      this.devLists = [];
      this.selectDevicelList.map(item => {
        this.devStatusList.push(item.devStatus);
        if (item.devStatus === "正常") {
          this.devLists.push({ devId: item.devId, devStatus: "1" });
        }
      });
      if (this.devStatusList.indexOf("停用") > -1) {
        this.$message.warning({
          message: "勾选设备中已存在停用设备,请确认",
          center: true
        });
      } else {
        if (this.devStatusList.length > 0) {
          this.dialogVisible3 = true;
        } else {
          this.$message.warning({
            message: "请选择设备",
            center: true
          });
        }
      }
    },
    // 确定停用设备
    confirmStopUsing() {
      console.log(this.devLists);
      this.$axios({
        method: "PATCH",
        url: "iequip/v1/portal/terms/device/stop",
        data: {
          iequipList: this.devLists
        },
        PBreq: "com.ccb.cloud.protobuf.proto.iequip.IequipList",
        PBres: "com.ccb.cloud.protobuf.proto.iequip.RetRslt"
      })
        .then(res => {
          console.log(res);
          this.getDevice();
        })
        .catch(err => {
          console.log(err);
        });
      this.dialogVisible3 = false;
    },
    // 设备信息修改弹窗
    recompose() {
      if (this.selectDevicelList.length === 1) {
        this.dialogVisible1 = true;
        this.addDevice();
      } else {
        this.$message.warning({
          message: "请选择一台设备修改信息",
          center: true
        });
      }
    },
    // 确认设备信息修改
    confirmRecompose() {
      console.log(this.selectDevicelList[0]);
      if (
        this.recomposeInfo.devName === "" ||
        this.recomposeInfo.remark === "" ||
        this.recomposeInfo.insId === ""
      ) {
        this.$message.warning({
          message: "设备信息不能为空",
          center: true
        });
      } else {
        this.$axios({
          method: "PATCH",
          url: "iequip/v1/portal/terms/" + this.selectDevicelList[0].devId,
          data: {
            devName: this.recomposeInfo.devName,
            remark: this.recomposeInfo.remark,
            insId: this.recomposeInfo.insId
          },
          PBreq: "com.ccb.cloud.protobuf.proto.iequip.Iequip",
          PBres: "com.ccb.cloud.protobuf.proto.iequip.RetRslt"
        })
          .then(res => {
            console.log(res);
            this.dialogVisible1 = false;
            this.getDevice();
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  },
  created() {
    this.getDevice();
  },
  filters: {
    filterStatus(status) {
      switch(status) {
        case '0' :
            return '正常'
        case '1' :
            return '停用'
      }
    }
  }
};
</script>

<style lang="scss">
.el-table__header-wrapper {
  tr {
    th {
      background-color: #2085d8 !important;
      color: #fff !important;
      font-weight: normal;
    }
  }
}
.el-table__body-wrapper {
  table {
    width: 100% !important;
  }
}
.deviceManage {
  .buttons {
    button {
      width: 72px;
      height: 30px;
    }
  }
}
.pass {
  color: #000;
}
.refuse {
  color: #cc0000;
}
.el-table__header-wrapper {
  background-color: #4d9de0;
}
// 新增设备弹窗样式
.addDevice {
  .el-dialog {
    width: 600px !important;
    height: 450px;
  }
  .el-dialog__header {
    width: 600px;
    height: 50px;
    display: flex;
    align-items: center;
    background-color: #ccc;
    box-sizing: border-box;
  }
  .el-input__inner {
    width: 400px;
  }
  .tit {
    width: 100px;
    display: inline-block;
  }
  section {
    margin-top: 15px;
  }
}
// 设备详情弹窗
.deviceDetail {
  dl {
    height: 16px;
  }
  dt {
    float: left;
  }
  dd {
   margin-inline-start:0;
   margin-left: 100px;
  }
}
</style>


