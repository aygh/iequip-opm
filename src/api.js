export const realNameApi = {   //实名认证
    queryEntity: '/iequip/v1/portal/realNmAudits/queryEntity',//5.7.查询实名认证请求列表服务 POST ConditionQuery
    rlnmAdtIdGet: rlnmAdtId => `/iequip/v1/portal/realNmAudits/${rlnmAdtId}`,//5.8.具体实名认证请求的详情查询服务 GET
    rlnmAuthenStPatch: rlnmAdtId =>  `/iequip/v1/portal/realNmAudits/${rlnmAdtId}/rlnmAuthenSt`//5.9.实名认证请求处理服务 PATCH req&res -> AcctRlnm
}

export const userApi = {
    register: '/iequip/v1/portal/accounts', //5.1.用户注册 POST 
    resetPWD: '/iequip/v1/portal/accounts/credential', //5.3用户密码更新 PATCH 
    
}

export const docMaintain = {    //文档维护
    add: '/iequip/v1/portal/docs',   //9.1 新增文档 post
    deleteDoc: docId => `/iequip/v1/portal/docs/${docId}`,   //9.1 新增文档 post
    editDoc: docId => `/iequip/v1/portal/docs/${docId}`,     //9.2   修改文档 PATCH
    query: '/iequip/v1/portal/docs/docBlngSbj/iequip',  //9.4 文档列表查询
    editQuery: docId => `/iequip/v1/portal/docs/${docId}`   //9.5 文档详情查询get
}

export const publishProject = {
    query: `/iequip/v1/portal/vers/queryEntity`,    //8.3.项目版本列表查询服务  post  
    getVersion: verId => `/iequip/v1/portal/vers/${verId}`,//8.4.具体版本的详情信息查询服务    get
    subApprove: appId => `/iequip/v1/portal/apps/${appId}/vers`,    //8.1 项目新版本提交审核服务    post
    getListById: appId => `/iequip/v1/portal/apps/${appId}/vers`,//8.2.指定项目的版本列表查询服务 GET 
    handle: verId => `/iequip/v1/portal/vers/${verId}/verSt`,   //8.5.版本操作服务  PATCH 
    queryActions: verId => `/iequip/v1/portal/vers/${verId}/actions`//8.6.项目版本生命周期查询服务  post
}

export const projectManage = {
    query: '/iequip/v1/portal/apps/queryEntity', //7.4项目列表查询服务 POST 
    updateStatus: (appId, appSt) => `/iequip/v1/portal/apps/${appId}/${appSt}`, //7.6项目状态更新服务
    editQuery: appId => `/iequip/v1/portal/apps/${appId}`,  //7.5具体项目的详情信息查询服务 get
    deletePro: appId => `/iequip/v1/portal/apps/${appId}`,  //7.3删除项目信息服务   delete
    editPro: appId => `/iequip/v1/portal/apps/${appId}`,    //7.2修改项目信息服务   patch
}

export const productMaintenance = {     //产品维护
    queryType: tpBlngSbj => `/iequip/v1/portal/typeinfo/${tpBlngSbj}`, //10.1类型查询服务
    add: '/product/v1/product',     //6.1新增产品
    specify: pdId => `/product/v1/products/${pdId}`, //6.2单个产品详情查询
    query: '/product/v1/products',   //6.3产品列表查询服务
    edit: pdId => `/product/v1/products/${pdId}`,  //6.4产品信息更新服务
    deletePro: (pdId, authAhrId) => `/product/v1/products/${pdId}/${authAhrId}`, //6.5删除产品信息服务
    bindResource: pdId => `/product/v1/products/${pdId}/bind`,    //6.6产品绑定资源服务
}