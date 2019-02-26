import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  //mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: '',
      redirect: {name: 'loginIn'}
    },
    {
      path: '/',
      redirect: { name: 'loginIn'}
    },
    {
      path: "",
      name: "",
      component: () =>
        import( /* webpackChunkName: "login" */ "@/views/login"),
      children: [
        {
          path: '/loginIn',
          name: "loginIn",
          component: () => 
            import(/* webpackChunkName: "login" */ "@/views/login/loginIn")
        },
        {
          path: '/register',
          name: "register",
          component: () => 
            import(/* webpackChunkName: "login" */ "@/views/login/register")
        },
        {
          path: '/resetPwd',
          name: "resetPwd",
          component: () => 
            import(/* webpackChunkName: "login" */ "@/views/login/reset-pwd")
        }
      ]
    },
    {
      path: "",
      component: () =>
        import( /* webpackChunkName: "layout" */ "./views/layout"),
      children: [
        {
          path: "approve",
          component: () =>
              import( /* webpackChunkName: "approve" */ "./views/requestApprove"),
          children: [
            {
              path: "realName",
              name: 'realName',
              component: () =>
                  import( /* webpackChunkName: "approve" */ "./views/requestApprove/realName-approve"),
            },
            {
              path: "publish",
              name: 'publish',
              component: () =>
                  import( /* webpackChunkName: "approve" */ "./views/requestApprove/publish-approve"),
            }
          ]
        }, 
        {
          path: "/projectManage",
          name: "projectManage",
          component: () =>
            import( /* webpackChunkName: "projectManage" */ "./views/projectManage")
        },
        {
          path: "/deviceManage",
          name: "deviceManage",
          component: () =>
            import( /* webpackChunkName: "deviceManage" */ "./views/deviceManage")
        },
        {
          path: 'docMaintain',
          component: () => 
            import( /* webpackChunkName: "docMaintain" */ "./views/docMaintain")
        },
        {
          path: 'resourceMaintenance',
          component: () => 
            import( /* webpackChunkName: "resourceMaintenance" */ "./views/resourceMaintenance")
        },
        {
          path: 'productMaintenance',
          component: () =>
              import( /* webpackChunkName: "productMaintenance" */ "./views/productMaintenance")
        }
      ]
    }
  ]
});