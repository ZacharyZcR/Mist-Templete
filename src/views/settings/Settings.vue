<template>
  <div class="max-w-4xl mx-auto">
    <!-- 页面标题和说明 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">系统设置</h1>
      <p class="mt-1 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
        配置系统参数和全局设置以满足您的需求
      </p>
    </div>

    <!-- 设置保存成功提示 -->
    <div v-if="showSuccessMessage"
         class="mb-6 p-4 rounded-md"
         :class="isDarkMode ? 'bg-green-900/20 border border-green-800 text-green-400' : 'bg-green-50 border border-green-200 text-green-700'">
      <div class="flex">
        <Icon icon="mdi:check-circle" class="h-5 w-5 mr-2" :class="isDarkMode ? 'text-green-400' : 'text-green-500'" />
        <span>设置已成功保存</span>
      </div>
    </div>

    <!-- 设置标签页 -->
    <div class="mb-6 border-b" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
      <ul class="flex flex-wrap -mb-px text-sm font-medium">
        <li v-for="tab in tabs" :key="tab.id" class="mr-2">
          <button
              @click="activeTab = tab.id"
              :class="[
              'inline-block py-3 px-4 rounded-t-lg border-b-2',
              activeTab === tab.id
                ? (isDarkMode
                  ? 'text-blue-500 border-blue-500'
                  : 'text-blue-600 border-blue-600')
                : (isDarkMode
                  ? 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600')
            ]"
          >
            <Icon :icon="tab.icon" class="h-5 w-5 inline-block mr-1.5" />
            {{ tab.name }}
          </button>
        </li>
      </ul>
    </div>

    <!-- 设置内容区域 -->
    <div class="rounded-lg shadow p-6" :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
      <!-- 个人偏好设置 -->
      <div v-if="activeTab === 'preferences'">
        <h2 class="text-lg font-semibold mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-800'">个人偏好设置</h2>

        <!-- 暗黑模式设置 -->
        <div class="mb-5 pb-5 border-b" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">暗黑模式</h3>
              <p class="text-sm mt-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
                切换应用的颜色主题
              </p>
            </div>
            <div class="flex items-center">
              <span class="text-sm mr-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                {{ isDarkMode ? '已启用' : '已禁用' }}
              </span>
              <button
                  @click="toggleDarkMode"
                  class="relative inline-flex h-6 w-11 items-center rounded-full"
                  :class="isDarkMode ? 'bg-blue-600' : 'bg-gray-200'"
              >
                <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                    :class="isDarkMode ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- 语言设置 -->
        <div class="mb-5 pb-5 border-b" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
          <div>
            <h3 class="font-medium mb-3" :class="isDarkMode ? 'text-white' : 'text-gray-800'">语言设置</h3>
            <select
                v-model="settings.preferences.language"
                class="w-full sm:w-64 px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
            >
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English (US)</option>
              <option value="ja-JP">日本語</option>
              <option value="ko-KR">한국어</option>
            </select>
          </div>
        </div>

        <!-- 时区设置 -->
        <div class="mb-5 pb-5 border-b" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
          <h3 class="font-medium mb-3" :class="isDarkMode ? 'text-white' : 'text-gray-800'">时区设置</h3>
          <select
              v-model="settings.preferences.timezone"
              class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
          >
            <option value="Asia/Shanghai">亚洲/上海 (GMT+8)</option>
            <option value="Asia/Tokyo">亚洲/东京 (GMT+9)</option>
            <option value="America/New_York">美国/纽约 (GMT-5)</option>
            <option value="Europe/London">欧洲/伦敦 (GMT+0)</option>
            <option value="Europe/Paris">欧洲/巴黎 (GMT+1)</option>
          </select>
        </div>

        <!-- 日期格式设置 -->
        <div>
          <h3 class="font-medium mb-3" :class="isDarkMode ? 'text-white' : 'text-gray-800'">日期格式</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="flex items-center">
              <input
                  type="radio"
                  id="date-format-1"
                  value="YYYY-MM-DD"
                  v-model="settings.preferences.dateFormat"
                  class="w-4 h-4"
                  :class="isDarkMode ? 'text-blue-600 bg-gray-700' : 'text-blue-600 bg-gray-100'"
              />
              <label
                  for="date-format-1"
                  class="ml-2 text-sm"
                  :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
              >
                YYYY-MM-DD (2023-01-31)
              </label>
            </div>

            <div class="flex items-center">
              <input
                  type="radio"
                  id="date-format-2"
                  value="DD/MM/YYYY"
                  v-model="settings.preferences.dateFormat"
                  class="w-4 h-4"
                  :class="isDarkMode ? 'text-blue-600 bg-gray-700' : 'text-blue-600 bg-gray-100'"
              />
              <label
                  for="date-format-2"
                  class="ml-2 text-sm"
                  :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
              >
                DD/MM/YYYY (31/01/2023)
              </label>
            </div>

            <div class="flex items-center">
              <input
                  type="radio"
                  id="date-format-3"
                  value="MM/DD/YYYY"
                  v-model="settings.preferences.dateFormat"
                  class="w-4 h-4"
                  :class="isDarkMode ? 'text-blue-600 bg-gray-700' : 'text-blue-600 bg-gray-100'"
              />
              <label
                  for="date-format-3"
                  class="ml-2 text-sm"
                  :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
              >
                MM/DD/YYYY (01/31/2023)
              </label>
            </div>

            <div class="flex items-center">
              <input
                  type="radio"
                  id="date-format-4"
                  value="MMM DD, YYYY"
                  v-model="settings.preferences.dateFormat"
                  class="w-4 h-4"
                  :class="isDarkMode ? 'text-blue-600 bg-gray-700' : 'text-blue-600 bg-gray-100'"
              />
              <label
                  for="date-format-4"
                  class="ml-2 text-sm"
                  :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
              >
                MMM DD, YYYY (Jan 31, 2023)
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 通知设置 -->
      <div v-if="activeTab === 'notifications'">
        <h2 class="text-lg font-semibold mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-800'">通知设置</h2>

        <!-- 电子邮件通知 -->
        <div class="mb-5 pb-5 border-b" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
          <h3 class="font-medium mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-800'">电子邮件通知</h3>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <span :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">系统更新</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                  接收关于系统更新和维护的通知
                </p>
              </div>
              <button
                  @click="settings.notifications.emailSystemUpdates = !settings.notifications.emailSystemUpdates"
                  class="relative inline-flex h-6 w-11 items-center rounded-full"
                  :class="settings.notifications.emailSystemUpdates ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'"
              >
                <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                    :class="settings.notifications.emailSystemUpdates ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <span :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">产品更新</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                  当产品信息更新时收到通知
                </p>
              </div>
              <button
                  @click="settings.notifications.emailProductUpdates = !settings.notifications.emailProductUpdates"
                  class="relative inline-flex h-6 w-11 items-center rounded-full"
                  :class="settings.notifications.emailProductUpdates ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'"
              >
                <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                    :class="settings.notifications.emailProductUpdates ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <span :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">安全警报</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                  接收账户安全相关的紧急通知
                </p>
              </div>
              <button
                  @click="settings.notifications.emailSecurityAlerts = !settings.notifications.emailSecurityAlerts"
                  class="relative inline-flex h-6 w-11 items-center rounded-full"
                  :class="settings.notifications.emailSecurityAlerts ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'"
              >
                <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                    :class="settings.notifications.emailSecurityAlerts ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- 应用内通知 -->
        <div>
          <h3 class="font-medium mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-800'">应用内通知</h3>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <span :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">新订单通知</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                  当有新订单时在应用内显示通知
                </p>
              </div>
              <button
                  @click="settings.notifications.appNewOrders = !settings.notifications.appNewOrders"
                  class="relative inline-flex h-6 w-11 items-center rounded-full"
                  :class="settings.notifications.appNewOrders ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'"
              >
                <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                    :class="settings.notifications.appNewOrders ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <span :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">任务提醒</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                  显示关于任务截止日期的提醒
                </p>
              </div>
              <button
                  @click="settings.notifications.appTaskReminders = !settings.notifications.appTaskReminders"
                  class="relative inline-flex h-6 w-11 items-center rounded-full"
                  :class="settings.notifications.appTaskReminders ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'"
              >
                <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                    :class="settings.notifications.appTaskReminders ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <span :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">系统消息</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                  显示关于系统状态和更新的通知
                </p>
              </div>
              <button
                  @click="settings.notifications.appSystemMessages = !settings.notifications.appSystemMessages"
                  class="relative inline-flex h-6 w-11 items-center rounded-full"
                  :class="settings.notifications.appSystemMessages ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'"
              >
                <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                    :class="settings.notifications.appSystemMessages ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 安全设置 -->
      <div v-if="activeTab === 'security'">
        <h2 class="text-lg font-semibold mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-800'">安全设置</h2>

        <!-- 登录安全 -->
        <div class="mb-5 pb-5 border-b" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
          <h3 class="font-medium mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-800'">登录安全</h3>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <span :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">两步验证</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                  启用两步验证以增强账户安全
                </p>
              </div>
              <button
                  @click="settings.security.twoFactorAuth = !settings.security.twoFactorAuth"
                  class="relative inline-flex h-6 w-11 items-center rounded-full"
                  :class="settings.security.twoFactorAuth ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'"
              >
                <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                    :class="settings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <span :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">记住登录状态</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                  在此设备上保持登录状态
                </p>
              </div>
              <button
                  @click="settings.security.rememberLogin = !settings.security.rememberLogin"
                  class="relative inline-flex h-6 w-11 items-center rounded-full"
                  :class="settings.security.rememberLogin ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'"
              >
                <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                    :class="settings.security.rememberLogin ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- 密码更新 -->
        <div>
          <h3 class="font-medium mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-800'">更改密码</h3>

          <div class="space-y-4">
            <div>
              <label
                  class="block text-sm font-medium mb-1"
                  :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
              >
                当前密码
              </label>
              <input
                  type="password"
                  v-model="currentPassword"
                  class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
                  :class="isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                  : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
                  placeholder="输入当前密码"
              />
            </div>

            <div>
              <label
                  class="block text-sm font-medium mb-1"
                  :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
              >
                新密码
              </label>
              <input
                  type="password"
                  v-model="newPassword"
                  class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
                  :class="isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                  : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
                  placeholder="输入新密码"
              />
            </div>

            <div>
              <label
                  class="block text-sm font-medium mb-1"
                  :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
              >
                确认新密码
              </label>
              <input
                  type="password"
                  v-model="confirmPassword"
                  class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
                  :class="isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                  : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
                  placeholder="再次输入新密码"
              />
            </div>

            <div>
              <button
                  class="px-4 py-2 rounded-md font-medium transition-colors text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  :disabled="!currentPassword || !newPassword || newPassword !== confirmPassword"
                  @click="changePassword"
              >
                更新密码
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 权限设置 -->
      <div v-if="activeTab === 'permissions'">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">权限设置</h2>
          <div class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
            需要管理员权限
          </div>
        </div>

        <!-- 用户角色权限 -->
        <div class="mb-5 pb-5 border-b" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
          <h3 class="font-medium mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-800'">用户角色权限</h3>

          <div class="space-y-4">
            <div>
              <h4 class="text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">管理员权限</h4>

              <div class="space-y-2 pl-4">
                <div class="flex items-center">
                  <input
                      type="checkbox"
                      id="perm-admin-users"
                      v-model="settings.permissions.adminUsers"
                      class="w-4 h-4 rounded"
                      :class="isDarkMode ? 'text-blue-600 bg-gray-700' : 'text-blue-600 bg-gray-100'"
                  />
                  <label
                      for="perm-admin-users"
                      class="ml-2 text-sm"
                      :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
                  >
                    用户管理
                  </label>
                </div>

                <div class="flex items-center">
                  <input
                      type="checkbox"
                      id="perm-admin-roles"
                      v-model="settings.permissions.adminRoles"
                      class="w-4 h-4 rounded"
                      :class="isDarkMode ? 'text-blue-600 bg-gray-700' : 'text-blue-600 bg-gray-100'"
                  />
                  <label
                      for="perm-admin-roles"
                      class="ml-2 text-sm"
                      :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
                  >
                    角色管理
                  </label>
                </div>

                <div class="flex items-center">
                  <input
                      type="checkbox"
                      id="perm-admin-system"
                      v-model="settings.permissions.adminSystem"
                      class="w-4 h-4 rounded"
                      :class="isDarkMode ? 'text-blue-600 bg-gray-700' : 'text-blue-600 bg-gray-100'"
                  />
                  <label
                      for="perm-admin-system"
                      class="ml-2 text-sm"
                      :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
                  >
                    系统设置
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">业务权限</h4>

              <div class="space-y-2 pl-4">
                <div class="flex items-center">
                  <input
                      type="checkbox"
                      id="perm-business-products"
                      v-model="settings.permissions.businessProducts"
                      class="w-4 h-4 rounded"
                      :class="isDarkMode ? 'text-blue-600 bg-gray-700' : 'text-blue-600 bg-gray-100'"
                  />
                  <label
                      for="perm-business-products"
                      class="ml-2 text-sm"
                      :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
                  >
                    产品管理
                  </label>
                </div>

                <div class="flex items-center">
                  <input
                      type="checkbox"
                      id="perm-business-orders"
                      v-model="settings.permissions.businessOrders"
                      class="w-4 h-4 rounded"
                      :class="isDarkMode ? 'text-blue-600 bg-gray-700' : 'text-blue-600 bg-gray-100'"
                  />
                  <label
                      for="perm-business-orders"
                      class="ml-2 text-sm"
                      :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
                  >
                    订单管理
                  </label>
                </div>

                <div class="flex items-center">
                  <input
                      type="checkbox"
                      id="perm-business-reports"
                      v-model="settings.permissions.businessReports"
                      class="w-4 h-4 rounded"
                      :class="isDarkMode ? 'text-blue-600 bg-gray-700' : 'text-blue-600 bg-gray-100'"
                  />
                  <label
                      for="perm-business-reports"
                      class="ml-2 text-sm"
                      :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
                  >
                    报表查看
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 应用访问控制 -->
        <div>
          <h3 class="font-medium mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-800'">应用访问控制</h3>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <span :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">公开注册</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                  允许用户自行注册账户
                </p>
              </div>
              <button
                  @click="settings.permissions.publicRegistration = !settings.permissions.publicRegistration"
                  class="relative inline-flex h-6 w-11 items-center rounded-full"
                  :class="settings.permissions.publicRegistration ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'"
              >
                <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                    :class="settings.permissions.publicRegistration ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <span :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">访客访问</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                  允许未登录用户访问公开内容
                </p>
              </div>
              <button
                  @click="settings.permissions.guestAccess = !settings.permissions.guestAccess"
                  class="relative inline-flex h-6 w-11 items-center rounded-full"
                  :class="settings.permissions.guestAccess ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'"
              >
                <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                    :class="settings.permissions.guestAccess ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 保存按钮 -->
    <div class="mt-6 flex justify-end">
      <button
          @click="saveSettings"
          class="px-4 py-2 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        保存设置
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { Icon } from '@iconify/vue';

// 当前激活的标签页
const activeTab = ref('preferences');

// 从父组件获取暗黑模式状态
const isDarkMode = inject('isDarkMode', ref(false));

// 切换暗黑模式
const toggleDarkMode = () => {
  // 使用父组件提供的isDarkMode响应式对象
  isDarkMode.value = !isDarkMode.value;
};

// 标签页配置
const tabs = [
  { id: 'preferences', name: '偏好设置', icon: 'mdi:tune' },
  { id: 'notifications', name: '通知设置', icon: 'mdi:bell-outline' },
  { id: 'security', name: '安全设置', icon: 'mdi:shield-outline' },
  { id: 'permissions', name: '权限设置', icon: 'mdi:account-key-outline' }
];

// 设置数据
const settings = ref({
  preferences: {
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    dateFormat: 'YYYY-MM-DD'
  },
  notifications: {
    emailSystemUpdates: true,
    emailProductUpdates: false,
    emailSecurityAlerts: true,
    appNewOrders: true,
    appTaskReminders: true,
    appSystemMessages: true
  },
  security: {
    twoFactorAuth: false,
    rememberLogin: true
  },
  permissions: {
    adminUsers: true,
    adminRoles: true,
    adminSystem: true,
    businessProducts: true,
    businessOrders: true,
    businessReports: false,
    publicRegistration: false,
    guestAccess: true
  }
});

// 密码相关字段
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// 设置保存成功提示
const showSuccessMessage = ref(false);

// 保存设置
const saveSettings = () => {
  // 这里可以添加实际的API调用来保存设置
  console.log('保存设置:', settings.value);

  // 显示成功消息
  showSuccessMessage.value = true;

  // 3秒后隐藏消息
  setTimeout(() => {
    showSuccessMessage.value = false;
  }, 3000);
};

// 更改密码
const changePassword = () => {
  if (newPassword.value !== confirmPassword.value) {
    alert('新密码和确认密码不匹配');
    return;
  }

  // 这里可以添加实际的API调用来更改密码
  console.log('更改密码', {
    currentPassword: currentPassword.value,
    newPassword: newPassword.value
  });

  // 重置表单
  currentPassword.value = '';
  newPassword.value = '';
  confirmPassword.value = '';

  // 显示成功消息
  showSuccessMessage.value = true;

  // 3秒后隐藏消息
  setTimeout(() => {
    showSuccessMessage.value = false;
  }, 3000);
};
</script>