<template>
  <div>
    <!-- 页面标题和操作栏 -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
      <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
        EDR终端管理
      </h1>
      <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
        <button
            @click="exportEndpoints"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'"
        >
          <Icon icon="mdi:download" class="mr-2 h-5 w-5" />
          导出终端列表
        </button>
        <button
            @click="scanAllEndpoints"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-600 text-white hover:bg-green-500'"
        >
          <Icon icon="mdi:scan" class="mr-2 h-5 w-5" />
          全网扫描
        </button>
        <button
            @click="refreshEndpoints"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'"
        >
          <Icon icon="mdi:refresh" class="mr-2 h-5 w-5" />
          刷新
        </button>
      </div>
    </div>

    <!-- 过滤和搜索 -->
    <div class="mb-6 p-4 rounded-xl shadow-sm"
         :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon icon="mdi:magnify" class="h-5 w-5" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" />
            </div>
            <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索终端..."
                class="pl-10 pr-4 py-2 w-full rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
            />
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <select
              v-model="statusFilter"
              class="px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
          >
            <option value="all">全部状态</option>
            <option value="online">在线</option>
            <option value="offline">离线</option>
            <option value="warning">警告</option>
            <option value="critical">危险</option>
          </select>
          <select
              v-model="osFilter"
              class="px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
          >
            <option value="all">全部操作系统</option>
            <option value="Windows">Windows</option>
            <option value="Linux">Linux</option>
            <option value="macOS">macOS</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" :class="isDarkMode ? 'border-blue-400' : 'border-blue-600'"></div>
    </div>

    <!-- 终端列表 -->
    <div v-else-if="filteredEndpoints.length > 0" class="rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md mb-6"
         :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y" :class="isDarkMode ? 'divide-gray-700' : 'divide-gray-200'">
          <thead :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              终端名称
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              IP地址
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              操作系统
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              状态
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              最后在线时间
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              代理版本
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              操作
            </th>
          </tr>
          </thead>
          <tbody :class="isDarkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'">
          <tr v-for="endpoint in filteredEndpoints" :key="endpoint.id"
              class="transition-colors duration-150"
              :class="isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'">
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ endpoint.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ endpoint.ip }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              <div class="flex items-center">
                <Icon :icon="getOsIcon(endpoint.os)" class="mr-2 h-5 w-5" />
                {{ endpoint.os }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                  class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="statusClass(endpoint.status)"
              >
                {{ statusText(endpoint.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ formatDate(endpoint.lastOnline) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ endpoint.agentVersion }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
              <div class="flex justify-end items-center space-x-3">
                <button @click="scanEndpoint(endpoint)"
                        :class="isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'">
                  <Icon icon="mdi:scan" class="h-5 w-5" />
                </button>
                <button @click="isolateEndpoint(endpoint)"
                        class="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300">
                  <Icon icon="mdi:server-network-off" class="h-5 w-5" />
                </button>
                <button @click="viewEndpointDetails(endpoint)"
                        class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <Icon icon="mdi:information-outline" class="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="px-6 py-3 flex items-center justify-between border-t"
           :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
        <div class="flex-1 flex justify-between sm:hidden">
          <button @click="prevPage" :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md"
                  :class="isDarkMode
                ? 'border-gray-700 bg-gray-800 text-gray-300 disabled:opacity-50'
                : 'border-gray-300 bg-white text-gray-700 disabled:opacity-50'">
            上一页
          </button>
          <button @click="nextPage" :disabled="currentPage >= totalPages"
                  class="ml-3 relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md"
                  :class="isDarkMode
                ? 'border-gray-700 bg-gray-800 text-gray-300 disabled:opacity-50'
                : 'border-gray-300 bg-white text-gray-700 disabled:opacity-50'">
            下一页
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-700'">
              显示第 <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> 到
              <span class="font-medium">{{ Math.min(currentPage * pageSize, totalItems) }}</span> 条，
              共 <span class="font-medium">{{ totalItems }}</span> 条记录
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button @click="prevPage" :disabled="currentPage === 1"
                      class="relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium"
                      :class="isDarkMode
                    ? 'border-gray-700 bg-gray-800 text-gray-300 disabled:opacity-50'
                    : 'border-gray-300 bg-white text-gray-700 disabled:opacity-50'">
                <span class="sr-only">上一页</span>
                <Icon icon="mdi:chevron-left" class="h-5 w-5" />
              </button>
              <button @click="nextPage" :disabled="currentPage >= totalPages"
                      class="relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium"
                      :class="isDarkMode
                    ? 'border-gray-700 bg-gray-800 text-gray-300 disabled:opacity-50'
                    : 'border-gray-300 bg-white text-gray-700 disabled:opacity-50'">
                <span class="sr-only">下一页</span>
                <Icon icon="mdi:chevron-right" class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-20 rounded-xl shadow-sm"
         :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
      <Icon icon="mdi:laptop" class="h-16 w-16 mx-auto" :class="isDarkMode ? 'text-gray-600' : 'text-gray-400'" />
      <h3 class="mt-4 text-lg font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
        暂无终端记录
      </h3>
      <p class="mt-2 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
        没有找到匹配当前筛选条件的终端设备
      </p>
    </div>

    <!-- 终端详情模态框 -->
    <div v-if="showEndpointModal" class="fixed inset-0 flex items-center justify-center z-50" @click.self="closeEndpointModal">
      <div class="fixed inset-0 bg-black opacity-50"></div>
      <div class="relative p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 md:mx-auto"
           :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'">
        <button @click="closeEndpointModal"
                :class="isDarkMode ? 'absolute top-4 right-4 text-gray-400 hover:text-gray-300' : 'absolute top-4 right-4 text-gray-400 hover:text-gray-600'">
          <Icon icon="mdi:close" class="h-6 w-6" />
        </button>

        <h2 class="text-xl font-bold mb-6">终端详情</h2>

        <div v-if="selectedEndpoint" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-4">
              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">终端名称:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ selectedEndpoint.name }}
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">IP地址:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ selectedEndpoint.ip }}
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">MAC地址:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ selectedEndpoint.mac }}
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">操作系统:</span>
                <p class="text-sm flex items-center" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  <Icon :icon="getOsIcon(selectedEndpoint.os)" class="mr-2 h-5 w-5" />
                  {{ selectedEndpoint.os }} {{ selectedEndpoint.osVersion }}
                </p>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">状态:</span>
                <p>
                  <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="statusClass(selectedEndpoint.status)">
                    {{ statusText(selectedEndpoint.status) }}
                  </span>
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">最后在线时间:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ formatDate(selectedEndpoint.lastOnline, true) }}
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">代理版本:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ selectedEndpoint.agentVersion }}
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">终端分组:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ selectedEndpoint.group }}
                </p>
              </div>
            </div>
          </div>

          <div>
            <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">硬件信息:</span>
            <div class="mt-2 p-3 rounded"
                 :class="isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm">
                <div>CPU: {{ selectedEndpoint.hardware.cpu }}</div>
                <div>内存: {{ selectedEndpoint.hardware.memory }}</div>
                <div>磁盘: {{ selectedEndpoint.hardware.disk }}</div>
                <div>显卡: {{ selectedEndpoint.hardware.gpu }}</div>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-3 justify-end">
            <button @click="scanEndpoint(selectedEndpoint)"
                    class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
                    :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'">
              <Icon icon="mdi:scan" class="mr-2 h-5 w-5" />
              执行扫描
            </button>
            <button @click="isolateEndpoint(selectedEndpoint)"
                    class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
                    :class="isDarkMode ? 'bg-yellow-600 text-white hover:bg-yellow-700' : 'bg-yellow-600 text-white hover:bg-yellow-500'">
              <Icon icon="mdi:server-network-off" class="mr-2 h-5 w-5" />
              网络隔离
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue';
import { Icon } from '@iconify/vue';

// 获取全局暗黑模式状态
const isDarkMode = inject('isDarkMode', ref(false));

// 加载状态
const loading = ref(true);

// 过滤条件和搜索
const searchQuery = ref('');
const statusFilter = ref('all');
const osFilter = ref('all');

// 分页
const currentPage = ref(1);
const pageSize = ref(10);

// 终端列表
const endpoints = ref([]);
const selectedEndpoint = ref(null);
const showEndpointModal = ref(false);

// 过滤后的终端
const filteredEndpoints = computed(() => {
  let result = endpoints.value.filter(endpoint => {
    // 状态过滤
    if (statusFilter.value !== 'all' && endpoint.status !== statusFilter.value) {
      return false;
    }

    // 操作系统过滤
    if (osFilter.value !== 'all' && !endpoint.os.includes(osFilter.value)) {
      return false;
    }

    // 搜索查询
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      return endpoint.name.toLowerCase().includes(query) ||
          endpoint.ip.toLowerCase().includes(query) ||
          endpoint.os.toLowerCase().includes(query);
    }

    return true;
  });

  // 按状态和名称排序
  result.sort((a, b) => {
    // 首先按状态排序：在线 > 警告 > 离线 > 危险
    const statusOrder = {
      'online': 0,
      'warning': 1,
      'offline': 2,
      'critical': 3
    };

    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;

    // 其次按名称字母顺序排序
    return a.name.localeCompare(b.name);
  });

  return result;
});

// 分页计算
const totalItems = computed(() => filteredEndpoints.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

// 分页导航
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// 状态样式
const statusClass = (status) => {
  if (isDarkMode.value) {
    const darkStatusMap = {
      'online': 'bg-green-900 text-green-300',
      'offline': 'bg-gray-700 text-gray-300',
      'warning': 'bg-yellow-900 text-yellow-300',
      'critical': 'bg-red-900 text-red-300',
    };
    return darkStatusMap[status] || 'bg-gray-700 text-gray-300';
  } else {
    const lightStatusMap = {
      'online': 'bg-green-100 text-green-800',
      'offline': 'bg-gray-100 text-gray-800',
      'warning': 'bg-yellow-100 text-yellow-800',
      'critical': 'bg-red-100 text-red-800',
    };
    return lightStatusMap[status] || 'bg-gray-100 text-gray-800';
  }
};

// 状态文本
const statusText = (status) => {
  const statusMap = {
    'online': '在线',
    'offline': '离线',
    'warning': '警告',
    'critical': '危险',
  };
  return statusMap[status] || status;
};

// 获取操作系统图标
const getOsIcon = (os) => {
  if (os.includes('Windows')) return 'mdi:microsoft-windows';
  if (os.includes('Linux')) return 'mdi:linux';
  if (os.includes('macOS')) return 'mdi:apple';
  return 'mdi:laptop';
};

// 格式化日期
const formatDate = (timestamp, detailed = false) => {
  const date = new Date(timestamp);

  if (detailed) {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  // 简化显示，今天的只显示时间，非今天的显示日期
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } else {
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

// 查看终端详情
const viewEndpointDetails = (endpoint) => {
  selectedEndpoint.value = endpoint;
  showEndpointModal.value = true;
};

// 关闭终端详情模态框
const closeEndpointModal = () => {
  showEndpointModal.value = false;
};

// 隔离终端
const isolateEndpoint = (endpoint) => {
  // 实际应用中这里会调用API隔离终端
  alert(`隔离终端: ${endpoint.name}`);
};

// 扫描终端
const scanEndpoint = (endpoint) => {
  // 实际应用中这里会调用API扫描终端
  alert(`扫描终端: ${endpoint.name}`);
};

// 全网扫描
const scanAllEndpoints = () => {
  // 实际应用中这里会调用API进行全网扫描
  alert('开始全网扫描');
};

// 导出终端列表
const exportEndpoints = () => {
  const dataStr = JSON.stringify(filteredEndpoints.value, null, 2);
  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportName = `edr-endpoints-${new Date().toISOString().split('T')[0]}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportName);
  linkElement.click();
};

// 刷新终端列表
const refreshEndpoints = async () => {
  loading.value = true;
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 重新加载数据
    await loadEndpoints();
  } finally {
    loading.value = false;
  }
};

// 加载终端数据
const loadEndpoints = async () => {
  try {
    // 模拟从API获取数据
    await new Promise(resolve => setTimeout(resolve, 800));

    // 生成模拟终端数据
    const mockEndpoints = [];
    const statuses = ['online', 'offline', 'warning', 'critical'];
    const osList = ['Windows 10', 'Windows 11', 'macOS 13.1', 'Ubuntu 22.04', 'CentOS 8'];
    const agentVersions = ['1.5.2', '1.5.1', '1.4.9', '1.6.0-beta'];
    const groups = ['研发部门', '市场部门', '财务部门', '人力资源部', '管理层'];

    // 生成终端数据
    const now = new Date();
    for (let i = 0; i < 15; i++) {
      const os = osList[Math.floor(Math.random() * osList.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const randomDate = new Date(now.getTime() - Math.random() * 3 * 24 * 60 * 60 * 1000);

      mockEndpoints.push({
        id: `endpoint-${i + 1}`,
        name: `ENDPOINT-${String(i + 1).padStart(3, '0')}`,
        ip: `192.168.1.${10 + i}`,
        mac: `00:1B:44:11:3A:${String(i + 10).padStart(2, '0')}`,
        os: os.split(' ')[0],
        osVersion: os.split(' ')[1],
        status: status,
        lastOnline: randomDate.toISOString(),
        agentVersion: agentVersions[Math.floor(Math.random() * agentVersions.length)],
        group: groups[Math.floor(Math.random() * groups.length)],
        hardware: {
          cpu: 'Intel Core i7-10700K @ 3.80GHz',
          memory: '16GB DDR4',
          disk: 'SSD 512GB',
          gpu: 'NVIDIA GeForce RTX 3070'
        }
      });
    }

    endpoints.value = mockEndpoints;
  } catch (error) {
    console.error('获取终端列表失败:', error);
    // 添加错误处理逻辑
  }
};

// 组件挂载时加载数据
onMounted(async () => {
  try {
    await loadEndpoints();
  } finally {
    loading.value = false;
  }
});
</script>
