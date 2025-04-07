<template>
  <div>
    <!-- 页面标题和操作按钮 -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">用户详情</h1>

      <div class="flex flex-wrap gap-2 mt-3 sm:mt-0">
        <router-link
            to="/users"
            class="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors"
            :class="isDarkMode
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'"
        >
          <Icon icon="mdi:arrow-left" class="mr-2 h-4 w-4" />
          返回列表
        </router-link>

        <router-link
            :to="`/users/${userId}/edit`"
            class="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Icon icon="mdi:pencil" class="mr-2 h-4 w-4" />
          编辑用户
        </router-link>

        <button
            @click="showDeleteConfirm = true"
            class="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors bg-red-600 hover:bg-red-700 text-white"
        >
          <Icon icon="mdi:delete" class="mr-2 h-4 w-4" />
          删除用户
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center min-h-[200px]">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2" :class="isDarkMode ? 'border-blue-500' : 'border-blue-600'"></div>
      <span class="ml-3" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">加载用户信息...</span>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="rounded-lg overflow-hidden shadow-md" :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
      <div class="p-6">
        <div class="flex items-center">
          <Icon icon="mdi:alert-circle" class="h-6 w-6 text-red-500" />
          <h3 class="ml-2 text-lg font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
            加载用户信息失败
          </h3>
        </div>
        <p class="mt-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
          无法加载用户详情，请稍后重试。
        </p>
        <button
            @click="loadUserData"
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          重试
        </button>
      </div>
    </div>

    <!-- 用户详情 -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 主要信息卡片 -->
      <div class="lg:col-span-1">
        <div class="rounded-lg overflow-hidden shadow-md" :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
          <!-- 用户头像和基本信息 -->
          <div class="p-6 border-b" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
            <div class="flex flex-col items-center">
              <!-- 用户头像 -->
              <div class="h-24 w-24 rounded-full flex items-center justify-center text-white text-2xl"
                   :style="{ backgroundColor: getAvatarColor(user.name) }">
                {{ getInitials(user.name) }}
              </div>

              <!-- 用户姓名 -->
              <h3 class="mt-4 text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                {{ user.name }}
              </h3>

              <!-- 电子邮件 -->
              <p class="mt-1 flex items-center text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
                <Icon icon="mdi:email" class="mr-1 h-4 w-4" />
                {{ user.email }}
              </p>

              <!-- 用户ID -->
              <p class="mt-1 text-xs text-center" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                用户ID: {{ user.id }}
              </p>

              <!-- 角色标签 -->
              <div class="mt-4">
                <span
                    class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getRoleClass(user.role)"
                >
                  {{ getRoleDisplay(user.role) }}
                </span>
              </div>
            </div>
          </div>

          <!-- 状态信息 -->
          <div class="p-6">
            <h4 class="font-medium mb-4" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">
              账户信息
            </h4>

            <div class="space-y-3">
              <!-- 账户状态 -->
              <div class="flex justify-between items-center">
                <span class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">状态</span>
                <span
                    class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getStatusClass(user.status)"
                >
                  {{ getStatusDisplay(user.status) }}
                </span>
              </div>

              <!-- 注册时间 -->
              <div class="flex justify-between items-center">
                <span class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">注册时间</span>
                <span class="text-sm" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">
                  {{ formatDate(user.registeredAt) }}
                </span>
              </div>

              <!-- 最后登录 -->
              <div class="flex justify-between items-center">
                <span class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">最后登录</span>
                <span class="text-sm" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">
                  {{ formatDate(user.lastLoginAt) }}
                </span>
              </div>

              <!-- 账户验证状态 -->
              <div class="flex justify-between items-center">
                <span class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">邮箱验证</span>
                <span
                    class="inline-flex items-center text-xs font-medium"
                    :class="user.emailVerified ? 'text-green-500' : 'text-red-500'"
                >
                  <Icon :icon="user.emailVerified ? 'mdi:check-circle' : 'mdi:close-circle'" class="mr-1 h-4 w-4" />
                  {{ user.emailVerified ? '已验证' : '未验证' }}
                </span>
              </div>

              <!-- 账户安全 -->
              <div class="flex justify-between items-center">
                <span class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">两步验证</span>
                <span
                    class="inline-flex items-center text-xs font-medium"
                    :class="user.twoFactorEnabled ? 'text-green-500' : 'text-yellow-500'"
                >
                  <Icon :icon="user.twoFactorEnabled ? 'mdi:shield-check' : 'mdi:shield-off'" class="mr-1 h-4 w-4" />
                  {{ user.twoFactorEnabled ? '已启用' : '未启用' }}
                </span>
              </div>
            </div>

            <!-- 账户操作 -->
            <div class="mt-6 pt-4 border-t" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
              <div class="space-y-2">
                <button
                    @click="resetPassword"
                    class="w-full flex justify-center items-center px-4 py-2 rounded-md text-sm transition-colors"
                    :class="isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'"
                >
                  <Icon icon="mdi:lock-reset" class="mr-2 h-4 w-4" />
                  重置密码
                </button>

                <button
                    @click="toggleAccountStatus"
                    class="w-full flex justify-center items-center px-4 py-2 rounded-md text-sm transition-colors"
                    :class="user.status === 'active'
                    ? (isDarkMode ? 'bg-yellow-700 hover:bg-yellow-800 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-white')
                    : (isDarkMode ? 'bg-green-700 hover:bg-green-800 text-white' : 'bg-green-500 hover:bg-green-600 text-white')"
                >
                  <Icon :icon="user.status === 'active' ? 'mdi:account-lock' : 'mdi:account-check'" class="mr-2 h-4 w-4" />
                  {{ user.status === 'active' ? '禁用账户' : '启用账户' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 详细信息和活动记录 -->
      <div class="lg:col-span-2 space-y-6">
        <!-- 权限信息 -->
        <div class="rounded-lg overflow-hidden shadow-md" :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
          <div class="p-6">
            <h4 class="font-medium mb-4" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">
              权限信息
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div
                  v-for="(permission, index) in user.permissions"
                  :key="index"
                  class="flex items-center p-2 rounded-md"
                  :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-100'"
              >
                <Icon icon="mdi:check-circle" class="h-4 w-4 text-green-500 mr-2" />
                <span class="text-sm" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">
                  {{ permission }}
                </span>
              </div>
            </div>

            <!-- 没有权限的情况 -->
            <div v-if="user.permissions.length === 0" class="text-center py-4">
              <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                此用户没有特殊权限
              </p>
            </div>
          </div>
        </div>

        <!-- 活动记录 -->
        <div class="rounded-lg overflow-hidden shadow-md" :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-medium" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">
                最近活动
              </h4>

              <button
                  class="text-sm font-medium"
                  :class="isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'"
              >
                查看全部
              </button>
            </div>

            <!-- 活动时间线 -->
            <div class="space-y-4">
              <div
                  v-for="(activity, index) in user.activities"
                  :key="index"
                  class="flex"
              >
                <!-- 活动图标 -->
                <div
                    class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                    :class="getActivityIconClass(activity.type)"
                >
                  <Icon :icon="getActivityIcon(activity.type)" class="h-4 w-4 text-white" />
                </div>

                <!-- 活动详情 -->
                <div class="ml-4 flex-1">
                  <div class="flex justify-between">
                    <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">
                      {{ activity.description }}
                    </p>
                    <span class="text-xs" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                      {{ formatTimeAgo(activity.timestamp) }}
                    </span>
                  </div>
                  <p class="text-xs mt-0.5" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                    {{ activity.details }}
                  </p>
                </div>
              </div>

              <!-- 没有活动的情况 -->
              <div v-if="user.activities.length === 0" class="text-center py-4">
                <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                  暂无活动记录
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 使用统计 -->
        <div class="rounded-lg overflow-hidden shadow-md" :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
          <div class="p-6">
            <h4 class="font-medium mb-4" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">
              使用统计
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                  class="p-4 rounded-lg flex flex-col items-center"
                  :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-100'"
              >
                <span class="text-sm mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
                  登录次数
                </span>
                <span class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
                  {{ user.stats.loginCount }}
                </span>
              </div>

              <div
                  class="p-4 rounded-lg flex flex-col items-center"
                  :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-100'"
              >
                <span class="text-sm mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
                  已完成任务
                </span>
                <span class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
                  {{ user.stats.completedTasks }}
                </span>
              </div>

              <div
                  class="p-4 rounded-lg flex flex-col items-center"
                  :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-100'"
              >
                <span class="text-sm mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
                  创建的项目
                </span>
                <span class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
                  {{ user.stats.createdProjects }}
                </span>
              </div>

              <div
                  class="p-4 rounded-lg flex flex-col items-center"
                  :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-100'"
              >
                <span class="text-sm mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
                  活跃天数
                </span>
                <span class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
                  {{ user.stats.activeDays }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <!-- 背景遮罩 -->
      <div class="fixed inset-0 bg-black opacity-50" @click="showDeleteConfirm = false"></div>

      <!-- 对话框 -->
      <div class="relative bg-white rounded-lg max-w-md w-full mx-4 shadow-xl" :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'">
        <div class="p-6">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <Icon icon="mdi:alert-circle" class="h-6 w-6 text-red-600" />
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-900'">删除用户</h3>
              <div class="mt-2">
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
                  您确定要删除用户 <span class="font-semibold">{{ user.name }}</span> 吗？此操作不可撤销，用户的所有数据将被永久删除。
                </p>
              </div>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button
                @click="showDeleteConfirm = false"
                class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                :class="isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'"
            >
              取消
            </button>
            <button
                @click="deleteUser"
                class="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-red-600 hover:bg-red-700 text-white"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 重置密码弹窗 -->
    <div v-if="showResetPassword" class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <!-- 背景遮罩 -->
      <div class="fixed inset-0 bg-black opacity-50" @click="showResetPassword = false"></div>

      <!-- 对话框 -->
      <div class="relative bg-white rounded-lg max-w-md w-full mx-4 shadow-xl" :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'">
        <div class="p-6">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <Icon icon="mdi:lock-reset" class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-900'">重置用户密码</h3>
              <div class="mt-2">
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
                  您将为用户 <span class="font-semibold">{{ user.name }}</span> 重置密码。系统将生成一个新的随机密码，并发送到用户邮箱。
                </p>
              </div>

              <div class="mt-4">
                <label class="flex items-center">
                  <input
                      type="checkbox"
                      v-model="requirePasswordChange"
                      class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''"
                  />
                  <span class="ml-2 text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    要求用户下次登录时更改密码
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button
                @click="showResetPassword = false"
                class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                :class="isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'"
            >
              取消
            </button>
            <button
                @click="confirmResetPassword"
                class="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white"
            >
              重置密码
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

// 路由和导航
const route = useRoute();
const router = useRouter();
const userId = computed(() => route.params.id);

// 从父组件获取暗黑模式状态
const isDarkMode = inject('isDarkMode', ref(false));

// 组件状态
const loading = ref(true);
const error = ref(false);
const user = ref({});
const showDeleteConfirm = ref(false);
const showResetPassword = ref(false);
const requirePasswordChange = ref(true);

// 初始化
onMounted(async () => {
  loadUserData();
});

// 加载用户数据
const loadUserData = async () => {
  loading.value = true;
  error.value = false;

  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 模拟用户数据
    user.value = {
      id: userId.value,
      name: '张伟',
      email: `user${userId.value}@example.com`,
      role: 'editor',
      status: 'active',
      registeredAt: new Date(new Date().setDate(new Date().getDate() - 60)),
      lastLoginAt: new Date(new Date().setHours(new Date().getHours() - 5)),
      emailVerified: true,
      twoFactorEnabled: false,
      permissions: [
        '查看仪表盘',
        '编辑文章',
        '发布文章',
        '管理评论',
        '上传媒体'
      ],
      activities: [
        {
          type: 'login',
          description: '登录系统',
          details: '从192.168.1.1 (Chrome on Windows)',
          timestamp: new Date(new Date().setHours(new Date().getHours() - 5))
        },
        {
          type: 'content',
          description: '发布文章',
          details: '文章标题: "如何使用Vue 3和Tailwind CSS"',
          timestamp: new Date(new Date().setHours(new Date().getHours() - 8))
        },
        {
          type: 'profile',
          description: '更新个人资料',
          details: '修改了邮箱地址',
          timestamp: new Date(new Date().setDate(new Date().getDate() - 2))
        },
        {
          type: 'login',
          description: '登录系统',
          details: '从192.168.1.1 (Chrome on Windows)',
          timestamp: new Date(new Date().setDate(new Date().getDate() - 3))
        },
        {
          type: 'security',
          description: '密码重置',
          details: '通过邮箱链接重置了密码',
          timestamp: new Date(new Date().setDate(new Date().getDate() - 10))
        }
      ],
      stats: {
        loginCount: 37,
        completedTasks: 24,
        createdProjects: 5,
        activeDays: 28
      }
    };

  } catch (err) {
    console.error('获取用户数据失败', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

// 获取用户名首字母作为头像
const getInitials = (name) => {
  return name ? name.charAt(0) : '?';
};

// 根据用户名生成一致的颜色
const getAvatarColor = (name) => {
  if (!name) return '#6b7280';

  // 简单的哈希算法为名字生成颜色
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // 转换为16进制颜色
  const colors = [
    '#4f46e5', '#0891b2', '#0ea5e9', '#10b981',
    '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b',
    '#6366f1', '#84cc16', '#14b8a6', '#5b21b6'
  ];

  return colors[Math.abs(hash) % colors.length];
};

// 获取角色显示文本
const getRoleDisplay = (role) => {
  const roleMap = {
    'admin': '管理员',
    'editor': '编辑者',
    'user': '用户'
  };
  return roleMap[role] || role;
};

// 获取角色CSS类
const getRoleClass = (role) => {
  const baseClass = isDarkMode.value ? 'bg-opacity-20 ' : 'bg-opacity-10 ';
  const roleClasses = {
    'admin': baseClass + (isDarkMode.value ? 'bg-purple-700 text-purple-300' : 'bg-purple-700 text-purple-800'),
    'editor': baseClass + (isDarkMode.value ? 'bg-blue-700 text-blue-300' : 'bg-blue-700 text-blue-800'),
    'user': baseClass + (isDarkMode.value ? 'bg-green-700 text-green-300' : 'bg-green-700 text-green-800')
  };
  return roleClasses[role] || '';
};

// 获取状态显示文本
const getStatusDisplay = (status) => {
  const statusMap = {
    'active': '活跃',
    'inactive': '未激活',
    'suspended': '已暂停'
  };
  return statusMap[status] || status;
};

// 获取状态CSS类
const getStatusClass = (status) => {
  const baseClass = isDarkMode.value ? 'bg-opacity-20 ' : 'bg-opacity-10 ';
  const statusClasses = {
    'active': baseClass + (isDarkMode.value ? 'bg-green-700 text-green-300' : 'bg-green-700 text-green-800'),
    'inactive': baseClass + (isDarkMode.value ? 'bg-yellow-700 text-yellow-300' : 'bg-yellow-700 text-yellow-800'),
    'suspended': baseClass + (isDarkMode.value ? 'bg-red-700 text-red-300' : 'bg-red-700 text-red-800')
  };
  return statusClasses[status] || '';
};

// 获取活动图标
const getActivityIcon = (type) => {
  const icons = {
    'login': 'mdi:login',
    'logout': 'mdi:logout',
    'content': 'mdi:file-document-edit',
    'profile': 'mdi:account-edit',
    'security': 'mdi:shield-key',
    'settings': 'mdi:cog'
  };
  return icons[type] || 'mdi:information';
};

// 获取活动图标CSS类
const getActivityIconClass = (type) => {
  const classes = {
    'login': isDarkMode.value ? 'bg-blue-700' : 'bg-blue-500',
    'logout': isDarkMode.value ? 'bg-indigo-700' : 'bg-indigo-500',
    'content': isDarkMode.value ? 'bg-green-700' : 'bg-green-500',
    'profile': isDarkMode.value ? 'bg-purple-700' : 'bg-purple-500',
    'security': isDarkMode.value ? 'bg-red-700' : 'bg-red-500',
    'settings': isDarkMode.value ? 'bg-gray-700' : 'bg-gray-500'
  };
  return classes[type] || (isDarkMode.value ? 'bg-gray-700' : 'bg-gray-500');
};

// 格式化日期
const formatDate = (date) => {
  if (!date) return '未知';

  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 格式化相对时间
const formatTimeAgo = (date) => {
  if (!date) return '';

  const now = new Date();
  const diffMs = now - new Date(date);
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  if (diffSec < 60) {
    return '刚刚';
  } else if (diffMin < 60) {
    return `${diffMin}分钟前`;
  } else if (diffHour < 24) {
    return `${diffHour}小时前`;
  } else if (diffDay < 30) {
    return `${diffDay}天前`;
  } else {
    return formatDate(date);
  }
};

// 切换账户状态
const toggleAccountStatus = async () => {
  try {
    const newStatus = user.value.status === 'active' ? 'suspended' : 'active';

    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 更新状态
    user.value.status = newStatus;

    // 显示成功提示
    alert(`用户状态已更新为: ${getStatusDisplay(newStatus)}`);

  } catch (error) {
    console.error('更新用户状态失败', error);
    alert('操作失败，请重试');
  }
};

// 打开重置密码对话框
const resetPassword = () => {
  showResetPassword.value = true;
};

// 确认重置密码
const confirmResetPassword = async () => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 关闭对话框
    showResetPassword.value = false;

    // 显示成功提示
    alert(`密码重置链接已发送到用户邮箱: ${user.value.email}`);

  } catch (error) {
    console.error('重置密码失败', error);
    alert('操作失败，请重试');
  }
};

// 删除用户
const deleteUser = async () => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 关闭确认框
    showDeleteConfirm.value = false;

    // 显示成功提示
    alert('用户已成功删除');

    // 跳转到用户列表
    router.push('/users');

  } catch (error) {
    console.error('删除用户失败', error);
    alert('操作失败，请重试');
  }
};
</script>