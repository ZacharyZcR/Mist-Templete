<template>
  <div class="w-full max-w-md mx-auto">
    <!-- 表单标题 -->
    <h1 class="text-2xl font-bold mb-6 text-center" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
      创建新账户
    </h1>

    <!-- 注册错误提示 -->
    <div v-if="registerError" class="mb-6 p-4 rounded-md" :class="isDarkMode
      ? 'bg-red-900/20 border border-red-800'
      : 'bg-red-50 border border-red-200'">
      <div class="flex items-center">
        <Icon icon="mdi:alert-circle" class="h-5 w-5 mr-2" :class="isDarkMode ? 'text-red-400' : 'text-red-500'" />
        <span :class="isDarkMode ? 'text-red-400' : 'text-red-700'">{{ registerError }}</span>
      </div>
    </div>

    <!-- 注册表单 -->
    <form @submit.prevent="handleRegister" class="space-y-5">
      <!-- 姓名 -->
      <div>
        <label for="name" class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
          姓名
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="mdi:account" class="h-5 w-5" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'" />
          </div>
          <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              class="w-full pl-10 px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
              placeholder="您的姓名"
              :disabled="isRegistering"
          />
        </div>
        <p v-if="errors.name" class="mt-1 text-sm" :class="isDarkMode ? 'text-red-400' : 'text-red-600'">{{ errors.name }}</p>
      </div>

      <!-- 用户名 -->
      <div>
        <label for="username" class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
          用户名
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="mdi:at" class="h-5 w-5" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'" />
          </div>
          <input
              id="username"
              v-model="formData.username"
              type="text"
              required
              class="w-full pl-10 px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
              placeholder="选择一个用户名"
              :disabled="isRegistering"
          />
        </div>
        <p v-if="errors.username" class="mt-1 text-sm" :class="isDarkMode ? 'text-red-400' : 'text-red-600'">{{ errors.username }}</p>
      </div>

      <!-- 邮箱 -->
      <div>
        <label for="email" class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
          邮箱
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="mdi:email" class="h-5 w-5" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'" />
          </div>
          <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="w-full pl-10 px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
              placeholder="您的邮箱地址"
              :disabled="isRegistering"
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
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full pl-10 pr-10 px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
              placeholder="创建密码（至少8个字符）"
              :disabled="isRegistering"
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

      <!-- 确认密码 -->
      <div>
        <label for="confirmPassword" class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
          确认密码
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="mdi:lock-check" class="h-5 w-5" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'" />
          </div>
          <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              class="w-full pl-10 pr-10 px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
              placeholder="再次输入密码"
              :disabled="isRegistering"
          />
          <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <Icon
                :icon="showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'"
                class="h-5 w-5"
                :class="isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'"
            />
          </button>
        </div>
        <p v-if="errors.confirmPassword" class="mt-1 text-sm" :class="isDarkMode ? 'text-red-400' : 'text-red-600'">
          {{ errors.confirmPassword }}
        </p>
      </div>

      <!-- 手机号码（可选） -->
      <div>
        <label for="phone" class="flex items-center text-sm font-medium mb-1">
          <span :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">手机号码</span>
          <span class="ml-1 text-xs" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'">(可选)</span>
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="mdi:phone" class="h-5 w-5" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'" />
          </div>
          <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              class="w-full pl-10 px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
              placeholder="您的手机号码"
              :disabled="isRegistering"
          />
        </div>
        <p v-if="errors.phone" class="mt-1 text-sm" :class="isDarkMode ? 'text-red-400' : 'text-red-600'">{{ errors.phone }}</p>
      </div>

      <!-- 用户协议同意 -->
      <div class="flex items-start">
        <div class="flex items-center h-5">
          <input
              id="terms"
              v-model="formData.terms"
              type="checkbox"
              required
              class="w-4 h-4 rounded focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :class="isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'"
              :disabled="isRegistering"
          />
        </div>
        <div class="ml-3">
          <label for="terms" class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
            我已阅读并同意
            <a href="#" class="font-medium text-blue-600 hover:text-blue-500">用户协议</a>
            和
            <a href="#" class="font-medium text-blue-600 hover:text-blue-500">隐私政策</a>
          </label>
          <p v-if="errors.terms" class="mt-1 text-sm" :class="isDarkMode ? 'text-red-400' : 'text-red-600'">{{ errors.terms }}</p>
        </div>
      </div>

      <!-- 验证码 -->
      <div>
        <label for="captcha" class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
          验证码
        </label>
        <div class="flex space-x-2">
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon icon="mdi:shield-check" class="h-5 w-5" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'" />
            </div>
            <input
                id="captcha"
                v-model="formData.captcha"
                type="text"
                required
                class="w-full pl-10 px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
                placeholder="输入验证码"
                :disabled="isRegistering"
            />
          </div>
          <div
              class="w-32 h-10 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer"
              :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-100'"
              @click="refreshCaptcha"
          >
            <!-- 这里应该是验证码图片，为了演示使用静态文本 -->
            <div class="text-xs font-mono tracking-widest select-none transform -rotate-3"
                 :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'">
              {{ captchaText }}
            </div>
          </div>
        </div>
        <p v-if="errors.captcha" class="mt-1 text-sm" :class="isDarkMode ? 'text-red-400' : 'text-red-600'">{{ errors.captcha }}</p>
      </div>

      <!-- 注册按钮 -->
      <div>
        <button
            type="submit"
            class="w-full py-2 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isRegistering"
        >
          <div class="flex items-center justify-center">
            <Icon v-if="isRegistering" icon="mdi:loading" class="animate-spin h-5 w-5 mr-2" />
            {{ isRegistering ? "注册中..." : "注册" }}
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
          或使用其他方式注册
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
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

const router = useRouter();

// 从父组件获取暗黑模式状态
const isDarkMode = inject('isDarkMode', ref(false));

// 注册表单数据
const formData = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  terms: false,
  captcha: ''
});

// 错误信息
const errors = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  terms: '',
  captcha: ''
});

// 密码可见性
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// 注册状态
const isRegistering = ref(false);
const registerError = ref('');

// 验证码相关
const captchaText = ref('');

// 生成随机验证码
const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 刷新验证码
const refreshCaptcha = () => {
  captchaText.value = generateCaptcha();
  formData.value.captcha = '';
};

// 组件加载时生成验证码
onMounted(() => {
  refreshCaptcha();
});

// 表单验证
const validateForm = () => {
  errors.value = {
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    terms: '',
    captcha: ''
  };
  let isValid = true;

  // 姓名验证
  if (!formData.value.name.trim()) {
    errors.value.name = '请输入您的姓名';
    isValid = false;
  }

  // 用户名验证
  if (!formData.value.username.trim()) {
    errors.value.username = '请输入用户名';
    isValid = false;
  } else if (formData.value.username.length < 3) {
    errors.value.username = '用户名长度至少为3个字符';
    isValid = false;
  }

  // 邮箱验证
  if (!formData.value.email) {
    errors.value.email = '请输入邮箱地址';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = '请输入有效的邮箱地址';
    isValid = false;
  }

  // 密码验证
  if (!formData.value.password) {
    errors.value.password = '请输入密码';
    isValid = false;
  } else if (formData.value.password.length < 8) {
    errors.value.password = '密码长度至少为8个字符';
    isValid = false;
  }

  // 确认密码验证
  if (!formData.value.confirmPassword) {
    errors.value.confirmPassword = '请确认您的密码';
    isValid = false;
  } else if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = '两次输入的密码不一致';
    isValid = false;
  }

  // 手机号码验证（可选字段）
  if (formData.value.phone && !/^1[3-9]\d{9}$/.test(formData.value.phone)) {
    errors.value.phone = '请输入有效的手机号码';
    isValid = false;
  }

  // 用户协议验证
  if (!formData.value.terms) {
    errors.value.terms = '请阅读并同意用户协议和隐私政策';
    isValid = false;
  }

  // 验证码验证
  if (!formData.value.captcha) {
    errors.value.captcha = '请输入验证码';
    isValid = false;
  } else if (formData.value.captcha.toUpperCase() !== captchaText.value) {
    errors.value.captcha = '验证码不正确';
    isValid = false;
  }

  return isValid;
};

// 注册处理
const handleRegister = async () => {
  if (!validateForm()) return;

  // 清除之前的错误信息
  registerError.value = '';
  isRegistering.value = true;

  try {
    // 在实际应用中，这里应该调用API注册
    // 为了演示，我们模拟一个注册请求
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 模拟注册成功
    console.log('注册数据:', {
      name: formData.value.name,
      username: formData.value.username,
      email: formData.value.email,
      password: formData.value.password,
      phone: formData.value.phone
    });

    // 注册成功后重定向到登录页
    router.push({
      path: '/auth/login',
      query: { registered: 'success', email: formData.value.email }
    });
  } catch (error) {
    registerError.value = '注册时发生错误，请稍后重试';
    console.error('注册错误:', error);
  } finally {
    isRegistering.value = false;
  }
};
</script>