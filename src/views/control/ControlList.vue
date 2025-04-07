<template>
  <div>
    <!-- 页面标题和操作栏 -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
      <h1 class="text-2xl font-bold mb-4 md:mb-0" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
        集控列表
      </h1>
      <div class="flex flex-col sm:flex-row gap-3">
        <!-- 搜索框 -->
        <div class="relative" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">
          <input
              type="text"
              v-model="searchQuery"
              placeholder="搜索节点..."
              class="pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:outline-none w-full sm:w-64 transition-all duration-200"
              :class="isDarkMode ? 'bg-gray-700 border-gray-600 focus:ring-blue-600' : 'bg-white border-gray-300 focus:ring-blue-400'"
          />
          <span class="absolute left-3 top-2.5">
            <Icon icon="mdi:magnify" class="h-5 w-5 opacity-60" />
          </span>
        </div>

        <!-- 创建按钮 -->
        <router-link
            to="/control/create"
            class="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200 transform hover:translate-y-[-2px] bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :class="isDarkMode ? 'focus:ring-offset-gray-900' : ''"
        >
          <Icon icon="mdi:plus" class="mr-2 h-5 w-5" />
          创建节点
        </router-link>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="overflow-hidden rounded-lg shadow" :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" :class="isDarkMode ? 'border-blue-400' : 'border-blue-600'"></div>
      </div>

      <!-- 无数据状态 -->
      <div v-else-if="filteredControls.length === 0" class="flex flex-col items-center justify-center py-20">
        <Icon icon="mdi:server-off" class="h-16 w-16 mb-4" :class="isDarkMode ? 'text-gray-600' : 'text-gray-400'" />
        <p class="text-lg" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
          {{ searchQuery ? '没有找到匹配的节点' : '暂无集控节点' }}
        </p>
        <router-link
            to="/control/create"
            class="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-blue-600 bg-blue-100 hover:bg-blue-200"
            :class="isDarkMode ? 'text-blue-400 bg-blue-900/30 hover:bg-blue-900/50' : ''"
        >
          <Icon icon="mdi:plus" class="mr-2 h-4 w-4" />
          创建节点
        </router-link>
      </div>

      <!-- 数据表格 -->
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y" :class="isDarkMode ? 'divide-gray-700' : 'divide-gray-200'">
            <thead :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
                节点ID
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
                节点名称
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
                位置
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
                状态
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
                上次连接
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
                操作
              </th>
            </tr>
            </thead>
            <tbody :class="isDarkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'">
            <tr v-for="control in filteredControls" :key="control.id" :class="isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'">
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                {{ control.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center" :class="isDarkMode ? 'bg-gray-600' : ''">
                    <Icon v-if="!control.avatar" icon="mdi:server" class="h-6 w-6" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" />
                    <img v-else :src="control.avatar" alt="" class="h-10 w-10 object-cover" />
                  </div>
                  <div class="ml-4">
                    <div class="font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                      {{ control.name }}
                    </div>
                    <div class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                      {{ control.ip }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                {{ control.location }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                  <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="statusClass(control.status)"
                  >
                    {{ statusText(control.status) }}
                  </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                {{ formatDate(control.lastConnection) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <div class="flex justify-end space-x-2">
                  <button
                      @click="viewDetails(control.id)"
                      class="text-blue-600 hover:text-blue-900"
                      :class="isDarkMode ? 'text-blue-400 hover:text-blue-300' : ''"
                      title="查看详情"
                  >
                    <Icon icon="mdi:eye" class="h-5 w-5" />
                  </button>
                  <button
                      @click="editNode(control.id)"
                      class="text-amber-600 hover:text-amber-900"
                      :class="isDarkMode ? 'text-amber-400 hover:text-amber-300' : ''"
                      title="编辑节点"
                  >
                    <Icon icon="mdi:pencil" class="h-5 w-5" />
                  </button>
                  <button
                      @click="deleteNode(control.id)"
                      class="text-red-600 hover:text-red-900"
                      :class="isDarkMode ? 'text-red-400 hover:text-red-300' : ''"
                      title="删除节点"
                  >
                    <Icon icon="mdi:delete" class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页控件 -->
        <div class="flex items-center justify-between px-6 py-3 border-t" :class="isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'">
          <div class="flex items-center">
            <span class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
              显示 {{ filteredControls.length }} 条，共 {{ controls.length }} 条
            </span>
          </div>
          <div class="flex space-x-2">
            <button
                class="px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                :class="isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                disabled
            >
              上一页
            </button>
            <button
                class="px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                :class="isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                disabled
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

// 获取全局暗黑模式状态
const isDarkMode = inject('isDarkMode', ref(false));
const router = useRouter();

// 加载状态
const loading = ref(true);

// 搜索查询
const searchQuery = ref('');

// 模拟数据 - 实际应用中应从API获取
const controls = ref([]);

// 根据搜索过滤后的数据
const filteredControls = computed(() => {
  if (!searchQuery.value) return controls.value;

  const query = searchQuery.value.toLowerCase();
  return controls.value.filter(control =>
      control.id.toString().includes(query) ||
      control.name.toLowerCase().includes(query) ||
      control.location.toLowerCase().includes(query) ||
      control.ip.includes(query)
  );
});

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '无数据';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// 状态文本
const statusText = (status) => {
  const statusMap = {
    'online': '在线',
    'offline': '离线',
    'warning': '警告',
    'error': '错误',
    'maintenance': '维护中'
  };
  return statusMap[status] || '未知';
};

// 状态样式类
const statusClass = (status) => {
  if (isDarkMode.value) {
    const darkStatusMap = {
      'online': 'bg-green-900 text-green-300',
      'offline': 'bg-gray-700 text-gray-300',
      'warning': 'bg-yellow-900 text-yellow-300',
      'error': 'bg-red-900 text-red-300',
      'maintenance': 'bg-blue-900 text-blue-300'
    };
    return darkStatusMap[status] || 'bg-gray-700 text-gray-300';
  } else {
    const lightStatusMap = {
      'online': 'bg-green-100 text-green-800',
      'offline': 'bg-gray-100 text-gray-800',
      'warning': 'bg-yellow-100 text-yellow-800',
      'error': 'bg-red-100 text-red-800',
      'maintenance': 'bg-blue-100 text-blue-800'
    };
    return lightStatusMap[status] || 'bg-gray-100 text-gray-800';
  }
};

// 查看详情
const viewDetails = (id) => {
  router.push(`/control/details/${id}`);
};

// 编辑节点
const editNode = (id) => {
  router.push(`/control/edit/${id}`);
};

// 删除节点
const deleteNode = (id) => {
  if (confirm('确定要删除此节点吗？此操作不可撤销。')) {
    // 这里应该调用API删除节点
    console.log('删除节点:', id);
    // 模拟删除成功后更新列表
    controls.value = controls.value.filter(control => control.id !== id);
  }
};

// 组件挂载时获取数据
onMounted(async () => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 模拟数据 - 实际应用中应该从API获取
    controls.value = [
      {
        id: 'CTRL-001',
        name: '主控节点A',
        location: '北京数据中心',
        status: 'online',
        ip: '192.168.1.100',
        lastConnection: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        id: 'CTRL-002',
        name: '备用节点B',
        location: '上海数据中心',
        status: 'online',
        ip: '192.168.2.50',
        lastConnection: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      },
      {
        id: 'CTRL-003',
        name: '边缘节点C',
        location: '广州分部',
        status: 'warning',
        ip: '192.168.3.25',
        lastConnection: new Date(Date.now() - 120 * 60 * 1000).toISOString()
      },
      {
        id: 'CTRL-004',
        name: '监控节点D',
        location: '深圳分部',
        status: 'offline',
        ip: '192.168.4.88',
        lastConnection: new Date(Date.now() - 1440 * 60 * 1000).toISOString()
      },
      {
        id: 'CTRL-005',
        name: '测试节点E',
        location: '成都分部',
        status: 'maintenance',
        ip: '192.168.5.120',
        lastConnection: new Date(Date.now() - 60 * 60 * 1000).toISOString()
      }
    ];
  } catch (error) {
    console.error('获取集控列表失败:', error);
    // 这里可以添加错误处理逻辑
  } finally {
    loading.value = false;
  }
});
</script>
