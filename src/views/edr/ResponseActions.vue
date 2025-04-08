<template>
  <div>
    <!-- 页面标题和操作栏 -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
      <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
        EDR响应操作
      </h1>
      <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
        <button
            @click="createPlaybook"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'"
        >
          <Icon icon="mdi:book-plus" class="mr-2 h-5 w-5" />
          创建响应预案
        </button>
        <button
            @click="batchResponse"
            :disabled="selectedEvents.length === 0"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="[selectedEvents.length === 0 ?
                     (isDarkMode ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-500 cursor-not-allowed') :
                     (isDarkMode ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-600 text-white hover:bg-green-500')]"
        >
          <Icon icon="mdi:check-all" class="mr-2 h-5 w-5" />
          批量处理 ({{ selectedEvents.length }})
        </button>
        <button
            @click="refreshEvents"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'"
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
                placeholder="搜索事件..."
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
            <option value="pending">待处理</option>
            <option value="in-progress">处理中</option>
            <option value="completed">已完成</option>
            <option value="failed">失败</option>
          </select>
          <select
              v-model="severityFilter"
              class="px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
          >
            <option value="all">全部严重性</option>
            <option value="critical">严重</option>
            <option value="high">高危</option>
            <option value="medium">中危</option>
            <option value="low">低危</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 快速操作和统计 -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="rounded-xl shadow-sm p-4"
           :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="flex items-center">
          <div class="p-3 rounded-full" :class="isDarkMode ? 'bg-red-900/30' : 'bg-red-100'">
            <Icon icon="mdi:alert-circle" class="h-6 w-6" :class="isDarkMode ? 'text-red-400' : 'text-red-600'" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
              待处理事件
            </p>
            <p class="text-xl font-semibold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
              {{ stats.pendingCount }}
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-xl shadow-sm p-4"
           :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="flex items-center">
          <div class="p-3 rounded-full" :class="isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'">
            <Icon icon="mdi:progress-clock" class="h-6 w-6" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
              处理中事件
            </p>
            <p class="text-xl font-semibold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
              {{ stats.inProgressCount }}
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-xl shadow-sm p-4"
           :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="flex items-center">
          <div class="p-3 rounded-full" :class="isDarkMode ? 'bg-green-900/30' : 'bg-green-100'">
            <Icon icon="mdi:check-circle" class="h-6 w-6" :class="isDarkMode ? 'text-green-400' : 'text-green-600'" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
              自动响应率
            </p>
            <p class="text-xl font-semibold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
              {{ stats.autoResponseRate }}%
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-xl shadow-sm p-4"
           :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="flex items-center">
          <div class="p-3 rounded-full" :class="isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'">
            <Icon icon="mdi:chart-timeline-variant" class="h-6 w-6" :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
              平均响应时间
            </p>
            <p class="text-xl font-semibold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
              {{ stats.avgResponseTime }}分钟
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" :class="isDarkMode ? 'border-blue-400' : 'border-blue-600'"></div>
    </div>

    <!-- 事件列表 -->
    <div v-else-if="filteredEvents.length > 0" class="mb-6">
      <div class="rounded-xl shadow-sm overflow-hidden"
           :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y" :class="isDarkMode ? 'divide-gray-700' : 'divide-gray-200'">
            <thead :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
            <tr>
              <th scope="col" class="pl-4 py-3 text-left">
                <div class="flex items-center">
                  <input id="selectAll" type="checkbox"
                         :checked="selectedEvents.length === filteredEvents.length && filteredEvents.length > 0"
                         @change="toggleSelectAll"
                         class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                         :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''" />
                </div>
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
                事件名称
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
                终端
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
                严重性
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
                状态
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
                发现时间
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                  :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
                操作
              </th>
            </tr>
            </thead>
            <tbody :class="isDarkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'">
            <tr v-for="event in displayedEvents" :key="event.id"
                class="transition-colors duration-150"
                :class="isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'">
              <td class="pl-4 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <input :id="`select-${event.id}`"
                         type="checkbox"
                         :value="event.id"
                         v-model="selectedEvents"
                         class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                         :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''"
                         :disabled="event.status === 'completed'" />
                </div>
              </td>
              <td class="px-6 py-4" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                <div class="flex items-start">
                  <Icon :icon="getEventTypeIcon(event.type)" class="h-5 w-5 mt-0.5 mr-2"
                        :class="getEventTypeIconColor(event.type)" />
                  <div>
                    <div class="text-sm font-medium">{{ event.name }}</div>
                    <div class="text-xs" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                      {{ event.description }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                <div class="flex items-center">
                  <Icon :icon="getOsIcon(event.endpoint.os)" class="h-5 w-5 mr-2" />
                  {{ event.endpoint.name }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="getSeverityClass(event.severity)">
                    {{ getSeverityText(event.severity) }}
                  </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="getStatusClass(event.status)">
                    {{ getStatusText(event.status) }}
                  </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                {{ formatDate(event.detectedAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <div class="flex justify-end items-center space-x-3">
                  <button v-if="event.status !== 'completed'" @click="respondToEvent(event)"
                          :class="isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'">
                    <Icon icon="mdi:shield-check" class="h-5 w-5" />
                  </button>
                  <button @click="viewEventDetails(event)"
                          :class="isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'">
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
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-20 rounded-xl shadow-sm"
         :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
      <Icon icon="mdi:shield-check" class="h-16 w-16 mx-auto" :class="isDarkMode ? 'text-gray-600' : 'text-gray-400'" />
      <h3 class="mt-4 text-lg font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
        暂无事件记录
      </h3>
      <p class="mt-2 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
        没有找到需要响应的事件或所有事件已处理完成
      </p>
    </div>

    <!-- 响应预案模态框 -->
    <div v-if="showPlaybookModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50" @click="closePlaybookModal"></div>
      <div class="relative p-6 rounded-lg shadow-xl max-w-md w-full mx-4 md:mx-auto"
           :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'">
        <button @click="closePlaybookModal"
                :class="isDarkMode ? 'absolute top-4 right-4 text-gray-400 hover:text-gray-300' : 'absolute top-4 right-4 text-gray-400 hover:text-gray-600'">
          <Icon icon="mdi:close" class="h-6 w-6" />
        </button>

        <h2 class="text-xl font-bold mb-6">创建响应预案</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              预案名称
            </label>
            <input
                v-model="newPlaybook.name"
                type="text"
                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                placeholder="输入预案名称"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              触发条件
            </label>
            <select
                v-model="newPlaybook.trigger"
                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
            >
              <option value="malware">检测到恶意软件</option>
              <option value="ransomware">检测到勒索软件</option>
              <option value="network">异常网络连接</option>
              <option value="behavior">可疑行为</option>
              <option value="manual">手动触发</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              响应行动
            </label>
            <div class="space-y-2 mt-2">
              <div class="flex items-center">
                <input id="action-isolate" v-model="newPlaybook.actions" value="isolate" type="checkbox"
                       class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                       :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''" />
                <label for="action-isolate" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  隔离终端
                </label>
              </div>
              <div class="flex items-center">
                <input id="action-kill-process" v-model="newPlaybook.actions" value="kill-process" type="checkbox"
                       class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                       :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''" />
                <label for="action-kill-process" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  终止进程
                </label>
              </div>
              <div class="flex items-center">
                <input id="action-delete-file" v-model="newPlaybook.actions" value="delete-file" type="checkbox"
                       class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                       :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''" />
                <label for="action-delete-file" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  删除文件
                </label>
              </div>
              <div class="flex items-center">
                <input id="action-block-ip" v-model="newPlaybook.actions" value="block-ip" type="checkbox"
                       class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                       :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''" />
                <label for="action-block-ip" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  阻止IP
                </label>
              </div>
              <div class="flex items-center">
                <input id="action-notify" v-model="newPlaybook.actions" value="notify" type="checkbox"
                       class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                       :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''" />
                <label for="action-notify" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  通知管理员
                </label>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              自动执行
            </label>
            <div class="flex items-center mt-1">
              <input id="auto-execute" v-model="newPlaybook.autoExecute" type="checkbox"
                     class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                     :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''" />
              <label for="auto-execute" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                检测到符合条件时自动执行
              </label>
            </div>
          </div>

          <div class="pt-4 flex justify-end">
            <button
                @click="savePlaybook"
                class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
                :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'"
            >
              <Icon icon="mdi:check" class="mr-2 h-5 w-5" />
              保存预案
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 事件详情模态框 -->
    <div v-if="showEventModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50" @click="closeEventModal"></div>
      <div class="relative p-6 rounded-lg shadow-xl max-w-3xl w-full mx-4 md:mx-auto"
           :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'">
        <button @click="closeEventModal"
                :class="isDarkMode ? 'absolute top-4 right-4 text-gray-400 hover:text-gray-300' : 'absolute top-4 right-4 text-gray-400 hover:text-gray-600'">
          <Icon icon="mdi:close" class="h-6 w-6" />
        </button>

        <h2 class="text-xl font-bold mb-6">事件详情</h2>

        <div v-if="selectedEvent" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">事件名称:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ selectedEvent.name }}
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">事件类型:</span>
                <p class="text-sm flex items-center" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  <Icon :icon="getEventTypeIcon(selectedEvent.type)" class="mr-2 h-5 w-5" :class="getEventTypeIconColor(selectedEvent.type)" />
                  {{ getEventTypeText(selectedEvent.type) }}
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">严重性:</span>
                <p>
                  <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="getSeverityClass(selectedEvent.severity)">
                    {{ getSeverityText(selectedEvent.severity) }}
                  </span>
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">状态:</span>
                <p>
                  <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="getStatusClass(selectedEvent.status)">
                    {{ getStatusText(selectedEvent.status) }}
                  </span>
                </p>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">受影响终端:</span>
                <p class="text-sm flex items-center" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  <Icon :icon="getOsIcon(selectedEvent.endpoint.os)" class="mr-2 h-5 w-5" />
                  {{ selectedEvent.endpoint.name }} ({{ selectedEvent.endpoint.ip }})
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">检测时间:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ formatDate(selectedEvent.detectedAt, true) }}
                </p>
              </div>

              <div v-if="selectedEvent.status !== 'pending'">
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">响应时间:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ formatDate(selectedEvent.responseAt, true) }}
                </p>
              </div>

              <div v-if="selectedEvent.respondedBy">
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">响应者:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ selectedEvent.respondedBy === 'auto' ? '自动响应' : selectedEvent.respondedBy }}
                </p>
              </div>
            </div>
          </div>

          <div>
            <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">详细描述:</span>
            <p class="text-sm mt-2 whitespace-pre-line" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ selectedEvent.description }}
            </p>
          </div>

          <div v-if="selectedEvent.indicators && selectedEvent.indicators.length > 0">
            <span class="text-sm font-medium mb-2 block" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">威胁指标:</span>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div v-for="(indicator, index) in selectedEvent.indicators" :key="index"
                   class="p-3 rounded-lg border"
                   :class="isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'">
                <div class="flex justify-between items-center">
                  <div class="flex items-center">
                    <Icon :icon="getIndicatorIcon(indicator.type)" class="h-5 w-5 mr-2"
                          :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'" />
                    <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                      {{ indicator.type }}:
                    </span>
                  </div>
                  <button class="text-xs px-2 py-0.5 rounded"
                          :class="isDarkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-600 text-white hover:bg-red-500'">
                    阻止
                  </button>
                </div>
                <p class="mt-1 text-sm ml-7" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ indicator.value }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="selectedEvent.takingActions && selectedEvent.takingActions.length > 0">
            <span class="text-sm font-medium mb-2 block" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">已采取的措施:</span>
            <div class="space-y-2">
              <div v-for="(action, index) in selectedEvent.takingActions" :key="index"
                   class="p-3 rounded-lg border flex items-center"
                   :class="isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'">
                <Icon :icon="getActionIcon(action.type)" class="h-5 w-5 mr-3"
                      :class="action.status === 'success' ?
                            (isDarkMode ? 'text-green-400' : 'text-green-600') :
                            (isDarkMode ? 'text-red-400' : 'text-red-600')" />
                <div>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                    {{ getActionText(action.type) }}: {{ action.detail }}
                  </p>
                  <p class="text-xs mt-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                    {{ formatDate(action.timestamp) }} -
                    {{ action.status === 'success' ? '成功' : '失败' }}
                    {{ action.status !== 'success' && action.error ? `: ${action.error}` : '' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedEvent.status === 'pending' || selectedEvent.status === 'in-progress'" class="flex justify-end space-x-3">
            <button @click="respondToEvent(selectedEvent)"
                    class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
                    :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'">
              <Icon icon="mdi:shield-check" class="mr-2 h-5 w-5" />
              响应处理
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 响应操作模态框 -->
    <div v-if="showResponseModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50" @click="closeResponseModal"></div>
      <div class="relative p-6 rounded-lg shadow-xl max-w-xl w-full mx-4 md:mx-auto"
           :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'">
        <button @click="closeResponseModal"
                :class="isDarkMode ? 'absolute top-4 right-4 text-gray-400 hover:text-gray-300' : 'absolute top-4 right-4 text-gray-400 hover:text-gray-600'">
          <Icon icon="mdi:close" class="h-6 w-6" />
        </button>

        <h2 class="text-xl font-bold mb-6">响应处理</h2>

        <div v-if="responseTarget" class="space-y-6">
          <div>
            <h3 class="text-md font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              事件信息
            </h3>
            <div class="relative p-6 rounded-lg shadow-xl max-w-xl w-full mx-4 md:mx-auto"
                 :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <Icon :icon="getEventTypeIcon(responseTarget.type)" class="h-5 w-5 mr-2"
                        :class="getEventTypeIconColor(responseTarget.type)" />
                  <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    {{ responseTarget.name }}
                  </span>
                </div>
                <span class="px-2 py-0.5 text-xs leading-none font-semibold rounded-full"
                      :class="getSeverityClass(responseTarget.severity)">
                  {{ getSeverityText(responseTarget.severity) }}
                </span>
              </div>
              <p class="mt-2 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                {{ responseTarget.description.substring(0, 120) }}{{ responseTarget.description.length > 120 ? '...' : '' }}
              </p>
              <div class="mt-2 flex items-center">
                <Icon :icon="getOsIcon(responseTarget.endpoint.os)" class="h-4 w-4 mr-1" />
                <span class="text-xs" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                  {{ responseTarget.endpoint.name }} ({{ responseTarget.endpoint.ip }})
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-md font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              可用响应方案
            </h3>
            <div class="space-y-3">
              <div class="flex items-center">
                <input id="response-isolate" v-model="selectedResponses" value="isolate" type="checkbox"
                       class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                       :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''" />
                <label for="response-isolate" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  网络隔离 - 断开终端网络连接，防止威胁扩散
                </label>
              </div>

              <div class="flex items-center">
                <input id="response-kill" v-model="selectedResponses" value="kill-process" type="checkbox"
                       class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                       :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''" />
                <label for="response-kill" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  终止进程 - 结束与威胁相关的可疑进程
                </label>
              </div>

              <div class="flex items-center">
                <input id="response-delete" v-model="selectedResponses" value="delete-file" type="checkbox"
                       class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                       :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''" />
                <label for="response-delete" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  删除文件 - 移除恶意文件
                </label>
              </div>

              <div class="flex items-center">
                <input id="response-block" v-model="selectedResponses" value="block-ip" type="checkbox"
                       class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                       :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''" />
                <label for="response-block" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  阻止连接 - 阻止与恶意IP/域的通信
                </label>
              </div>

              <div class="flex items-center">
                <input id="response-scan" v-model="selectedResponses" value="full-scan" type="checkbox"
                       class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                       :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''" />
                <label for="response-scan" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  完全扫描 - 对终端执行全面安全扫描
                </label>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              备注信息
            </label>
            <textarea
                v-model="responseNote"
                rows="3"
                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                placeholder="添加响应备注信息"
            ></textarea>
          </div>

          <div class="pt-4 flex justify-end space-x-3">
            <button @click="closeResponseModal"
                    class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
                    :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'">
              取消
            </button>
            <button @click="executeResponse"
                    class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
                    :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'"
                    :disabled="selectedResponses.length === 0">
              <Icon icon="mdi:shield-check" class="mr-2 h-5 w-5" />
              执行响应
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 批量响应模态框 -->
    <div v-if="showBatchModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50" @click="closeBatchModal"></div>
      <div class="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-xl w-full mx-4 md:mx-auto"
           :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'">
        <button @click="closeBatchModal"
                :class="isDarkMode ? 'absolute top-4 right-4 text-gray-400 hover:text-gray-300' : 'absolute top-4 right-4 text-gray-400 hover:text-gray-600'">
          <Icon icon="mdi:close" class="h-6 w-6" />
        </button>

        <h2 class="text-xl font-bold mb-6">批量响应处理</h2>

        <div class="space-y-6">
          <div>
            <h3 class="text-md font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              已选事件
            </h3>
            <div class="p-4 rounded-lg border max-h-40 overflow-y-auto"
                 :class="isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'">
              <div v-for="id in selectedEvents" :key="id" class="flex items-center mb-2 last:mb-0">
                <Icon icon="mdi:shield-alert" class="h-4 w-4 mr-2"
                      :class="isDarkMode ? 'text-amber-400' : 'text-amber-600'" />
                <span class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  {{ getEventById(id)?.name || id }}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-md font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              批量响应方案
            </h3>
            <div class="space-y-3">
              <div class="flex items-center">
                <input id="batch-isolate" v-model="batchSelectedResponses" value="isolate" type="checkbox"
                       class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                       :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''" />
                <label for="batch-isolate" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  网络隔离 - 断开所有选中终端的网络连接
                </label>
              </div>

              <div class="flex items-center">
                <input id="batch-kill" v-model="batchSelectedResponses" value="kill-process" type="checkbox"
                       class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                       :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''" />
                <label for="batch-kill" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  终止进程 - 结束所有选中事件相关的可疑进程
                </label>
              </div>

              <div class="flex items-center">
                <input id="batch-scan" v-model="batchSelectedResponses" value="full-scan" type="checkbox"
                       class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                       :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''" />
                <label for="batch-scan" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  完全扫描 - 对所有选中终端执行全面安全扫描
                </label>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              批量响应备注
            </label>
            <textarea
                v-model="batchResponseNote"
                rows="3"
                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                placeholder="添加批量响应备注信息"
            ></textarea>
          </div>

          <div class="pt-4 flex justify-end space-x-3">
            <button @click="closeBatchModal"
                    class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
                    :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'">
              取消
            </button>
            <button @click="executeBatchResponse"
                    class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
                    :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'"
                    :disabled="batchSelectedResponses.length === 0">
              <Icon icon="mdi:shield-check" class="mr-2 h-5 w-5" />
              执行批量响应
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

// 事件列表
const events = ref([]);
const selectedEvents = ref([]);

// 统计数据
const stats = ref({
  pendingCount: 0,
  inProgressCount: 0,
  autoResponseRate: 0,
  avgResponseTime: 0
});

// 搜索和过滤
const searchQuery = ref('');
const statusFilter = ref('all');
const severityFilter = ref('all');

// 分页
const currentPage = ref(1);
const pageSize = ref(10);

// 模态框状态
const showPlaybookModal = ref(false);
const showEventModal = ref(false);
const showResponseModal = ref(false);
const showBatchModal = ref(false);

// 选中的事件
const selectedEvent = ref(null);
const responseTarget = ref(null);

// 新预案
const newPlaybook = ref({
  name: '',
  trigger: 'malware',
  actions: [],
  autoExecute: false
});

// 响应选择
const selectedResponses = ref([]);
const responseNote = ref('');

// 批量响应选择
const batchSelectedResponses = ref([]);
const batchResponseNote = ref('');

// 过滤后的事件
const filteredEvents = computed(() => {
  let result = events.value.filter(event => {
    // 状态过滤
    if (statusFilter.value !== 'all' && event.status !== statusFilter.value) {
      return false;
    }

    // 严重性过滤
    if (severityFilter.value !== 'all' && event.severity !== severityFilter.value) {
      return false;
    }

    // 搜索查询
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      return event.name.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.endpoint.name.toLowerCase().includes(query) ||
          event.endpoint.ip.toLowerCase().includes(query);
    }

    return true;
  });

  // 按严重性和检测时间排序
  result.sort((a, b) => {
    // 首先按状态排序
    const statusOrder = {
      'pending': 0,
      'in-progress': 1,
      'completed': 2,
      'failed': 3
    };

    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;

    // 然后按严重性排序
    const severityOrder = {
      'critical': 0,
      'high': 1,
      'medium': 2,
      'low': 3
    };

    const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (severityDiff !== 0) return severityDiff;

    // 最后按检测时间排序，较新的排在前面
    return new Date(b.detectedAt) - new Date(a.detectedAt);
  });

  return result;
});

// 分页计算
const totalItems = computed(() => filteredEvents.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));
const displayedEvents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredEvents.value.slice(start, end);
});

// 根据ID获取事件
const getEventById = (id) => {
  return events.value.find(event => event.id === id);
};

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

// 全选/取消全选事件
const toggleSelectAll = (e) => {
  const isChecked = e.target.checked;

  if (isChecked) {
    // 只选择非完成状态的事件
    selectedEvents.value = filteredEvents.value
        .filter(event => event.status !== 'completed')
        .map(event => event.id);
  } else {
    selectedEvents.value = [];
  }
};

// 获取事件类型图标
const getEventTypeIcon = (type) => {
  const iconMap = {
    'malware': 'mdi:virus',
    'ransomware': 'mdi:lock',
    'network': 'mdi:lan',
    'behavior': 'mdi:account-alert',
    'system': 'mdi:cog',
    'vulnerability': 'mdi:security',
  };
  return iconMap[type] || 'mdi:alert-circle';
};

// 获取事件类型图标颜色
const getEventTypeIconColor = (type) => {
  if (isDarkMode.value) {
    const darkMap = {
      'malware': 'text-red-400',
      'ransomware': 'text-purple-400',
      'network': 'text-blue-400',
      'behavior': 'text-amber-400',
      'system': 'text-gray-400',
      'vulnerability': 'text-orange-400',
    };
    return darkMap[type] || 'text-gray-400';
  } else {
    const lightMap = {
      'malware': 'text-red-600',
      'ransomware': 'text-purple-600',
      'network': 'text-blue-600',
      'behavior': 'text-amber-600',
      'system': 'text-gray-600',
      'vulnerability': 'text-orange-600',
    };
    return lightMap[type] || 'text-gray-600';
  }
};

// 获取事件类型文本
const getEventTypeText = (type) => {
  const typeMap = {
    'malware': '恶意软件',
    'ransomware': '勒索软件',
    'network': '网络异常',
    'behavior': '可疑行为',
    'system': '系统异常',
    'vulnerability': '漏洞利用',
  };
  return typeMap[type] || type;
};

// 获取操作系统图标
const getOsIcon = (os) => {
  if (os.includes('Windows')) return 'mdi:microsoft-windows';
  if (os.includes('Linux')) return 'mdi:linux';
  if (os.includes('macOS')) return 'mdi:apple';
  return 'mdi:laptop';
};

// 获取严重性样式
const getSeverityClass = (severity) => {
  if (isDarkMode.value) {
    const darkMap = {
      'critical': 'bg-red-900 text-red-300',
      'high': 'bg-orange-900 text-orange-300',
      'medium': 'bg-yellow-900 text-yellow-300',
      'low': 'bg-blue-900 text-blue-300',
    };
    return darkMap[severity] || 'bg-gray-700 text-gray-300';
  } else {
    const lightMap = {
      'critical': 'bg-red-100 text-red-800',
      'high': 'bg-orange-100 text-orange-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-blue-100 text-blue-800',
    };
    return lightMap[severity] || 'bg-gray-100 text-gray-800';
  }
};

// 获取严重性文本
const getSeverityText = (severity) => {
  const severityMap = {
    'critical': '严重',
    'high': '高危',
    'medium': '中危',
    'low': '低危',
  };
  return severityMap[severity] || severity;
};

// 获取状态样式
const getStatusClass = (status) => {
  if (isDarkMode.value) {
    const darkMap = {
      'pending': 'bg-red-900 text-red-300',
      'in-progress': 'bg-yellow-900 text-yellow-300',
      'completed': 'bg-green-900 text-green-300',
      'failed': 'bg-gray-700 text-gray-300',
    };
    return darkMap[status] || 'bg-gray-700 text-gray-300';
  } else {
    const lightMap = {
      'pending': 'bg-red-100 text-red-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'failed': 'bg-gray-100 text-gray-800',
    };
    return lightMap[status] || 'bg-gray-100 text-gray-800';
  }
};

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'pending': '待处理',
    'in-progress': '处理中',
    'completed': '已完成',
    'failed': '失败',
  };
  return statusMap[status] || status;
};

// 获取指标图标
const getIndicatorIcon = (type) => {
  const iconMap = {
    'hash': 'mdi:file-document-outline',
    'ip': 'mdi:ip-network-outline',
    'domain': 'mdi:web',
    'url': 'mdi:link-variant',
    'process': 'mdi:application-cog-outline',
    'registry': 'mdi:registry',
  };
  return iconMap[type] || 'mdi:file-document-outline';
};

// 获取动作图标
const getActionIcon = (type) => {
  const iconMap = {
    'isolate': 'mdi:lan-disconnect',
    'kill-process': 'mdi:stop-circle',
    'delete-file': 'mdi:delete',
    'block-ip': 'mdi:shield',
    'full-scan': 'mdi:scan',
  };
  return iconMap[type] || 'mdi:shield-check';
};

// 获取动作文本
const getActionText = (type) => {
  const actionMap = {
    'isolate': '隔离终端',
    'kill-process': '终止进程',
    'delete-file': '删除文件',
    'block-ip': '阻止IP',
    'full-scan': '完全扫描',
  };
  return actionMap[type] || type;
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

// 创建响应预案
const createPlaybook = () => {
  newPlaybook.value = {
    name: '',
    trigger: 'malware',
    actions: [],
    autoExecute: false
  };
  showPlaybookModal.value = true;
};

// 关闭预案模态框
const closePlaybookModal = () => {
  showPlaybookModal.value = false;
};

// 保存预案
const savePlaybook = () => {
  // 实际应用中这里会调用API保存预案
  alert(`保存响应预案: ${newPlaybook.value.name}`);
  showPlaybookModal.value = false;
};

// 查看事件详情
const viewEventDetails = (event) => {
  selectedEvent.value = event;
  showEventModal.value = true;
};

// 关闭事件详情模态框
const closeEventModal = () => {
  showEventModal.value = false;
};

// 响应处理事件
const respondToEvent = (event) => {
  responseTarget.value = event;
  selectedResponses.value = [];
  responseNote.value = '';
  showResponseModal.value = true;
};

// 关闭响应模态框
const closeResponseModal = () => {
  showResponseModal.value = false;
};

// 执行响应
const executeResponse = () => {
  // 实际应用中这里会调用API执行响应操作
  alert(`对事件 ${responseTarget.value.name} 执行响应操作: ${selectedResponses.value.join(', ')}`);

  // 模拟更新事件状态
  const index = events.value.findIndex(e => e.id === responseTarget.value.id);
  if (index !== -1) {
    events.value[index] = {
      ...events.value[index],
      status: 'in-progress',
      responseAt: new Date().toISOString(),
      respondedBy: '系统管理员',
      takingActions: [
        ...(events.value[index].takingActions || []),
        ...selectedResponses.value.map(action => ({
          type: action,
          detail: action === 'isolate' ? '终端已隔离' :
              action === 'kill-process' ? '终止可疑进程' :
                  action === 'delete-file' ? '删除恶意文件' :
                      action === 'block-ip' ? '阻止恶意IP' :
                          '执行全面扫描',
          timestamp: new Date().toISOString(),
          status: 'success'
        }))
      ]
    };
  }

  // 更新统计数据
  updateStats();

  showResponseModal.value = false;
};

// 批量响应
const batchResponse = () => {
  batchSelectedResponses.value = [];
  batchResponseNote.value = '';
  showBatchModal.value = true;
};

// 关闭批量响应模态框
const closeBatchModal = () => {
  showBatchModal.value = false;
};

// 执行批量响应
const executeBatchResponse = () => {
  // 实际应用中这里会调用API执行批量响应操作
  alert(`对 ${selectedEvents.value.length} 个事件执行批量响应操作: ${batchSelectedResponses.value.join(', ')}`);

  // 模拟更新事件状态
  events.value = events.value.map(event => {
    if (selectedEvents.value.includes(event.id) && event.status !== 'completed') {
      return {
        ...event,
        status: 'in-progress',
        responseAt: new Date().toISOString(),
        respondedBy: '系统管理员',
        takingActions: [
          ...(event.takingActions || []),
          ...batchSelectedResponses.value.map(action => ({
            type: action,
            detail: action === 'isolate' ? '终端已隔离' :
                action === 'kill-process' ? '终止可疑进程' :
                    '执行全面扫描',
            timestamp: new Date().toISOString(),
            status: 'success'
          }))
        ]
      };
    }
    return event;
  });

  // 清空选择
  selectedEvents.value = [];

  // 更新统计数据
  updateStats();

  showBatchModal.value = false;
};

// 刷新事件列表
const refreshEvents = async () => {
  loading.value = true;
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 重新加载数据
    await loadEvents();
  } finally {
    loading.value = false;
  }
};

// 更新统计数据
const updateStats = () => {
  const pendingCount = events.value.filter(e => e.status === 'pending').length;
  const inProgressCount = events.value.filter(e => e.status === 'in-progress').length;

  // 计算自动响应率
  const respondedEvents = events.value.filter(e => e.respondedBy);
  const autoResponses = respondedEvents.filter(e => e.respondedBy === 'auto').length;
  const autoResponseRate = respondedEvents.length ? Math.round((autoResponses / respondedEvents.length) * 100) : 0;

  // 计算平均响应时间（分钟）
  let totalResponseTime = 0;
  let responseCount = 0;

  events.value.forEach(event => {
    if (event.responseAt && event.detectedAt) {
      const detectedTime = new Date(event.detectedAt).getTime();
      const responseTime = new Date(event.responseAt).getTime();
      totalResponseTime += (responseTime - detectedTime) / (1000 * 60); // 转换为分钟
      responseCount++;
    }
  });

  const avgResponseTime = responseCount ? Math.round(totalResponseTime / responseCount) : 0;

  stats.value = {
    pendingCount,
    inProgressCount,
    autoResponseRate,
    avgResponseTime
  };
};

// 加载事件数据
const loadEvents = async () => {
  try {
    // 模拟从API获取数据
    await new Promise(resolve => setTimeout(resolve, 800));

    // 当前时间
    const now = new Date();

    // 生成1小时前的时间
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // 生成3小时前的时间
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);

    // 生成6小时前的时间
    const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);

    // 生成12小时前的时间
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

    // 生成模拟事件数据
    const mockEvents = [
      {
        id: 'event-1',
        name: 'Trojan.Win32.Emotet',
        type: 'malware',
        description: '检测到Emotet木马病毒。Emotet是一种复杂的恶意软件，最初设计为银行木马，现已演变为分发其他恶意软件的服务。它通常通过网络钓鱼邮件中的恶意链接或附件传播。',
        severity: 'critical',
        status: 'pending',
        detectedAt: oneHourAgo.toISOString(),
        endpoint: {
          name: 'DESKTOP-001',
          ip: '192.168.1.101',
          os: 'Windows'
        },
        indicators: [
          { type: 'hash', value: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6' },
          { type: 'process', value: 'C:\\Windows\\System32\\svchost.exe' },
          { type: 'ip', value: '192.168.12.34' }
        ]
      },
      {
        id: 'event-2',
        name: 'Suspicious PowerShell Command',
        type: 'behavior',
        description: '检测到可疑的PowerShell命令执行。该命令尝试下载并执行远程脚本，这是典型的恶意脚本执行行为，可能导致系统被进一步入侵。',
        severity: 'high',
        status: 'in-progress',
        detectedAt: threeHoursAgo.toISOString(),
        responseAt: oneHourAgo.toISOString(),
        respondedBy: '系统管理员',
        endpoint: {
          name: 'DESKTOP-002',
          ip: '192.168.1.102',
          os: 'Windows'
        },
        indicators: [
          { type: 'process', value: 'powershell.exe -EncodedCommand [base64]' },
          { type: 'url', value: 'hxxp://malicious.example.com/script.ps1' }
        ],
        takingActions: [
          {
            type: 'kill-process',
            detail: '终止PowerShell进程',
            timestamp: oneHourAgo.toISOString(),
            status: 'success'
          }
        ]
      },
      {
        id: 'event-3',
        name: 'Ransomware Activity',
        type: 'ransomware',
        description: '检测到潜在的勒索软件活动。观察到大量文件加密操作和可疑进程行为，这些特征与已知的勒索软件攻击模式相符。',
        severity: 'critical',
        status: 'completed',
        detectedAt: sixHoursAgo.toISOString(),
        responseAt: threeHoursAgo.toISOString(),
        respondedBy: 'auto',
        endpoint: {
          name: 'DESKTOP-003',
          ip: '192.168.1.103',
          os: 'Windows'
        },
        indicators: [
          { type: 'hash', value: 'f1e2d3c4b5a6g7h8i9j0k1l2m3n4o5p6' },
          { type: 'process', value: 'C:\\Users\\Admin\\AppData\\Local\\Temp\\ransom.exe' }
        ],
        takingActions: [
          {
            type: 'isolate',
            detail: '终端已隔离',
            timestamp: threeHoursAgo.toISOString(),
            status: 'success'
          },
          {
            type: 'kill-process',
            detail: '终止可疑进程',
            timestamp: threeHoursAgo.toISOString(),
            status: 'success'
          },
          {
            type: 'delete-file',
            detail: '删除恶意文件',
            timestamp: threeHoursAgo.toISOString(),
            status: 'success'
          }
        ]
      },
      {
        id: 'event-4',
        name: 'Suspicious Outbound Connection',
        type: 'network',
        description: '检测到可疑的出站连接。终端尝试连接已知的命令控制(C2)服务器，这可能表明系统已被入侵并正在尝试与远程攻击者建立联系。',
        severity: 'high',
        status: 'pending',
        detectedAt: twelveHoursAgo.toISOString(),
        endpoint: {
          name: 'DESKTOP-004',
          ip: '192.168.1.104',
          os: 'Windows'
        },
        indicators: [
          { type: 'ip', value: '203.0.113.100' },
          { type: 'domain', value: 'badserver.example.com' }
        ]
      },
      {
        id: 'event-5',
        name: 'CVE-2023-1234 Exploitation Attempt',
        type: 'vulnerability',
        description: '检测到针对CVE-2023-1234漏洞的利用尝试。该漏洞存在于Microsoft Exchange服务中，成功利用可能导致远程代码执行。',
        severity: 'medium',
        status: 'pending',
        detectedAt: now.toISOString(),
        endpoint: {
          name: 'SERVER-001',
          ip: '192.168.1.201',
          os: 'Windows'
        },
        indicators: [
          { type: 'url', value: '/ecp/root.web?X-ARR-CACHE-HIT=0' },
          { type: 'process', value: 'w3wp.exe' }
        ]
      }
    ];

    events.value = mockEvents;

    // 更新统计数据
    updateStats();
  } catch (error) {
    console.error('获取事件列表失败:', error);
    // 添加错误处理逻辑
  }
};

// 组件挂载时加载数据
onMounted(async () => {
  try {
    await loadEvents();
  } finally {
    loading.value = false;
  }
});
</script>
