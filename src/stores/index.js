import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    user: {
      name: '张总',
      role: '管理员'
    },
    sidebar: {
      opened: true
    }
  }),
  actions: {
    toggleSidebar() {
      this.sidebar.opened = !this.sidebar.opened
    }
  }
})

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [
      {
        id: 1,
        project_no: 'XM-2026001',
        name: '佳杰朱青项目1',
        customer_name: '佳杰公司',
        contract_amount: 100000,
        status: '执行中',
        manager_id: 1,
        manager_name: '李经理',
        start_date: '2026-03-20',
        status_history: [
          {
            time: '2026-03-01 10:00:00',
            old_status: '新建',
            new_status: '立项中',
            operator: '李经理',
            reason: '项目创建'
          },
          {
            time: '2026-03-10 14:30:00',
            old_status: '立项中',
            new_status: '设计中',
            operator: '李经理',
            reason: '开始设计'
          },
          {
            time: '2026-03-15 09:15:00',
            old_status: '设计中',
            new_status: '搭建中',
            operator: '李经理',
            reason: '开始搭建'
          },
          {
            time: '2026-03-20 11:00:00',
            old_status: '搭建中',
            new_status: '执行中',
            operator: '李经理',
            reason: '开始执行'
          }
        ]
      },
      {
        id: 2,
        project_no: 'XM-2026002',
        name: '恒远科技项目',
        customer_name: '恒远科技',
        contract_amount: 150000,
        status: '设计中',
        manager_id: 2,
        manager_name: '王经理',
        start_date: '2026-03-25',
        status_history: [
          {
            time: '2026-03-20 10:00:00',
            old_status: '新建',
            new_status: '立项中',
            operator: '王经理',
            reason: '项目创建'
          },
          {
            time: '2026-03-22 14:00:00',
            old_status: '立项中',
            new_status: '设计中',
            operator: '王经理',
            reason: '开始设计'
          }
        ]
      },
      {
        id: 3,
        project_no: 'XM-2026003',
        name: '新奥能源项目',
        customer_name: '新奥能源',
        contract_amount: 200000,
        status: '搭建中',
        manager_id: 1,
        manager_name: '李经理',
        start_date: '2026-03-15',
        status_history: [
          {
            time: '2026-03-10 09:00:00',
            old_status: '新建',
            new_status: '立项中',
            operator: '李经理',
            reason: '项目创建'
          },
          {
            time: '2026-03-12 15:30:00',
            old_status: '立项中',
            new_status: '设计中',
            operator: '李经理',
            reason: '开始设计'
          },
          {
            time: '2026-03-15 10:00:00',
            old_status: '设计中',
            new_status: '搭建中',
            operator: '李经理',
            reason: '开始搭建'
          }
        ]
      }
    ],
    currentProject: null,
    statusTransitions: {
      '立项中': ['设计中', '暂停', '已结项'],
      '设计中': ['搭建中', '暂停', '已结项'],
      '搭建中': ['执行中', '暂停', '已结项'],
      '执行中': ['已结项', '暂停'],
      '暂停': ['执行中', '已结项'],
      '已结项': []
    }
  }),
  actions: {
    setCurrentProject(project) {
      this.currentProject = project
    },
    changeStatus(projectId, newStatus, reason) {
      const project = this.projects.find(p => p.id === projectId)
      if (project) {
        const oldStatus = project.status
        project.status = newStatus
        project.status_history.push({
          time: new Date().toLocaleString('zh-CN'),
          old_status: oldStatus,
          new_status: newStatus,
          operator: '当前用户',
          reason: reason
        })
      }
    },
    pauseProject(projectId, reason) {
      this.changeStatus(projectId, '暂停', reason)
    },
    cancelProject(projectId, reason) {
      this.changeStatus(projectId, '已结项', reason)
    },
    restartProject(projectId, reason) {
      const project = this.projects.find(p => p.id === projectId)
      if (project) {
        // 从历史记录中找到暂停前的状态
        const pauseRecord = project.status_history.slice().reverse().find(record => record.new_status === '暂停')
        const previousStatus = pauseRecord ? pauseRecord.old_status : '执行中'
        this.changeStatus(projectId, previousStatus, reason)
      }
    },
    getAvailableTransitions(status) {
      return this.statusTransitions[status] || []
    }
  }
})

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    materials: [
      {
        id: 1,
        name: '多层板',
        spec: '1220*2440*15mm',
        unit: '张',
        safe_stock: 50,
        current_stock: 120
      },
      {
        id: 2,
        name: '奥松板',
        spec: '1220*2440*18mm',
        unit: '张',
        safe_stock: 30,
        current_stock: 25
      },
      {
        id: 3,
        name: '方钢管',
        spec: '40*40*2mm',
        unit: '根',
        safe_stock: 100,
        current_stock: 150
      },
      {
        id: 4,
        name: '铝型材',
        spec: '6063-T5',
        unit: '米',
        safe_stock: 200,
        current_stock: 180
      }
    ]
  })
})

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    receivables: [
      {
        id: 1,
        project_id: 1,
        project_name: '佳杰朱青项目1',
        contract_amount: 100000,
        invoiced_amount: 80000,
        received_amount: 60000
      },
      {
        id: 2,
        project_id: 2,
        project_name: '恒远科技项目',
        contract_amount: 150000,
        invoiced_amount: 0,
        received_amount: 0
      },
      {
        id: 3,
        project_id: 3,
        project_name: '新奥能源项目',
        contract_amount: 200000,
        invoiced_amount: 100000,
        received_amount: 50000
      }
    ],
    payments: [
      {
        id: 1,
        project_id: 1,
        project_name: '佳杰朱青项目1',
        pay_type: '材料款',
        payee: '建材供应商',
        amount: 20000,
        status: '已付款'
      },
      {
        id: 2,
        project_id: 1,
        project_name: '佳杰朱青项目1',
        pay_type: '人工费',
        payee: '李师傅',
        amount: 10000,
        status: '已审批'
      },
      {
        id: 3,
        project_id: 3,
        project_name: '新奥能源项目',
        pay_type: '外包费',
        payee: '外协单位',
        amount: 30000,
        status: '待审批'
      }
    ],
    flows: [
      {
        id: 1,
        project_id: 1,
        project_name: '佳杰朱青项目1',
        flow_type: '收入',
        amount: 60000,
        category: '工程款',
        date: '2026-03-10',
        status: '已确认'
      },
      {
        id: 2,
        project_id: 1,
        project_name: '佳杰朱青项目1',
        flow_type: '支出',
        amount: 20000,
        category: '材料费',
        date: '2026-03-15',
        status: '已确认'
      },
      {
        id: 3,
        project_id: null,
        project_name: null,
        flow_type: '支出',
        amount: 5000,
        category: '办公费',
        date: '2026-03-20',
        status: '已确认'
      }
    ]
  })
})

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [
      {
        id: 1,
        type: '待处理',
        content: '佳杰朱青项目1的付款申请审批',
        status: '待处理'
      },
      {
        id: 2,
        type: '待处理',
        content: '新奥能源项目的采购申请审批',
        status: '待处理'
      },
      {
        id: 3,
        type: '我发起的',
        content: '恒远科技项目的费用报销',
        status: '已审批'
      },
      {
        id: 4,
        type: '抄送我的',
        content: '3月份库存盘点报告',
        status: '未读'
      }
    ]
  })
})

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    metrics: {
      monthlyRevenue: 210000,
      pendingPayment: 140000,
      ongoingProjects: 3,
      inventoryAlerts: 1
    },
    projectProgress: [
      {
        id: 1,
        name: '佳杰朱青项目1',
        status: '执行中',
        progress: 75
      },
      {
        id: 2,
        name: '恒远科技项目',
        status: '设计中',
        progress: 40
      },
      {
        id: 3,
        name: '新奥能源项目',
        status: '搭建中',
        progress: 60
      }
    ],
    todoCounts: {
      pendingApprovals: 2,
      myApplications: 1,
      copiedToMe: 1
    },
    costBreakdown: {
      labor: 30000,
      materials: 50000,
      expenses: 10000
    }
  })
})