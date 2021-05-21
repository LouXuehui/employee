module.exports.routers = [
  { path: '/login', component: '../login/index' }, //登录页
  {
    path: '/',
    component: '../layout/index',
    routes: [
      { path: '/myPage', component: '../pages/myPage/index' }, //个人信息管理
      { path: '/user', component: '../pages/userManagement/index' }, //用户管理
      { path: '/employee', component: '../pages/employee/index' } ,//员工管理
      { path: '/dept', component: '../pages/dept/index' }, //部门管理
      { path: '/position', component: '../pages/position/index' } ,//职位管理
    ]
  }
]
