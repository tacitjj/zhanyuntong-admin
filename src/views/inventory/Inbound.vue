<template>
  <div class="inbound">
    <h1 class="page-title">入库单</h1>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" size="large" @click="openAddDialog">
        <el-icon><Plus /></el-icon>
        新增入库单
      </el-button>
      <el-button size="large">
        <el-icon><Filter /></el-icon>
        筛选
      </el-button>
    </div>
    
    <!-- 入库单列表 -->
    <el-card class="inbound-card">
      <template #header>
        <div class="card-header">
          <span>入库记录</span>
        </div>
      </template>
      <el-table :data="inboundList" style="width: 100%">
        <el-table-column prop="date" label="入库日期" width="120" />
        <el-table-column prop="type" label="入库类型" width="120" />
        <el-table-column prop="material" label="物料" min-width="150" />
        <el-table-column prop="qty" label="数量" width="80" />
        <el-table-column prop="unitPrice" label="单价" width="100">
          <template #default="scope">
            ¥{{ scope.row.unitPrice.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="总金额" width="120">
          <template #default="scope">
            ¥{{ scope.row.totalAmount.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="supplier" label="供应商" width="150" />
        <el-table-column prop="operator" label="经办人" width="100" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" plain @click="openEditDialog(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" plain @click="deleteInbound(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 入库单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑入库单' : '新增入库单'"
      width="500px"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="入库日期">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="入库类型">
          <el-select v-model="form.type" placeholder="选择入库类型" style="width: 100%">
            <el-option label="采购入库" value="采购入库" />
            <el-option label="退货入库" value="退货入库" />
            <el-option label="调拨入库" value="调拨入库" />
          </el-select>
        </el-form-item>
        <el-form-item label="物料">
          <el-select v-model="form.material" placeholder="选择物料" style="width: 100%">
            <el-option label="多层板" value="多层板" />
            <el-option label="奥松板" value="奥松板" />
            <el-option label="方钢管" value="方钢管" />
            <el-option label="铝型材" value="铝型材" />
          </el-select>
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="form.qty" :min="1" />
        </el-form-item>
        <el-form-item label="单价">
          <el-input v-model="form.unitPrice" type="number" placeholder="单价" />
        </el-form-item>
        <el-form-item label="供应商">
          <el-input v-model="form.supplier" placeholder="供应商名称" />
        </el-form-item>
        <el-form-item label="经办人">
          <el-input v-model="form.operator" placeholder="经办人姓名" />
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
import { ref, watch } from 'vue'
import { Plus, Filter } from '@element-plus/icons-vue'

const dialogVisible = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  date: new Date(),
  type: '采购入库',
  material: '',
  qty: 1,
  unitPrice: 0,
  totalAmount: 0,
  supplier: '',
  operator: ''
})

// 监听数量和单价变化，自动计算总金额
watch([() => form.value.qty, () => form.value.unitPrice], () => {
  form.value.totalAmount = form.value.qty * form.value.unitPrice
})

const inboundList = ref([
  {
    id: 1,
    date: '2026-03-20',
    type: '采购入库',
    material: '多层板',
    qty: 50,
    unitPrice: 100,
    totalAmount: 5000,
    supplier: '建材供应商',
    operator: '张三'
  },
  {
    id: 2,
    date: '2026-03-19',
    type: '采购入库',
    material: '方钢管',
    qty: 100,
    unitPrice: 80,
    totalAmount: 8000,
    supplier: '金属材料公司',
    operator: '李四'
  }
])

const openAddDialog = () => {
  isEditing.value = false
  editingId.value = null
  form.value = {
    date: new Date(),
    type: '采购入库',
    material: '',
    qty: 1,
    unitPrice: 0,
    totalAmount: 0,
    supplier: '',
    operator: ''
  }
  dialogVisible.value = true
}

const openEditDialog = (inbound) => {
  isEditing.value = true
  editingId.value = inbound.id
  form.value = {
    date: new Date(inbound.date),
    type: inbound.type,
    material: inbound.material,
    qty: inbound.qty,
    unitPrice: inbound.unitPrice,
    totalAmount: inbound.totalAmount,
    supplier: inbound.supplier,
    operator: inbound.operator
  }
  dialogVisible.value = true
}

const submitForm = () => {
  if (isEditing.value) {
    // 编辑现有记录
    const index = inboundList.value.findIndex(item => item.id === editingId.value)
    if (index !== -1) {
      inboundList.value[index] = {
        ...inboundList.value[index],
        date: form.value.date.toISOString().split('T')[0],
        type: form.value.type,
        material: form.value.material,
        qty: form.value.qty,
        unitPrice: form.value.unitPrice,
        totalAmount: form.value.totalAmount,
        supplier: form.value.supplier,
        operator: form.value.operator
      }
    }
  } else {
    // 新增记录
    inboundList.value.unshift({
      id: inboundList.value.length + 1,
      date: form.value.date.toISOString().split('T')[0],
      type: form.value.type,
      material: form.value.material,
      qty: form.value.qty,
      unitPrice: form.value.unitPrice,
      totalAmount: form.value.totalAmount,
      supplier: form.value.supplier,
      operator: form.value.operator
    })
  }
  dialogVisible.value = false
}

const deleteInbound = (id) => {
  inboundList.value = inboundList.value.filter(item => item.id !== id)
}
</script>

<style scoped>
.inbound {
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

.inbound-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>