<template>
  <div class="settings">
    <h1 class="page-title">系统设置</h1>
    
    <el-card class="settings-card">
      <el-tabs type="border-card">
        <el-tab-pane label="用户管理">
          <div class="tab-content">
            <el-button type="primary" size="small" style="margin-bottom: 16px">
              <el-icon><Plus /></el-icon>
              新增用户
            </el-button>
            <el-table :data="users" style="width: 100%">
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="name" label="用户名" width="120" />
              <el-table-column prop="role" label="角色" width="100" />
              <el-table-column prop="department" label="部门" width="120" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="scope.row.status === '启用' ? 'success' : 'danger'">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" fixed="right">
                <template #default="scope">
                  <el-button type="primary" size="small" plain>
                    编辑
                  </el-button>
                  <el-button type="danger" size="small" plain>
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="角色管理">
          <div class="tab-content">
            <el-button type="primary" size="small" style="margin-bottom: 16px">
              <el-icon><Plus /></el-icon>
              新增角色
            </el-button>
            <el-table :data="roles" style="width: 100%">
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="name" label="角色名称" width="120" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作" width="150" fixed="right">
                <template #default="scope">
                  <el-button type="primary" size="small" plain>
                    编辑
                  </el-button>
                  <el-button type="danger" size="small" plain>
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="部门管理">
          <div class="tab-content">
            <el-button type="primary" size="small" style="margin-bottom: 16px">
              <el-icon><Plus /></el-icon>
              新增部门
            </el-button>
            <el-table :data="departments" style="width: 100%">
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="name" label="部门名称" width="120" />
              <el-table-column prop="parent" label="上级部门" width="120" />
              <el-table-column label="操作" width="150" fixed="right">
                <template #default="scope">
                  <el-button type="primary" size="small" plain>
                    编辑
                  </el-button>
                  <el-button type="danger" size="small" plain>
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="数据字典">
          <div class="tab-content">
            <el-button type="primary" size="small" style="margin-bottom: 16px">
              <el-icon><Plus /></el-icon>
              新增字典
            </el-button>
            <el-table :data="dictionaries" style="width: 100%">
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="type" label="字典类型" width="120" />
              <el-table-column prop="key" label="键" width="120" />
              <el-table-column prop="value" label="值" width="120" />
              <el-table-column label="操作" width="150" fixed="right">
                <template #default="scope">
                  <el-button type="primary" size="small" plain>
                    编辑
                  </el-button>
                  <el-button type="danger" size="small" plain>
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="日志查询">
          <div class="tab-content">
            <el-table :data="logs" style="width: 100%">
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="user" label="操作用户" width="120" />
              <el-table-column prop="action" label="操作" width="150" />
              <el-table-column prop="ip" label="IP地址" width="150" />
              <el-table-column prop="time" label="操作时间" width="180" />
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

const users = ref([
  {
    id: 1,
    name: '张总',
    role: '管理员',
    department: '总经办',
    status: '启用'
  },
  {
    id: 2,
    name: '李经理',
    role: '项目经理',
    department: '项目部',
    status: '启用'
  },
  {
    id: 3,
    name: '王财务',
    role: '财务',
    department: '财务部',
    status: '启用'
  }
])

const roles = ref([
  {
    id: 1,
    name: '管理员',
    description: '系统管理员，拥有所有权限'
  },
  {
    id: 2,
    name: '项目经理',
    description: '负责项目管理，拥有项目相关权限'
  },
  {
    id: 3,
    name: '财务',
    description: '负责财务管理，拥有财务相关权限'
  },
  {
    id: 4,
    name: '库管',
    description: '负责库存管理，拥有库存相关权限'
  },
  {
    id: 5,
    name: '行政',
    description: '负责行政管理，拥有行政相关权限'
  }
])

const departments = ref([
  {
    id: 1,
    name: '总经办',
    parent: '无'
  },
  {
    id: 2,
    name: '项目部',
    parent: '总经办'
  },
  {
    id: 3,
    name: '财务部',
    parent: '总经办'
  },
  {
    id: 4,
    name: '行政部',
    parent: '总经办'
  }
])

const dictionaries = ref([
  {
    id: 1,
    type: '工种',
    key: '木工',
    value: '木工'
  },
  {
    id: 2,
    type: '工种',
    key: '油漆工',
    value: '油漆工'
  },
  {
    id: 3,
    type: '费用类型',
    key: '差旅费',
    value: '差旅费'
  },
  {
    id: 4,
    type: '费用类型',
    key: '办公费',
    value: '办公费'
  },
  {
    id: 5,
    type: '物料分类',
    key: '板材',
    value: '板材'
  },
  {
    id: 6,
    type: '物料分类',
    key: '型材',
    value: '型材'
  }
])

const logs = ref([
  {
    id: 1,
    user: '张总',
    action: '登录系统',
    ip: '192.168.1.100',
    time: '2026-03-23 10:00:00'
  },
  {
    id: 2,
    user: '李经理',
    action: '新增项目',
    ip: '192.168.1.101',
    time: '2026-03-23 10:30:00'
  },
  {
    id: 3,
    user: '王财务',
    action: '审批付款申请',
    ip: '192.168.1.102',
    time: '2026-03-23 11:00:00'
  }
])
</script>

<style scoped>
.settings {
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

.settings-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tab-content {
  padding: 20px 0;
}
</style>