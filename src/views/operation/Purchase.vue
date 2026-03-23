<template>
  <div class="purchase">
    <h1 class="page-title">采购申请</h1>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" size="large" @click="openAddDialog">
        <el-icon><Plus /></el-icon>
        新增采购申请
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
    
    <!-- 采购申请列表 -->
    <el-card class="purchase-card">
      <template #header>
        <div class="card-header">
          <span>采购申请记录</span>
          <el-input
            v-model="searchQuery"
            placeholder="搜索项目或物料"
            prefix-icon="Search"
            style="width: 300px"
          />
        </div>
      </template>
      <el-table :data="filteredPurchaseRequests" style="width: 100%">
        <el-table-column prop="date" label="申请日期" width="120" />
        <el-table-column prop="project" label="关联项目" min-width="180" />
        <el-table-column prop="material" label="物料名称" width="150" />
        <el-table-column prop="spec" label="规格" width="150" />
        <el-table-column prop="qty" label="数量" width="80" />
        <el-table-column prop="estimatedAmount" label="预计金额" width="120">
          <template #default="scope">
            ¥{{ scope.row.estimatedAmount.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="urgency" label="紧急程度" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.urgency === '紧急' ? 'danger' : 'info'">
              {{ scope.row.urgency }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" plain @click="openEditDialog(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" plain @click="deletePurchaseRequest(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="purchaseRequests.length"
        />
      </div>
    </el-card>
    
    <!-- 采购申请对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑采购申请' : '新增采购申请'"
      width="500px"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="申请日期">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="关联项目">
          <el-select v-model="form.project" placeholder="选择项目" style="width: 100%">
            <el-option label="佳杰朱青项目1" value="佳杰朱青项目1" />
            <el-option label="恒远科技项目" value="恒远科技项目" />
            <el-option label="新奥能源项目" value="新奥能源项目" />
          </el-select>
        </el-form-item>
        <el-form-item label="物料名称">
          <el-input v-model="form.material" placeholder="需要采购的物料" />
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="form.spec" placeholder="型号要求" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="form.qty" :min="1" />
        </el-form-item>
        <el-form-item label="预计金额">
          <el-input v-model="form.estimatedAmount" type="number" placeholder="预算金额" />
        </el-form-item>
        <el-form-item label="紧急程度">
          <el-radio-group v-model="form.urgency">
            <el-radio label="普通">普通</el-radio>
            <el-radio label="紧急">紧急</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="申请说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus, Filter, Download, Search } from '@element-plus/icons-vue'

const dialogVisible = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  date: new Date(),
  project: '',
  material: '',
  spec: '',
  qty: 1,
  estimatedAmount: 0,
  urgency: '普通',
  remark: ''
})

const purchaseRequests = ref([
  {
    id: 1,
    date: '2026-03-20',
    project: '佳杰朱青项目1',
    material: '多层板',
    spec: '1220*2440*15mm',
    qty: 50,
    estimatedAmount: 5000,
    urgency: '普通',
    status: '待采购'
  },
  {
    id: 2,
    date: '2026-03-19',
    project: '新奥能源项目',
    material: '方钢管',
    spec: '40*40*2mm',
    qty: 100,
    estimatedAmount: 8000,
    urgency: '紧急',
    status: '已采购'
  },
  {
    id: 3,
    date: '2026-03-18',
    project: '恒远科技项目',
    material: '铝型材',
    spec: '6063-T5',
    qty: 200,
    estimatedAmount: 12000,
    urgency: '普通',
    status: '已入库'
  }
])

const filteredPurchaseRequests = computed(() => {
  if (!searchQuery.value) {
    return purchaseRequests.value
  }
  const query = searchQuery.value.toLowerCase()
  return purchaseRequests.value.filter(request => 
    request.project.toLowerCase().includes(query) || 
    request.material.toLowerCase().includes(query)
  )
})

const getStatusType = (status) => {
  const statusMap = {
    '待采购': 'warning',
    '已采购': 'info',
    '已入库': 'success'
  }
  return statusMap[status] || 'info'
}

const openAddDialog = () => {
  isEditing.value = false
  editingId.value = null
  form.value = {
    date: new Date(),
    project: '',
    material: '',
    spec: '',
    qty: 1,
    estimatedAmount: 0,
    urgency: '普通',
    remark: ''
  }
  dialogVisible.value = true
}

const openEditDialog = (request) => {
  isEditing.value = true
  editingId.value = request.id
  form.value = {
    date: new Date(request.date),
    project: request.project,
    material: request.material,
    spec: request.spec,
    qty: request.qty,
    estimatedAmount: request.estimatedAmount,
    urgency: request.urgency,
    remark: request.remark
  }
  dialogVisible.value = true
}

const submitForm = () => {
  if (isEditing.value) {
    // 编辑现有记录
    const index = purchaseRequests.value.findIndex(req => req.id === editingId.value)
    if (index !== -1) {
      purchaseRequests.value[index] = {
        ...purchaseRequests.value[index],
        date: form.value.date.toISOString().split('T')[0],
        project: form.value.project,
        material: form.value.material,
        spec: form.value.spec,
        qty: form.value.qty,
        estimatedAmount: form.value.estimatedAmount,
        urgency: form.value.urgency
      }
    }
  } else {
    // 新增记录
    purchaseRequests.value.unshift({
      id: purchaseRequests.value.length + 1,
      date: form.value.date.toISOString().split('T')[0],
      project: form.value.project,
      material: form.value.material,
      spec: form.value.spec,
      qty: form.value.qty,
      estimatedAmount: form.value.estimatedAmount,
      urgency: form.value.urgency,
      status: '待采购'
    })
  }
  dialogVisible.value = false
}

const deletePurchaseRequest = (id) => {
  purchaseRequests.value = purchaseRequests.value.filter(req => req.id !== id)
}
</script>

<style scoped>
.purchase {
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

.purchase-card {
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>