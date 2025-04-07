<template>
  <div class="max-w-4xl mx-auto">
    <!-- 页面标题和说明 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">个人资料</h1>
      <p class="mt-1 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
        管理您的账户信息和个人偏好
      </p>
    </div>

    <!-- 保存成功提示 -->
    <div v-if="showSuccessMessage"
         class="mb-6 p-4 rounded-md"
         :class="isDarkMode ? 'bg-green-900/20 border border-green-800 text-green-400' : 'bg-green-50 border border-green-200 text-green-700'">
      <div class="flex">
        <Icon icon="mdi:check-circle" class="h-5 w-5 mr-2" :class="isDarkMode ? 'text-green-400' : 'text-green-500'" />
        <span>个人资料已成功更新</span>
      </div>
    </div>

    <div class="rounded-lg shadow-sm" :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
      <!-- 头部 - 用户头像和封面 -->
      <div class="relative">
        <!-- 封面图片 -->
        <div class="h-40 sm:h-48 rounded-t-lg overflow-hidden">
          <img
              :src="profile.coverImage || '/img/default-cover.jpg'"
              alt="封面图片"
              class="w-full h-full object-cover"
          />

          <!-- 封面图片上传按钮 -->
          <div class="absolute top-2 right-2">
            <button
                class="p-2 rounded-full bg-gray-800/60 text-white hover:bg-gray-800/80 transition-colors"
                @click="openCoverUpload"
            >
              <Icon icon="mdi:camera" class="h-5 w-5" />
            </button>
            <input
                type="file"
                ref="coverImageInput"
                class="hidden"
                accept="image/*"
                @change="handleCoverImageChange"
            />
          </div>
        </div>

        <!-- 头像 -->
        <div class="absolute left-6 bottom-0 transform translate-y-1/2">
          <div class="relative">
            <div class="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 overflow-hidden"
                 :class="isDarkMode ? 'border-gray-800' : 'border-white'">
              <img
                  :src="profile.avatar || '/img/default-avatar.jpg'"
                  alt="用户头像"
                  class="w-full h-full object-cover"
              />
            </div>

            <!-- 头像上传按钮 -->
            <button
                class="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                @click="openAvatarUpload"
            >
              <Icon icon="mdi:camera" class="h-4 w-4" />
            </button>
            <input
                type="file"
                ref="avatarInput"
                class="hidden"
                accept="image/*"
                @change="handleAvatarChange"
            />
          </div>
        </div>
      </div>

      <!-- 表单区域 -->
      <div class="pt-16 pb-6 px-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 左侧 - 个人信息 -->
          <div class="lg:col-span-2 space-y-6">
            <h2 class="text-xl font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">个人信息</h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- 姓名 -->
              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  姓名
                </label>
                <input
                    type="text"
                    v-model="profile.name"
                    class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
                    placeholder="您的姓名"
                />
              </div>

              <!-- 用户名 -->
              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  用户名
                </label>
                <input
                    type="text"
                    v-model="profile.username"
                    class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
                    placeholder="用户名"
                />
              </div>

              <!-- 职位 -->
              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  职位
                </label>
                <input
                    type="text"
                    v-model="profile.jobTitle"
                    class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
                    placeholder="您的职位"
                />
              </div>

              <!-- 部门 -->
              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  部门
                </label>
                <input
                    type="text"
                    v-model="profile.department"
                    class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
                    placeholder="您的部门"
                />
              </div>

              <!-- 所在地 -->
              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  所在地
                </label>
                <input
                    type="text"
                    v-model="profile.location"
                    class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
                    placeholder="城市，国家"
                />
              </div>

              <!-- 时区 -->
              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  时区
                </label>
                <select
                    v-model="profile.timezone"
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
            </div>

            <!-- 个人简介 -->
            <div>
              <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                个人简介
              </label>
              <textarea
                  v-model="profile.bio"
                  class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
                  :class="isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                  : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
                  placeholder="关于您自己的简短介绍"
                  rows="4"
              ></textarea>
            </div>

            <h2 class="text-xl font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">联系信息</h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- 电子邮件 -->
              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  电子邮件
                </label>
                <input
                    type="email"
                    v-model="profile.email"
                    class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
                    placeholder="您的电子邮件"
                />
              </div>

              <!-- 电话 -->
              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  电话
                </label>
                <input
                    type="tel"
                    v-model="profile.phone"
                    class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
                    placeholder="您的电话号码"
                />
              </div>
            </div>
          </div>

          <!-- 右侧 - 社交媒体和偏好 -->
          <div class="space-y-6">
            <h2 class="text-xl font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">社交媒体</h2>

            <div class="space-y-4">
              <!-- 微信 -->
              <div class="flex items-center">
                <div class="w-8 text-center mr-2">
                  <Icon icon="mdi:wechat" class="h-5 w-5" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" />
                </div>
                <input
                    type="text"
                    v-model="profile.socialMedia.wechat"
                    class="flex-1 px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
                    placeholder="微信号"
                />
              </div>

              <!-- 领英 -->
              <div class="flex items-center">
                <div class="w-8 text-center mr-2">
                  <Icon icon="mdi:linkedin" class="h-5 w-5" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" />
                </div>
                <input
                    type="text"
                    v-model="profile.socialMedia.linkedin"
                    class="flex-1 px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
                    placeholder="LinkedIn URL"
                />
              </div>

              <!-- GitHub -->
              <div class="flex items-center">
                <div class="w-8 text-center mr-2">
                  <Icon icon="mdi:github" class="h-5 w-5" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" />
                </div>
                <input
                    type="text"
                    v-model="profile.socialMedia.github"
                    class="flex-1 px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
                    placeholder="GitHub 用户名"
                />
              </div>

              <!-- 网站 -->
              <div class="flex items-center">
                <div class="w-8 text-center mr-2">
                  <Icon icon="mdi:web" class="h-5 w-5" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" />
                </div>
                <input
                    type="url"
                    v-model="profile.socialMedia.website"
                    class="flex-1 px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
                    :class="isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
                    placeholder="个人网站 URL"
                />
              </div>
            </div>

            <h2 class="text-xl font-medium mt-6" :class="isDarkMode ? 'text-white' : 'text-gray-800'">个人偏好</h2>

            <div class="space-y-4">
              <!-- 语言偏好 -->
              <div>
                <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  语言偏好
                </label>
                <select
                    v-model="profile.preferences.language"
                    class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
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

              <!-- 显示在线状态 -->
              <div class="flex items-center justify-between">
                <div>
                  <span :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">显示在线状态</span>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                    允许其他用户查看您的在线状态
                  </p>
                </div>
                <button
                    @click="profile.preferences.showOnlineStatus = !profile.preferences.showOnlineStatus"
                    class="relative inline-flex h-6 w-11 items-center rounded-full"
                    :class="profile.preferences.showOnlineStatus ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'"
                >
                  <span
                      class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                      :class="profile.preferences.showOnlineStatus ? 'translate-x-6' : 'translate-x-1'"
                  />
                </button>
              </div>

              <!-- 接收系统通知 -->
              <div class="flex items-center justify-between">
                <div>
                  <span :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">接收系统通知</span>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                    接收系统更新和重要通知
                  </p>
                </div>
                <button
                    @click="profile.preferences.receiveNotifications = !profile.preferences.receiveNotifications"
                    class="relative inline-flex h-6 w-11 items-center rounded-full"
                    :class="profile.preferences.receiveNotifications ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'"
                >
                  <span
                      class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                      :class="profile.preferences.receiveNotifications ? 'translate-x-6' : 'translate-x-1'"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="mt-8 flex justify-end">
          <button
              @click="saveProfile"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            保存更改
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { Icon } from '@iconify/vue';

// 从父组件获取暗黑模式状态
const isDarkMode = inject('isDarkMode', ref(false));

// 文件输入引用
const avatarInput = ref(null);
const coverImageInput = ref(null);

// 个人资料数据
const profile = ref({
  name: '张三',
  username: 'zhangsan',
  jobTitle: '高级前端工程师',
  department: '技术部',
  location: '上海, 中国',
  timezone: 'Asia/Shanghai',
  bio: '热爱前端开发和UI设计，拥有5年Vue开发经验，专注于构建高性能、用户友好的web应用。',
  email: 'zhangsan@example.com',
  phone: '+86 123 4567 8901',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  coverImage: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  socialMedia: {
    wechat: 'zhangsan_wx',
    linkedin: 'in/zhangsan',
    github: 'zhangsan',
    website: 'https://zhangsan.dev'
  },
  preferences: {
    language: 'zh-CN',
    showOnlineStatus: true,
    receiveNotifications: true
  }
});

// 成功消息显示状态
const showSuccessMessage = ref(false);

// 打开头像上传
const openAvatarUpload = () => {
  avatarInput.value.click();
};

// 打开封面图片上传
const openCoverUpload = () => {
  coverImageInput.value.click();
};

// 处理头像文件变更
const handleAvatarChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // 在实际应用中，这里应该上传文件到服务器
    // 这里只是为了演示使用本地URL
    const reader = new FileReader();
    reader.onload = (e) => {
      profile.value.avatar = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// 处理封面图片文件变更
const handleCoverImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // 在实际应用中，这里应该上传文件到服务器
    // 这里只是为了演示使用本地URL
    const reader = new FileReader();
    reader.onload = (e) => {
      profile.value.coverImage = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// 保存个人资料
const saveProfile = () => {
  // 这里应该有API调用来保存个人资料
  console.log('保存个人资料:', profile.value);

  // 显示成功消息
  showSuccessMessage.value = true;

  // 3秒后隐藏成功消息
  setTimeout(() => {
    showSuccessMessage.value = false;
  }, 3000);
};
</script>