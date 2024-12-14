import { createRouter, createMemoryHistory, RouteRecordRaw } from 'vue-router'

const login = () => import('@/components/login/login.vue')
const home = () => import('@/view/dashboard/index.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import('@/components/layout/layout.vue'),
    children: [
      {
        path: '/home',
        component: home,
        meta: {
          name: '控制台'
        }
      },
      {
        path: '/customers',
        component: () => import('@/view/customer/index.vue'),
        meta: {
          name: '客户管理'
        }
      },
      {
        path: '/doors',
        component: () => import('@/view/door/index.vue'),
        meta: {
          name: '柜门管理'
        }
      },
      {
        path: '/goods',
        component: () => import('@/view/goods/index.vue'),
        meta: {
          name: '货物管理'
        }
      },
      {
        path: '/goodtype',
        component: () => import('@/view/goodtype/index.vue'),
        meta: {
          name: '货物分类管理'
        }
      },
      {
        path: '/order',
        component: () => import('@/view/goodtype/index.vue'),
        meta: {
          name: '下单'
        }
      },
      {
        path: '/orderManagement',
        component: () => import('@/view/goodtype/index.vue'),
        meta: {
          name: '订单管理'
        }
      },
    ]
  },
  // {
  //   path: "/feedback",
  //   component: () => import('@/view/blog/mdview.vue'),
  // },
  // {
  //   path: "/BlogEditer",
  //   component: () => import('@/view/blog/createBlog.vue'),
  // },
  {
    path: "/ProfileEditer",
    component: () => import('@/view/dashboard/editProfile.vue'),
  },
  // {
  //   path: "/BlogViewer",
  //   component: () => import('@/view/blog/mdview.vue'),
  // },
  {
    path: "/login",
    component: login
  },
  {
    path: "/illustration",
    component: () => import('@/components/illustration/index.vue')
  },
  {
    path: "/register",
    component: () => import('@/components/login/register.vue')
  },
  {
    path: "/sorryPage",
    component: () => import('@/components/login/sorry.vue')
  },
]


const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export default router