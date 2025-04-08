<template>
  <div>
    <!-- 页面标题和操作栏 -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
      <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
        EDR威胁检测
      </h1>
      <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
        <button
            @click="startScan"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'"
        >
          <Icon icon="mdi:scan" class="mr-2 h-5 w-5" />
          启动扫描
        </button>
        <button
            @click="exportThreats"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'"
        >
          <Icon icon="mdi:download" class="mr-2 h-5 w-5" />
          导出数据
        </button>
        <button
            @click="refreshThreats"
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
                placeholder="搜索威胁..."
                class="pl-10 pr-4 py-2 w-full rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
            />
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <select
              v-model="typeFilter"
              class="px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
          >
            <option value="all">全部类型</option>
            <option value="malware">恶意软件</option>
            <option value="ransomware">勒索软件</option>
            <option value="exploit">漏洞利用</option>
            <option value="pua">可疑应用</option>
            <option value="network">网络威胁</option>
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
          <select
              v-model="statusFilter"
              class="px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
          >
            <option value="all">全部状态</option>
            <option value="active">活跃</option>
            <option value="contained">已隔离</option>
            <option value="remediated">已修复</option>
            <option value="false_positive">误报</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 威胁统计 -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="rounded-xl shadow-sm p-4"
           :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="flex items-center">
          <div class="p-3 rounded-full" :class="isDarkMode ? 'bg-red-900/30' : 'bg-red-100'">
            <Icon icon="mdi:alert-circle" class="h-6 w-6" :class="isDarkMode ? 'text-red-400' : 'text-red-600'" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
              活跃威胁
            </p>
            <p class="text-xl font-semibold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
              {{ stats.activeCount }}
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-xl shadow-sm p-4"
           :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="flex items-center">
          <div class="p-3 rounded-full" :class="isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'">
            <Icon icon="mdi:virus" class="h-6 w-6" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
              已隔离
            </p>
            <p class="text-xl font-semibold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
              {{ stats.containedCount }}
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
              已修复
            </p>
            <p class="text-xl font-semibold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
              {{ stats.remediatedCount }}
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-xl shadow-sm p-4"
           :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="flex items-center">
          <div class="p-3 rounded-full" :class="isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'">
            <Icon icon="mdi:shield-check" class="h-6 w-6" :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
              保护终端
            </p>
            <p class="text-xl font-semibold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
              {{ stats.protectedEndpoints }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" :class="isDarkMode ? 'border-blue-400' : 'border-blue-600'"></div>
    </div>

    <!-- 威胁列表 -->
    <div v-else-if="filteredThreats.length > 0" class="rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md mb-6"
         :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y" :class="isDarkMode ? 'divide-gray-700' : 'divide-gray-200'">
          <thead :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              威胁名称
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              类型
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
              检测时间
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              操作
            </th>
          </tr>
          </thead>
          <tbody :class="isDarkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'">
          <tr v-for="threat in displayedThreats" :key="threat.id"
              class="transition-colors duration-150"
              :class="isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'">
            <td class="px-6 py-4 whitespace-nowrap" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              <div class="flex items-start">
                <Icon :icon="getThreatTypeIcon(threat.type)" class="h-5 w-5 mt-0.5 mr-2"
                      :class="getThreatTypeIconColor(threat.type)" />
                <div>
                  <div class="text-sm font-medium">{{ threat.name }}</div>
                  <div class="text-xs truncate max-w-xs" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                    {{ threat.location }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ getThreatTypeText(threat.type) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              <div class="flex items-center">
                <Icon :icon="getOsIcon(threat.endpoint.os)" class="h-5 w-5 mr-2" />
                {{ threat.endpoint.name }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getSeverityClass(threat.severity)">
                  {{ getSeverityText(threat.severity) }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getStatusClass(threat.status)">
                  {{ getStatusText(threat.status) }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ formatDate(threat.detectedAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
              <div class="flex justify-end items-center space-x-3">
                <!-- 活跃状态才显示操作按钮 -->
                <template v-if="threat.status === 'active'">
                  <button @click="quarantineThreat(threat)"
                          class="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300">
                    <Icon icon="mdi:shield-lock" class="h-5 w-5" />
                  </button>
                  <button @click="removeThreat(threat)"
                          class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                    <Icon icon="mdi:delete-sweep" class="h-5 w-5" />
                  </button>
                </template>
                <!-- 隔离状态显示还原按钮 -->
                <template v-if="threat.status === 'contained'">
                  <button @click="restoreThreat(threat)"
                          class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    <Icon icon="mdi:restore" class="h-5 w-5" />
                  </button>
                </template>
                <!-- 任何状态都显示详情按钮 -->
                <button @click="viewThreatDetails(threat)"
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
      <Icon icon="mdi:shield-check" class="h-16 w-16 mx-auto" :class="isDarkMode ? 'text-gray-600' : 'text-gray-400'" />
      <h3 class="mt-4 text-lg font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
        暂无威胁记录
      </h3>
      <p class="mt-2 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
        没有找到匹配当前筛选条件的威胁
      </p>
    </div>

    <!-- 威胁详情模态框 -->
    <div v-if="showThreatModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50" @click="closeThreatModal"></div>
      <div class="relative p-6 rounded-lg shadow-xl max-w-md w-full mx-4 md:mx-auto"
           :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'">
        <button @click="closeThreatModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <Icon icon="mdi:close" class="h-6 w-6" />
        </button>

        <h2 class="text-xl font-bold mb-6 pr-8">威胁详情</h2>

        <div v-if="selectedThreat" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">威胁名称:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ selectedThreat.name }}
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">威胁类型:</span>
                <p class="text-sm flex items-center" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  <Icon :icon="getThreatTypeIcon(selectedThreat.type)" class="mr-2 h-5 w-5"
                        :class="getThreatTypeIconColor(selectedThreat.type)" />
                  {{ getThreatTypeText(selectedThreat.type) }}
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">严重性:</span>
                <p>
                  <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="getSeverityClass(selectedThreat.severity)">
                    {{ getSeverityText(selectedThreat.severity) }}
                  </span>
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">状态:</span>
                <p>
                  <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="getStatusClass(selectedThreat.status)">
                    {{ getStatusText(selectedThreat.status) }}
                  </span>
                </p>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">检测终端:</span>
                <p class="text-sm flex items-center" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  <Icon :icon="getOsIcon(selectedThreat.endpoint.os)" class="mr-2 h-5 w-5" />
                  {{ selectedThreat.endpoint.name }} ({{ selectedThreat.endpoint.ip }})
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">检测时间:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ formatDate(selectedThreat.detectedAt, true) }}
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">威胁位置:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ selectedThreat.location }}
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">文件哈希:</span>
                <p class="text-sm text-xs break-all" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ selectedThreat.hash }}
                </p>
              </div>
            </div>
          </div>

          <div>
            <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">威胁描述:</span>
            <p class="text-sm mt-2 whitespace-pre-line" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ selectedThreat.description }}
            </p>
          </div>

          <div v-if="selectedThreat.indicators && selectedThreat.indicators.length > 0">
            <span class="text-sm font-medium mb-2 block" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">威胁指标:</span>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div v-for="(indicator, index) in selectedThreat.indicators" :key="index"
                   class="p-3 rounded-lg border"
                   :class="isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'">
                <div class="flex justify-between items-center">
                  <div class="flex items-center">
                    <Icon :icon="getIndicatorIcon(indicator.type)" class="h-5 w-5 mr-2"
                          :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'" />
                    <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                      {{ getIndicatorTypeText(indicator.type) }}:
                    </span>
                  </div>
                </div>
                <p class="mt-1 text-sm ml-7 break-all" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ indicator.value }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="selectedThreat.actions && selectedThreat.actions.length > 0">
            <span class="text-sm font-medium mb-2 block" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">采取的行动:</span>
            <div class="space-y-2">
              <div v-for="(action, index) in selectedThreat.actions" :key="index"
                   class="p-3 rounded-lg border flex items-center"
                   :class="isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'">
                <Icon :icon="getActionIcon(action.type)" class="h-5 w-5 mr-3"
                      :class="action.status === 'success' ?
                            (isDarkMode ? 'text-green-400' : 'text-green-600') :
                            (isDarkMode ? 'text-red-400' : 'text-red-600')" />
                <div>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                    {{ getActionText(action.type) }}
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

          <div v-if="selectedThreat.status === 'active'" class="flex justify-end space-x-3">
            <button @click="quarantineThreat(selectedThreat)"
                    class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
                    :class="isDarkMode ? 'bg-yellow-600 text-white hover:bg-yellow-700' : 'bg-yellow-600 text-white hover:bg-yellow-500'">
              <Icon icon="mdi:shield-lock" class="mr-2 h-5 w-5" />
              隔离威胁
            </button>
            <button @click="removeThreat(selectedThreat)"
                    class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
                    :class="isDarkMode ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-600 text-white hover:bg-green-500'">
              <Icon icon="mdi:delete-sweep" class="mr-2 h-5 w-5" />
              删除威胁
            </button>
          </div>

          <div v-if="selectedThreat.status === 'contained'" class="flex justify-end space-x-3">
            <button @click="restoreThreat(selectedThreat)"
                    class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
                    :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'">
              <Icon icon="mdi:restore" class="mr-2 h-5 w-5" />
              恢复文件
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 扫描模态框 -->
    <div v-if="showScanModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50" @click="closeScanModal"></div>
      <div class="relative p-6 rounded-lg shadow-xl max-w-md w-full mx-4 md:mx-auto"
           :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'">
        <button @click="closeScanModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <Icon icon="mdi:close" class="h-6 w-6" />
        </button>

        <h2 class="text-xl font-bold mb-6">威胁扫描</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              扫描范围
            </label>
            <select
                v-model="scanConfig.scope"
                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
            >
              <option value="all">所有终端</option>
              <option value="selected">选定终端</option>
              <option value="critical">关键终端</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              扫描类型
            </label>
            <select
                v-model="scanConfig.type"
                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
            >
              <option value="quick">快速扫描</option>
              <option value="full">完全扫描</option>
              <option value="custom">自定义扫描</option>
            </select>
          </div>

          <div v-if="scanConfig.type === 'custom'" class="space-y-2">
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              扫描选项
            </label>
            <div class="flex items-center">
              <input id="scan-memory" v-model="scanConfig.options" value="memory" type="checkbox"
                     class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                     :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''" />
              <label for="scan-memory" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                扫描内存
              </label>
            </div>
            <div class="flex items-center">
              <input id="scan-system" v-model="scanConfig.options" value="system" type="checkbox"
                     class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                     :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''" />
              <label for="scan-system" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                扫描系统文件
              </label>
            </div>
            <div class="flex items-center">
              <input id="scan-boot" v-model="scanConfig.options" value="boot" type="checkbox"
                     class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                     :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''" />
              <label for="scan-boot" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                扫描启动项
              </label>
            </div>
            <div class="flex items-center">
              <input id="scan-registry" v-model="scanConfig.options" value="registry" type="checkbox"
                     class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                     :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''" />
              <label for="scan-registry" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                扫描注册表
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              扫描优先级
            </label>
            <select
                v-model="scanConfig.priority"
                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
            >
              <option value="high">高（可能影响终端性能）</option>
              <option value="normal">中（平衡性能和速度）</option>
              <option value="low">低（最小化性能影响）</option>
            </select>
          </div>

          <div class="pt-4 flex justify-end">
            <button
                @click="executeScan"
                class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
                :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'"
            >
              <Icon icon="mdi:scan" class="mr-2 h-5 w-5" />
              开始扫描
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

// 搜索和过滤
const searchQuery = ref('');
const typeFilter = ref('all');
const severityFilter = ref('all');
const statusFilter = ref('all');

// 分页
const currentPage = ref(1);
const pageSize = ref(10);

// 威胁数据
const threats = ref([]);
const stats = ref({
  activeCount: 0,
  containedCount: 0,
  remediatedCount: 0,
  protectedEndpoints: 0
});

// 模态框状态
const showThreatModal = ref(false);
const showScanModal = ref(false);
const selectedThreat = ref(null);

// 扫描配置
const scanConfig = ref({
  scope: 'all',
  type: 'quick',
  options: ['memory', 'boot'],
  priority: 'normal'
});

// 过滤后的威胁
const filteredThreats = computed(() => {
  let result = threats.value.filter(threat => {
    // 类型过滤
    if (typeFilter.value !== 'all' && threat.type !== typeFilter.value) {
      return false;
    }

    // 严重性过滤
    if (severityFilter.value !== 'all' && threat.severity !== severityFilter.value) {
      return false;
    }

    // 状态过滤
    if (statusFilter.value !== 'all' && threat.status !== statusFilter.value) {
      return false;
    }

    // 搜索查询
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      return threat.name.toLowerCase().includes(query) ||
          threat.description.toLowerCase().includes(query) ||
          threat.location.toLowerCase().includes(query) ||
          threat.endpoint.name.toLowerCase().includes(query) ||
          threat.endpoint.ip.toLowerCase().includes(query);
    }

    return true;
  });

  // 按严重性和检测时间排序
  result.sort((a, b) => {
    // 首先按状态排序：活跃 > 已隔离 > 已修复 > 误报
    const statusOrder = {
      'active': 0,
      'contained': 1,
      'remediated': 2,
      'false_positive': 3
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
const totalItems = computed(() => filteredThreats.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));
const displayedThreats = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredThreats.value.slice(start, end);
});

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

// 获取威胁类型图标
const getThreatTypeIcon = (type) => {
  const iconMap = {
    'malware': 'mdi:virus',
    'ransomware': 'mdi:lock',
    'exploit': 'mdi:security',
    'pua': 'mdi:exclamation-thick',
    'network': 'mdi:lan',
  };
  return iconMap[type] || 'mdi:alert-circle';
};

// 获取威胁类型图标颜色
const getThreatTypeIconColor = (type) => {
  if (isDarkMode.value) {
    const darkMap = {
      'malware': 'text-red-400',
      'ransomware': 'text-purple-400',
      'exploit': 'text-orange-400',
      'pua': 'text-yellow-400',
      'network': 'text-blue-400',
    };
    return darkMap[type] || 'text-gray-400';
  } else {
    const lightMap = {
      'malware': 'text-red-600',
      'ransomware': 'text-purple-600',
      'exploit': 'text-orange-600',
      'pua': 'text-yellow-600',
      'network': 'text-blue-600',
    };
    return lightMap[type] || 'text-gray-600';
  }
};

// 获取威胁类型文本
const getThreatTypeText = (type) => {
  const typeMap = {
    'malware': '恶意软件',
    'ransomware': '勒索软件',
    'exploit': '漏洞利用',
    'pua': '可疑应用',
    'network': '网络威胁',
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
      'active': 'bg-red-900 text-red-300',
      'contained': 'bg-yellow-900 text-yellow-300',
      'remediated': 'bg-green-900 text-green-300',
      'false_positive': 'bg-gray-700 text-gray-300',
    };
    return darkMap[status] || 'bg-gray-700 text-gray-300';
  } else {
    const lightMap = {
      'active': 'bg-red-100 text-red-800',
      'contained': 'bg-yellow-100 text-yellow-800',
      'remediated': 'bg-green-100 text-green-800',
      'false_positive': 'bg-gray-100 text-gray-800',
    };
    return lightMap[status] || 'bg-gray-100 text-gray-800';
  }
};

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'active': '活跃',
    'contained': '已隔离',
    'remediated': '已修复',
    'false_positive': '误报',
  };
  return statusMap[status] || status;
};

// 获取指标图标
const getIndicatorIcon = (type) => {
  const iconMap = {
    'file': 'mdi:file-document-outline',
    'registry': 'mdi:registry',
    'network': 'mdi:ip-network-outline',
    'process': 'mdi:application-cog-outline',
    'memory': 'mdi:memory',
  };
  return iconMap[type] || 'mdi:information-outline';
};

// 获取指标类型文本
const getIndicatorTypeText = (type) => {
  const typeMap = {
    'file': '文件',
    'registry': '注册表',
    'network': '网络',
    'process': '进程',
    'memory': '内存',
  };
  return typeMap[type] || type;
};

// 获取动作图标
const getActionIcon = (type) => {
  const iconMap = {
    'quarantine': 'mdi:shield-lock',
    'delete': 'mdi:delete',
    'restore': 'mdi:restore',
    'scan': 'mdi:virus-scan',
  };
  return iconMap[type] || 'mdi:shield-check';
};

// 获取动作文本
const getActionText = (type) => {
  const actionMap = {
    'quarantine': '隔离威胁',
    'delete': '删除威胁',
    'restore': '恢复文件',
    'scan': '扫描执行',
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

// 查看威胁详情
const viewThreatDetails = (threat) => {
  selectedThreat.value = threat;
  showThreatModal.value = true;
};

// 关闭威胁详情模态框
const closeThreatModal = () => {
  showThreatModal.value = false;
};

// 隔离威胁
const quarantineThreat = (threat) => {
  // 实际应用中这里会调用API隔离威胁
  const now = new Date().toISOString();

  // 更新威胁状态
  const index = threats.value.findIndex(t => t.id === threat.id);
  if (index !== -1) {
    threats.value[index] = {
      ...threats.value[index],
      status: 'contained',
      actions: [
        ...(threats.value[index].actions || []),
        {
          type: 'quarantine',
          timestamp: now,
          status: 'success'
        }
      ]
    };

    // 如果模态框打开，更新选中的威胁
    if (showThreatModal.value && selectedThreat.value && selectedThreat.value.id === threat.id) {
      selectedThreat.value = threats.value[index];
    }

    // 更新统计数据
    updateStats();

    // 显示成功消息
    alert(`威胁 "${threat.name}" 已成功隔离`);
  }
};

// 删除威胁
const removeThreat = (threat) => {
  // 实际应用中这里会调用API删除威胁
  const now = new Date().toISOString();

  // 更新威胁状态
  const index = threats.value.findIndex(t => t.id === threat.id);
  if (index !== -1) {
    threats.value[index] = {
      ...threats.value[index],
      status: 'remediated',
      actions: [
        ...(threats.value[index].actions || []),
        {
          type: 'delete',
          timestamp: now,
          status: 'success'
        }
      ]
    };

    // 如果模态框打开，更新选中的威胁
    if (showThreatModal.value && selectedThreat.value && selectedThreat.value.id === threat.id) {
      selectedThreat.value = threats.value[index];
    }

    // 更新统计数据
    updateStats();

    // 显示成功消息
    alert(`威胁 "${threat.name}" 已成功删除`);
  }
};

// 恢复隔离的威胁文件
const restoreThreat = (threat) => {
  // 实际应用中这里会调用API恢复隔离的文件
  const now = new Date().toISOString();

  // 更新威胁状态
  const index = threats.value.findIndex(t => t.id === threat.id);
  if (index !== -1) {
    threats.value[index] = {
      ...threats.value[index],
      status: 'active',
      actions: [
        ...(threats.value[index].actions || []),
        {
          type: 'restore',
          timestamp: now,
          status: 'success'
        }
      ]
    };

    // 如果模态框打开，更新选中的威胁
    if (showThreatModal.value && selectedThreat.value && selectedThreat.value.id === threat.id) {
      selectedThreat.value = threats.value[index];
    }

    // 更新统计数据
    updateStats();

    // 显示成功消息
    alert(`威胁 "${threat.name}" 已还原`);
  }
};

// 启动扫描
const startScan = () => {
  scanConfig.value = {
    scope: 'all',
    type: 'quick',
    options: ['memory', 'boot'],
    priority: 'normal'
  };
  showScanModal.value = true;
};

// 关闭扫描模态框
const closeScanModal = () => {
  showScanModal.value = false;
};

// 执行扫描
const executeScan = () => {
  // 实际应用中这里会调用API启动扫描
  let scopeText = scanConfig.value.scope === 'all' ? '所有终端' :
      scanConfig.value.scope === 'selected' ? '选定终端' : '关键终端';

  let typeText = scanConfig.value.type === 'quick' ? '快速扫描' :
      scanConfig.value.type === 'full' ? '完全扫描' : '自定义扫描';

  let optionsText = scanConfig.value.type === 'custom' ? `(${scanConfig.value.options.join(', ')})` : '';

  let priorityText = scanConfig.value.priority === 'high' ? '高优先级' :
      scanConfig.value.priority === 'normal' ? '中优先级' : '低优先级';

  alert(`开始对${scopeText}执行${typeText}${optionsText}，优先级：${priorityText}`);

  showScanModal.value = false;

  // 模拟扫描发现新威胁
  setTimeout(() => {
    refreshThreats();
  }, 2000);
};

// 导出威胁数据
const exportThreats = () => {
  // 实际应用中这里会处理导出逻辑
  alert('导出威胁数据');
};

// 更新统计数据
const updateStats = () => {
  stats.value = {
    activeCount: threats.value.filter(t => t.status === 'active').length,
    containedCount: threats.value.filter(t => t.status === 'contained').length,
    remediatedCount: threats.value.filter(t => t.status === 'remediated').length,
    protectedEndpoints: new Set(threats.value.map(t => t.endpoint.id)).size
  };
};

// 刷新威胁列表
const refreshThreats = async () => {
  loading.value = true;
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 重新加载数据
    await loadThreats();
  } finally {
    loading.value = false;
  }
};

// 加载威胁数据
const loadThreats = async () => {
  try {
    // 模拟从API获取数据
    await new Promise(resolve => setTimeout(resolve, 800));

    // 当前时间
    const now = new Date();

    // 生成2小时前的时间
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    // 生成6小时前的时间
    const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);

    // 生成1天前的时间
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // 生成3天前的时间
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

    // 生成模拟威胁数据
    const mockThreats = [
      {
        id: 'threat-1',
        name: 'Trojan.Win32.Emotet',
        type: 'malware',
        description: 'Emotet是一种复杂的恶意软件，最初设计为银行木马，现已演变为分发其他恶意软件的服务。它通常通过网络钓鱼邮件中的恶意链接或附件传播，可能会导致敏感信息泄露和进一步的系统感染。',
        severity: 'critical',
        status: 'active',
        detectedAt: twoHoursAgo.toISOString(),
        endpoint: {
          id: 'endpoint-1',
          name: 'DESKTOP-001',
          ip: '192.168.1.101',
          os: 'Windows'
        },
        location: 'C:\\Users\\Admin\\AppData\\Local\\Temp\\suspicious.exe',
        hash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
        indicators: [
          { type: 'file', value: 'suspicious.exe' },
          { type: 'registry', value: 'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\malware.exe' },
          { type: 'network', value: '203.0.113.100:443' }
        ]
      },
      {
        id: 'threat-2',
        name: 'Ransomware.WannaCry',
        type: 'ransomware',
        description: 'WannaCry是一种加密勒索软件，利用EternalBlue漏洞进行传播。它会加密受感染系统上的文件，并要求支付赎金以获取解密密钥。此威胁可能导致重要数据丢失和系统瘫痪。',
        severity: 'critical',
        status: 'contained',
        detectedAt: sixHoursAgo.toISOString(),
        endpoint: {
          id: 'endpoint-2',
          name: 'DESKTOP-002',
          ip: '192.168.1.102',
          os: 'Windows'
        },
        location: 'C:\\Windows\\System32\\tasksche.exe',
        hash: 'b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5',
        indicators: [
          { type: 'file', value: 'tasksche.exe' },
          { type: 'file', value: '@WanaDecryptor@.exe' },
          { type: 'network', value: 'Multiple TOR .onion addresses' }
        ],
        actions: [
          {
            type: 'quarantine',
            timestamp: twoHoursAgo.toISOString(),
            status: 'success'
          }
        ]
      },
      {
        id: 'threat-3',
        name: 'PUA.Win32.Miner',
        type: 'pua',
        description: '检测到未经授权的加密货币挖矿软件。此类应用会消耗系统资源进行加密货币挖矿，导致系统性能显著下降和能耗增加。',
        severity: 'medium',
        status: 'remediated',
        detectedAt: oneDayAgo.toISOString(),
        endpoint: {
          id: 'endpoint-3',
          name: 'DESKTOP-003',
          ip: '192.168.1.103',
          os: 'Windows'
        },
        location: 'C:\\Program Files (x86)\\CryptoMiner\\miner.exe',
        hash: 'c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5',
        indicators: [
          { type: 'file', value: 'miner.exe' },
          { type: 'process', value: 'miner.exe with high CPU usage' }
        ],
        actions: [
          {
            type: 'quarantine',
            timestamp: oneDayAgo.toISOString(),
            status: 'success'
          },
          {
            type: 'delete',
            timestamp: sixHoursAgo.toISOString(),
            status: 'success'
          }
        ]
      },
      {
        id: 'threat-4',
        name: 'Exploit.CVE-2021-44228',
        type: 'exploit',
        description: '检测到针对Apache Log4j漏洞(CVE-2021-44228)的攻击尝试。此漏洞允许远程代码执行，被称为"Log4Shell"，是一个严重的安全漏洞。',
        severity: 'high',
        status: 'active',
        detectedAt: now.toISOString(),
        endpoint: {
          id: 'endpoint-4',
          name: 'SERVER-001',
          ip: '192.168.1.201',
          os: 'Linux'
        },
        location: '/var/log/application.log',
        hash: 'd1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5',
        indicators: [
          { type: 'network', value: 'Request with JNDI injection payload' },
          { type: 'file', value: 'application.log containing malicious string' }
        ]
      },
      {
        id: 'threat-5',
        name: 'Backdoor.Cobalt.Strike',
        type: 'malware',
        description: '检测到Cobalt Strike恶意软件。Cobalt Strike是一款渗透测试工具，但常被攻击者用作后门程序和命令控制(C2)工具，可能导致系统完全被接管。',
        severity: 'high',
        status: 'contained',
        detectedAt: threeDaysAgo.toISOString(),
        endpoint: {
          id: 'endpoint-5',
          name: 'WORKSTATION-007',
          ip: '192.168.1.107',
          os: 'Windows'
        },
        location: 'C:\\Windows\\System32\\svchost.exe (injected code)',
        hash: 'e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5',
        indicators: [
          { type: 'process', value: 'Suspicious svchost.exe with unusual network connections' },
          { type: 'network', value: 'Connection to known C2 server: 198.51.100.123:443' },
          { type: 'memory', value: 'Beacon payload detected in process memory' }
        ],
        actions: [
          {
            type: 'quarantine',
            timestamp: threeDaysAgo.toISOString(),
            status: 'success'
          }
        ]
      }
    ];

    threats.value = mockThreats;

    // 更新统计数据
    updateStats();
  } catch (error) {
    console.error('获取威胁列表失败:', error);
    // 添加错误处理逻辑
  }
};

// 组件挂载时加载数据
onMounted(async () => {
  try {
    await loadThreats();
  } finally {
    loading.value = false;
  }
});
</script>
