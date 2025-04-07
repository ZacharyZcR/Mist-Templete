<template>
  <div class="w-full max-w-md mx-auto">
    <!-- 表单标题 -->
    <h1 class="text-2xl font-bold mb-6 text-center" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
      登录您的账户
    </h1>

    <!-- 登录错误提示 -->
    <div v-if="loginError" class="mb-6 p-4 rounded-md" :class="isDarkMode
      ? 'bg-red-900/20 border border-red-800'
      : 'bg-red-50 border border-red-200'">
      <div class="flex items-center">
        <Icon icon="mdi:alert-circle" class="h-5 w-5 mr-2" :class="isDarkMode ? 'text-red-400' : 'text-red-500'" />
        <span :class="isDarkMode ? 'text-red-400' : 'text-red-700'">{{ loginError }}</span>
      </div>
    </div>

    <!-- 登录表单 -->
    <form @submit.prevent="handleLogin" class="space-y-5">
      <!-- 用户名/邮箱 -->
      <div>
        <label for="email" class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
          邮箱/用户名
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="mdi:account" class="h-5 w-5" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'" />
          </div>
          <input
              id="email"
              v-model="credentials.email"
              type="text"
              required
              class="w-full pl-10 px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
              placeholder="您的邮箱或用户名"
              :disabled="isLoggingIn"
          />
        </div>
        <p v-if="errors.email" class="mt-1 text-sm" :class="isDarkMode ? 'text-red-400' : 'text-red-600'">{{ errors.email }}</p>
      </div>

      <!-- 密码 -->
      <div>
        <label for="password" class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
          密码
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="mdi:lock" class="h-5 w-5" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'" />
          </div>
          <input
              id="password"
              v-model="credentials.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full pl-10 pr-10 px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
              placeholder="您的密码"
              :disabled="isLoggingIn"
          />
          <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <Icon
                :icon="showPassword ? 'mdi:eye-off' : 'mdi:eye'"
                class="h-5 w-5"
                :class="isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'"
            />
          </button>
        </div>
        <p v-if="errors.password" class="mt-1 text-sm" :class="isDarkMode ? 'text-red-400' : 'text-red-600'">{{ errors.password }}</p>
      </div>

      <!-- 记住我和忘记密码 -->
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <input
              id="remember"
              v-model="credentials.remember"
              type="checkbox"
              class="w-4 h-4 rounded focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :class="isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'"
          />
          <label for="remember" class="ml-2 text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
            记住我
          </label>
        </div>
        <router-link
            to="/auth/forgot-password"
            class="text-sm font-medium text-blue-600 hover:text-blue-500"
            :disabled="isLoggingIn"
        >
          忘记密码?
        </router-link>
      </div>

      <!-- 登录按钮 -->
      <div>
        <button
            type="submit"
            class="w-full py-2 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoggingIn"
        >
          <div class="flex items-center justify-center">
            <Icon v-if="isLoggingIn" icon="mdi:loading" class="animate-spin h-5 w-5 mr-2" />
            {{ isLoggingIn ? "登录中..." : "登录" }}
          </div>
        </button>
      </div>
    </form>

    <!-- 社交登录分隔线 -->
    <div class="relative my-8">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'"></div>
      </div>
      <div class="relative flex justify-center">
        <span class="px-2 text-sm" :class="isDarkMode ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-500'">
          或使用其他方式登录
        </span>
      </div>
    </div>

    <!-- 社交登录按钮 -->
    <div class="grid grid-cols-3 gap-3">
      <button
          type="button"
          class="py-2 px-4 rounded-lg font-medium border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex justify-center items-center"
          :class="isDarkMode
          ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'"
      >
        <Icon icon="mdi:wechat" class="h-5 w-5 text-green-500" />
      </button>
      <button
          type="button"
          class="py-2 px-4 rounded-lg font-medium border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex justify-center items-center"
          :class="isDarkMode
          ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'"
      >
        <Icon icon="mdi:qqchat" class="h-5 w-5 text-blue-500" />
      </button>
      <button
          type="button"
          class="py-2 px-4 rounded-lg font-medium border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex justify-center items-center"
          :class="isDarkMode
          ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'"
      >
        <Icon icon="mdi:github" class="h-5 w-5" :class="isDarkMode ? 'text-white' : 'text-gray-800'" />
      </button>
    </div>

    <!-- 测试账户信息 -->
    <div class="mt-6 p-4 rounded-lg border" :class="isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'">
      <h3 class="text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">演示用测试账户:</h3>
      <div class="grid grid-cols-2 gap-2 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
        <div>邮箱:</div>
        <div class="font-mono">admin@example.com</div>
        <div>密码:</div>
        <div class="font-mono">password</div>
      </div>
      <button
          @click="fillTestCredentials"
          class="mt-2 w-full text-center text-sm py-1 rounded text-blue-600 hover:text-blue-500"
      >
        填充测试账户
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';

const router = useRouter();
const route = useRoute();

// 从父组件获取暗黑模式状态
const isDarkMode = inject('isDarkMode', ref(false));

// 登录表单数据
const credentials = ref({
  email: '',
  password: '',
  remember: false
});

// 错误信息
const errors = ref({
  email: '',
  password: ''
});

// 密码可见性
const showPassword = ref(false);

// 登录状态
const isLoggingIn = ref(false);
const loginError = ref('');

// 表单验证
const validateForm = () => {
  errors.value = { email: '', password: '' };
  let isValid = true;

  if (!credentials.value.email) {
    errors.value.email = '请输入邮箱或用户名';
    isValid = false;
  }

  if (!credentials.value.password) {
    errors.value.password = '请输入密码';
    isValid = false;
  } else if (credentials.value.password.length < 6) {
    errors.value.password = '密码长度至少为6个字符';
    isValid = false;
  }

  return isValid;
};

// 登录处理
const handleLogin = async () => {
  if (!validateForm()) return;

  // 清除之前的错误信息
  loginError.value = '';
  isLoggingIn.value = true;

  try {
    // 在实际应用中，这里应该调用API登录
    // 为了演示，我们模拟一个登录请求
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 测试账户登录成功逻辑
    if (credentials.value.email === 'admin@example.com' && credentials.value.password === 'password') {
      // 存储登录凭证
      localStorage.setItem('token', 'demo-token-12345');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: '管理员',
        email: 'admin@example.com',
        role: 'admin'
      }));

      // 添加一些示例权限
      localStorage.setItem('permissions', JSON.stringify([
        'users.access', 'users.create', 'users.edit',
        'business.access', 'products.create', 'products.edit',
        'settings.access'
      ]));

      // 登录成功后重定向
      const redirectPath = route.query.redirect || '/';
      router.push(redirectPath);
    } else {
      // 登录失败
      loginError.value = '邮箱或密码不正确，请重试';
    }
  } catch (error) {
    loginError.value = '登录时发生错误，请稍后重试';
    console.error('登录错误:', error);
  } finally {
    isLoggingIn.value = false;
  }
};

// 填充测试账户信息
const fillTestCredentials = () => {
  credentials.value.email = 'admin@example.com';
  credentials.value.password = 'password';
};
</script>