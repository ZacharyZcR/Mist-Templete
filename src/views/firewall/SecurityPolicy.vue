<template>
  <div>
    <!-- 页面标题和操作栏 -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
      <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
        安全策略配置
      </h1>
      <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
        <button
            @click="saveAllPolicies"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'"
        >
          <Icon icon="mdi:content-save" class="mr-2 h-5 w-5" />
          保存所有更改
        </button>
        <button
            @click="resetToDefaults"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'"
        >
          <Icon icon="mdi:restore" class="mr-2 h-5 w-5" />
          恢复默认设置
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" :class="isDarkMode ? 'border-blue-400' : 'border-blue-600'"></div>
    </div>

    <div v-else>
      <!-- 策略状态概览 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div
            v-for="(stat, index) in policyStats"
            :key="index"
            class="rounded-xl shadow-sm p-5 transition-all duration-200 hover:shadow-md"
            :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                {{ stat.name }}
              </h3>
              <p class="text-2xl font-bold mt-1" :class="stat.colorClass">
                {{ stat.value }}
              </p>
            </div>
            <div class="p-2 rounded-md" :class="stat.bgColorClass">
              <Icon :icon="stat.icon" class="h-6 w-6" :class="stat.iconColorClass" />
            </div>
          </div>
        </div>
      </div>

      <!-- 策略类型选择 -->
      <div class="mb-6 border-b" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
        <nav class="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
          <button
              v-for="(tab, index) in policyTabs"
              :key="index"
              @click="activeTab = tab.id"
              class="whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm"
              :class="[
              activeTab === tab.id
                ? (isDarkMode
                    ? 'border-blue-500 text-blue-400'
                    : 'border-blue-600 text-blue-600')
                : (isDarkMode
                    ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'),
            ]"
          >
            <Icon :icon="tab.icon" class="h-5 w-5 inline-block mr-1" />
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- 访问控制策略 -->
      <div v-if="activeTab === 'access-control'" class="space-y-6">
        <div class="rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md"
             :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h3 class="text-lg font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">入站流量策略</h3>
              <p class="text-sm mt-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                控制从外部网络到内部网络的流量访问规则
              </p>
            </div>
            <div class="mt-3 md:mt-0 flex items-center">
              <span class="mr-3 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">启用策略</span>
              <label class="inline-flex relative items-center cursor-pointer">
                <input v-model="policies.accessControl.inbound.enabled" type="checkbox" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                     :class="isDarkMode
                       ? 'peer-checked:bg-blue-600 dark:bg-gray-700 dark:peer-checked:bg-blue-600'
                       : 'peer-checked:bg-blue-600'"></div>
              </label>
            </div>
          </div>

          <div class="space-y-4 mt-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  默认策略
                </label>
                <select
                    v-model="policies.accessControl.inbound.defaultAction"
                    class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                >
                  <option value="block">阻止所有 (安全优先)</option>
                  <option value="allow">允许所有 (访问优先)</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  未知流量处理
                </label>
                <select
                    v-model="policies.accessControl.inbound.unknownTraffic"
                    class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                >
                  <option value="drop">丢弃 (不响应)</option>
                  <option value="reject">拒绝 (发送拒绝通知)</option>
                  <option value="log">仅记录 (允许但记录)</option>
                </select>
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                允许的服务
              </label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div v-for="(service, index) in commonServices" :key="index">
                  <label class="inline-flex items-center">
                    <input
                        type="checkbox"
                        v-model="policies.accessControl.inbound.allowedServices"
                        :value="service.value"
                        class="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                        :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''"
                    >
                    <span class="ml-2 text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                      {{ service.name }}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  允许的IP/网段
                </label>
                <div class="flex">
                  <input
                      v-model="newAllowedIP"
                      type="text"
                      placeholder="例如: 192.168.1.0/24"
                      class="flex-1 px-4 py-2 rounded-l-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                      :class="isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                      : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                  />
                  <button
                      @click="addAllowedIP"
                      class="px-4 py-2 rounded-r-lg font-medium"
                      :class="isDarkMode
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-600 text-white hover:bg-blue-500'"
                  >
                    添加
                  </button>
                </div>
                <div class="mt-2 flex flex-wrap gap-2">
                  <span
                      v-for="(ip, index) in policies.accessControl.inbound.allowedIPs"
                      :key="index"
                      class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
                      :class="isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'"
                  >
                    {{ ip }}
                    <button @click="removeAllowedIP(ip)" class="ml-1 text-xs">
                      <Icon icon="mdi:close" class="h-3 w-3" />
                    </button>
                  </span>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  拒绝的IP/网段
                </label>
                <div class="flex">
                  <input
                      v-model="newBlockedIP"
                      type="text"
                      placeholder="例如: 10.0.0.0/8"
                      class="flex-1 px-4 py-2 rounded-l-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                      :class="isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                      : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                  />
                  <button
                      @click="addBlockedIP"
                      class="px-4 py-2 rounded-r-lg font-medium"
                      :class="isDarkMode
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-red-600 text-white hover:bg-red-500'"
                  >
                    添加
                  </button>
                </div>
                <div class="mt-2 flex flex-wrap gap-2">
                  <span
                      v-for="(ip, index) in policies.accessControl.inbound.blockedIPs"
                      :key="index"
                      class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
                      :class="isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'"
                  >
                    {{ ip }}
                    <button @click="removeBlockedIP(ip)" class="ml-1 text-xs">
                      <Icon icon="mdi:close" class="h-3 w-3" />
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md"
             :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h3 class="text-lg font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">出站流量策略</h3>
              <p class="text-sm mt-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                控制从内部网络到外部网络的流量访问规则
              </p>
            </div>
            <div class="mt-3 md:mt-0 flex items-center">
              <span class="mr-3 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">启用策略</span>
              <label class="inline-flex relative items-center cursor-pointer">
                <input v-model="policies.accessControl.outbound.enabled" type="checkbox" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                     :class="isDarkMode
                       ? 'peer-checked:bg-blue-600 dark:bg-gray-700 dark:peer-checked:bg-blue-600'
                       : 'peer-checked:bg-blue-600'"></div>
              </label>
            </div>
          </div>

          <div class="space-y-4 mt-5">
            <div>
              <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                默认策略
              </label>
              <select
                  v-model="policies.accessControl.outbound.defaultAction"
                  class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                  :class="isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                  : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
              >
                <option value="allow">允许所有 (常见设置)</option>
                <option value="block">阻止所有 (高度限制)</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                限制的目标端口
              </label>
              <div class="flex">
                <input
                    v-model="newBlockedPort"
                    type="text"
                    placeholder="端口号或范围 (例如: 6667 或 1-1024)"
                    class="flex-1 px-4 py-2 rounded-l-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                />
                <button
                    @click="addBlockedPort"
                    class="px-4 py-2 rounded-r-lg font-medium"
                    :class="isDarkMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-600 text-white hover:bg-blue-500'"
                >
                  添加
                </button>
              </div>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                    v-for="(port, index) in policies.accessControl.outbound.blockedPorts"
                    :key="index"
                    class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
                    :class="isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'"
                >
                  {{ port }}
                  <button @click="removeBlockedPort(port)" class="ml-1 text-xs">
                    <Icon icon="mdi:close" class="h-3 w-3" />
                  </button>
                </span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                应用程序控制
              </label>
              <div class="mt-2 space-y-3">
                <div v-for="(app, index) in policies.accessControl.outbound.applications" :key="index"
                     class="flex items-center p-3 rounded-lg border"
                     :class="isDarkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50'">
                  <div class="flex-1">
                    <div class="font-medium" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">
                      {{ app.name }}
                    </div>
                    <div class="text-xs mt-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                      {{ app.path }}
                    </div>
                  </div>
                  <div class="flex items-center">
                    <select
                        v-model="app.policy"
                        class="px-3 py-1 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                        :class="isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                        : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                    >
                      <option value="allow">允许</option>
                      <option value="block">阻止</option>
                      <option value="ask">询问</option>
                    </select>
                  </div>
                </div>

                <button
                    class="w-full py-2 rounded-lg border border-dashed flex items-center justify-center text-sm"
                    :class="isDarkMode
                    ? 'border-gray-600 text-gray-400 hover:text-gray-300 hover:border-gray-500'
                    : 'border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400'"
                >
                  <Icon icon="mdi:plus" class="h-4 w-4 mr-1" />
                  添加应用程序
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 威胁防护策略 -->
      <div v-if="activeTab === 'threat-protection'" class="space-y-6">
        <div class="rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md"
             :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h3 class="text-lg font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">入侵防护系统 (IPS)</h3>
              <p class="text-sm mt-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                检测并阻止恶意网络活动和入侵尝试
              </p>
            </div>
            <div class="mt-3 md:mt-0 flex items-center">
              <span class="mr-3 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">启用 IPS</span>
              <label class="inline-flex relative items-center cursor-pointer">
                <input v-model="policies.threatProtection.ips.enabled" type="checkbox" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                     :class="isDarkMode
                       ? 'peer-checked:bg-blue-600 dark:bg-gray-700 dark:peer-checked:bg-blue-600'
                       : 'peer-checked:bg-blue-600'"></div>
              </label>
            </div>
          </div>

          <div class="space-y-4 mt-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  保护级别
                </label>
                <select
                    v-model="policies.threatProtection.ips.protectionLevel"
                    class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                >
                  <option value="low">低 (仅高可信度威胁)</option>
                  <option value="medium">中 (平衡安全与性能)</option>
                  <option value="high">高 (最大程度防护)</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  威胁检测模式
                </label>
                <select
                    v-model="policies.threatProtection.ips.detectionMode"
                    class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                >
                  <option value="prevention">预防模式 (阻止威胁)</option>
                  <option value="detection">检测模式 (仅记录)</option>
                </select>
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                保护类型
              </label>
              <div class="space-y-2">
                <div v-for="(protection, key) in policies.threatProtection.ips.protectionTypes" :key="key"
                     class="flex items-center justify-between p-3 rounded-lg border"
                     :class="isDarkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50'">
                  <div>
                    <div class="font-medium" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">
                      {{ protection.name }}
                    </div>
                    <div class="text-xs mt-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                      {{ protection.description }}
                    </div>
                  </div>
                  <label class="inline-flex relative items-center cursor-pointer">
                    <input v-model="protection.enabled" type="checkbox" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                         :class="isDarkMode
                          ? 'peer-checked:bg-blue-600 dark:bg-gray-700 dark:peer-checked:bg-blue-600'
                          : 'peer-checked:bg-blue-600'"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md"
             :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h3 class="text-lg font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">DDoS 防护</h3>
              <p class="text-sm mt-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                缓解分布式拒绝服务攻击的配置
              </p>
            </div>
            <div class="mt-3 md:mt-0 flex items-center">
              <span class="mr-3 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">启用防护</span>
              <label class="inline-flex relative items-center cursor-pointer">
                <input v-model="policies.threatProtection.ddos.enabled" type="checkbox" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                     :class="isDarkMode
                       ? 'peer-checked:bg-blue-600 dark:bg-gray-700 dark:peer-checked:bg-blue-600'
                       : 'peer-checked:bg-blue-600'"></div>
              </label>
            </div>
          </div>

          <div class="space-y-4 mt-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  防护级别
                </label>
                <select
                    v-model="policies.threatProtection.ddos.protectionLevel"
                    class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                >
                  <option value="auto">自动 (基于流量动态调整)</option>
                  <option value="low">低 (最小限制)</option>
                  <option value="medium">中 (平衡保护)</option>
                  <option value="high">高 (激进保护)</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  IP数据包速率限制 (每秒)
                </label>
                <input
                    v-model="policies.threatProtection.ddos.packetRateLimit"
                    type="number"
                    min="100"
                    max="100000"
                    class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  TCP连接限制 (每分钟)
                </label>
                <input
                    v-model="policies.threatProtection.ddos.tcpConnectionLimit"
                    type="number"
                    min="10"
                    max="10000"
                    class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  HTTP请求限制 (每分钟)
                </label>
                <input
                    v-model="policies.threatProtection.ddos.httpRequestLimit"
                    type="number"
                    min="10"
                    max="100000"
                    class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                高级设置
              </label>
              <div class="space-y-2">
                <div class="flex items-center">
                  <input
                      id="icmp-flood"
                      v-model="policies.threatProtection.ddos.blockICMPFlood"
                      type="checkbox"
                      class="w-4 h-4 rounded"
                      :class="isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'"
                  >
                  <label for="icmp-flood" class="ml-2 text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    阻止ICMP洪水攻击
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                      id="syn-flood"
                      v-model="policies.threatProtection.ddos.blockSYNFlood"
                      type="checkbox"
                      class="w-4 h-4 rounded"
                      :class="isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'"
                  >
                  <label for="syn-flood" class="ml-2 text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    阻止SYN洪水攻击
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                      id="udp-flood"
                      v-model="policies.threatProtection.ddos.blockUDPFlood"
                      type="checkbox"
                      class="w-4 h-4 rounded"
                      :class="isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'"
                  >
                  <label for="udp-flood" class="ml-2 text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    阻止UDP洪水攻击
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 内容过滤策略 -->
      <div v-if="activeTab === 'content-filtering'" class="space-y-6">
        <div class="rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md"
             :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h3 class="text-lg font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">Web 过滤</h3>
              <p class="text-sm mt-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                控制网站访问和内容过滤
              </p>
            </div>
            <div class="mt-3 md:mt-0 flex items-center">
              <span class="mr-3 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">启用过滤</span>
              <label class="inline-flex relative items-center cursor-pointer">
                <input v-model="policies.contentFiltering.web.enabled" type="checkbox" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                     :class="isDarkMode
                       ? 'peer-checked:bg-blue-600 dark:bg-gray-700 dark:peer-checked:bg-blue-600'
                       : 'peer-checked:bg-blue-600'"></div>
              </label>
            </div>
          </div>

          <div class="space-y-4 mt-5">
            <div>
              <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                过滤模式
              </label>
              <select
                  v-model="policies.contentFiltering.web.filterMode"
                  class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                  :class="isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                  : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
              >
                <option value="blacklist">黑名单 (仅阻止指定内容)</option>
                <option value="whitelist">白名单 (仅允许指定内容)</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                内容类别过滤
              </label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div v-for="(category, index) in webCategories" :key="index">
                  <label class="inline-flex items-center">
                    <input
                        type="checkbox"
                        v-model="policies.contentFiltering.web.blockedCategories"
                        :value="category.value"
                        class="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                        :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''"
                    >
                    <span class="ml-2 text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                      {{ category.name }}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  自定义URL列表
                </label>
                <div class="flex">
                  <input
                      v-model="newCustomURL"
                      type="text"
                      placeholder="例如: example.com"
                      class="flex-1 px-4 py-2 rounded-l-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                      :class="isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                      : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                  />
                  <button
                      @click="addCustomURL"
                      class="px-4 py-2 rounded-r-lg font-medium"
                      :class="isDarkMode
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-600 text-white hover:bg-blue-500'"
                  >
                    添加
                  </button>
                </div>
                <div class="mt-2 flex flex-wrap gap-2">
                  <span
                      v-for="(url, index) in policies.contentFiltering.web.customURLs"
                      :key="index"
                      class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
                      :class="isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'"
                  >
                    {{ url }}
                    <button @click="removeCustomURL(url)" class="ml-1 text-xs">
                      <Icon icon="mdi:close" class="h-3 w-3" />
                    </button>
                  </span>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  关键词过滤
                </label>
                <div class="flex">
                  <input
                      v-model="newKeyword"
                      type="text"
                      placeholder="输入关键词"
                      class="flex-1 px-4 py-2 rounded-l-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                      :class="isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                      : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                  />
                  <button
                      @click="addKeyword"
                      class="px-4 py-2 rounded-r-lg font-medium"
                      :class="isDarkMode
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-600 text-white hover:bg-blue-500'"
                  >
                    添加
                  </button>
                </div>
                <div class="mt-2 flex flex-wrap gap-2">
                  <span
                      v-for="(keyword, index) in policies.contentFiltering.web.keywords"
                      :key="index"
                      class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
                      :class="isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'"
                  >
                    {{ keyword }}
                    <button @click="removeKeyword(keyword)" class="ml-1 text-xs">
                      <Icon icon="mdi:close" class="h-3 w-3" />
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                安全浏览设置
              </label>
              <div class="space-y-2">
                <div class="flex items-center">
                  <input
                      id="phishing"
                      v-model="policies.contentFiltering.web.blockPhishing"
                      type="checkbox"
                      class="w-4 h-4 rounded"
                      :class="isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'"
                  >
                  <label for="phishing" class="ml-2 text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    阻止钓鱼网站
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                      id="malware"
                      v-model="policies.contentFiltering.web.blockMalware"
                      type="checkbox"
                      class="w-4 h-4 rounded"
                      :class="isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'"
                  >
                  <label for="malware" class="ml-2 text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    阻止恶意软件网站
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                      id="cert-check"
                      v-model="policies.contentFiltering.web.enforceHttps"
                      type="checkbox"
                      class="w-4 h-4 rounded"
                      :class="isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'"
                  >
                  <label for="cert-check" class="ml-2 text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    强制HTTPS证书验证
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md"
             :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h3 class="text-lg font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">DNS 过滤</h3>
              <p class="text-sm mt-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                通过DNS层面过滤恶意域名和内容
              </p>
            </div>
            <div class="mt-3 md:mt-0 flex items-center">
              <span class="mr-3 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">启用过滤</span>
              <label class="inline-flex relative items-center cursor-pointer">
                <input v-model="policies.contentFiltering.dns.enabled" type="checkbox" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                     :class="isDarkMode
                       ? 'peer-checked:bg-blue-600 dark:bg-gray-700 dark:peer-checked:bg-blue-600'
                       : 'peer-checked:bg-blue-600'"></div>
              </label>
            </div>
          </div>

          <div class="space-y-4 mt-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  安全DNS服务器
                </label>
                <select
                    v-model="policies.contentFiltering.dns.secureProvider"
                    class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                >
                  <option value="none">不使用</option>
                  <option value="cloudflare">Cloudflare (1.1.1.1)</option>
                  <option value="google">Google (8.8.8.8)</option>
                  <option value="quad9">Quad9 (9.9.9.9)</option>
                  <option value="opendns">OpenDNS</option>
                  <option value="custom">自定义</option>
                </select>
              </div>

              <div v-if="policies.contentFiltering.dns.secureProvider === 'custom'">
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  自定义DNS服务器
                </label>
                <input
                    v-model="policies.contentFiltering.dns.customDNS"
                    type="text"
                    placeholder="例如: 208.67.222.222,208.67.220.220"
                    class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                DNS安全设置
              </label>
              <div class="space-y-2">
                <div class="flex items-center">
                  <input
                      id="dns-over-https"
                      v-model="policies.contentFiltering.dns.useDOH"
                      type="checkbox"
                      class="w-4 h-4 rounded"
                      :class="isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'"
                  >
                  <label for="dns-over-https" class="ml-2 text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    使用DNS-over-HTTPS (DoH)
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                      id="dns-cache"
                      v-model="policies.contentFiltering.dns.enableCache"
                      type="checkbox"
                      class="w-4 h-4 rounded"
                      :class="isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'"
                  >
                  <label for="dns-cache" class="ml-2 text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    启用DNS缓存
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                      id="dns-protection"
                      v-model="policies.contentFiltering.dns.blockMalicious"
                      type="checkbox"
                      class="w-4 h-4 rounded"
                      :class="isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'"
                  >
                  <label for="dns-protection" class="ml-2 text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    阻止已知恶意域名
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                域名黑名单
              </label>
              <div class="flex">
                <input
                    v-model="newBlockedDomain"
                    type="text"
                    placeholder="例如: example.org"
                    class="flex-1 px-4 py-2 rounded-l-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
                />
                <button
                    @click="addBlockedDomain"
                    class="px-4 py-2 rounded-r-lg font-medium"
                    :class="isDarkMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-600 text-white hover:bg-blue-500'"
                >
                  添加
                </button>
              </div>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                    v-for="(domain, index) in policies.contentFiltering.dns.blockedDomains"
                    :key="index"
                    class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
                    :class="isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'"
                >
                  {{ domain }}
                  <button @click="removeBlockedDomain(domain)" class="ml-1 text-xs">
                    <Icon icon="mdi:close" class="h-3 w-3" />
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 保存修改提示 -->
      <div class="mt-6 p-4 rounded-xl shadow-sm border"
           :class="isDarkMode
             ? 'bg-blue-900/30 border-blue-800 text-blue-300'
             : 'bg-blue-50 border-blue-200 text-blue-800'">
        <div class="flex">
          <div class="flex-shrink-0">
            <Icon icon="mdi:information" class="h-5 w-5" />
          </div>
          <div class="ml-3">
            <p class="text-sm">
              修改安全策略可能会影响系统安全性能，请确保了解每项配置的作用。修改后请点击"保存所有更改"按钮使配置生效。
            </p>
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

// 活动标签页
const activeTab = ref('access-control');

// 策略配置数据
const policies = ref({
  accessControl: {
    inbound: {
      enabled: true,
      defaultAction: 'block',
      unknownTraffic: 'drop',
      allowedServices: ['http', 'https', 'ssh'],
      allowedIPs: ['192.168.1.0/24', '10.0.0.0/8'],
      blockedIPs: ['45.12.34.56', '98.76.54.32/24']
    },
    outbound: {
      enabled: true,
      defaultAction: 'allow',
      blockedPorts: ['6667', '25'],
      applications: [
        { name: 'Web浏览器', path: '/usr/bin/firefox', policy: 'allow' },
        { name: '文件传输', path: '/usr/bin/filezilla', policy: 'ask' },
        { name: '聊天应用', path: '/usr/bin/discord', policy: 'allow' }
      ]
    }
  },
  threatProtection: {
    ips: {
      enabled: true,
      protectionLevel: 'medium',
      detectionMode: 'prevention',
      protectionTypes: {
        exploits: {
          name: '漏洞利用防护',
          description: '检测并阻止针对系统和应用程序漏洞的攻击',
          enabled: true
        },
        scanning: {
          name: '扫描检测',
          description: '检测端口扫描和主机发现活动',
          enabled: true
        },
        bruteforce: {
          name: '暴力破解防护',
          description: '阻止针对认证系统的暴力破解尝试',
          enabled: true
        },
        anomaly: {
          name: '异常流量检测',
          description: '识别异常流量模式和行为',
          enabled: false
        }
      }
    },
    ddos: {
      enabled: true,
      protectionLevel: 'medium',
      packetRateLimit: 1000,
      tcpConnectionLimit: 100,
      httpRequestLimit: 500,
      blockICMPFlood: true,
      blockSYNFlood: true,
      blockUDPFlood: true
    }
  },
  contentFiltering: {
    web: {
      enabled: true,
      filterMode: 'blacklist',
      blockedCategories: ['adult', 'gambling', 'malware'],
      customURLs: ['example.com', 'badsite.net'],
      keywords: ['赌博', '色情'],
      blockPhishing: true,
      blockMalware: true,
      enforceHttps: true
    },
    dns: {
      enabled: true,
      secureProvider: 'cloudflare',
      customDNS: '',
      useDOH: true,
      enableCache: true,
      blockMalicious: true,
      blockedDomains: ['malicious-site.com', 'adserver.net']
    }
  }
});

// 表单输入暂存区
const newAllowedIP = ref('');
const newBlockedIP = ref('');
const newBlockedPort = ref('');
const newCustomURL = ref('');
const newKeyword = ref('');
const newBlockedDomain = ref('');

// 常用服务列表
const commonServices = ref([
  { name: 'HTTP', value: 'http' },
  { name: 'HTTPS', value: 'https' },
  { name: 'SSH', value: 'ssh' },
  { name: 'FTP', value: 'ftp' },
  { name: 'SMTP', value: 'smtp' },
  { name: 'DNS', value: 'dns' },
  { name: 'RDP', value: 'rdp' },
  { name: 'TELNET', value: 'telnet' }
]);

// 网站内容类别
const webCategories = ref([
  { name: '成人内容', value: 'adult' },
  { name: '博彩/赌博', value: 'gambling' },
  { name: '恶意软件', value: 'malware' },
  { name: '钓鱼网站', value: 'phishing' },
  { name: '暴力内容', value: 'violence' },
  { name: '武器相关', value: 'weapons' },
  { name: '毒品相关', value: 'drugs' },
  { name: '极端主义', value: 'extremism' },
  { name: '社交媒体', value: 'social' }
]);

// 策略类型标签
const policyTabs = ref([
  { id: 'access-control', name: '访问控制', icon: 'mdi:shield-lock' },
  { id: 'threat-protection', name: '威胁防护', icon: 'mdi:shield-alert' },
  { id: 'content-filtering', name: '内容过滤', icon: 'mdi:filter' }
]);

// 策略统计数据
const policyStats = computed(() => {
  // 计算启用的策略数量
  const enabledCount = [
    policies.value.accessControl.inbound.enabled,
    policies.value.accessControl.outbound.enabled,
    policies.value.threatProtection.ips.enabled,
    policies.value.threatProtection.ddos.enabled,
    policies.value.contentFiltering.web.enabled,
    policies.value.contentFiltering.dns.enabled
  ].filter(Boolean).length;

  // 计算高安全级别的策略数量
  const highSecurityCount = [
    policies.value.accessControl.inbound.defaultAction === 'block',
    policies.value.threatProtection.ips.protectionLevel === 'high',
    policies.value.threatProtection.ddos.protectionLevel === 'high',
    policies.value.contentFiltering.web.filterMode === 'whitelist'
  ].filter(Boolean).length;

  // 计算被阻止的项目总数
  const blockedItemsCount =
      policies.value.accessControl.inbound.blockedIPs.length +
      policies.value.accessControl.outbound.blockedPorts.length +
      policies.value.contentFiltering.web.customURLs.length +
      policies.value.contentFiltering.dns.blockedDomains.length;

  // 计算过滤的内容分类数量
  const filteredCategoriesCount = policies.value.contentFiltering.web.blockedCategories.length;

  return [
    {
      name: '启用策略',
      value: `${enabledCount}/6`,
      colorClass: isDarkMode.value ? 'text-blue-400' : 'text-blue-600',
      bgColorClass: isDarkMode.value ? 'bg-blue-900/30' : 'bg-blue-100',
      iconColorClass: isDarkMode.value ? 'text-blue-400' : 'text-blue-500',
      icon: 'mdi:shield-check'
    },
    {
      name: '高安全策略',
      value: highSecurityCount,
      colorClass: isDarkMode.value ? 'text-green-400' : 'text-green-600',
      bgColorClass: isDarkMode.value ? 'bg-green-900/30' : 'bg-green-100',
      iconColorClass: isDarkMode.value ? 'text-green-400' : 'text-green-500',
      icon: 'mdi:security'
    },
    {
      name: '阻止项目',
      value: blockedItemsCount,
      colorClass: isDarkMode.value ? 'text-red-400' : 'text-red-600',
      bgColorClass: isDarkMode.value ? 'bg-red-900/30' : 'bg-red-100',
      iconColorClass: isDarkMode.value ? 'text-red-400' : 'text-red-500',
      icon: 'mdi:block-helper'
    },
    {
      name: '过滤分类',
      value: filteredCategoriesCount,
      colorClass: isDarkMode.value ? 'text-purple-400' : 'text-purple-600',
      bgColorClass: isDarkMode.value ? 'bg-purple-900/30' : 'bg-purple-100',
      iconColorClass: isDarkMode.value ? 'text-purple-400' : 'text-purple-500',
      icon: 'mdi:filter-variant'
    }
  ];
});

// 添加允许的IP
const addAllowedIP = () => {
  if (newAllowedIP.value && !policies.value.accessControl.inbound.allowedIPs.includes(newAllowedIP.value)) {
    policies.value.accessControl.inbound.allowedIPs.push(newAllowedIP.value);
    newAllowedIP.value = '';
  }
};

// 移除允许的IP
const removeAllowedIP = (ip) => {
  policies.value.accessControl.inbound.allowedIPs = policies.value.accessControl.inbound.allowedIPs.filter(i => i !== ip);
};

// 添加阻止的IP
const addBlockedIP = () => {
  if (newBlockedIP.value && !policies.value.accessControl.inbound.blockedIPs.includes(newBlockedIP.value)) {
    policies.value.accessControl.inbound.blockedIPs.push(newBlockedIP.value);
    newBlockedIP.value = '';
  }
};

// 移除阻止的IP
const removeBlockedIP = (ip) => {
  policies.value.accessControl.inbound.blockedIPs = policies.value.accessControl.inbound.blockedIPs.filter(i => i !== ip);
};

// 添加阻止的端口
const addBlockedPort = () => {
  if (newBlockedPort.value && !policies.value.accessControl.outbound.blockedPorts.includes(newBlockedPort.value)) {
    policies.value.accessControl.outbound.blockedPorts.push(newBlockedPort.value);
    newBlockedPort.value = '';
  }
};

// 移除阻止的端口
const removeBlockedPort = (port) => {
  policies.value.accessControl.outbound.blockedPorts = policies.value.accessControl.outbound.blockedPorts.filter(p => p !== port);
};

// 添加自定义URL
const addCustomURL = () => {
  if (newCustomURL.value && !policies.value.contentFiltering.web.customURLs.includes(newCustomURL.value)) {
    policies.value.contentFiltering.web.customURLs.push(newCustomURL.value);
    newCustomURL.value = '';
  }
};

// 移除自定义URL
const removeCustomURL = (url) => {
  policies.value.contentFiltering.web.customURLs = policies.value.contentFiltering.web.customURLs.filter(u => u !== url);
};

// 添加关键词
const addKeyword = () => {
  if (newKeyword.value && !policies.value.contentFiltering.web.keywords.includes(newKeyword.value)) {
    policies.value.contentFiltering.web.keywords.push(newKeyword.value);
    newKeyword.value = '';
  }
};

// 移除关键词
const removeKeyword = (keyword) => {
  policies.value.contentFiltering.web.keywords = policies.value.contentFiltering.web.keywords.filter(k => k !== keyword);
};

// 添加阻止的域名
const addBlockedDomain = () => {
  if (newBlockedDomain.value && !policies.value.contentFiltering.dns.blockedDomains.includes(newBlockedDomain.value)) {
    policies.value.contentFiltering.dns.blockedDomains.push(newBlockedDomain.value);
    newBlockedDomain.value = '';
  }
};

// 移除阻止的域名
const removeBlockedDomain = (domain) => {
  policies.value.contentFiltering.dns.blockedDomains = policies.value.contentFiltering.dns.blockedDomains.filter(d => d !== domain);
};

// 保存所有策略
const saveAllPolicies = () => {
  localStorage.setItem('securityPolicies', JSON.stringify(policies.value));
  alert('安全策略已成功保存');
};

// 重置为默认设置
const resetToDefaults = () => {
  if (confirm('确定要恢复默认安全策略设置吗？这将覆盖您的所有自定义设置。')) {
    localStorage.removeItem('securityPolicies');
    loadPolicies();
  }
};

// 加载策略配置
const loadPolicies = async () => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 从本地存储获取保存的策略配置
    const savedPolicies = localStorage.getItem('securityPolicies');

    if (savedPolicies) {
      policies.value = JSON.parse(savedPolicies);
    }
    // 如果没有保存的配置，使用默认配置（已在data中定义）
  } catch (error) {
    console.error('加载安全策略失败:', error);
  } finally {
    loading.value = false;
  }
};

// 组件挂载时加载数据
onMounted(async () => {
  await loadPolicies();
});
</script>
