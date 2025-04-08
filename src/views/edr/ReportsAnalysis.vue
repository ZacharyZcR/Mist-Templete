<template>
  <div>
    <!-- 页面标题和操作栏 -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
      <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
        EDR报告分析
      </h1>
      <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
        <button
            @click="exportReports"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'"
        >
          <Icon icon="mdi:download" class="mr-2 h-5 w-5" />
          导出报告
        </button>
        <button
            @click="generateReport"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-600 text-white hover:bg-green-500'"
        >
          <Icon icon="mdi:file-chart" class="mr-2 h-5 w-5" />
          生成报告
        </button>
        <button
            @click="refreshReports"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'"
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
                placeholder="搜索报告..."
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
            <option value="threat">威胁检测</option>
            <option value="health">终端健康</option>
            <option value="vulnerability">漏洞分析</option>
            <option value="compliance">合规检查</option>
          </select>
          <select
              v-model="timeFilter"
              class="px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
          >
            <option value="all">全部时间</option>
            <option value="today">今天</option>
            <option value="week">本周</option>
            <option value="month">本月</option>
            <option value="quarter">本季度</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" :class="isDarkMode ? 'border-blue-400' : 'border-blue-600'"></div>
    </div>

    <!-- 概览数据卡片 -->
    <div v-else-if="reports.length > 0" class="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="rounded-xl shadow-sm p-4"
           :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="flex items-center">
          <div class="p-3 rounded-full" :class="isDarkMode ? 'bg-red-900/30' : 'bg-red-100'">
            <Icon icon="mdi:shield-alert" class="h-6 w-6" :class="isDarkMode ? 'text-red-400' : 'text-red-600'" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
              已检测威胁
            </p>
            <p class="text-xl font-semibold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
              {{ metrics.threatCount }}
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-xl shadow-sm p-4"
           :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="flex items-center">
          <div class="p-3 rounded-full" :class="isDarkMode ? 'bg-green-900/30' : 'bg-green-100'">
            <Icon icon="mdi:monitor" class="h-6 w-6" :class="isDarkMode ? 'text-green-400' : 'text-green-600'" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
              受监控终端
            </p>
            <p class="text-xl font-semibold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
              {{ metrics.monitoredEndpoints }}
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-xl shadow-sm p-4"
           :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="flex items-center">
          <div class="p-3 rounded-full" :class="isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'">
            <Icon icon="mdi:alert-circle" class="h-6 w-6" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
              严重漏洞
            </p>
            <p class="text-xl font-semibold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
              {{ metrics.criticalVulnerabilities }}
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-xl shadow-sm p-4"
           :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="flex items-center">
          <div class="p-3 rounded-full" :class="isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'">
            <Icon icon="mdi:check-decagram" class="h-6 w-6" :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
              合规终端
            </p>
            <p class="text-xl font-semibold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
              {{ metrics.compliantEndpoints }}%
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 报告列表 -->
    <div v-if="!loading && filteredReports.length > 0" class="space-y-6">
      <!-- 威胁检测报告卡片 -->
      <div v-for="report in filteredReports" :key="report.id"
           class="rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
           :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">

        <!-- 报告标题和工具栏 -->
        <div class="p-4 sm:p-6 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
             :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
          <div>
            <div class="flex items-center">
              <Icon :icon="getReportTypeIcon(report.type)" class="h-5 w-5 mr-2"
                    :class="getReportTypeColor(report.type, isDarkMode)" />
              <h2 class="text-lg font-semibold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
                {{ report.title }}
              </h2>
            </div>
            <p class="text-sm mt-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
              生成于 {{ formatDate(report.generatedAt) }} | {{ report.author }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button @click="viewReport(report)"
                    class="inline-flex items-center px-3 py-1.5 text-sm rounded-lg transition-colors duration-200"
                    :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'">
              <Icon icon="mdi:eye" class="mr-1 h-4 w-4" />
              查看
            </button>
            <button @click="downloadReport(report)"
                    class="inline-flex items-center px-3 py-1.5 text-sm rounded-lg transition-colors duration-200"
                    :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'">
              <Icon icon="mdi:download" class="mr-1 h-4 w-4" />
              下载
            </button>
            <button @click="shareReport(report)"
                    class="inline-flex items-center px-3 py-1.5 text-sm rounded-lg transition-colors duration-200"
                    :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'">
              <Icon icon="mdi:share-variant" class="mr-1 h-4 w-4" />
              分享
            </button>
          </div>
        </div>

        <!-- 报告内容 -->
        <div class="p-4 sm:p-6">
          <!-- 威胁检测报告 -->
          <div v-if="report.type === 'threat'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="rounded-lg p-4"
                   :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
                <p class="text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  检测到的威胁
                </p>
                <div class="flex items-end justify-between">
                  <p class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                    {{ report.data.threatCount }}
                  </p>
                  <div :class="report.data.trend === 'up' ?
                              (isDarkMode ? 'text-red-400' : 'text-red-600') :
                              (isDarkMode ? 'text-green-400' : 'text-green-600')"
                       class="flex items-center text-sm">
                    <Icon :icon="report.data.trend === 'up' ? 'mdi:arrow-up' : 'mdi:arrow-down'" class="h-4 w-4 mr-1" />
                    {{ report.data.trendPercentage }}%
                  </div>
                </div>
              </div>

              <div class="rounded-lg p-4"
                   :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
                <p class="text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  自动修复
                </p>
                <div class="flex items-end justify-between">
                  <p class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                    {{ report.data.autoRemediated }}
                  </p>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                    {{ Math.round(report.data.autoRemediated / report.data.threatCount * 100) }}% 的威胁
                  </p>
                </div>
              </div>

              <div class="rounded-lg p-4"
                   :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
                <p class="text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  受影响终端
                </p>
                <div class="flex items-end justify-between">
                  <p class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                    {{ report.data.affectedEndpoints }}
                  </p>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                    {{ Math.round(report.data.affectedEndpoints / metrics.monitoredEndpoints * 100) }}% 的终端
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-md font-medium mb-3" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                威胁类型分布
              </h3>
              <div class="h-64 p-4 rounded-lg" :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
                <!-- 实际应用中这里会是一个图表组件 -->
                <div class="h-full flex items-center justify-center">
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                    图表显示威胁类型分布（实际应用中会渲染图表）
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-md font-medium mb-3" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                严重威胁汇总
              </h3>
              <div class="rounded-lg overflow-hidden border"
                   :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
                <table class="min-w-full divide-y"
                       :class="isDarkMode ? 'divide-gray-700' : 'divide-gray-200'">
                  <thead :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
                  <tr>
                    <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
                      威胁名称
                    </th>
                    <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
                      类型
                    </th>
                    <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
                      严重程度
                    </th>
                    <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
                      受影响终端
                    </th>
                    <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
                      状态
                    </th>
                  </tr>
                  </thead>
                  <tbody :class="isDarkMode ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'">
                  <tr v-for="(threat, i) in report.data.criticalThreats" :key="i">
                    <td class="px-4 py-3 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                      {{ threat.name }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                      {{ threat.type }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                        <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                              :class="getSeverityClass(threat.severity)">
                          {{ threat.severity }}
                        </span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                      {{ threat.affectedCount }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                        <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                              :class="getStatusClass(threat.status)">
                          {{ threat.status }}
                        </span>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- 终端健康报告 -->
          <div v-if="report.type === 'health'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="rounded-lg p-4"
                   :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
                <p class="text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  健康评分
                </p>
                <div class="flex items-end justify-between">
                  <p class="text-2xl font-bold" :class="getHealthScoreColor(report.data.healthScore, isDarkMode)">
                    {{ report.data.healthScore }}/100
                  </p>
                  <div :class="report.data.trend === 'up' ?
                              (isDarkMode ? 'text-green-400' : 'text-green-600') :
                              (isDarkMode ? 'text-red-400' : 'text-red-600')"
                       class="flex items-center text-sm">
                    <Icon :icon="report.data.trend === 'up' ? 'mdi:arrow-up' : 'mdi:arrow-down'" class="h-4 w-4 mr-1" />
                    {{ report.data.trendPercentage }}%
                  </div>
                </div>
              </div>

              <div class="rounded-lg p-4"
                   :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
                <p class="text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  资源使用率
                </p>
                <div class="flex items-end justify-between">
                  <p class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                    {{ report.data.resourceUsage }}%
                  </p>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                    平均值
                  </p>
                </div>
              </div>

              <div class="rounded-lg p-4"
                   :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
                <p class="text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  组件状态
                </p>
                <div class="flex items-end justify-between">
                  <p class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                    {{ report.data.componentsHealthy }}/{{ report.data.totalComponents }}
                  </p>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                    {{ Math.round(report.data.componentsHealthy / report.data.totalComponents * 100) }}% 正常
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-md font-medium mb-3" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                终端健康状态分布
              </h3>
              <div class="h-64 p-4 rounded-lg" :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
                <!-- 实际应用中这里会是一个图表组件 -->
                <div class="h-full flex items-center justify-center">
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                    图表显示终端健康状态分布（实际应用中会渲染图表）
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 漏洞分析报告 -->
          <div v-if="report.type === 'vulnerability'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="rounded-lg p-4"
                   :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
                <p class="text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  严重漏洞
                </p>
                <p class="text-2xl font-bold" :class="isDarkMode ? 'text-red-400' : 'text-red-600'">
                  {{ report.data.critical }}
                </p>
              </div>

              <div class="rounded-lg p-4"
                   :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
                <p class="text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  高危漏洞
                </p>
                <p class="text-2xl font-bold" :class="isDarkMode ? 'text-orange-400' : 'text-orange-600'">
                  {{ report.data.high }}
                </p>
              </div>

              <div class="rounded-lg p-4"
                   :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
                <p class="text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  中危漏洞
                </p>
                <p class="text-2xl font-bold" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'">
                  {{ report.data.medium }}
                </p>
              </div>

              <div class="rounded-lg p-4"
                   :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
                <p class="text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  低危漏洞
                </p>
                <p class="text-2xl font-bold" :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'">
                  {{ report.data.low }}
                </p>
              </div>
            </div>

            <div>
              <h3 class="text-md font-medium mb-3" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                漏洞分布趋势
              </h3>
              <div class="h-64 p-4 rounded-lg" :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
                <!-- 实际应用中这里会是一个图表组件 -->
                <div class="h-full flex items-center justify-center">
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                    图表显示漏洞随时间变化趋势（实际应用中会渲染图表）
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-md font-medium mb-3" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                主要漏洞详情
              </h3>
              <div class="space-y-3">
                <div v-for="(vuln, i) in report.data.topVulnerabilities" :key="i"
                     class="p-3 rounded-lg border"
                     :class="isDarkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50'">
                  <div class="flex items-start justify-between">
                    <div>
                      <div class="flex items-center">
                        <span class="w-2 h-2 rounded-full mr-2"
                              :class="getVulnerabilitySeverityDotClass(vuln.severity)"></span>
                        <h4 class="text-sm font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                          {{ vuln.name }}
                        </h4>
                      </div>
                      <p class="text-xs mt-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                        {{ vuln.description }}
                      </p>
                    </div>
                    <span class="px-2 py-1 text-xs leading-none font-semibold rounded"
                          :class="getVulnerabilitySeverityClass(vuln.severity)">
                      {{ vuln.severity }}
                    </span>
                  </div>
                  <div class="mt-2 flex justify-between items-center">
                    <span class="text-xs" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                      影响 {{ vuln.affectedCount }} 个终端
                    </span>
                    <button class="text-xs px-2 py-1 rounded"
                            :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'">
                      修复建议
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 合规检查报告 -->
          <div v-if="report.type === 'compliance'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="rounded-lg p-4"
                   :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
                <p class="text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  合规评分
                </p>
                <div class="flex items-end justify-between">
                  <p class="text-2xl font-bold"
                     :class="getComplianceScoreColor(report.data.complianceScore, isDarkMode)">
                    {{ report.data.complianceScore }}%
                  </p>
                  <div :class="report.data.trend === 'up' ?
                              (isDarkMode ? 'text-green-400' : 'text-green-600') :
                              (isDarkMode ? 'text-red-400' : 'text-red-600')"
                       class="flex items-center text-sm">
                    <Icon :icon="report.data.trend === 'up' ? 'mdi:arrow-up' : 'mdi:arrow-down'" class="h-4 w-4 mr-1" />
                    {{ report.data.trendPercentage }}%
                  </div>
                </div>
              </div>

              <div class="rounded-lg p-4"
                   :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
                <p class="text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  通过检查
                </p>
                <div class="flex items-end justify-between">
                  <p class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                    {{ report.data.passedChecks }}/{{ report.data.totalChecks }}
                  </p>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                    {{ Math.round(report.data.passedChecks / report.data.totalChecks * 100) }}% 通过
                  </p>
                </div>
              </div>

              <div class="rounded-lg p-4"
                   :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
                <p class="text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  不合规终端
                </p>
                <div class="flex items-end justify-between">
                  <p class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                    {{ report.data.nonCompliantEndpoints }}
                  </p>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                    {{ Math.round(report.data.nonCompliantEndpoints / metrics.monitoredEndpoints * 100) }}% 的终端
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-md font-medium mb-3" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                合规标准达成情况
              </h3>
              <div class="h-64 p-4 rounded-lg" :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
                <!-- 实际应用中这里会是一个图表组件 -->
                <div class="h-full flex items-center justify-center">
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                    图表显示各合规标准达成情况（实际应用中会渲染图表）
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-md font-medium mb-3" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                主要合规问题
              </h3>
              <div class="space-y-3">
                <div v-for="(issue, i) in report.data.complianceIssues" :key="i"
                     class="p-3 rounded-lg border"
                     :class="isDarkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50'">
                  <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 class="text-sm font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                        {{ issue.name }}
                      </h4>
                      <p class="text-xs mt-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                        {{ issue.standard }} | 影响 {{ issue.affectedCount }} 个终端
                      </p>
                    </div>
                    <div class="mt-2 md:mt-0 flex items-center">
                      <span class="px-2 py-1 text-xs leading-none font-semibold rounded mr-2"
                            :class="getComplianceIssueClass(issue.severity)">
                        {{ issue.severity }}
                      </span>
                      <button class="text-xs px-2 py-1 rounded"
                              :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'">
                        解决方案
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 查看更多按钮 -->
          <div class="mt-4 text-center">
            <button @click="viewDetailedReport(report)"
                    class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
                    :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'">
              <Icon icon="mdi:chart-box" class="mr-2 h-5 w-5" />
              查看完整报告
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && filteredReports.length === 0" class="text-center py-20 rounded-xl shadow-sm"
         :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
      <Icon icon="mdi:file-chart" class="h-16 w-16 mx-auto" :class="isDarkMode ? 'text-gray-600' : 'text-gray-400'" />
      <h3 class="mt-4 text-lg font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
        暂无报告
      </h3>
      <p class="mt-2 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
        没有找到匹配当前筛选条件的报告
      </p>
      <button
          @click="generateReport"
          class="mt-4 inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
          :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'"
      >
        <Icon icon="mdi:file-chart" class="mr-2 h-5 w-5" />
        生成新报告
      </button>
    </div>

    <!-- 生成报告模态框 -->
    <div v-if="showGenerateModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50" @click="closeGenerateModal"></div>
      <div class="relative p-6 rounded-lg shadow-xl max-w-md w-full mx-4 md:mx-auto"
           :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'">
        <button @click="closeGenerateModal"
                :class="isDarkMode ? 'absolute top-4 right-4 text-gray-400 hover:text-gray-300' : 'absolute top-4 right-4 text-gray-400 hover:text-gray-600'">
          <Icon icon="mdi:close" class="h-6 w-6" />
        </button>

        <h2 class="text-xl font-bold mb-6">生成新报告</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              报告类型
            </label>
            <select
                v-model="newReport.type"
                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
            >
              <option value="threat">威胁检测报告</option>
              <option value="health">终端健康报告</option>
              <option value="vulnerability">漏洞分析报告</option>
              <option value="compliance">合规检查报告</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              时间范围
            </label>
            <select
                v-model="newReport.timeRange"
                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
            >
              <option value="day">过去24小时</option>
              <option value="week">过去7天</option>
              <option value="month">过去30天</option>
              <option value="quarter">过去90天</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              包含终端
            </label>
            <select
                v-model="newReport.endpointScope"
                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
            >
              <option value="all">所有终端</option>
              <option value="selected">选定终端组</option>
              <option value="critical">仅关键终端</option>
            </select>
          </div>

          <div class="pt-4 flex justify-end">
            <button
                @click="confirmGenerateReport"
                class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
                :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'"
            >
              <Icon icon="mdi:check" class="mr-2 h-5 w-5" />
              开始生成
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

// 搜索和过滤
const searchQuery = ref('');
const typeFilter = ref('all');
const timeFilter = ref('all');

// 报告数据
const reports = ref([]);
const metrics = ref({
  threatCount: 0,
  monitoredEndpoints: 0,
  criticalVulnerabilities: 0,
  compliantEndpoints: 0
});

// 新报告模态框
const showGenerateModal = ref(false);
const newReport = ref({
  type: 'threat',
  timeRange: 'week',
  endpointScope: 'all'
});

// 过滤后的报告
const filteredReports = computed(() => {
  let result = reports.value.filter(report => {
    // 类型过滤
    if (typeFilter.value !== 'all' && report.type !== typeFilter.value) {
      return false;
    }

    // 时间过滤
    if (timeFilter.value !== 'all') {
      const reportDate = new Date(report.generatedAt);
      const now = new Date();

      if (timeFilter.value === 'today' && reportDate.toDateString() !== now.toDateString()) {
        return false;
      }

      if (timeFilter.value === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (reportDate < weekAgo) {
          return false;
        }
      }

      if (timeFilter.value === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (reportDate < monthAgo) {
          return false;
        }
      }

      if (timeFilter.value === 'quarter') {
        const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        if (reportDate < quarterAgo) {
          return false;
        }
      }
    }

    // 搜索查询
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      return report.title.toLowerCase().includes(query) ||
          report.author.toLowerCase().includes(query);
    }

    return true;
  });

  // 按生成时间排序
  result.sort((a, b) => {
    const dateA = new Date(a.generatedAt);
    const dateB = new Date(b.generatedAt);

    return dateB - dateA; // 从新到旧排序
  });

  return result;
});

// 获取报告类型图标
const getReportTypeIcon = (type) => {
  const iconMap = {
    'threat': 'mdi:shield-alert',
    'health': 'mdi:heart-pulse',
    'vulnerability': 'mdi:security',
    'compliance': 'mdi:check-decagram',
  };
  return iconMap[type] || 'mdi:file-chart';
};

// 获取报告类型颜色
const getReportTypeColor = (type, isDark) => {
  if (isDark) {
    const darkColorMap = {
      'threat': 'text-red-400',
      'health': 'text-green-400',
      'vulnerability': 'text-yellow-400',
      'compliance': 'text-blue-400',
    };
    return darkColorMap[type] || 'text-gray-400';
  } else {
    const lightColorMap = {
      'threat': 'text-red-600',
      'health': 'text-green-600',
      'vulnerability': 'text-yellow-600',
      'compliance': 'text-blue-600',
    };
    return lightColorMap[type] || 'text-gray-600';
  }
};

// 获取威胁严重性样式
const getSeverityClass = (severity) => {
  if (isDarkMode.value) {
    const darkMap = {
      '严重': 'bg-red-900 text-red-300',
      '高危': 'bg-orange-900 text-orange-300',
      '中危': 'bg-yellow-900 text-yellow-300',
      '低危': 'bg-blue-900 text-blue-300',
    };
    return darkMap[severity] || 'bg-gray-700 text-gray-300';
  } else {
    const lightMap = {
      '严重': 'bg-red-100 text-red-800',
      '高危': 'bg-orange-100 text-orange-800',
      '中危': 'bg-yellow-100 text-yellow-800',
      '低危': 'bg-blue-100 text-blue-800',
    };
    return lightMap[severity] || 'bg-gray-100 text-gray-800';
  }
};

// 获取威胁状态样式
const getStatusClass = (status) => {
  if (isDarkMode.value) {
    const darkMap = {
      '已修复': 'bg-green-900 text-green-300',
      '已隔离': 'bg-yellow-900 text-yellow-300',
      '待处理': 'bg-red-900 text-red-300',
      '已忽略': 'bg-gray-700 text-gray-300',
    };
    return darkMap[status] || 'bg-gray-700 text-gray-300';
  } else {
    const lightMap = {
      '已修复': 'bg-green-100 text-green-800',
      '已隔离': 'bg-yellow-100 text-yellow-800',
      '待处理': 'bg-red-100 text-red-800',
      '已忽略': 'bg-gray-100 text-gray-800',
    };
    return lightMap[status] || 'bg-gray-100 text-gray-800';
  }
};

// 获取健康评分颜色
const getHealthScoreColor = (score, isDark) => {
  if (isDark) {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  } else {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }
};

// 获取合规评分颜色
const getComplianceScoreColor = (score, isDark) => {
  if (isDark) {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  } else {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  }
};

// 获取漏洞严重性点样式
const getVulnerabilitySeverityDotClass = (severity) => {
  const severityMap = {
    '严重': 'bg-red-500',
    '高危': 'bg-orange-500',
    '中危': 'bg-yellow-500',
    '低危': 'bg-blue-500',
  };
  return severityMap[severity] || 'bg-gray-500';
};

// 获取漏洞严重性标签样式
const getVulnerabilitySeverityClass = (severity) => {
  if (isDarkMode.value) {
    const darkMap = {
      '严重': 'bg-red-900/50 text-red-300',
      '高危': 'bg-orange-900/50 text-orange-300',
      '中危': 'bg-yellow-900/50 text-yellow-300',
      '低危': 'bg-blue-900/50 text-blue-300',
    };
    return darkMap[severity] || 'bg-gray-700 text-gray-300';
  } else {
    const lightMap = {
      '严重': 'bg-red-100 text-red-800',
      '高危': 'bg-orange-100 text-orange-800',
      '中危': 'bg-yellow-100 text-yellow-800',
      '低危': 'bg-blue-100 text-blue-800',
    };
    return lightMap[severity] || 'bg-gray-100 text-gray-800';
  }
};

// 获取合规问题样式
const getComplianceIssueClass = (severity) => {
  if (isDarkMode.value) {
    const darkMap = {
      '严重': 'bg-red-900/50 text-red-300',
      '中等': 'bg-yellow-900/50 text-yellow-300',
      '轻微': 'bg-blue-900/50 text-blue-300',
    };
    return darkMap[severity] || 'bg-gray-700 text-gray-300';
  } else {
    const lightMap = {
      '严重': 'bg-red-100 text-red-800',
      '中等': 'bg-yellow-100 text-yellow-800',
      '轻微': 'bg-blue-100 text-blue-800',
    };
    return lightMap[severity] || 'bg-gray-100 text-gray-800';
  }
};

// 格式化日期
const formatDate = (timestamp) => {
  const date = new Date(timestamp);

  // 显示易读的日期和时间
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 查看报告
const viewReport = (report) => {
  // 实际应用中可能会打开报告详情页或弹出详细视图
  console.log('查看报告', report.id);
};

// 查看详细报告
const viewDetailedReport = (report) => {
  // 实际应用中可能会导航到完整的报告页面
  console.log('查看完整报告', report.id);
};

// 下载报告
const downloadReport = (report) => {
  // 实际应用中会触发下载操作
  alert(`下载报告: ${report.title}`);
};

// 分享报告
const shareReport = (report) => {
  // 实际应用中会显示分享选项
  alert(`分享报告: ${report.title}`);
};

// 生成报告
const generateReport = () => {
  newReport.value = {
    type: 'threat',
    timeRange: 'week',
    endpointScope: 'all'
  };
  showGenerateModal.value = true;
};

// 关闭生成报告模态框
const closeGenerateModal = () => {
  showGenerateModal.value = false;
};

// 确认生成报告
const confirmGenerateReport = () => {
  // 实际应用中会调用API生成报告
  alert(`正在生成${newReport.value.type}类型报告，时间范围：${newReport.value.timeRange}，终端范围：${newReport.value.endpointScope}`);

  // 在实际应用中，这里应该会启动一个报告生成任务，完成后再更新报告列表
  // 这里简单模拟添加一个新报告
  setTimeout(() => {
    refreshReports();
  }, 1000);

  showGenerateModal.value = false;
};

// 导出报告
const exportReports = () => {
  // 实际应用中会执行导出操作
  alert('导出所有报告');
};

// 刷新报告
const refreshReports = async () => {
  loading.value = true;
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 重新加载数据
    await loadReports();
  } finally {
    loading.value = false;
  }
};

// 加载报告数据
const loadReports = async () => {
  try {
    // 模拟从API获取数据
    await new Promise(resolve => setTimeout(resolve, 800));

    // 设置指标数据
    metrics.value = {
      threatCount: 23,
      monitoredEndpoints: 152,
      criticalVulnerabilities: 7,
      compliantEndpoints: 87
    };

    // 生成模拟报告数据
    const mockReports = [
      {
        id: 'report-1',
        title: '威胁检测月度报告',
        type: 'threat',
        author: '系统管理员',
        generatedAt: '2023-04-01T10:15:00Z',
        data: {
          threatCount: 23,
          autoRemediated: 18,
          affectedEndpoints: 11,
          trend: 'down',
          trendPercentage: 12,
          criticalThreats: [
            { name: 'Trojan.Emotet', type: '特洛伊木马', severity: '严重', affectedCount: 3, status: '已修复' },
            { name: 'Ransomware.WannaCry', type: '勒索软件', severity: '严重', affectedCount: 1, status: '已隔离' },
            { name: 'Backdoor.Cobaltstrike', type: '后门', severity: '高危', affectedCount: 2, status: '待处理' },
          ]
        }
      },
      {
        id: 'report-2',
        title: '终端健康状态报告',
        type: 'health',
        author: '系统管理员',
        generatedAt: '2023-04-02T14:30:00Z',
        data: {
          healthScore: 86,
          resourceUsage: 42,
          componentsHealthy: 7,
          totalComponents: 8,
          trend: 'up',
          trendPercentage: 5
        }
      },
      {
        id: 'report-3',
        title: '系统漏洞分析报告',
        type: 'vulnerability',
        author: '安全分析员',
        generatedAt: '2023-04-03T09:45:00Z',
        data: {
          critical: 7,
          high: 15,
          medium: 32,
          low: 48,
          topVulnerabilities: [
            { name: 'CVE-2023-1234', description: 'Windows权限提升漏洞', severity: '严重', affectedCount: 15 },
            { name: 'CVE-2023-5678', description: 'Apache Log4j 远程代码执行漏洞', severity: '严重', affectedCount: 8 },
            { name: 'CVE-2023-9101', description: 'Chrome浏览器安全漏洞', severity: '高危', affectedCount: 23 }
          ]
        }
      },
      {
        id: 'report-4',
        title: 'IT安全合规检查报告',
        type: 'compliance',
        author: '合规官',
        generatedAt: '2023-04-05T16:00:00Z',
        data: {
          complianceScore: 87,
          passedChecks: 42,
          totalChecks: 48,
          nonCompliantEndpoints: 19,
          trend: 'up',
          trendPercentage: 3,
          complianceIssues: [
            { name: '密码策略不符合要求', description: '密码长度不足', severity: '严重', standard: 'ISO 27001', affectedCount: 12 },
            { name: '未启用双因素认证', description: '敏感系统需要双因素认证', severity: '中等', standard: 'NIST SP 800-53', affectedCount: 8 },
            { name: '操作系统更新延迟', description: '安全补丁应用延迟', severity: '中等', standard: 'CIS Controls', affectedCount: 15 }
          ]
        }
      }
    ];

    reports.value = mockReports;
  } catch (error) {
    console.error('获取报告列表失败:', error);
    // 添加错误处理逻辑
  }
};

// 组件挂载时加载数据
onMounted(async () => {
  try {
    await loadReports();
  } finally {
    loading.value = false;
  }
});
</script>
