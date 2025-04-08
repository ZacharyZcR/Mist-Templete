export const sidebarConfig = [
    {
        id: 'dashboard',
        title: '仪表盘',
        icon: 'mdi:view-dashboard',
        path: '/'
    },
    {
        id: 'control',
        title: '集控管理',
        isSection: true,
        items: [
            {
                id: 'control-list',
                title: '集控列表',
                icon: 'mdi:format-list-bulleted',
                path: '/control/list'
            },
            {
                id: 'control-create',
                title: '创建节点',
                icon: 'mdi:plus-circle-outline',
                path: '/control/create'
            },
            {
                id: 'control-overview',
                title: '集控总览',
                icon: 'mdi:view-dashboard-outline',
                path: '/control/overview'
            },
            {
                id: 'control-map',
                title: '集控地图',
                icon: 'mdi:map',
                path: '/control/map'
            }
        ]
    },
    {
        id: 'firewall',
        title: '防火墙',
        isSection: true,
        items: [
            {
                id: 'firewall-rules',
                title: '规则管理',
                icon: 'mdi:shield-outline',
                path: '/firewall/rules'
            },
            {
                id: 'firewall-logs',
                title: '日志查询',
                icon: 'mdi:file-document-outline',
                path: '/firewall/logs'
            },
            {
                id: 'firewall-security',
                title: '安全策略',
                icon: 'mdi:security',
                path: '/firewall/security'
            },
            {
                id: 'firewall-alerts',
                title: '安全告警',
                icon: 'mdi:alert-circle-outline',
                path: '/firewall/alerts'
            }
        ]
    },
    {
        id: 'edr',
        title: 'EDR终端检测',
        isSection: true,
        items: [
            {
                id: 'edr-endpoints',
                title: '终端管理',
                icon: 'mdi:desktop-mac-dashboard',
                path: '/edr/endpoints'
            },
            {
                id: 'edr-threats',
                title: '威胁检测',
                icon: 'mdi:shield-alert',
                path: '/edr/threats'
            },
            {
                id: 'edr-response',
                title: '响应操作',
                icon: 'mdi:shield-check',  // 安全响应确认
                path: '/edr/response'
            },
            {
                id: 'edr-reports',
                title: '报告分析',
                icon: 'mdi:file-chart',
                path: '/edr/reports'
            },
            {
                id: 'edr-policies',
                title: '策略配置',
                icon: 'mdi:shield-check',
                path: '/edr/policies'
            }
        ]
    },
    {
        id: 'security-chat',
        title: '安全模型对话',
        isSection: true,
        items: [
            {
                id: 'security-chat-list',
                title: '对话列表',
                icon: 'mdi:chat-outline',
                path: '/security-chat/list'
            },
            {
                id: 'security-chat-new',
                title: '新建对话',
                icon: 'mdi:chat-plus-outline',
                path: '/security-chat/new'
            },
            {
                id: 'security-chat-history',
                title: '对话历史',
                icon: 'mdi:history',
                path: '/security-chat/history'
            },
            {
                id: 'security-chat-models',
                title: '模型管理',
                icon: 'mdi:brain',
                path: '/security-chat/models'
            }
        ]
    },
    {
        id: 'users',
        title: '用户管理',
        isSection: true,
        items: [
            {
                id: 'users-list',
                title: '用户列表',
                icon: 'mdi:account-group',
                path: '/users'
            },
            {
                id: 'users-create',
                title: '创建用户',
                icon: 'mdi:account-plus',
                path: '/users/create'
            }
        ]
    },
    {
        id: 'settings',
        title: '设置',
        isSection: true,
        items: [
            {
                id: 'settings-system',
                title: '系统设置',
                icon: 'mdi:cog',
                path: '/settings'
            },
            {
                id: 'settings-profile',
                title: '个人资料',
                icon: 'mdi:account-cog',
                path: '/profile'
            }
        ]
    }
];
