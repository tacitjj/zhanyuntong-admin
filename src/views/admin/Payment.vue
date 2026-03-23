<template>
  <div class="admin-payment">
    <h1 class="page-title">行政付款</h1>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" size="large">
        <el-icon><Plus /></el-icon>
        新增付款
      </el-button>
      <el-button size="large">
        <el-icon><Filter /></el-icon>
        筛选
      </el-button>
    </div>
    
    <!-- 行政付款列表 -->
    <el-card class="payment-card">
      <template #header>
        <div class="card-header">
          <span>付款记录</span>
        </div>
      </template>
      <el-table :data="paymentList" style="width: 100%">
        <el-table-column prop="date" label="付款日期" width="120" />
        <el-table-column prop="type" label="付款类型" width="120" />
        <el-table-column prop="payee" label="收款方" width="150" />
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="scope">
            ¥{{ scope.row.amount.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="period" label="付款周期" width="150" />
        <el-table-column prop="project" label="关联项目" min-width="180" />
        <el-table-column prop="operator" label="经办人" width="100" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus, Filter } from '@element-plus/icons-vue'

const paymentList = ref([
  {
    id: 1,
    date: '2026-03-01',
    type: '房租',
    payee: '房屋租赁公司',
    amount: 10000,
    period: '2026年3月房租',
    project: null,
    operator: '张三'
  },
  {
    id: 2,
    date: '2026-03-05',
    type: '水电费',
    payee: '电力公司',
    amount: 2000,
    period: '2026年2月水电费',
    project: null,
    operator: '李四'
  },
  {
    id: 3,
    date: '2026-03-10',
    type: '办公用品',
    payee: '办公用品供应商',
    amount: 1500,
    period: '2026年3月办公用品',
    project: null,
    operator: '王五'
  }
])
</script>

<style scoped>
.admin-payment {
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

.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}

.payment-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>