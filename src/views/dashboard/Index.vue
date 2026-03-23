<template>
  <div class="dashboard">
    <h1 class="page-title">数据看板</h1>
    
    <!-- 核心指标 -->
    <div class="metrics-grid">
      <el-card class="metric-card">
        <div class="metric-content">
          <div class="metric-icon revenue">
            <el-icon><Money /></el-icon>
          </div>
          <div class="metric-info">
            <div class="metric-label">本月营收</div>
            <div class="metric-value">¥{{ metrics.monthlyRevenue.toLocaleString() }}</div>
          </div>
        </div>
      </el-card>
      <el-card class="metric-card">
        <div class="metric-content">
          <div class="metric-icon pending">
            <el-icon><CreditCard /></el-icon>
          </div>
          <div class="metric-info">
            <div class="metric-label">待回款</div>
            <div class="metric-value">¥{{ metrics.pendingPayment.toLocaleString() }}</div>
          </div>
        </div>
      </el-card>
      <el-card class="metric-card">
        <div class="metric-content">
          <div class="metric-icon project">
            <el-icon><Document /></el-icon>
          </div>
          <div class="metric-info">
            <div class="metric-label">进行中项目</div>
            <div class="metric-value">{{ metrics.ongoingProjects }}个</div>
          </div>
        </div>
      </el-card>
      <el-card class="metric-card">
        <div class="metric-content">
          <div class="metric-icon inventory">
            <el-icon><Warning /></el-icon>
          </div>
          <div class="metric-info">
            <div class="metric-label">库存预警</div>
            <div class="metric-value">{{ metrics.inventoryAlerts }}个</div>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 项目进度 -->
    <el-card class="section-card">
      <template #header>
        <div class="section-header">
          <span>项目进度</span>
          <el-button type="primary" size="small">查看全部</el-button>
        </div>
      </template>
      <div class="project-progress">
        <div v-for="project in projectProgress" :key="project.id" class="progress-item">
          <div class="progress-info">
            <span class="project-name">{{ project.name }}</span>
            <span class="project-status" :class="getStatusClass(project.status)">{{ project.status }}</span>
          </div>
          <el-progress 
            :percentage="project.progress" 
            :color="getProgressColor(project.progress)"
            :stroke-width="10"
          />
        </div>
      </div>
    </el-card>
    
    <!-- 待办提醒 -->
    <el-card class="section-card">
      <template #header>
        <div class="section-header">
          <span>待办提醒</span>
          <el-button type="primary" size="small">查看全部</el-button>
        </div>
      </template>
      <div class="todo-list">
        <div class="todo-item">
          <div class="todo-icon pending">
            <el-icon><Check /></el-icon>
          </div>
          <div class="todo-info">
            <div class="todo-label">待审批付款/报销/采购申请</div>
            <div class="todo-count">{{ todoCounts.pendingApprovals }}项</div>
          </div>
        </div>
        <div class="todo-item">
          <div class="todo-icon my-applications">
            <el-icon><UserFilled /></el-icon>
          </div>
          <div class="todo-info">
            <div class="todo-label">我发起的申请</div>
            <div class="todo-count">{{ todoCounts.myApplications }}项</div>
          </div>
        </div>
        <div class="todo-item">
          <div class="todo-icon copied">
            <el-icon><Message /></el-icon>
          </div>
          <div class="todo-info">
            <div class="todo-label">抄送我的流程</div>
            <div class="todo-count">{{ todoCounts.copiedToMe }}项</div>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 收支趋势和成本构成 -->
    <div class="bottom-grid">
      <!-- 收支趋势 -->
      <el-card class="section-card">
        <template #header>
          <div class="section-header">
            <span>收支趋势</span>
          </div>
        </template>
        <div class="chart-container">
          <div class="chart-placeholder">
            <el-icon class="chart-icon"><TrendCharts /></el-icon>
            <span>近30天收支趋势图</span>
          </div>
        </div>
      </el-card>
      
      <!-- 成本构成 -->
      <el-card class="section-card">
        <template #header>
          <div class="section-header">
            <span>成本构成</span>
          </div>
        </template>
        <div class="chart-container">
          <div class="chart-placeholder">
            <el-icon class="chart-icon"><PieChart /></el-icon>
            <span>本月项目成本分布图</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDashboardStore } from '../../stores'
import { Money, CreditCard, Document, Warning, Check, UserFilled, Message, TrendCharts, PieChart } from '@element-plus/icons-vue'

const dashboardStore = useDashboardStore()

const metrics = computed(() => dashboardStore.metrics)
const projectProgress = computed(() => dashboardStore.projectProgress)
const todoCounts = computed(() => dashboardStore.todoCounts)

const getStatusClass = (status) => {
  const statusMap = {
    '立项中': 'status-blue',
    '设计中': 'status-blue',
    '搭建中': 'status-blue',
    '执行中': 'status-blue',
    '已结项': 'status-green'
  }
  return statusMap[status] || ''
}

const getProgressColor = (progress) => {
  if (progress < 30) return '#F56C6C'
  if (progress < 70) return '#E6A23C'
  return '#67C23A'
}
</script>

<style scoped>
.dashboard {
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

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.metric-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.metric-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.metric-icon.revenue {
  background-color: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}

.metric-icon.pending {
  background-color: rgba(230, 162, 60, 0.1);
  color: #e6a23c;
}

.metric-icon.project {
  background-color: rgba(103, 194, 58, 0.1);
  color: #67c23a;
}

.metric-icon.inventory {
  background-color: rgba(245, 108, 108, 0.1);
  color: #f56c6c;
}

.metric-info {
  flex: 1;
}

.metric-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.metric-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.section-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-progress {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 10px 0;
}

.progress-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.project-status {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.status-blue {
  background-color: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}

.status-green {
  background-color: rgba(103, 194, 58, 0.1);
  color: #67c23a;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px 0;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.todo-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.todo-icon.pending {
  background-color: rgba(230, 162, 60, 0.1);
  color: #e6a23c;
}

.todo-icon.my-applications {
  background-color: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}

.todo-icon.copied {
  background-color: rgba(103, 194, 58, 0.1);
  color: #67c23a;
}

.todo-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todo-label {
  font-size: 14px;
  color: #333;
}

.todo-count {
  font-size: 16px;
  font-weight: bold;
  color: #1890ff;
}

.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #999;
}

.chart-icon {
  font-size: 48px;
}

@media (max-width: 768px) {
  .bottom-grid {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>