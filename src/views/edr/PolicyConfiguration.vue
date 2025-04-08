<template>
  <div>
    <!-- 页面标题和操作栏 -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
      <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
        EDR策略配置
      </h1>
      <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
        <button
            @click="createPolicy"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'"
        >
          <Icon icon="mdi:plus" class="mr-2 h-5 w-5" />
          创建策略
        </button>
        <button
            @click="importPolicy"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'"
        >
          <Icon icon="mdi:import" class="mr-2 h-5 w-5" />
          导入策略
        </button>
        <button
            @click="refreshPolicies"
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
                placeholder="搜索策略..."
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
            <option value="antimalware">反恶意软件</option>
            <option value="firewall">防火墙</option>
            <option value="device-control">设备控制</option>
            <option value="intrusion-prevention">入侵防御</option>
            <option value="application-control">应用程序控制</option>
          </select>
          <select
              v-model="statusFilter"
              class="px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
          >
            <option value="all">全部状态</option>
            <option value="enabled">已启用</option>
            <option value="disabled">已禁用</option>
            <option value="draft">草稿</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" :class="isDarkMode ? 'border-blue-400' : 'border-blue-600'"></div>
    </div>

    <!-- 策略列表 -->
    <div v-else-if="filteredPolicies.length > 0" class="rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md mb-6"
         :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y" :class="isDarkMode ? 'divide-gray-700' : 'divide-gray-200'">
          <thead :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              策略名称
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              类型
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              状态
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              应用范围
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              更新时间
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              操作
            </th>
          </tr>
          </thead>
          <tbody :class="isDarkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'">
          <tr v-for="policy in displayedPolicies" :key="policy.id"
              class="transition-colors duration-150"
              :class="isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'">
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              <div class="flex items-center">
                <Icon :icon="getPolicyTypeIcon(policy.type)" class="mr-2 h-5 w-5"
                      :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'" />
                {{ policy.name }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ formatPolicyType(policy.type) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                  class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="policyStatusClass(policy.status)"
              >
                {{ policyStatusText(policy.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ policy.target === 'all' ? '全部终端' : `${policy.targetCount} 个终端` }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ formatDate(policy.updatedAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
              <div class="flex justify-end items-center space-x-3">
                <button @click="togglePolicyStatus(policy)"
                        :class="isDarkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-800'">
                  <Icon :icon="policy.status === 'enabled' ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'" class="h-5 w-5" />
                </button>
                <button @click="editPolicy(policy)"
                        :class="isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'">
                  <Icon icon="mdi:pencil" class="h-5 w-5" />
                </button>
                <button @click="assignPolicy(policy)"
                        :class="isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-800'">
                  <Icon icon="mdi:account-multiple" class="h-5 w-5" />
                </button>
                <button @click="duplicatePolicy(policy)"
                        :class="isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'">
                  <Icon icon="mdi:content-copy" class="h-5 w-5" />
                </button>
                <button @click="deletePolicy(policy)"
                        :class="isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'">
                  <Icon icon="mdi:delete" class="h-5 w-5" />
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
      <Icon icon="mdi:clipboard-text" class="h-16 w-16 mx-auto" :class="isDarkMode ? 'text-gray-600' : 'text-gray-400'" />
      <h3 class="mt-4 text-lg font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
        暂无策略记录
      </h3>
      <p class="mt-2 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
        没有找到匹配当前筛选条件的策略
      </p>
      <button
          @click="createPolicy"
          class="mt-4 inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
          :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'"
      >
        <Icon icon="mdi:plus" class="mr-2 h-5 w-5" />
        创建新策略
      </button>
    </div>

    <!-- 策略编辑模态框 -->
    <div v-if="showPolicyModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50" @click="closePolicyModal"></div>
      <div class="relative p-6 rounded-lg shadow-xl max-w-3xl w-full mx-4 md:mx-auto overflow-y-auto max-h-[90vh]"
           :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'">
        <button @click="closePolicyModal"
                :class="isDarkMode ? 'absolute top-4 right-4 text-gray-400 hover:text-gray-300' : 'absolute top-4 right-4 text-gray-400 hover:text-gray-600'">
          <Icon icon="mdi:close" class="h-6 w-6" />
        </button>

        <h2 class="text-xl font-bold mb-6">{{ isEditMode ? '编辑策略' : '创建策略' }}</h2>

        <div class="space-y-6">
          <!-- 基本信息 -->
          <div>
            <h3 class="text-lg font-medium mb-4" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">基本信息</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  策略名称
                </label>
                <input
                    v-model="editingPolicy.name"
                    type="text"
                    class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                    placeholder="输入策略名称"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  策略类型
                </label>
                <select
                    v-model="editingPolicy.type"
                    class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                    :disabled="isEditMode"
                >
                  <option value="antimalware">反恶意软件</option>
                  <option value="firewall">防火墙</option>
                  <option value="device-control">设备控制</option>
                  <option value="intrusion-prevention">入侵防御</option>
                  <option value="application-control">应用程序控制</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  描述
                </label>
                <textarea
                    v-model="editingPolicy.description"
                    rows="3"
                    class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                    placeholder="输入策略描述"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- 策略配置 - 根据类型显示不同的配置 -->
          <div>
            <h3 class="text-lg font-medium mb-4" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">策略配置</h3>

            <!-- 反恶意软件配置 -->
            <div v-if="editingPolicy.type === 'antimalware'" class="space-y-4">
              <div class="flex items-center mb-2">
                <input
                    id="realtime-protection"
                    v-model="editingPolicy.config.realtimeProtection"
                    type="checkbox"
                    class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''"
                />
                <label for="realtime-protection" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  启用实时保护
                </label>
              </div>

              <div class="flex items-center mb-2">
                <input
                    id="scheduled-scan"
                    v-model="editingPolicy.config.scheduledScan"
                    type="checkbox"
                    class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''"
                />
                <label for="scheduled-scan" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  启用计划扫描
                </label>
              </div>

              <div v-if="editingPolicy.config.scheduledScan">
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  扫描频率
                </label>
                <select
                    v-model="editingPolicy.config.scanFrequency"
                    class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                >
                  <option value="daily">每天</option>
                  <option value="weekly">每周</option>
                  <option value="monthly">每月</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  扫描级别
                </label>
                <select
                    v-model="editingPolicy.config.scanLevel"
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

              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  检测到威胁时的操作
                </label>
                <select
                    v-model="editingPolicy.config.threatAction"
                    class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                >
                  <option value="quarantine">隔离</option>
                  <option value="remove">删除</option>
                  <option value="report">仅报告</option>
                </select>
              </div>
            </div>

            <!-- 防火墙配置 -->
            <div v-if="editingPolicy.type === 'firewall'" class="space-y-4">
              <div class="flex items-center mb-2">
                <input
                    id="firewall-enabled"
                    v-model="editingPolicy.config.firewallEnabled"
                    type="checkbox"
                    class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''"
                />
                <label for="firewall-enabled" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  启用防火墙保护
                </label>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  防火墙模式
                </label>
                <select
                    v-model="editingPolicy.config.firewallMode"
                    class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                >
                  <option value="block-all">阻止所有连接（白名单模式）</option>
                  <option value="allow-all">允许所有连接（黑名单模式）</option>
                  <option value="interactive">交互模式</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  日志级别
                </label>
                <select
                    v-model="editingPolicy.config.loggingLevel"
                    class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                >
                  <option value="none">不记录</option>
                  <option value="blocked">仅记录被阻止的连接</option>
                  <option value="all">记录所有连接</option>
                </select>
              </div>
            </div>

            <!-- 设备控制配置 -->
            <div v-if="editingPolicy.type === 'device-control'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-3" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  设备访问控制
                </label>

                <div class="space-y-3 p-4 rounded-lg border" :class="isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'">
                  <div class="flex items-center justify-between">
                    <span class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">USB存储设备</span>
                    <select
                        v-model="editingPolicy.config.usb"
                        class="px-3 py-1 rounded border focus:ring-2 focus:outline-none transition-colors duration-200"
                        :class="isDarkMode
                        ? 'bg-gray-600 border-gray-500 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                        : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                    >
                      <option value="allow">允许</option>
                      <option value="readonly">只读</option>
                      <option value="block">阻止</option>
                    </select>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">CD/DVD</span>
                    <select
                        v-model="editingPolicy.config.cdrom"
                        class="px-3 py-1 rounded border focus:ring-2 focus:outline-none transition-colors duration-200"
                        :class="isDarkMode
                        ? 'bg-gray-600 border-gray-500 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                        : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                    >
                      <option value="allow">允许</option>
                      <option value="readonly">只读</option>
                      <option value="block">阻止</option>
                    </select>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">蓝牙设备</span>
                    <select
                        v-model="editingPolicy.config.bluetooth"
                        class="px-3 py-1 rounded border focus:ring-2 focus:outline-none transition-colors duration-200"
                        :class="isDarkMode
                        ? 'bg-gray-600 border-gray-500 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                        : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                    >
                      <option value="allow">允许</option>
                      <option value="block">阻止</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="flex items-center">
                <input
                    id="notify-user"
                    v-model="editingPolicy.config.notifyUser"
                    type="checkbox"
                    class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''"
                />
                <label for="notify-user" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  设备被阻止时通知用户
                </label>
              </div>
            </div>

            <!-- 入侵防御配置 -->
            <div v-if="editingPolicy.type === 'intrusion-prevention'" class="space-y-4">
              <div class="flex items-center mb-2">
                <input
                    id="ips-enabled"
                    v-model="editingPolicy.config.ipsEnabled"
                    type="checkbox"
                    class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''"
                />
                <label for="ips-enabled" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  启用入侵防御系统
                </label>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  保护级别
                </label>
                <select
                    v-model="editingPolicy.config.protectionLevel"
                    class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                >
                  <option value="low">低（仅阻止已知高危攻击）</option>
                  <option value="medium">中（平衡安全性和性能）</option>
                  <option value="high">高（最大程度的保护）</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-3" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  防护类型
                </label>

                <div class="space-y-2">
                  <div class="flex items-center">
                    <input
                        id="exploit-protection"
                        v-model="editingPolicy.config.exploitProtection"
                        type="checkbox"
                        class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''"
                    />
                    <label for="exploit-protection" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                      漏洞利用防护
                    </label>
                  </div>

                  <div class="flex items-center">
                    <input
                        id="network-attack-protection"
                        v-model="editingPolicy.config.networkAttackProtection"
                        type="checkbox"
                        class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''"
                    />
                    <label for="network-attack-protection" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                      网络攻击防护
                    </label>
                  </div>

                  <div class="flex items-center">
                    <input
                        id="ransomware-protection"
                        v-model="editingPolicy.config.ransomwareProtection"
                        type="checkbox"
                        class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''"
                    />
                    <label for="ransomware-protection" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                      勒索软件防护
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 应用程序控制配置 -->
            <div v-if="editingPolicy.type === 'application-control'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  控制模式
                </label>
                <select
                    v-model="editingPolicy.config.controlMode"
                    class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                >
                  <option value="whitelist">白名单（仅允许已批准的应用）</option>
                  <option value="blacklist">黑名单（阻止指定的应用）</option>
                  <option value="monitor">监控模式（仅记录）</option>
                </select>
              </div>

              <div class="flex items-center mb-2">
                <input
                    id="trust-signed"
                    v-model="editingPolicy.config.trustSigned"
                    type="checkbox"
                    class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''"
                />
                <label for="trust-signed" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  信任数字签名的应用程序
                </label>
              </div>

              <div class="flex items-center mb-2">
                <input
                    id="block-unrecognized"
                    v-model="editingPolicy.config.blockUnrecognized"
                    type="checkbox"
                    class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''"
                />
                <label for="block-unrecognized" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  阻止未识别的可执行文件
                </label>
              </div>

              <!-- 应用列表 - 这里简化为文本区域，实际应用可能需要更复杂的UI -->
              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  {{ editingPolicy.config.controlMode === 'whitelist' ? '允许的应用程序' :
                    editingPolicy.config.controlMode === 'blacklist' ? '阻止的应用程序' : '监控的应用程序' }}
                </label>
                <textarea
                    v-model="editingPolicy.config.applicationList"
                    rows="4"
                    class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                    placeholder="每行一个应用程序路径或哈希值"
                ></textarea>
                <p class="mt-1 text-xs" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                  格式：每行一个应用程序路径或哈希值，例如 C:\Program Files\App\app.exe 或 SHA256哈希值
                </p>
              </div>
            </div>
          </div>

          <!-- 应用范围 -->
          <div>
            <h3 class="text-lg font-medium mb-4" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">应用范围</h3>
            <div class="space-y-3">
              <div class="flex items-center">
                <input
                    id="apply-all"
                    v-model="editingPolicy.applyToAll"
                    type="radio"
                    name="apply-scope"
                    value="true"
                    class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''"
                />
                <label for="apply-all" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  应用到所有终端
                </label>
              </div>

              <div class="flex items-center">
                <input
                    id="apply-selected"
                    v-model="editingPolicy.applyToAll"
                    type="radio"
                    name="apply-scope"
                    value="false"
                    class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''"
                />
                <label for="apply-selected" class="ml-2 block text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  应用到选定终端
                </label>
              </div>

              <div v-if="editingPolicy.applyToAll === 'false'" class="mt-3">
                <p class="text-sm mb-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                  策略保存后，您可以在列表中选择"分配"操作来指定适用的终端。
                </p>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-3 justify-end pt-4 border-t" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
            <button
                @click="saveDraft"
                class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
                :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'"
            >
              <Icon icon="mdi:content-save-outline" class="mr-2 h-5 w-5" />
              保存为草稿
            </button>
            <button
                @click="saveAndEnable"
                class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
                :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'"
            >
              <Icon icon="mdi:check" class="mr-2 h-5 w-5" />
              保存并启用
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分配策略模态框 -->
    <div v-if="showAssignModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50" @click="closeAssignModal"></div>
      <div class="relative p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 md:mx-auto"
           :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'">
        <button @click="closeAssignModal"
                :class="isDarkMode ? 'absolute top-4 right-4 text-gray-400 hover:text-gray-300' : 'absolute top-4 right-4 text-gray-400 hover:text-gray-600'">
          <Icon icon="mdi:close" class="h-6 w-6" />
        </button>

        <h2 class="text-xl font-bold mb-6">分配策略: {{ selectedPolicy.name }}</h2>

        <div class="space-y-4">
          <div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon icon="mdi:magnify" class="h-5 w-5" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" />
              </div>
              <input
                  v-model="endpointSearchQuery"
                  type="text"
                  placeholder="搜索终端..."
                  class="pl-10 pr-4 py-2 w-full rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                  :class="isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                  : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
              />
            </div>
          </div>

          <div class="overflow-y-auto max-h-60 rounded-lg border"
               :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
            <div v-if="filteredEndpoints.length > 0" class="divide-y"
                 :class="isDarkMode ? 'divide-gray-700' : 'divide-gray-200'">
              <div v-for="endpoint in filteredEndpoints" :key="endpoint.id"
                   class="p-3 flex items-center"
                   :class="isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'">
                <input
                    :id="`endpoint-${endpoint.id}`"
                    v-model="selectedEndpoints"
                    :value="endpoint.id"
                    type="checkbox"
                    class="rounded focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''"
                />
                <label :for="`endpoint-${endpoint.id}`" class="ml-3 flex-1 flex items-center">
                  <Icon :icon="getOsIcon(endpoint.os)" class="mr-2 h-5 w-5" />
                  <span class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    {{ endpoint.name }} ({{ endpoint.ip }})
                  </span>
                </label>
                <span class="px-2.5 py-1 text-xs leading-5 font-semibold rounded-full"
                      :class="statusClass(endpoint.status)">
                  {{ statusText(endpoint.status) }}
                </span>
              </div>
            </div>
            <div v-else class="p-6 text-center">
              <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                没有找到匹配的终端
              </p>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              <span>已选择 {{ selectedEndpoints.length }} 个终端</span>
              <button @click="toggleSelectAll"
                      :class="isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'">
                {{ selectedEndpoints.length === filteredEndpoints.length ? '取消全选' : '全选' }}
              </button>
            </div>
          </div>

          <div class="flex flex-wrap gap-3 justify-end pt-4 border-t" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
            <button
                @click="closeAssignModal"
                class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
                :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'"
            >
              取消
            </button>
            <button
                @click="confirmAssignPolicy"
                class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
                :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'"
                :disabled="selectedEndpoints.length === 0"
            >
              <Icon icon="mdi:check" class="mr-2 h-5 w-5" />
              确认分配
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
const typeFilter = ref('all');
const statusFilter = ref('all');

// 分页
const currentPage = ref(1);
const pageSize = ref(10);

// 策略列表
const policies = ref([]);

// 模态框状态
const showPolicyModal = ref(false);
const showAssignModal = ref(false);
const isEditMode = ref(false);
const editingPolicy = ref({
  name: '',
  type: 'antimalware',
  description: '',
  status: 'draft',
  applyToAll: 'true',
  config: {
    // 反恶意软件配置
    realtimeProtection: true,
    scheduledScan: false,
    scanFrequency: 'weekly',
    scanLevel: 'quick',
    threatAction: 'quarantine',

    // 防火墙配置
    firewallEnabled: true,
    firewallMode: 'allow-all',
    loggingLevel: 'blocked',

    // 设备控制配置
    usb: 'allow',
    cdrom: 'allow',
    bluetooth: 'allow',
    notifyUser: true,

    // 入侵防御配置
    ipsEnabled: true,
    protectionLevel: 'medium',
    exploitProtection: true,
    networkAttackProtection: true,
    ransomwareProtection: true,

    // 应用程序控制配置
    controlMode: 'blacklist',
    trustSigned: true,
    blockUnrecognized: false,
    applicationList: '',
  }
});

// 已选策略（用于分配对话框）
const selectedPolicy = ref({});
const endpointSearchQuery = ref('');
const selectedEndpoints = ref([]);

// mock终端数据
const endpoints = ref([]);

// 过滤后的策略
const filteredPolicies = computed(() => {
  let result = policies.value.filter(policy => {
    // 类型过滤
    if (typeFilter.value !== 'all' && policy.type !== typeFilter.value) {
      return false;
    }

    // 状态过滤
    if (statusFilter.value !== 'all' && policy.status !== statusFilter.value) {
      return false;
    }

    // 搜索查询
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      return policy.name.toLowerCase().includes(query) ||
          policy.description.toLowerCase().includes(query);
    }

    return true;
  });

  // 按更新时间和名称排序
  result.sort((a, b) => {
    const dateA = new Date(a.updatedAt);
    const dateB = new Date(b.updatedAt);

    return dateB - dateA; // 按更新时间降序排序
  });

  return result;
});

// 分页计算
const totalItems = computed(() => filteredPolicies.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));
const displayedPolicies = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredPolicies.value.slice(start, end);
});

// 过滤后的终端（用于分配对话框）
const filteredEndpoints = computed(() => {
  if (!endpointSearchQuery.value) {
    return endpoints.value;
  }

  const query = endpointSearchQuery.value.toLowerCase();
  return endpoints.value.filter(endpoint =>
      endpoint.name.toLowerCase().includes(query) ||
      endpoint.ip.toLowerCase().includes(query) ||
      endpoint.os.toLowerCase().includes(query)
  );
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

// 格式化策略类型
const formatPolicyType = (type) => {
  const typeMap = {
    'antimalware': '反恶意软件',
    'firewall': '防火墙',
    'device-control': '设备控制',
    'intrusion-prevention': '入侵防御',
    'application-control': '应用程序控制',
  };
  return typeMap[type] || type;
};

// 获取策略类型图标
const getPolicyTypeIcon = (type) => {
  const iconMap = {
    'antimalware': 'mdi:virus',
    'firewall': 'mdi:shield',
    'device-control': 'mdi:usb',
    'intrusion-prevention': 'mdi:security',
    'application-control': 'mdi:apps',
  };
  return iconMap[type] || 'mdi:file-document-outline';
};

// 策略状态样式
const policyStatusClass = (status) => {
  if (isDarkMode.value) {
    const darkStatusMap = {
      'enabled': 'bg-green-900 text-green-300',
      'disabled': 'bg-gray-700 text-gray-300',
      'draft': 'bg-blue-900 text-blue-300',
    };
    return darkStatusMap[status] || 'bg-gray-700 text-gray-300';
  } else {
    const lightStatusMap = {
      'enabled': 'bg-green-100 text-green-800',
      'disabled': 'bg-gray-100 text-gray-800',
      'draft': 'bg-blue-100 text-blue-800',
    };
    return lightStatusMap[status] || 'bg-gray-100 text-gray-800';
  }
};

// 策略状态文本
const policyStatusText = (status) => {
  const statusMap = {
    'enabled': '已启用',
    'disabled': '已禁用',
    'draft': '草稿',
  };
  return statusMap[status] || status;
};

// 终端状态样式（用于分配对话框）
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

// 终端状态文本（用于分配对话框）
const statusText = (status) => {
  const statusMap = {
    'online': '在线',
    'offline': '离线',
    'warning': '警告',
    'critical': '危险',
  };
  return statusMap[status] || status;
};

// 获取操作系统图标（用于分配对话框）
const getOsIcon = (os) => {
  if (os.includes('Windows')) return 'mdi:microsoft-windows';
  if (os.includes('Linux')) return 'mdi:linux';
  if (os.includes('macOS')) return 'mdi:apple';
  return 'mdi:laptop';
};

// 格式化日期
const formatDate = (timestamp) => {
  const date = new Date(timestamp);

  // 简化显示，今天的只显示时间，非今天的显示日期
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
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

// 创建策略
const createPolicy = () => {
  isEditMode.value = false;
  editingPolicy.value = {
    name: '',
    type: 'antimalware',
    description: '',
    status: 'draft',
    applyToAll: 'true',
    config: {
      // 反恶意软件配置
      realtimeProtection: true,
      scheduledScan: false,
      scanFrequency: 'weekly',
      scanLevel: 'quick',
      threatAction: 'quarantine',

      // 防火墙配置
      firewallEnabled: true,
      firewallMode: 'allow-all',
      loggingLevel: 'blocked',

      // 设备控制配置
      usb: 'allow',
      cdrom: 'allow',
      bluetooth: 'allow',
      notifyUser: true,

      // 入侵防御配置
      ipsEnabled: true,
      protectionLevel: 'medium',
      exploitProtection: true,
      networkAttackProtection: true,
      ransomwareProtection: true,

      // 应用程序控制配置
      controlMode: 'blacklist',
      trustSigned: true,
      blockUnrecognized: false,
      applicationList: '',
    }
  };
  showPolicyModal.value = true;
};

// 编辑策略
const editPolicy = (policy) => {
  isEditMode.value = true;
  // 深拷贝策略对象
  editingPolicy.value = JSON.parse(JSON.stringify(policy));
  editingPolicy.value.applyToAll = policy.target === 'all' ? 'true' : 'false';
  showPolicyModal.value = true;
};

// 关闭策略编辑模态框
const closePolicyModal = () => {
  showPolicyModal.value = false;
};

// 保存为草稿
const saveDraft = () => {
  // 实际应用中这里会调用API保存策略
  editingPolicy.value.status = 'draft';

  if (!isEditMode.value) {
    // 创建新策略
    const newPolicy = {
      ...editingPolicy.value,
      id: `policy-${policies.value.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      target: editingPolicy.value.applyToAll === 'true' ? 'all' : 'selected',
      targetCount: 0
    };

    policies.value.unshift(newPolicy);
    alert('策略已保存为草稿');
  } else {
    // 更新现有策略
    const index = policies.value.findIndex(p => p.id === editingPolicy.value.id);

    if (index !== -1) {
      const updatedPolicy = {
        ...editingPolicy.value,
        updatedAt: new Date().toISOString(),
        target: editingPolicy.value.applyToAll === 'true' ? 'all' : 'selected',
      };

      policies.value[index] = updatedPolicy;
      alert('策略已更新并保存为草稿');
    }
  }

  showPolicyModal.value = false;
};

// 保存并启用
const saveAndEnable = () => {
  // 实际应用中这里会调用API保存策略并启用
  editingPolicy.value.status = 'enabled';

  if (!isEditMode.value) {
    // 创建新策略
    const newPolicy = {
      ...editingPolicy.value,
      id: `policy-${policies.value.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      target: editingPolicy.value.applyToAll === 'true' ? 'all' : 'selected',
      targetCount: 0
    };

    policies.value.unshift(newPolicy);
    alert('策略已保存并启用');
  } else {
    // 更新现有策略
    const index = policies.value.findIndex(p => p.id === editingPolicy.value.id);

    if (index !== -1) {
      const updatedPolicy = {
        ...editingPolicy.value,
        updatedAt: new Date().toISOString(),
        target: editingPolicy.value.applyToAll === 'true' ? 'all' : 'selected',
      };

      policies.value[index] = updatedPolicy;
      alert('策略已更新并启用');
    }
  }

  showPolicyModal.value = false;
};

// 切换策略状态
const togglePolicyStatus = (policy) => {
  // 实际应用中这里会调用API更改策略状态
  const index = policies.value.findIndex(p => p.id === policy.id);

  if (index !== -1) {
    const newStatus = policy.status === 'enabled' ? 'disabled' : 'enabled';
    policies.value[index] = {
      ...policy,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };

    alert(`策略"${policy.name}"已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  }
};

// 分配策略
const assignPolicy = (policy) => {
  selectedPolicy.value = policy;
  selectedEndpoints.value = [];
  endpointSearchQuery.value = '';
  showAssignModal.value = true;
};

// 关闭分配模态框
const closeAssignModal = () => {
  showAssignModal.value = false;
};

// 全选/取消全选终端
const toggleSelectAll = () => {
  if (selectedEndpoints.value.length === filteredEndpoints.value.length) {
    selectedEndpoints.value = [];
  } else {
    selectedEndpoints.value = filteredEndpoints.value.map(e => e.id);
  }
};

// 确认分配策略
const confirmAssignPolicy = () => {
  // 实际应用中这里会调用API分配策略
  const index = policies.value.findIndex(p => p.id === selectedPolicy.value.id);

  if (index !== -1) {
    policies.value[index] = {
      ...selectedPolicy.value,
      target: 'selected',
      targetCount: selectedEndpoints.value.length,
      updatedAt: new Date().toISOString()
    };

    alert(`策略"${selectedPolicy.value.name}"已分配给${selectedEndpoints.value.length}个终端`);
  }

  showAssignModal.value = false;
};

// 复制策略
const duplicatePolicy = (policy) => {
  // 实际应用中这里会调用API复制策略
  const newPolicy = {
    ...JSON.parse(JSON.stringify(policy)),
    id: `policy-${policies.value.length + 1}`,
    name: `${policy.name} (复制)`,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  policies.value.unshift(newPolicy);
  alert(`已创建策略"${policy.name}"的副本`);
};

// 删除策略
const deletePolicy = (policy) => {
  // 实际应用中这里会调用API删除策略
  if (confirm(`确定要删除策略"${policy.name}"吗？此操作不可撤销。`)) {
    const index = policies.value.findIndex(p => p.id === policy.id);

    if (index !== -1) {
      policies.value.splice(index, 1);
      alert(`策略"${policy.name}"已删除`);
    }
  }
};

// 导入策略
const importPolicy = () => {
  // 实际应用中这里会打开文件选择器并处理导入的JSON
  alert('导入策略功能待实现');
};

// 刷新策略列表
const refreshPolicies = async () => {
  loading.value = true;
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 重新加载数据
    await loadPolicies();
  } finally {
    loading.value = false;
  }
};

// 加载策略数据
const loadPolicies = async () => {
  try {
    // 模拟从API获取数据
    await new Promise(resolve => setTimeout(resolve, 800));

    // 生成模拟策略数据
    const mockPolicies = [
      {
        id: 'policy-1',
        name: '标准终端保护策略',
        type: 'antimalware',
        description: '适用于常规办公终端的标准防恶意软件策略',
        status: 'enabled',
        target: 'all',
        targetCount: 0,
        createdAt: '2023-04-10T08:30:00Z',
        updatedAt: '2023-04-15T14:20:00Z',
        config: {
          realtimeProtection: true,
          scheduledScan: true,
          scanFrequency: 'weekly',
          scanLevel: 'quick',
          threatAction: 'quarantine'
        }
      },
      {
        id: 'policy-2',
        name: '研发部门防火墙策略',
        type: 'firewall',
        description: '适用于研发部门的严格防火墙规则',
        status: 'enabled',
        target: 'selected',
        targetCount: 15,
        createdAt: '2023-03-20T10:15:00Z',
        updatedAt: '2023-04-05T11:30:00Z',
        config: {
          firewallEnabled: true,
          firewallMode: 'block-all',
          loggingLevel: 'all'
        }
      },
      {
        id: 'policy-3',
        name: '财务部门设备控制策略',
        type: 'device-control',
        description: '限制财务部门的外部设备使用',
        status: 'enabled',
        target: 'selected',
        targetCount: 8,
        createdAt: '2023-02-15T09:20:00Z',
        updatedAt: '2023-03-10T16:45:00Z',
        config: {
          usb: 'readonly',
          cdrom: 'allow',
          bluetooth: 'block',
          notifyUser: true
        }
      },
      {
        id: 'policy-4',
        name: '高级入侵防御策略',
        type: 'intrusion-prevention',
        description: '适用于核心服务器的高级入侵防御配置',
        status: 'draft',
        target: 'selected',
        targetCount: 0,
        createdAt: '2023-04-01T13:10:00Z',
        updatedAt: '2023-04-01T13:10:00Z',
        config: {
          ipsEnabled: true,
          protectionLevel: 'high',
          exploitProtection: true,
          networkAttackProtection: true,
          ransomwareProtection: true
        }
      },
      {
        id: 'policy-5',
        name: '默认应用程序控制策略',
        type: 'application-control',
        description: '默认的应用程序控制设置',
        status: 'disabled',
        target: 'all',
        targetCount: 0,
        createdAt: '2023-01-05T11:25:00Z',
        updatedAt: '2023-02-20T10:30:00Z',
        config: {
          controlMode: 'blacklist',
          trustSigned: true,
          blockUnrecognized: false,
          applicationList: 'C:\\Games\\*.exe\nC:\\Downloads\\unknown.exe'
        }
      }
    ];

    policies.value = mockPolicies;

    // 生成模拟终端数据（用于分配对话框）
    const mockEndpoints = [];
    const statuses = ['online', 'offline', 'warning', 'critical'];
    const osList = ['Windows 10', 'Windows 11', 'macOS 13.1', 'Ubuntu 22.04', 'CentOS 8'];

    // 生成终端数据
    for (let i = 0; i < 8; i++) {
      const os = osList[Math.floor(Math.random() * osList.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      mockEndpoints.push({
        id: `endpoint-${i + 1}`,
        name: `ENDPOINT-${String(i + 1).padStart(3, '0')}`,
        ip: `192.168.1.${10 + i}`,
        os: os.split(' ')[0],
        status: status
      });
    }

    endpoints.value = mockEndpoints;
  } catch (error) {
    console.error('获取策略列表失败:', error);
    // 添加错误处理逻辑
  }
};

// 组件挂载时加载数据
onMounted(async () => {
  try {
    await loadPolicies();
  } finally {
    loading.value = false;
  }
});
</script>
