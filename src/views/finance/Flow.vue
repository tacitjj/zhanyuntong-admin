<template>
  <div class="flow">
    <h1 class="page-title">收支流水</h1>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" size="large">
        <el-icon><Plus /></el-icon>
        新增流水
      </el-button>
      <el-button size="large">
        <el-icon><Filter /></el-icon>
        筛选
      </el-button>
      <el-button size="large">
        <el-icon><Download /></el-icon>
        导出
      </el-button>
    </div>
    
    <!-- 收支流水列表 -->
    <el-card class="flow-card">
      <template #header>
        <div class="card-header">
          <span>收支记录</span>
          <el-input
            v-model="searchQuery"
            placeholder="搜索项目或对方单位"
            prefix-icon="Search"
            style="width: 300px"
          />
        </div>
      </template>
      <el-table :data="filteredFlows" style="width: 100%">
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="project" label="项目" min-width="180" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.type === '收入' ? 'success' : 'danger'">
              {{ scope.row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="scope">
            ¥{{ scope.row.amount.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="category" label="类别" width="120" />
        <el-table-column prop="counterparty" label="对方单位" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '已确认' ? 'success' : 'warning'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="flows.length"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus, Filter, Download, Search } from '@element-plus/icons-vue'

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const flows = ref([
  {
    id: 1,
    date: '2026-03-10',
    project: '佳杰朱青项目1',
    type: '收入',
    amount: 60000,
    category: '工程款',
    counterparty: '佳杰公司',
    status: '已确认',
    remark: '项目首付款'
  },
  {
    id: 2,
    date: '2026-03-15',
    project: '佳杰朱青项目1',
    type: '支出',
    amount: 20000,
    category: '材料费',
    counterparty: '建材供应商',
    status: '已确认',
    remark: '采购建材'
  },
  {
    id: 3,
    date: '2026-03-20',
    project: null,
    type: '支出',
    amount: 5000,
    category: '办公费',
    counterparty: '办公用品供应商',
    status: '已确认',
    remark: '购买办公用品'
  }
])

const filteredFlows = computed(() => {
  if (!searchQuery.value) {
    return flows.value
  }
  const query = searchQuery.value.toLowerCase()
  return flows.value.filter(flow => 
    (flow.project && flow.project.toLowerCase().includes(query)) || 
    (flow.counterparty && flow.counterparty.toLowerCase().includes(query))
  )
})
</script>

<style scoped>
.flow {
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

.flow-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>