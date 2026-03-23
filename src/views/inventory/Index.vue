<template>
  <div class="inventory">
    <h1 class="page-title">库存管理</h1>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" size="large" @click="navigateTo('inbound')">
        <el-icon><Plus /></el-icon>
        入库
      </el-button>
      <el-button type="primary" size="large" @click="navigateTo('outbound')">
        <el-icon><TakeawayBox /></el-icon>
        出库
      </el-button>
      <el-button type="primary" size="large" @click="navigateTo('check')">
        <el-icon><View /></el-icon>
        盘点
      </el-button>
    </div>
    
    <!-- 库存清单 -->
    <el-card class="inventory-card">
      <template #header>
        <div class="card-header">
          <span>库存清单</span>
          <el-input
            v-model="searchQuery"
            placeholder="搜索物料名称或规格"
            prefix-icon="Search"
            style="width: 300px"
          />
        </div>
      </template>
      <el-table :data="filteredMaterials" style="width: 100%">
        <el-table-column prop="name" label="物料" min-width="150" />
        <el-table-column prop="spec" label="规格" min-width="180" />
        <el-table-column prop="current_stock" label="库存量" width="100" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="safe_stock" label="安全库存" width="100" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.status === '低于安全库存' ? 'danger' : 'success'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" plain @click="navigateTo('outbound')">
              出库
            </el-button>
            <el-button type="info" size="small" plain>
              详情
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
          :total="materials.length"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useInventoryStore } from '../../stores'
import { Plus, TakeawayBox, View, Search } from '@element-plus/icons-vue'

const router = useRouter()
const inventoryStore = useInventoryStore()

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const materials = computed(() => {
  return inventoryStore.materials.map(material => ({
    ...material,
    status: material.current_stock < material.safe_stock ? '低于安全库存' : '正常'
  }))
})

const filteredMaterials = computed(() => {
  if (!searchQuery.value) {
    return materials.value
  }
  const query = searchQuery.value.toLowerCase()
  return materials.value.filter(material => 
    material.name.toLowerCase().includes(query) || 
    material.spec.toLowerCase().includes(query)
  )
})

const navigateTo = (path) => {
  router.push(`/inventory/${path}`)
}
</script>

<style scoped>
.inventory {
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

.inventory-card {
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