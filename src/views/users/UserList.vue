<template>
  <div>
    <!-- 页面标题和操作按钮 -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">用户列表</h1>

      <div class="mt-3 sm:mt-0">
        <router-link
            to="/users/create"
            class="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Icon icon="mdi:account-plus" class="mr-2 h-5 w-5" />
          添加用户
        </router-link>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="mb-6 rounded-lg shadow p-4" :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- 搜索框 -->
        <div class="flex-1 relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="mdi:magnify" class="h-5 w-5" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" />
          </div>
          <input
              type="text"
              v-model="searchQuery"
              placeholder="搜索用户名、邮箱或角色..."
              class="block w-full pl-10 pr-3 py-2 rounded-md border focus:ring-2 focus:outline-none"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500'
              : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-blue-500'"
          />
        </div>

        <!-- 角色筛选 -->
        <div class="w-full md:w-48">
          <select
              v-model="roleFilter"
              class="block w-full px-3 py-2 rounded-md border focus:ring-2 focus:outline-none"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
              : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500'"
          >
            <option value="">所有角色</option>
            <option value="admin">管理员</option>
            <option value="editor">编辑者</option>
            <option value="user">普通用户</option>
          </select>
        </div>

        <!-- 状态筛选 -->
        <div class="w-full md:w-48">
          <select
              v-model="statusFilter"
              class="block w-full px-3 py-2 rounded-md border focus:ring-2 focus:outline-none"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
              : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500'"
          >
            <option value="">所有状态</option>
            <option value="active">活跃</option>
            <option value="inactive">未激活</option>
            <option value="suspended">已暂停</option>
          </select>
        </div>

        <!-- 应用筛选按钮 -->
        <button
            @click="applyFilters"
            class="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white"
        >
          应用筛选
        </button>

        <!-- 重置筛选按钮 -->
        <button
            @click="resetFilters"
            class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
            :class="isDarkMode
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'"
        >
          重置
        </button>
      </div>
    </div>

    <!-- 用户列表表格 -->
    <div class="overflow-x-auto rounded-lg shadow" :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
      <table class="min-w-full divide-y" :class="isDarkMode ? 'divide-gray-700' : 'divide-gray-200'">
        <thead :class="isDarkMode ? 'bg-gray-900' : 'bg-gray-50'">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
            用户
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
            角色
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
            状态
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
            注册日期
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
            最后登录
          </th>
          <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
            操作
          </th>
        </tr>
        </thead>
        <tbody class="divide-y" :class="isDarkMode ? 'divide-gray-700' : 'divide-gray-200'">
        <!-- 加载状态 -->
        <tr v-if="loading" :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
          <td colspan="6" class="px-6 py-12">
            <div class="flex justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" :class="isDarkMode ? 'border-blue-500' : 'border-blue-600'"></div>
            </div>
            <p class="text-center mt-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">加载中...</p>
          </td>
        </tr>

        <!-- 无数据状态 -->
        <tr v-else-if="filteredUsers.length === 0" :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
          <td colspan="6" class="px-6 py-12 text-center" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
            <div class="flex flex-col items-center">
              <Icon icon="mdi:account-search" class="h-12 w-12 mb-2 opacity-50" />
              <p class="text-lg font-medium">未找到符合条件的用户</p>
              <p class="mt-1">尝试调整搜索条件或筛选器</p>
            </div>
          </td>
        </tr>

        <!-- 用户列表 -->
        <tr v-for="user in paginatedUsers" :key="user.id" :class="isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'">
          <!-- 用户信息 -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10">
                <div class="h-10 w-10 rounded-full flex items-center justify-center text-white"
                     :style="{ backgroundColor: getAvatarColor(user.name) }">
                  {{ getInitials(user.name) }}
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                  {{ user.name }}
                </div>
                <div class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                  {{ user.email }}
                </div>
              </div>
            </div>
          </td>

          <!-- 角色 -->
          <td class="px-6 py-4 whitespace-nowrap">
              <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getRoleClass(user.role)"
              >
                {{ getRoleDisplay(user.role) }}
              </span>
          </td>

          <!-- 状态 -->
          <td class="px-6 py-4 whitespace-nowrap">
              <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(user.status)"
              >
                {{ getStatusDisplay(user.status) }}
              </span>
          </td>

          <!-- 注册日期 -->
          <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
            {{ formatDate(user.registeredAt) }}
          </td>

          <!-- 最后登录 -->
          <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
            {{ formatDate(user.lastLoginAt) }}
          </td>

          <!-- 操作按钮 -->
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div class="flex justify-end gap-2">
              <!-- 查看按钮 -->
              <router-link :to="`/users/${user.id}`" :class="isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'">
                <Icon icon="mdi:eye" class="h-5 w-5" />
              </router-link>

              <!-- 编辑按钮 -->
              <router-link :to="`/users/${user.id}/edit`" :class="isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-900'">
                <Icon icon="mdi:pencil" class="h-5 w-5" />
              </router-link>

              <!-- 删除按钮 -->
              <button @click="confirmDeleteUser(user)" :class="isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'">
                <Icon icon="mdi:delete" class="h-5 w-5" />
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>

      <!-- 分页 -->
      <div class="px-6 py-3 flex items-center justify-between border-t" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md"
              :class="[
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : '',
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            ]"
          >
            上一页
          </button>
          <button
              @click="nextPage"
              :disabled="currentPage >= totalPages"
              class="relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md"
              :class="[
              currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : '',
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            ]"
          >
            下一页
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
            <p class="text-sm">
              显示
              <span class="font-medium">{{ startIndex + 1 }}</span>
              -
              <span class="font-medium">{{ Math.min(endIndex, filteredUsers.length) }}</span>
              共
              <span class="font-medium">{{ filteredUsers.length }}</span>
              条记录
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <!-- 上一页按钮 -->
              <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border"
                  :class="[
                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : '',
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                ]"
              >
                <span class="sr-only">上一页</span>
                <Icon icon="mdi:chevron-left" class="h-5 w-5" />
              </button>

              <!-- 页码按钮 -->
              <template v-for="page in displayedPages" :key="page">
                <button
                    v-if="page !== '...'"
                    @click="goToPage(page)"
                    class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    :class="[
                    page === currentPage
                      ? (isDarkMode ? 'bg-gray-700 border-gray-700 text-white' : 'bg-blue-50 border-blue-500 text-blue-600')
                      : (isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50')
                  ]"
                >
                  {{ page }}
                </button>
                <span
                    v-else
                    class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    :class="isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-300 text-gray-700'"
                >
                  ...
                </span>
              </template>

              <!-- 下一页按钮 -->
              <button
                  @click="nextPage"
                  :disabled="currentPage >= totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border"
                  :class="[
                  currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : '',
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                ]"
              >
                <span class="sr-only">下一页</span>
                <Icon icon="mdi:chevron-right" class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <!-- 背景遮罩 -->
      <div class="fixed inset-0 bg-black opacity-50" @click="showDeleteConfirm = false"></div>

      <!-- 对话框 -->
      <div class="relative rounded-lg max-w-md w-full mx-4 shadow-xl" :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'">
        <div class="p-6">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <Icon icon="mdi:alert-circle" class="h-6 w-6 text-red-600" />
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-900'">删除用户</h3>
              <div class="mt-2">
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
                  您确定要删除用户 <span class="font-semibold">{{ userToDelete?.name }}</span> 吗？此操作不可撤销。
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

// 路由
const router = useRouter();

// 从父组件获取暗黑模式状态
const isDarkMode = inject('isDarkMode', ref(false));

// 状态变量
const users = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const roleFilter = ref('');
const statusFilter = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showDeleteConfirm = ref(false);
const userToDelete = ref(null);

// 生成模拟数据
const generateMockUsers = () => {
  const mockUsers = [];
  const roles = ['admin', 'editor', 'user'];
  const statuses = ['active', 'inactive', 'suspended'];

  for (let i = 1; i <= 50; i++) {
    const firstName = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴'][Math.floor(Math.random() * 10)];
    const lastName = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '洋', '艳', '勇', '军', '杰', '娟', '涛', '明', '超', '秀兰', '霞'][Math.floor(Math.random() * 20)];
    const name = firstName + lastName;
    const registrationDate = new Date();
    registrationDate.setDate(registrationDate.getDate() - Math.floor(Math.random() * 365));

    const lastLoginDate = new Date(registrationDate);
    lastLoginDate.setDate(lastLoginDate.getDate() + Math.floor(Math.random() * (new Date() - registrationDate) / (1000 * 60 * 60 * 24)));

    mockUsers.push({
      id: i,
      name,
      email: `user${i}@example.com`,
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      registeredAt: registrationDate,
      lastLoginAt: lastLoginDate
    });
  }

  return mockUsers;
};

// 初始化
onMounted(async () => {
  // 模拟API请求延迟
  setTimeout(() => {
    users.value = generateMockUsers();
    loading.value = false;
  }, 1000);
});

// 应用筛选条件
const applyFilters = () => {
  currentPage.value = 1; // 重置到第一页
};

// 重置筛选条件
const resetFilters = () => {
  searchQuery.value = '';
  roleFilter.value = '';
  statusFilter.value = '';
  currentPage.value = 1;
};

// 确认删除用户
const confirmDeleteUser = (user) => {
  userToDelete.value = user;
  showDeleteConfirm.value = true;
};

// 删除用户
const deleteUser = () => {
  if (!userToDelete.value) return;

  // 从列表中移除用户
  users.value = users.value.filter(u => u.id !== userToDelete.value.id);

  // 关闭确认框并清除选中的用户
  showDeleteConfirm.value = false;
  userToDelete.value = null;

  // 这里实际项目中应该调用API删除用户
  // 模拟成功提示
  alert('用户已成功删除');
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

// 过滤后的用户列表
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    // 搜索过滤
    const searchMatches = !searchQuery.value ||
        user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        getRoleDisplay(user.role).toLowerCase().includes(searchQuery.value.toLowerCase());

    // 角色过滤
    const roleMatches = !roleFilter.value || user.role === roleFilter.value;

    // 状态过滤
    const statusMatches = !statusFilter.value || user.status === statusFilter.value;

    return searchMatches && roleMatches && statusMatches;
  });
});

// 分页相关计算
const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage.value);
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value;
});

const endIndex = computed(() => {
  return startIndex.value + itemsPerPage.value;
});

const paginatedUsers = computed(() => {
  return filteredUsers.value.slice(startIndex.value, endIndex.value);
});

// 分页按钮显示逻辑
const displayedPages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const pages = [];

  if (total <= 7) {
    // 显示所有页码
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // 始终显示第一页
    pages.push(1);

    if (current > 3) {
      pages.push('...');
    }

    // 显示当前页附近的页码
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 2) {
      pages.push('...');
    }

    // 始终显示最后一页
    pages.push(total);
  }

  return pages;
});

// 分页操作
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

const goToPage = (page) => {
  currentPage.value = page;
};
</script>