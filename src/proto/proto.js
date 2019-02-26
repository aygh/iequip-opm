/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/light");

var $root = ($protobuf.roots["default"] || ($protobuf.roots["default"] = new $protobuf.Root()))
.setOptions({
  java_multiple_files: false,
  java_outer_classname: "TestProto",
  optimize_for: "SPEED"
})
.addJSON({
  com: {
    nested: {
      ccb: {
        nested: {
          cloud: {
            nested: {
              protobuf: {
                nested: {
                  proto: {
                    nested: {
                      iequip: {
                        nested: {
                          AcctRegister: {
                            fields: {
                              veriCode: {
                                type: "string",
                                id: 1
                              },
                              codeSN: {
                                type: "string",
                                id: 2
                              },
                              acct: {
                                type: "Acct",
                                id: 3
                              }
                            }
                          },
                          AcctUpdCredential: {
                            fields: {
                              updTp: {
                                type: "string",
                                id: 1
                              },
                              acctId: {
                                type: "string",
                                id: 2
                              },
                              oldCredential: {
                                type: "string",
                                id: 3
                              },
                              newCredential: {
                                type: "string",
                                id: 4
                              },
                              acctPhone: {
                                type: "string",
                                id: 5
                              },
                              veriCode: {
                                type: "string",
                                id: 6
                              },
                              codeSN: {
                                type: "string",
                                id: 7
                              }
                            }
                          },
                          AcctUpdPhone: {
                            fields: {
                              oldAcctPhone: {
                                type: "string",
                                id: 1
                              },
                              oldVeriCode: {
                                type: "string",
                                id: 2
                              },
                              oldCodeSN: {
                                type: "string",
                                id: 3
                              },
                              newAcctPhone: {
                                type: "string",
                                id: 4
                              },
                              newVeriCode: {
                                type: "string",
                                id: 5
                              },
                              newCodeSN: {
                                type: "string",
                                id: 6
                              },
                              acctId: {
                                type: "string",
                                id: 7
                              },
                              updTp: {
                                type: "string",
                                id: 8
                              }
                            }
                          },
                          Acct: {
                            fields: {
                              acctId: {
                                type: "string",
                                id: 1
                              },
                              acctNm: {
                                type: "string",
                                id: 2
                              },
                              acctPhone: {
                                type: "string",
                                id: 3
                              },
                              acctTp: {
                                type: "string",
                                id: 4
                              },
                              rlnmAuthenSt: {
                                type: "string",
                                id: 5
                              },
                              rlnmAuthenMsg: {
                                type: "string",
                                id: 6
                              },
                              authenPhone: {
                                type: "string",
                                id: 7
                              },
                              emailAdr: {
                                type: "string",
                                id: 8
                              },
                              sbjNm: {
                                type: "string",
                                id: 9
                              },
                              sbjCrdtTp: {
                                type: "string",
                                id: 10
                              },
                              sbjCrdtNo: {
                                type: "string",
                                id: 11
                              },
                              unnSocCrCd: {
                                type: "string",
                                id: 12
                              },
                              entNm: {
                                type: "string",
                                id: 13
                              },
                              entCrdtTp: {
                                type: "string",
                                id: 14
                              },
                              entCrdtNo: {
                                type: "string",
                                id: 15
                              },
                              rspbpsnNm: {
                                type: "string",
                                id: 16
                              },
                              rspbpsnCrdtTp: {
                                type: "string",
                                id: 17
                              },
                              rspbpsnCrdtNo: {
                                type: "string",
                                id: 18
                              },
                              lclCrtTms: {
                                type: "int64",
                                id: 19
                              },
                              credential: {
                                type: "string",
                                id: 20
                              }
                            }
                          },
                          ConditionQuery: {
                            fields: {
                              rlnmAuthenSt: {
                                type: "string",
                                id: 1
                              },
                              sbjNm: {
                                type: "string",
                                id: 2
                              },
                              lclCrdTms: {
                                type: "string",
                                id: 3
                              },
                              adtTms: {
                                type: "string",
                                id: 4
                              },
                              start: {
                                type: "string",
                                id: 5
                              },
                              maxRows: {
                                type: "string",
                                id: 6
                              }
                            }
                          },
                          AcctRlnm: {
                            fields: {
                              rlnmInfId: {
                                type: "string",
                                id: 1
                              },
                              acctTp: {
                                type: "string",
                                id: 2
                              },
                              rlnmAuthenSt: {
                                type: "string",
                                id: 3
                              },
                              rlnmAuthenMsg: {
                                type: "string",
                                id: 4
                              },
                              authenFrontSrc: {
                                type: "string",
                                id: 5
                              },
                              authenBackSrc: {
                                type: "string",
                                id: 6
                              },
                              authenHandSrc: {
                                type: "string",
                                id: 7
                              },
                              authenPhone: {
                                type: "string",
                                id: 8
                              },
                              sbjNm: {
                                type: "string",
                                id: 9
                              },
                              sbjCrdtTp: {
                                type: "string",
                                id: 10
                              },
                              sbjCrdtNo: {
                                type: "string",
                                id: 11
                              },
                              unnSocCrCd: {
                                type: "string",
                                id: 12
                              },
                              entNm: {
                                type: "string",
                                id: 13
                              },
                              entCrdtTp: {
                                type: "string",
                                id: 14
                              },
                              entCrdtNo: {
                                type: "string",
                                id: 15
                              },
                              entCrdtSrc: {
                                type: "string",
                                id: 16
                              },
                              rspbpsnNm: {
                                type: "string",
                                id: 17
                              },
                              rspbpsnCrdtTp: {
                                type: "string",
                                id: 18
                              },
                              rspbpsnCrdtNo: {
                                type: "string",
                                id: 19
                              },
                              lclCrtTms: {
                                type: "string",
                                id: 20
                              },
                              rlnmAdtId: {
                                type: "string",
                                id: 21
                              },
                              acctId: {
                                type: "string",
                                id: 22
                              },
                              adtPsnNm: {
                                type: "string",
                                id: 23
                              },
                              adtTms: {
                                type: "string",
                                id: 24
                              }
                            }
                          },
                          App: {
                            fields: {
                              appId: {
                                type: "string",
                                id: 1
                              },
                              insId: {
                                type: "string",
                                id: 2
                              },
                              appSecret: {
                                type: "string",
                                id: 3
                              },
                              appNm: {
                                type: "string",
                                id: 4
                              },
                              appTp: {
                                type: "string",
                                id: 5
                              },
                              appLogoSrc: {
                                type: "string",
                                id: 6
                              },
                              appBrf: {
                                type: "string",
                                id: 7
                              },
                              appSt: {
                                type: "string",
                                id: 8
                              },
                              appStDesc: {
                                type: "string",
                                id: 9
                              },
                              reviTims: {
                                type: "int32",
                                id: 10
                              },
                              isDel: {
                                type: "string",
                                id: 11
                              },
                              lclCrtTms: {
                                type: "int64",
                                id: 12
                              },
                              insNm: {
                                type: "string",
                                id: 13
                              },
                              insIdList: {
                                type: "string",
                                id: 14
                              },
                              beginTms: {
                                type: "int64",
                                id: 15
                              },
                              endTms: {
                                type: "int64",
                                id: 16
                              },
                              start: {
                                type: "int32",
                                id: 17
                              },
                              maxRows: {
                                type: "int32",
                                id: 18
                              },
                              daDispNo: {
                                type: "int32",
                                id: 19
                              },
                              appVersion: {
                                type: "AppVersion",
                                id: 20
                              },
                              rlId: {
                                type: "string",
                                id: 21
                              }
                            }
                          },
                          AppVersion: {
                            fields: {
                              verId: {
                                type: "string",
                                id: 1
                              },
                              appId: {
                                type: "string",
                                id: 2
                              },
                              verCodeSrc: {
                                type: "string",
                                id: 3
                              }
                            }
                          },
                          AppVer: {
                            fields: {
                              verId: {
                                type: "string",
                                id: 1
                              },
                              appId: {
                                type: "string",
                                id: 2
                              },
                              version: {
                                type: "string",
                                id: 3
                              },
                              verDesc: {
                                type: "string",
                                id: 4
                              },
                              codeSrc: {
                                type: "string",
                                id: 5
                              },
                              pubTms: {
                                type: "int64",
                                id: 6
                              },
                              pubTp: {
                                type: "string",
                                id: 7
                              },
                              verCodeSrc: {
                                type: "string",
                                id: 8
                              },
                              verSt: {
                                type: "string",
                                id: 9
                              },
                              verStDesc: {
                                type: "string",
                                id: 10
                              },
                              insId: {
                                type: "string",
                                id: 11
                              },
                              insNm: {
                                type: "string",
                                id: 12
                              },
                              entNm: {
                                type: "string",
                                id: 13
                              },
                              sbjNm: {
                                type: "string",
                                id: 14
                              },
                              appNm: {
                                type: "string",
                                id: 15
                              },
                              appTp: {
                                type: "string",
                                id: 16
                              },
                              appLogoSrc: {
                                type: "string",
                                id: 17
                              },
                              appBrf: {
                                type: "string",
                                id: 18
                              },
                              lclCrtTms: {
                                type: "int64",
                                id: 19
                              },
                              adtPsnNm: {
                                type: "string",
                                id: 20
                              },
                              adtTms: {
                                type: "int64",
                                id: 21
                              }
                            }
                          },
                          SelectParam: {
                            fields: {
                              insNm: {
                                type: "string",
                                id: 1
                              },
                              appNm: {
                                type: "string",
                                id: 2
                              },
                              verAuthenSt: {
                                type: "string",
                                id: 3
                              },
                              beginTms: {
                                type: "int64",
                                id: 4
                              },
                              endTms: {
                                type: "int64",
                                id: 5
                              },
                              start: {
                                type: "int32",
                                id: 6
                              },
                              maxRows: {
                                type: "int32",
                                id: 7
                              }
                            }
                          },
                          VerStParam: {
                            fields: {
                              oprTp: {
                                type: "string",
                                id: 1
                              },
                              oprPsnId: {
                                type: "string",
                                id: 2
                              },
                              oprPsnNm: {
                                type: "string",
                                id: 3
                              },
                              oprDesc: {
                                type: "string",
                                id: 4
                              },
                              pubTms: {
                                type: "int64",
                                id: 5
                              },
                              pubTp: {
                                type: "string",
                                id: 6
                              },
                              pubEquips: {
                                type: "string",
                                id: 7
                              }
                            }
                          },
                          VerAction: {
                            fields: {
                              actionId: {
                                type: "string",
                                id: 1
                              },
                              verId: {
                                type: "string",
                                id: 2
                              },
                              oprTp: {
                                type: "string",
                                id: 3
                              },
                              oprPsnId: {
                                type: "string",
                                id: 4
                              },
                              oprPsnNm: {
                                type: "string",
                                id: 5
                              },
                              oprDesc: {
                                type: "string",
                                id: 6
                              },
                              oprTms: {
                                type: "int64",
                                id: 7
                              }
                            }
                          },
                          Doc: {
                            fields: {
                              docId: {
                                type: "string",
                                id: 1
                              },
                              docBlngSbj: {
                                type: "string",
                                id: 2
                              },
                              docTp: {
                                type: "string",
                                id: 3
                              },
                              docNm: {
                                type: "string",
                                id: 4
                              },
                              docBrf: {
                                type: "string",
                                id: 5
                              },
                              docSrc: {
                                type: "string",
                                id: 6
                              },
                              idDel: {
                                type: "string",
                                id: 7
                              },
                              docLogId: {
                                type: "string",
                                id: 8
                              },
                              oprTp: {
                                type: "string",
                                id: 9
                              },
                              mntPsnNm: {
                                type: "string",
                                id: 10
                              },
                              mntTms: {
                                type: "string",
                                id: 11
                              },
                              pageNum: {
                                type: "string",
                                id: 12
                              },
                              pageSize: {
                                type: "string",
                                id: 13
                              }
                            }
                          },
                          IequipAppList: {
                            fields: {
                              appList: {
                                rule: "repeated",
                                type: "com.ccb.cloud.protobuf.proto.iequip.App",
                                id: 1
                              }
                            }
                          },
                          Iequip: {
                            fields: {
                              devId: {
                                type: "string",
                                id: 1
                              },
                              devName: {
                                type: "string",
                                id: 2
                              },
                              modelId: {
                                type: "string",
                                id: 3
                              },
                              ipAddr: {
                                type: "string",
                                id: 4
                              },
                              devMac: {
                                type: "string",
                                id: 5
                              },
                              remark: {
                                type: "string",
                                id: 6
                              },
                              devStatus: {
                                type: "string",
                                id: 7
                              },
                              insId: {
                                type: "string",
                                id: 8
                              },
                              isDel: {
                                type: "string",
                                id: 9
                              },
                              lclCrtTms: {
                                type: "string",
                                id: 10
                              },
                              lclUdtTms: {
                                type: "string",
                                id: 11
                              },
                              pageIndex: {
                                type: "int32",
                                id: 12
                              },
                              pageSize: {
                                type: "int32",
                                id: 13
                              },
                              beginTms: {
                                type: "string",
                                id: 14
                              },
                              endTms: {
                                type: "string",
                                id: 15
                              },
                              entNm: {
                                type: "string",
                                id: 16
                              },
                              model: {
                                type: "Model",
                                id: 17
                              }
                            }
                          },
                          IequipList: {
                            fields: {
                              iequipList: {
                                rule: "repeated",
                                type: "Iequip",
                                id: 1
                              }
                            }
                          },
                          Model: {
                            fields: {
                              modelId: {
                                type: "string",
                                id: 1
                              },
                              devType: {
                                type: "string",
                                id: 2
                              },
                              vendorCode: {
                                type: "string",
                                id: 3
                              },
                              vendorNm: {
                                type: "string",
                                id: 4
                              },
                              modelCode: {
                                type: "string",
                                id: 5
                              },
                              modelNm: {
                                type: "string",
                                id: 6
                              },
                              modelCodeLists: {
                                rule: "repeated",
                                type: "ModelCode",
                                id: 7
                              }
                            }
                          },
                          ModelList: {
                            fields: {
                              modelList: {
                                rule: "repeated",
                                type: "Model",
                                id: 1
                              }
                            }
                          },
                          ModelCode: {
                            fields: {
                              modelId: {
                                type: "string",
                                id: 1
                              },
                              modelCode: {
                                type: "string",
                                id: 2
                              }
                            }
                          },
                          OrgInfo: {
                            fields: {
                              insId: {
                                type: "string",
                                id: 1
                              },
                              insChnFullnm: {
                                type: "string",
                                id: 2
                              },
                              insChnShrtnm: {
                                type: "string",
                                id: 3
                              }
                            }
                          },
                          Product: {
                            fields: {
                              pdId: {
                                type: "string",
                                id: 1
                              },
                              pdBlngSbj: {
                                type: "string",
                                id: 2
                              },
                              pdTp: {
                                type: "string",
                                id: 3
                              },
                              pdNm: {
                                type: "string",
                                id: 4
                              },
                              pdBrf: {
                                type: "string",
                                id: 5
                              },
                              pdLogoSrc: {
                                type: "string",
                                id: 6
                              },
                              pdUrl: {
                                type: "string",
                                id: 7
                              },
                              pdDispNo: {
                                type: "int32",
                                id: 8
                              },
                              avlSt: {
                                type: "string",
                                id: 9
                              },
                              pageIndex: {
                                type: "int32",
                                id: 10
                              },
                              pageSize: {
                                type: "int32",
                                id: 11
                              }
                            }
                          },
                          RetRslt: {
                            fields: {
                              retRsltCd: {
                                type: "string",
                                id: 1
                              },
                              retRsltDsc: {
                                type: "string",
                                id: 2
                              }
                            }
                          },
                          RlnmAdt: {
                            fields: {
                              rlnmAdtId: {
                                type: "string",
                                id: 1
                              },
                              acctId: {
                                type: "string",
                                id: 2
                              },
                              rlnmInfId: {
                                type: "string",
                                id: 3
                              },
                              adtPsnNm: {
                                type: "string",
                                id: 4
                              },
                              adtTms: {
                                type: "string",
                                id: 5
                              }
                            }
                          },
                          Test: {
                            fields: {
                              uid: {
                                type: "string",
                                id: 1
                              }
                            }
                          }
                        }
                      },
                      ProtoRequest: {
                        fields: {
                          requestSession: {
                            type: "RequestSession",
                            id: 1
                          },
                          requestBody: {
                            type: "RequestBody",
                            id: 2
                          }
                        }
                      },
                      RequestSession: {
                        fields: {
                          acctId: {
                            type: "string",
                            id: 1
                          },
                          acctNm: {
                            type: "string",
                            id: 2
                          },
                          usrGnd: {
                            type: "string",
                            id: 3
                          },
                          insId: {
                            type: "string",
                            id: 4
                          },
                          lglpsnId: {
                            type: "string",
                            id: 5
                          },
                          acctPhone: {
                            type: "string",
                            id: 6
                          },
                          emailAdr: {
                            type: "string",
                            id: 7
                          },
                          Land_Cnt: {
                            type: "string",
                            id: 8
                          },
                          Mnplt_Dt_Tm: {
                            type: "string",
                            id: 9
                          },
                          reqWeb: {
                            type: "string",
                            id: 10
                          }
                        }
                      },
                      RequestBody: {
                        fields: {
                          ENTITY: {
                            type: "google.protobuf.Any",
                            id: 1
                          }
                        }
                      },
                      ProtoResponse: {
                        fields: {
                          responseHeader: {
                            type: "ResponseHeader",
                            id: 1
                          },
                          responseBody: {
                            type: "ResponseBody",
                            id: 2
                          }
                        }
                      },
                      ResponseHeader: {
                        fields: {
                          SYS_TRACE_ID: {
                            type: "string",
                            id: 1
                          },
                          SYS_TX_STATUS: {
                            type: "string",
                            id: 2
                          },
                          SYS_RESP_DESC: {
                            type: "string",
                            id: 3
                          }
                        }
                      },
                      ResponseBody: {
                        fields: {
                          ENTITY: {
                            type: "google.protobuf.Any",
                            id: 1
                          }
                        }
                      },
                      Page: {
                        fields: {
                          pageNum: {
                            type: "int32",
                            id: 1
                          },
                          pageSize: {
                            type: "int32",
                            id: 2
                          },
                          currPageSize: {
                            type: "int32",
                            id: 3
                          },
                          total: {
                            type: "int64",
                            id: 4
                          },
                          pages: {
                            type: "int32",
                            id: 5
                          },
                          data: {
                            rule: "repeated",
                            type: "google.protobuf.Any",
                            id: 6
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  google: {
    nested: {
      protobuf: {
        nested: {
          Any: {
            fields: {
              type_url: {
                type: "string",
                id: 1
              },
              value: {
                type: "bytes",
                id: 2
              }
            }
          }
        }
      }
    }
  }
});

module.exports = $root;
