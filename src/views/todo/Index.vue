<template>
  <div class="todo">
    <h1 class="page-title">待办中心</h1>
    
    <el-card class="todo-card">
      <el-tabs type="border-card">
        <el-tab-pane label="待处理">
          <div class="todo-list">
            <div v-for="item in pendingTodos" :key="item.id" class="todo-item">
              <div class="todo-content">
                <div class="todo-title">{{ item.content }}</div>
                <div class="todo-meta">
                  <span class="todo-date">2026-03-23</span>
                </div>
              </div>
              <div class="todo-actions">
                <el-button type="primary" size="small">通过</el-button>
                <el-button type="danger" size="small">驳回</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我发起的">
          <div class="todo-list">
            <div v-for="item in myTodos" :key="item.id" class="todo-item">
              <div class="todo-content">
                <div class="todo-title">{{ item.content }}</div>
                <div class="todo-meta">
                  <span class="todo-date">2026-03-22</span>
                  <el-tag :type="getStatusType(item.status)">{{ item.status }}</el-tag>
                </div>
              </div>
              <div class="todo-actions">
                <el-button type="primary" size="small" plain>查看</el-button>
                <el-button type="info" size="small" plain>撤回</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="抄送我的">
          <div class="todo-list">
            <div v-for="item in copiedTodos" :key="item.id" class="todo-item">
              <div class="todo-content">
                <div class="todo-title">{{ item.content }}</div>
                <div class="todo-meta">
                  <span class="todo-date">2026-03-21</span>
                  <el-tag type="info">{{ item.status }}</el-tag>
                </div>
              </div>
              <div class="todo-actions">
                <el-button type="primary" size="small">标记已读</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTodoStore } from '../../stores'

const todoStore = useTodoStore()

const pendingTodos = computed(() => {
  return todoStore.todos.filter(todo => todo.type === '待处理')
})

const myTodos = computed(() => {
  return todoStore.todos.filter(todo => todo.type === '我发起的')
})

const copiedTodos = computed(() => {
  return todoStore.todos.filter(todo => todo.type === '抄送我的')
})

const getStatusType = (status) => {
  const statusMap = {
    '已审批': 'success',
    '待处理': 'warning',
    '未读': 'info'
  }
  return statusMap[status] || 'info'
}
</script>

<style scoped>
.todo {
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

.todo-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 0;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.todo-item:hover {
  background-color: #f0f0f0;
}

.todo-content {
  flex: 1;
}

.todo-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.todo-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #666;
}

.todo-actions {
  display: flex;
  gap: 8px;
}
</style>