<template>
  <div class="project-detail">
    <h1 class="page-title">项目详情</h1>
    
    <!-- 项目基本信息 -->
    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <span>基本信息</span>
          <el-button type="primary" size="small">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
        </div>
      </template>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">项目编号：</span>
          <span class="info-value">{{ project?.project_no }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">项目名称：</span>
          <span class="info-value">{{ project?.name }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">客户：</span>
          <span class="info-value">{{ project?.customer_name }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">合同额：</span>
          <span class="info-value">¥{{ project?.contract_amount.toLocaleString() }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">状态：</span>
          <el-tag :type="getStatusType(project?.status)">
            {{ project?.status }}
          </el-tag>
        </div>
        <div class="info-item">
          <span class="info-label">项目经理：</span>
          <span class="info-value">{{ project?.manager_name }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">进场日：</span>
          <span class="info-value">{{ project?.start_date }}</span>
        </div>
      </div>
    </el-card>
    
    <!-- 成本构成 -->
    <el-card class="cost-card">
      <template #header>
        <div class="card-header">
          <span>成本构成</span>
        </div>
      </template>
      <div class="cost-breakdown">
        <div class="cost-item">
          <div class="cost-label">人工成本</div>
          <div class="cost-value">¥30,000</div>
        </div>
        <div class="cost-item">
          <div class="cost-label">材料成本</div>
          <div class="cost-value">¥50,000</div>
        </div>
        <div class="cost-item">
          <div class="cost-label">费用成本</div>
          <div class="cost-value">¥10,000</div>
        </div>
        <div class="cost-item total">
          <div class="cost-label">总成本</div>
          <div class="cost-value">¥90,000</div>
        </div>
        <div class="cost-item profit">
          <div class="cost-label">利润</div>
          <div class="cost-value">¥10,000</div>
        </div>
      </div>
    </el-card>
    
    <!-- 收支明细 -->
    <el-card class="finance-card">
      <template #header>
        <div class="card-header">
          <span>收支明细</span>
          <el-button type="primary" size="small">
            <el-icon><Plus /></el-icon>
            新增记录
          </el-button>
        </div>
      </template>
      <el-tabs type="border-card">
        <el-tab-pane label="收入">
          <el-table :data="incomeList" style="width: 100%">
            <el-table-column prop="date" label="日期" width="120" />
            <el-table-column prop="amount" label="金额" width="120">
              <template #default="scope">
                ¥{{ scope.row.amount.toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column prop="category" label="类别" width="120" />
            <el-table-column prop="description" label="描述" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === '已确认' ? 'success' : 'warning'">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="支出">
          <el-table :data="expenseList" style="width: 100%">
            <el-table-column prop="date" label="日期" width="120" />
            <el-table-column prop="amount" label="金额" width="120">
              <template #default="scope">
                ¥{{ scope.row.amount.toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column prop="category" label="类别" width="120" />
            <el-table-column prop="description" label="描述" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === '已确认' ? 'success' : 'warning'">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '../../stores'
import { Edit, Plus } from '@element-plus/icons-vue'

const route = useRoute()
const projectStore = useProjectStore()

const projectId = computed(() => parseInt(route.params.id))

const project = computed(() => {
  return projectStore.projects.find(p => p.id === projectId.value) || {
    id: projectId.value,
    project_no: 'XM-2026001',
    name: '佳杰朱青项目1',
    customer_name: '佳杰公司',
    contract_amount: 100000,
    status: '执行中',
    manager_name: '李经理',
    start_date: '2026-03-20'
  }
})

const incomeList = ref([
  {
    id: 1,
    date: '2026-03-10',
    amount: 60000,
    category: '工程款',
    description: '项目首付款',
    status: '已确认'
  }
])

const expenseList = ref([
  {
    id: 1,
    date: '2026-03-15',
    amount: 20000,
    category: '材料费',
    description: '采购建材',
    status: '已确认'
  },
  {
    id: 2,
    date: '2026-03-20',
    amount: 10000,
    category: '人工费',
    description: '工人工资',
    status: '已确认'
  }
])

const getStatusType = (status) => {
  const statusMap = {
    '立项中': 'primary',
    '设计中': 'primary',
    '搭建中': 'primary',
    '执行中': 'primary',
    '已结项': 'success'
  }
  return statusMap[status] || 'info'
}
</script>

<style scoped>
.project-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.info-card,
.cost-card,
.finance-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding: 10px 0;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 14px;
  color: #666;
}

.info-value {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.cost-breakdown {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.cost-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.cost-item.total {
  background-color: rgba(24, 144, 255, 0.1);
}

.cost-item.profit {
  background-color: rgba(103, 194, 58, 0.1);
}

.cost-label {
  font-size: 14px;
  color: #666;
}

.cost-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.cost-item.profit .cost-value {
  color: #67c23a;
}
</style>