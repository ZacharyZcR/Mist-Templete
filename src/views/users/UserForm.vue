<template>
  <div>
    <!-- 页面标题 -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
        {{ isEdit ? '编辑用户' : '创建用户' }}
      </h1>
      <router-link
          to="/users"
          class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors"
          :class="isDarkMode
          ? 'bg-gray-700 hover:bg-gray-600 text-white'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'"
      >
        <Icon icon="mdi:arrow-left" class="mr-2 h-4 w-4" />
        返回用户列表
      </router-link>
    </div>

    <!-- 表单卡片 -->
    <div class="rounded-lg shadow-md overflow-hidden" :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
      <div class="p-6">
        <!-- 表单标题 -->
        <div class="mb-6">
          <h2 class="text-lg font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
            {{ isEdit ? '用户信息' : '基本信息' }}
          </h2>
          <p class="mt-1 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
            {{ isEdit ? '编辑用户的详细信息。' : '请填写新用户的基本信息。' }}
          </p>
        </div>

        <!-- 表单内容 -->
        <form @submit.prevent="submitForm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 姓名 -->
            <div>
              <label for="name" class="block text-sm font-medium" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">
                姓名
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon icon="mdi:account" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" class="h-5 w-5" />
                </div>
                <input
                    type="text"
                    id="name"
                    v-model="formData.name"
                    :class="[
                    'block w-full pl-10 pr-3 py-2 rounded-md focus:outline-none focus:ring-2',
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500'
                      : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-blue-500',
                    errors.name ? (isDarkMode ? 'border-red-500 focus:ring-red-500' : 'border-red-500 focus:ring-red-500') : 'border'
                  ]"
                    placeholder="输入用户姓名"
                    required
                />
              </div>
              <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name }}</p>
            </div>

            <!-- 电子邮箱 -->
            <div>
              <label for="email" class="block text-sm font-medium" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">
                电子邮箱
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon icon="mdi:email" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" class="h-5 w-5" />
                </div>
                <input
                    type="email"
                    id="email"
                    v-model="formData.email"
                    :class="[
                    'block w-full pl-10 pr-3 py-2 rounded-md focus:outline-none focus:ring-2',
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500'
                      : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-blue-500',
                    errors.email ? (isDarkMode ? 'border-red-500 focus:ring-red-500' : 'border-red-500 focus:ring-red-500') : 'border'
                  ]"
                    placeholder="example@company.com"
                    required
                />
              </div>
              <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
            </div>

            <!-- 密码 -->
            <div v-if="!isEdit">
              <label for="password" class="block text-sm font-medium" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">
                密码
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon icon="mdi:lock" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" class="h-5 w-5" />
                </div>
                <input
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    v-model="formData.password"
                    :class="[
                    'block w-full pl-10 pr-10 py-2 rounded-md focus:outline-none focus:ring-2',
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500'
                      : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-blue-500',
                    errors.password ? (isDarkMode ? 'border-red-500 focus:ring-red-500' : 'border-red-500 focus:ring-red-500') : 'border'
                  ]"
                    placeholder="输入密码"
                    required
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                      type="button"
                      @click="togglePasswordVisibility"
                      class="focus:outline-none"
                  >
                    <Icon
                        :icon="showPassword ? 'mdi:eye-off' : 'mdi:eye'"
                        :class="isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'"
                        class="h-5 w-5"
                    />
                  </button>
                </div>
              </div>
              <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
              <p v-else class="mt-1 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                密码至少包含8个字符
              </p>
            </div>

            <!-- 确认密码 -->
            <div v-if="!isEdit">
              <label for="confirmPassword" class="block text-sm font-medium" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">
                确认密码
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon icon="mdi:lock-check" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" class="h-5 w-5" />
                </div>
                <input
                    :type="showPassword ? 'text' : 'password'"
                    id="confirmPassword"
                    v-model="formData.confirmPassword"
                    :class="[
                    'block w-full pl-10 pr-3 py-2 rounded-md focus:outline-none focus:ring-2',
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500'
                      : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-blue-500',
                    errors.confirmPassword ? (isDarkMode ? 'border-red-500 focus:ring-red-500' : 'border-red-500 focus:ring-red-500') : 'border'
                  ]"
                    placeholder="确认密码"
                    required
                />
              </div>
              <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-500">{{ errors.confirmPassword }}</p>
            </div>

            <!-- 用户角色 -->
            <div class="md:col-span-2">
              <label for="role" class="block text-sm font-medium" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">
                用户角色
              </label>
              <div class="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                    v-for="role in roles"
                    :key="role.value"
                    @click="formData.role = role.value"
                    class="relative flex cursor-pointer rounded-lg p-4 focus:outline-none"
                    :class="[
                    formData.role === role.value
                      ? (isDarkMode ? 'bg-blue-900 border-blue-600' : 'bg-blue-50 border-blue-500')
                      : (isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'),
                    'border'
                  ]"
                >
                  <div class="flex w-full items-center justify-between">
                    <div class="flex items-center">
                      <div class="text-sm">
                        <p
                            class="font-medium"
                            :class="[
                            formData.role === role.value
                              ? (isDarkMode ? 'text-white' : 'text-blue-700')
                              : (isDarkMode ? 'text-white' : 'text-gray-900')
                          ]"
                        >
                          {{ role.label }}
                        </p>
                        <p
                            class="text-xs"
                            :class="[
                            formData.role === role.value
                              ? (isDarkMode ? 'text-blue-200' : 'text-blue-600')
                              : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                          ]"
                        >
                          {{ role.description }}
                        </p>
                      </div>
                    </div>
                    <div
                        class="flex-shrink-0 text-white"
                        :class="[
                        formData.role === role.value
                          ? (isDarkMode ? 'text-blue-300' : 'text-blue-600')
                          : 'invisible'
                      ]"
                    >
                      <Icon icon="mdi:check-circle" class="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>
              <p v-if="errors.role" class="mt-1 text-sm text-red-500">{{ errors.role }}</p>
            </div>

            <!-- 用户状态 -->
            <div class="md:col-span-2">
              <label for="status" class="block text-sm font-medium" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">
                用户状态
              </label>
              <div class="mt-1">
                <select
                    id="status"
                    v-model="formData.status"
                    :class="[
                    'block w-full pl-3 pr-10 py-2 rounded-md focus:outline-none focus:ring-2',
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                      : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500',
                    errors.status ? (isDarkMode ? 'border-red-500 focus:ring-red-500' : 'border-red-500 focus:ring-red-500') : 'border'
                  ]"
                >
                  <option v-for="status in statuses" :key="status.value" :value="status.value">
                    {{ status.label }}
                  </option>
                </select>
              </div>
              <p v-if="errors.status" class="mt-1 text-sm text-red-500">{{ errors.status }}</p>
            </div>
          </div>

          <!-- 可选的附加设置部分 -->
          <div class="mt-8">
            <div class="flex items-center mb-4">
              <h3 class="text-lg font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-900'">附加设置</h3>
              <span
                  class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'"
              >
                可选
              </span>
            </div>

            <!-- 发送欢迎邮件 -->
            <div class="relative flex items-start mb-4">
              <div class="flex items-center h-5">
                <input
                    id="sendWelcomeEmail"
                    v-model="formData.sendWelcomeEmail"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="sendWelcomeEmail" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">发送欢迎邮件</label>
                <p class="text-xs" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                  创建用户后向其邮箱发送欢迎邮件，包含登录信息。
                </p>
              </div>
            </div>

            <!-- 要求下次登录时重置密码 -->
            <div class="relative flex items-start">
              <div class="flex items-center h-5">
                <input
                    id="requirePasswordChange"
                    v-model="formData.requirePasswordChange"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    :class="isDarkMode ? 'bg-gray-700 border-gray-600' : ''"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="requirePasswordChange" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">
                  要求下次登录时重置密码
                </label>
                <p class="text-xs" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                  用户首次登录时将被要求设置新密码。
                </p>
              </div>
            </div>
          </div>

          <!-- 表单按钮 -->
          <div class="mt-10 flex justify-end space-x-3">
            <router-link
                to="/users"
                class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                :class="isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'"
            >
              取消
            </router-link>
            <button
                type="submit"
                class="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white"
                :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                处理中...
              </span>
              <span v-else>{{ isEdit ? '保存修改' : '创建用户' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

// 路由和导航
const route = useRoute();
const router = useRouter();

// 判断是创建还是编辑模式
const isEdit = computed(() => route.path.includes('/edit'));
const userId = computed(() => route.params.id);

// 从父组件获取暗黑模式状态
const isDarkMode = inject('isDarkMode', ref(false));

// 表单状态
const isSubmitting = ref(false);
const showPassword = ref(false);

// 角色和状态选项
const roles = [
  {
    value: 'admin',
    label: '管理员',
    description: '可以访问所有功能和设置'
  },
  {
    value: 'editor',
    label: '编辑者',
    description: '可以编辑内容，但无法修改系统设置'
  },
  {
    value: 'user',
    label: '普通用户',
    description: '基本访问权限'
  }
];

const statuses = [
  { value: 'active', label: '活跃' },
  { value: 'inactive', label: '未激活' },
  { value: 'suspended', label: '已暂停' }
];

// 表单数据
const formData = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'user',
  status: 'active',
  sendWelcomeEmail: true,
  requirePasswordChange: false
});

// 表单错误
const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  status: ''
});

// 初始化
onMounted(async () => {
  if (isEdit.value) {
    try {
      // 在实际项目中，这里应该是一个API调用来获取用户数据
      // 例如: const userData = await api.getUser(userId.value);

      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      // 模拟获取到的用户数据
      const userData = {
        id: userId.value,
        name: '张伟',
        email: `user${userId.value}@example.com`,
        role: 'editor',
        status: 'active'
      };

      // 填充表单数据
      formData.name = userData.name;
      formData.email = userData.email;
      formData.role = userData.role;
      formData.status = userData.status;

    } catch (error) {
      console.error('获取用户数据失败', error);
      // 可以显示错误通知
    }
  }
});

// 表单校验
const validateForm = () => {
  let isValid = true;

  // 重置所有错误
  Object.keys(errors).forEach(key => {
    errors[key] = '';
  });

  // 验证姓名
  if (!formData.name.trim()) {
    errors.name = '请输入用户姓名';
    isValid = false;
  }

  // 验证邮箱
  if (!formData.email) {
    errors.email = '请输入电子邮箱';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = '请输入有效的电子邮箱地址';
    isValid = false;
  }

  // 只在创建用户时验证密码
  if (!isEdit.value) {
    // 验证密码
    if (!formData.password) {
      errors.password = '请输入密码';
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = '密码长度至少为8个字符';
      isValid = false;
    }

    // 验证确认密码
    if (!formData.confirmPassword) {
      errors.confirmPassword = '请确认密码';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '两次输入的密码不一致';
      isValid = false;
    }
  }

  // 验证角色
  if (!formData.role) {
    errors.role = '请选择用户角色';
    isValid = false;
  }

  // 验证状态
  if (!formData.status) {
    errors.status = '请选择用户状态';
    isValid = false;
  }

  return isValid;
};

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// 提交表单
const submitForm = async () => {
  if (!validateForm()) {
    // 滚动到第一个错误位置
    const firstError = document.querySelector('.text-red-500');
    if (firstError) {
      firstError.scrollIntoView({behavior: 'smooth', block: 'center'});
    }
    return;
  }

  isSubmitting.value = true;

  try {
    // 准备提交的数据
    const submitData = {...formData};

    // 编辑模式下删除密码相关字段
    if (isEdit.value) {
      delete submitData.password;
      delete submitData.confirmPassword;
    }

    // 在实际项目中，这里是API调用
    // 如果是编辑: await api.updateUser(userId.value, submitData);
    // 如果是创建: await api.createUser(submitData);

    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 显示成功提示
    alert(isEdit.value ? '用户更新成功！' : '用户创建成功！');

    // 返回用户列表页
    router.push('/users');
  } catch (error) {
    console.error('提交表单失败', error);
    // 显示错误通知
    alert('操作失败，请重试');
  } finally {
    isSubmitting.value = false;
  }
};
</script>