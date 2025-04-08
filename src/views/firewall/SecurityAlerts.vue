<template>
  <div>
    <!-- 页面标题和操作栏 -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
      <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
        安全告警中心
      </h1>
      <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
        <button
            @click="markAllAsRead"
            :disabled="unreadAlertsCount === 0"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode
            ? (unreadAlertsCount > 0 ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-800 text-gray-500 cursor-not-allowed')
            : (unreadAlertsCount > 0 ? 'bg-white text-gray-700 hover:bg-gray-50' : 'bg-gray-100 text-gray-400 cursor-not-allowed')"
        >
          <Icon icon="mdi:check-all" class="mr-2 h-5 w-5" />
          标记所有已读
        </button>
        <button
            @click="exportAlerts"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'"
        >
          <Icon icon="mdi:download" class="mr-2 h-5 w-5" />
          导出告警
        </button>
        <button
            @click="refreshAlerts"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'"
        >
          <Icon icon="mdi:refresh" class="mr-2 h-5 w-5" />
          刷新
        </button>
      </div>
    </div>

    <!-- 告警摘要卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="rounded-xl shadow-sm p-5 transition-all duration-200 hover:shadow-md"
           :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">高危告警</h3>
            <p class="text-2xl font-bold mt-1" :class="isDarkMode ? 'text-red-400' : 'text-red-600'">
              {{ highSeverityCount }}
            </p>
          </div>
          <div class="p-2 rounded-md" :class="isDarkMode ? 'bg-red-900/30' : 'bg-red-100'">
            <Icon icon="mdi:alert-circle" class="h-6 w-6" :class="isDarkMode ? 'text-red-400' : 'text-red-500'" />
          </div>
        </div>
      </div>

      <div class="rounded-xl shadow-sm p-5 transition-all duration-200 hover:shadow-md"
           :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">中危告警</h3>
            <p class="text-2xl font-bold mt-1" :class="isDarkMode ? 'text-orange-400' : 'text-orange-600'">
              {{ mediumSeverityCount }}
            </p>
          </div>
          <div class="p-2 rounded-md" :class="isDarkMode ? 'bg-orange-900/30' : 'bg-orange-100'">
            <Icon icon="mdi:alert" class="h-6 w-6" :class="isDarkMode ? 'text-orange-400' : 'text-orange-500'" />
          </div>
        </div>
      </div>

      <div class="rounded-xl shadow-sm p-5 transition-all duration-200 hover:shadow-md"
           :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">总计未处理</h3>
            <p class="text-2xl font-bold mt-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-800'">
              {{ unhandledCount }}
            </p>
          </div>
          <div class="p-2 rounded-md" :class="isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'">
            <Icon icon="mdi:bell" class="h-6 w-6" :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'" />
          </div>
        </div>
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
                placeholder="搜索告警..."
                class="pl-10 pr-4 py-2 w-full rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
            />
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <select
              v-model="severityFilter"
              class="px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
          >
            <option value="all">全部级别</option>
            <option value="high">高危</option>
            <option value="medium">中危</option>
            <option value="low">低危</option>
          </select>
          <select
              v-model="statusFilter"
              class="px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
          >
            <option value="all">全部状态</option>
            <option value="unhandled">未处理</option>
            <option value="handling">处理中</option>
            <option value="resolved">已解决</option>
            <option value="ignored">已忽略</option>
          </select>
          <select
              v-model="timeFilter"
              class="px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
          >
            <option value="24h">最近24小时</option>
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="all">全部时间</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" :class="isDarkMode ? 'border-blue-400' : 'border-blue-600'"></div>
    </div>

    <!-- 告警列表 -->
    <div v-else-if="filteredAlerts.length > 0" class="rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md mb-6"
         :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y" :class="isDarkMode ? 'divide-gray-700' : 'divide-gray-200'">
          <thead :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              级别
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              告警类型
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              来源
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              时间
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              状态
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              操作
            </th>
          </tr>
          </thead>
          <tbody :class="isDarkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'">
          <tr v-for="alert in paginatedAlerts" :key="alert.id"
              class="transition-colors duration-150"
              :class="[
                  isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50',
                  !alert.read ? (isDarkMode ? 'bg-gray-700/30' : 'bg-blue-50/40') : ''
                ]">
            <td class="px-6 py-4 whitespace-nowrap">
                <span
                    class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="alertSeverityClass(alert.severity)"
                >
                  {{ alertSeverityText(alert.severity) }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              <div class="flex items-center">
                  <span v-if="!alert.read" class="inline-block w-2 h-2 rounded-full mr-2"
                        :class="isDarkMode ? 'bg-blue-400' : 'bg-blue-500'"></span>
                {{ alert.type }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ alert.source }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ formatDate(alert.timestamp) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span
                    class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="alertStatusClass(alert.status)"
                >
                  {{ alertStatusText(alert.status) }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
              <div class="flex justify-end space-x-2">
                <button @click="viewAlertDetails(alert)"
                        class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <Icon icon="mdi:information-outline" class="h-5 w-5" />
                </button>
                <button v-if="alert.status === 'unhandled'" @click="setAlertStatus(alert, 'handling')"
                        class="text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300">
                  <Icon icon="mdi:progress-wrench" class="h-5 w-5" />
                </button>
                <button v-if="['unhandled', 'handling'].includes(alert.status)" @click="setAlertStatus(alert, 'resolved')"
                        class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                  <Icon icon="mdi:check-circle" class="h-5 w-5" />
                </button>
                <button v-if="alert.status === 'unhandled'" @click="setAlertStatus(alert, 'ignored')"
                        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <Icon icon="mdi:bell-off" class="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="px-6 py-3 flex items-center justify-between border-t" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
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
      <Icon icon="mdi:shield-check" class="h-16 w-16 mx-auto" :class="isDarkMode ? 'text-gray-600' : 'text-gray-400'" />
      <h3 class="mt-4 text-lg font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
        暂无告警信息
      </h3>
      <p class="mt-2 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
        当前没有符合筛选条件的安全告警
      </p>
    </div>

    <!-- 告警详情模态框 -->
    <div v-if="showAlertModal" class="fixed inset-0 flex items-center justify-center z-50" @click.self="closeAlertModal">
      <div class="fixed inset-0 bg-black opacity-50"></div>
      <div class="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 md:mx-auto"
           :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'">
        <button @click="closeAlertModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <Icon icon="mdi:close" class="h-6 w-6" />
        </button>

        <div v-if="selectedAlert" class="space-y-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 mr-4">
              <div class="p-2 rounded-full"
                   :class="alertSeverityIconClass(selectedAlert.severity)">
                <Icon :icon="alertSeverityIcon(selectedAlert.severity)" class="h-6 w-6" />
              </div>
            </div>
            <div>
              <h2 class="text-xl font-bold">{{ selectedAlert.type }}</h2>
              <span
                  class="mt-1 px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="alertSeverityClass(selectedAlert.severity)"
              >
                {{ alertSeverityText(selectedAlert.severity) }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
            <div class="space-y-2">
              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">告警 ID:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ selectedAlert.id }}
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">来源:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ selectedAlert.source }}
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">目标:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ selectedAlert.target || 'N/A' }}
                </p>
              </div>
            </div>

            <div class="space-y-2">
              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">时间:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ formatDate(selectedAlert.timestamp, true) }}
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">当前状态:</span>
                <p>
                  <span
                      class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="alertStatusClass(selectedAlert.status)"
                  >
                    {{ alertStatusText(selectedAlert.status) }}
                  </span>
                </p>
              </div>

              <div v-if="selectedAlert.handledBy">
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">处理人:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ selectedAlert.handledBy }}
                </p>
              </div>
            </div>
          </div>

          <div>
            <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">告警描述:</span>
            <p class="mt-1 text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ selectedAlert.description }}
            </p>
          </div>

          <div v-if="selectedAlert.details">
            <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">详细信息:</span>
            <pre class="mt-1 p-3 text-xs overflow-x-auto rounded"
                 :class="isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'">{{ selectedAlert.details }}</pre>
          </div>

          <div v-if="selectedAlert.solution">
            <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">建议解决方案:</span>
            <p class="mt-1 text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ selectedAlert.solution }}
            </p>
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-end gap-3 pt-4 border-t" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
            <button v-if="selectedAlert.status === 'unhandled'"
                    @click="setAlertStatus(selectedAlert, 'ignored')"
                    class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
                    :class="isDarkMode
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            >
              忽略告警
            </button>
            <button v-if="selectedAlert.status === 'unhandled'"
                    @click="setAlertStatus(selectedAlert, 'handling')"
                    class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
                    :class="isDarkMode
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-orange-600 text-white hover:bg-orange-500'"
            >
              开始处理
            </button>
            <button v-if="['unhandled', 'handling'].includes(selectedAlert.status)"
                    @click="setAlertStatus(selectedAlert, 'resolved')"
                    class="px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-green-600 text-white hover:bg-green-700"
            >
              标记为已解决
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
const severityFilter = ref('all');
const statusFilter = ref('all');
const timeFilter = ref('24h');

// 分页
const currentPage = ref(1);
const pageSize = ref(10);

// 告警列表和选择的告警
const alerts = ref([]);
const selectedAlert = ref(null);
const showAlertModal = ref(false);

// 告警数量统计
const highSeverityCount = computed(() => alerts.value.filter(alert => alert.severity === 'high').length);
const mediumSeverityCount = computed(() => alerts.value.filter(alert => alert.severity === 'medium').length);
const unhandledCount = computed(() => alerts.value.filter(alert => alert.status === 'unhandled').length);
const unreadAlertsCount = computed(() => alerts.value.filter(alert => !alert.read).length);

// 过滤后的告警
const filteredAlerts = computed(() => {
  let result = alerts.value.filter(alert => {
    // 级别过滤
    if (severityFilter.value !== 'all' && alert.severity !== severityFilter.value) {
      return false;
    }

    // 状态过滤
    if (statusFilter.value !== 'all' && alert.status !== statusFilter.value) {
      return false;
    }

    // 时间过滤
    if (timeFilter.value !== 'all') {
      const now = new Date();
      const alertDate = new Date(alert.timestamp);
      let timeLimit;

      switch(timeFilter.value) {
        case '24h':
          timeLimit = 24 * 60 * 60 * 1000; // 24小时
          break;
        case '7d':
          timeLimit = 7 * 24 * 60 * 60 * 1000; // 7天
          break;
        case '30d':
          timeLimit = 30 * 24 * 60 * 60 * 1000; // 30天
          break;
      }

      if ((now - alertDate) > timeLimit) {
        return false;
      }
    }

    // 搜索查询
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      return alert.type.toLowerCase().includes(query) ||
          alert.source.toLowerCase().includes(query) ||
          alert.description.toLowerCase().includes(query);
    }

    return true;
  });

  // 按时间降序排序
  result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return result;
});

// 分页结果
const paginatedAlerts = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return filteredAlerts.value.slice(startIndex, startIndex + pageSize.value);
});

// 总项目数和总页数
const totalItems = computed(() => filteredAlerts.value.length);
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

// 告警级别样式
const alertSeverityClass = (severity) => {
  if (isDarkMode.value) {
    const darkSeverityMap = {
      'high': 'bg-red-900 text-red-300',
      'medium': 'bg-orange-900 text-orange-300',
      'low': 'bg-yellow-900 text-yellow-300',
    };
    return darkSeverityMap[severity] || 'bg-gray-700 text-gray-300';
  } else {
    const lightSeverityMap = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-orange-100 text-orange-800',
      'low': 'bg-yellow-100 text-yellow-800',
    };
    return lightSeverityMap[severity] || 'bg-gray-100 text-gray-800';
  }
};

// 告警级别图标样式
const alertSeverityIconClass = (severity) => {
  if (isDarkMode.value) {
    const darkIconMap = {
      'high': 'bg-red-900/30 text-red-400',
      'medium': 'bg-orange-900/30 text-orange-400',
      'low': 'bg-yellow-900/30 text-yellow-400',
    };
    return darkIconMap[severity] || 'bg-gray-700 text-gray-400';
  } else {
    const lightIconMap = {
      'high': 'bg-red-100 text-red-500',
      'medium': 'bg-orange-100 text-orange-500',
      'low': 'bg-yellow-100 text-yellow-500',
    };
    return lightIconMap[severity] || 'bg-gray-100 text-gray-500';
  }
};

// 告警级别图标
const alertSeverityIcon = (severity) => {
  const iconMap = {
    'high': 'mdi:alert-circle',
    'medium': 'mdi:alert',
    'low': 'mdi:alert-outline',
  };
  return iconMap[severity] || 'mdi:information-outline';
};

// 告警级别文本
const alertSeverityText = (severity) => {
  const textMap = {
    'high': '高危',
    'medium': '中危',
    'low': '低危',
  };
  return textMap[severity] || severity;
};

// 告警状态样式
const alertStatusClass = (status) => {
  if (isDarkMode.value) {
    const darkStatusMap = {
      'unhandled': 'bg-blue-900 text-blue-300',
      'handling': 'bg-orange-900 text-orange-300',
      'resolved': 'bg-green-900 text-green-300',
      'ignored': 'bg-gray-700 text-gray-300',
    };
    return darkStatusMap[status] || 'bg-gray-700 text-gray-300';
  } else {
    const lightStatusMap = {
      'unhandled': 'bg-blue-100 text-blue-800',
      'handling': 'bg-orange-100 text-orange-800',
      'resolved': 'bg-green-100 text-green-800',
      'ignored': 'bg-gray-100 text-gray-800',
    };
    return lightStatusMap[status] || 'bg-gray-100 text-gray-800';
  }
};

// 告警状态文本
const alertStatusText = (status) => {
  const statusMap = {
    'unhandled': '未处理',
    'handling': '处理中',
    'resolved': '已解决',
    'ignored': '已忽略',
  };
  return statusMap[status] || status;
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

  // 简化显示，今天的告警只显示时间，非今天的显示日期
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

// 查看告警详情
const viewAlertDetails = (alert) => {
  // 标记为已读
  if (!alert.read) {
    alert.read = true;
    saveAlerts();
  }

  selectedAlert.value = alert;
  showAlertModal.value = true;
};

// 关闭告警详情模态框
const closeAlertModal = () => {
  showAlertModal.value = false;
};

// 设置告警状态
const setAlertStatus = (alert, newStatus) => {
  alert.status = newStatus;
  alert.read = true;

  if (['handling', 'resolved'].includes(newStatus)) {
    alert.handledBy = '当前用户'; // 实际应用中应该使用登录用户的名称
    alert.handledAt = new Date().toISOString();
  }

  saveAlerts();

  // 如果是在模态框中修改的状态，关闭模态框
  if (showAlertModal.value) {
    closeAlertModal();
  }
};

// 标记所有未读为已读
const markAllAsRead = () => {
  alerts.value.forEach(alert => {
    if (!alert.read) {
      alert.read = true;
    }
  });
  saveAlerts();
};

// 保存告警到localStorage
const saveAlerts = () => {
  localStorage.setItem('securityAlerts', JSON.stringify(alerts.value));
};

// 导出告警
const exportAlerts = () => {
  const dataStr = JSON.stringify(filteredAlerts.value, null, 2);
  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportName = `security-alerts-${new Date().toISOString().split('T')[0]}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportName);
  linkElement.click();
};

// 刷新告警
const refreshAlerts = async () => {
  loading.value = true;
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 重新加载数据
    await loadAlerts();
  } finally {
    loading.value = false;
  }
};

// 加载告警数据
const loadAlerts = async () => {
  try {
    // 模拟从API获取数据
    // 在实际应用中，这里应该是一个API调用
    await new Promise(resolve => setTimeout(resolve, 800));

    // 尝试从localStorage获取保存的告警
    const savedAlerts = localStorage.getItem('securityAlerts');

    if (savedAlerts) {
      alerts.value = JSON.parse(savedAlerts);
    } else {
      // 生成模拟告警数据
      generateMockAlerts();
    }
  } catch (error) {
    console.error('获取安全告警失败:', error);
    // 添加错误处理逻辑
  }
};

// 生成模拟告警数据
const generateMockAlerts = () => {
  const alertTypes = [
    { type: '端口扫描尝试', severity: 'medium', solution: '检查防火墙规则，阻止来自该IP的所有流量' },
    { type: 'SSH暴力破解', severity: 'high', solution: '启用SSH密钥认证，禁用密码登录，限制SSH访问IP' },
    { type: '未授权访问尝试', severity: 'high', solution: '确认相关账户安全，更改密码，检查日志查找更多证据' },
    { type: '可疑流量模式', severity: 'medium', solution: '分析网络流量模式，设置流量限制规则' },
    { type: 'DDoS攻击尝试', severity: 'high', solution: '启用DDoS防护，配置流量清洗，联系网络服务提供商' },
    { type: '恶意软件检测', severity: 'high', solution: '隔离受影响系统，运行完整系统扫描，更新防病毒软件' },
    { type: '异常登录位置', severity: 'medium', solution: '验证用户身份，如有必要重置密码并启用双因素认证' },
    { type: '系统文件更改', severity: 'low', solution: '验证更改的合法性，恢复备份，检查是否有其他异常' },
    { type: 'DNS请求异常', severity: 'low', solution: '检查DNS设置，监控流量，查找可能的数据泄露迹象' },
    { type: '加密流量异常', severity: 'medium', solution: '检查SSL证书，审核加密通信，寻找可能的隐蔽通道' }
  ];

  const statusOptions = ['unhandled', 'handling', 'resolved', 'ignored'];
  const mockAlerts = [];

  // 生成过去30天内的随机告警
  const now = new Date();

  for (let i = 0; i < 25; i++) {
    const randomDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const alertTypeIndex = Math.floor(Math.random() * alertTypes.length);
    const alertType = alertTypes[alertTypeIndex];
    const status = i < 10 ? 'unhandled' : statusOptions[Math.floor(Math.random() * statusOptions.length)];

    const ipOctet1 = Math.floor(Math.random() * 255);
    const ipOctet2 = Math.floor(Math.random() * 255);
    const sourceIP = `${ipOctet1}.${ipOctet2}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

    mockAlerts.push({
      id: `alert-${Date.now()}-${i}`,
      type: alertType.type,
      severity: alertType.severity,
      source: sourceIP,
      target: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      timestamp: randomDate.toISOString(),
      status: status,
      read: status !== 'unhandled',
      description: `检测到来自 ${sourceIP} 的${alertType.type}，这可能表明有攻击者正在尝试探测系统漏洞。`,
      details: JSON.stringify({
        attempts: Math.floor(Math.random() * 100) + 1,
        duration: `${Math.floor(Math.random() * 10) + 1} 分钟`,
        targetPorts: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => Math.floor(Math.random() * 65535))
      }, null, 2),
      solution: alertType.solution,
      handledBy: status === 'unhandled' ? null : '系统管理员',
      handledAt: status === 'unhandled' ? null : new Date(randomDate.getTime() + Math.random() * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  alerts.value = mockAlerts;
  saveAlerts();
};

// 组件挂载时加载数据
onMounted(async () => {
  try {
    await loadAlerts();
  } finally {
    loading.value = false;
  }
});
</script>
