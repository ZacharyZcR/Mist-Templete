<template>
  <div class="w-full max-w-md mx-auto">
    <!-- 表单标题 -->
    <h1 class="text-2xl font-bold mb-6 text-center" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
      找回密码
    </h1>

    <!-- 说明文字 -->
    <p class="mb-6 text-center" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
      请输入您的注册邮箱，我们将发送密码重置链接给您。
    </p>

    <!-- 成功提示 -->
    <div v-if="isSubmitted" class="mb-6 p-4 rounded-md" :class="isDarkMode
      ? 'bg-green-900/20 border border-green-800 text-green-400'
      : 'bg-green-50 border border-green-200 text-green-700'">
      <div class="flex items-center">
        <Icon icon="mdi:check-circle" class="h-5 w-5 mr-2" :class="isDarkMode ? 'text-green-400' : 'text-green-500'" />
        <span>
          密码重置链接已发送到您的邮箱，请查收并按照提示操作。
        </span>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMessage && !isSubmitted" class="mb-6 p-4 rounded-md" :class="isDarkMode
      ? 'bg-red-900/20 border border-red-800'
      : 'bg-red-50 border border-red-200'">
      <div class="flex items-center">
        <Icon icon="mdi:alert-circle" class="h-5 w-5 mr-2" :class="isDarkMode ? 'text-red-400' : 'text-red-500'" />
        <span :class="isDarkMode ? 'text-red-400' : 'text-red-700'">{{ errorMessage }}</span>
      </div>
    </div>

    <!-- 找回密码表单 -->
    <form v-if="!isSubmitted" @submit.prevent="handleSubmit" class="space-y-5">
      <!-- 邮箱 -->
      <div>
        <label for="email" class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
          邮箱地址
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="mdi:email" class="h-5 w-5" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'" />
          </div>
          <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full pl-10 px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
              placeholder="您的注册邮箱"
              :disabled="isSubmitting"
          />
        </div>
        <p v-if="emailError" class="mt-1 text-sm" :class="isDarkMode ? 'text-red-400' : 'text-red-600'">{{ emailError }}</p>
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
                v-model="captcha"
                type="text"
                required
                class="w-full pl-10 px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
                placeholder="输入验证码"
                :disabled="isSubmitting"
            />
          </div>
          <div
              class="w-32 h-10 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer"
              :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-100'"
              @click="refreshCaptcha"
          >
            <div class="text-xs font-mono tracking-widest select-none transform -rotate-3"
                 :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'">
              {{ captchaText }}
            </div>
          </div>
        </div>
        <p v-if="captchaError" class="mt-1 text-sm" :class="isDarkMode ? 'text-red-400' : 'text-red-600'">{{ captchaError }}</p>
      </div>

      <!-- 提交按钮 -->
      <div>
        <button
            type="submit"
            class="w-full py-2 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isSubmitting"
        >
          <div class="flex items-center justify-center">
            <Icon v-if="isSubmitting" icon="mdi:loading" class="animate-spin h-5 w-5 mr-2" />
            {{ isSubmitting ? "提交中..." : "发送重置链接" }}
          </div>
        </button>
      </div>
    </form>

    <!-- 提交成功后显示返回登录按钮 -->
    <div v-if="isSubmitted" class="mt-6">
      <button
          @click="goToLogin"
          class="w-full py-2 px-4 rounded-lg font-medium transition-colors border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          :class="isDarkMode
          ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
      >
        返回登录
      </button>
    </div>

    <!-- 返回登录链接 -->
    <div v-if="!isSubmitted" class="mt-6 text-center">
      <router-link
          to="/auth/login"
          class="text-sm font-medium text-blue-600 hover:text-blue-500"
          :class="{ 'opacity-50 pointer-events-none': isSubmitting }"
      >
        返回登录
      </router-link>
    </div>

    <!-- 备注信息 -->
    <div class="mt-8 p-4 rounded-lg" :class="isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-600'">
      <p class="text-sm">
        如果您的邮箱地址存在于我们的系统中，您将收到一封密码重置邮件。如果您没有收到邮件，请检查垃圾邮件文件夹或确认您使用的是注册时的邮箱地址。
      </p>
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

// 表单数据
const email = ref('');
const captcha = ref('');
const captchaText = ref('');

// 错误信息
const emailError = ref('');
const captchaError = ref('');
const errorMessage = ref('');

// 状态
const isSubmitting = ref(false);
const isSubmitted = ref(false);

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
  captcha.value = '';
};

// 组件加载时生成验证码
onMounted(() => {
  refreshCaptcha();
});

// 表单验证
const validateForm = () => {
  emailError.value = '';
  captchaError.value = '';
  let isValid = true;

  // 邮箱验证
  if (!email.value) {
    emailError.value = '请输入邮箱地址';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = '请输入有效的邮箱地址';
    isValid = false;
  }

  // 验证码验证
  if (!captcha.value) {
    captchaError.value = '请输入验证码';
    isValid = false;
  } else if (captcha.value.toUpperCase() !== captchaText.value) {
    captchaError.value = '验证码不正确';
    isValid = false;
  }

  return isValid;
};

// 提交表单
const handleSubmit = async () => {
  if (!validateForm()) return;

  // 清除之前的错误信息
  errorMessage.value = '';
  isSubmitting.value = true;

  try {
    // 在实际应用中，这里应该调用API发送重置密码请求
    // 为了演示，我们模拟一个请求
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 模拟成功响应
    console.log('发送重置密码链接到:', email.value);
    isSubmitted.value = true;
  } catch (error) {
    // 处理错误情况
    errorMessage.value = '发送重置链接时出错，请稍后重试';
    console.error('忘记密码错误:', error);
  } finally {
    isSubmitting.value = false;
  }
};

// 返回登录页
const goToLogin = () => {
  router.push('/auth/login');
};
</script>