import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/dashboard/Index.vue'),
    meta: {
      title: '数据看板'
    }
  },
  {
    path: '/project',
    name: 'Project',
    component: () => import('../views/project/Index.vue'),
    meta: {
      title: '项目管理'
    }
  },
  {
    path: '/project/detail/:id',
    name: 'ProjectDetail',
    component: () => import('../views/project/Detail.vue'),
    meta: {
      title: '项目详情'
    }
  },
  {
    path: '/operation',
    name: 'Operation',
    component: () => import('../views/operation/Index.vue'),
    meta: {
      title: '运营管理'
    }
  },
  {
    path: '/operation/work-log',
    name: 'WorkLog',
    component: () => import('../views/operation/WorkLog.vue'),
    meta: {
      title: '工人报工'
    }
  },
  {
    path: '/operation/purchase',
    name: 'Purchase',
    component: () => import('../views/operation/Purchase.vue'),
    meta: {
      title: '采购申请'
    }
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('../views/inventory/Index.vue'),
    meta: {
      title: '库存管理'
    }
  },
  {
    path: '/inventory/inbound',
    name: 'Inbound',
    component: () => import('../views/inventory/Inbound.vue'),
    meta: {
      title: '入库单'
    }
  },
  {
    path: '/inventory/outbound',
    name: 'Outbound',
    component: () => import('../views/inventory/Outbound.vue'),
    meta: {
      title: '出库单'
    }
  },
  {
    path: '/inventory/check',
    name: 'Check',
    component: () => import('../views/inventory/Check.vue'),
    meta: {
      title: '盘点单'
    }
  },
  {
    path: '/finance',
    name: 'Finance',
    component: () => import('../views/finance/Index.vue'),
    meta: {
      title: '财务管理'
    }
  },
  {
    path: '/finance/payment',
    name: 'Payment',
    component: () => import('../views/finance/Payment.vue'),
    meta: {
      title: '付款申请'
    }
  },
  {
    path: '/finance/flow',
    name: 'Flow',
    component: () => import('../views/finance/Flow.vue'),
    meta: {
      title: '收支流水'
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/admin/Index.vue'),
    meta: {
      title: '行政管理'
    }
  },
  {
    path: '/admin/reimburse',
    name: 'Reimburse',
    component: () => import('../views/admin/Reimburse.vue'),
    meta: {
      title: '费用报销'
    }
  },
  {
    path: '/admin/payment',
    name: 'AdminPayment',
    component: () => import('../views/admin/Payment.vue'),
    meta: {
      title: '行政付款'
    }
  },
  {
    path: '/todo',
    name: 'Todo',
    component: () => import('../views/todo/Index.vue'),
    meta: {
      title: '待办中心'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/settings/Index.vue'),
    meta: {
      title: '系统设置'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '展云通后台管理系统'
  next()
})

export default router