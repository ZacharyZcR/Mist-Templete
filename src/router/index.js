import { createRouter, createWebHistory } from "vue-router";

// 布局组件
const MainLayout = () => import("../layouts/MainLayout.vue");
const AuthLayout = () => import("../layouts/AuthLayout.vue");

// 公共页面
const Home = () => import("../views/Home.vue");
const NotFound = () => import("../views/errors/NotFound.vue");
const Forbidden = () => import("../views/errors/Forbidden.vue");

const routes = [
    // 需要登录的路由
    {
        path: "/",
        component: MainLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: "",
                name: "Dashboard",
                component: Home,
                meta: { title: "仪表盘" }
            },

            // 集控管理路由
            {
                path: "control",
                name: "ControlManagement",
                meta: { title: "集控管理", permission: "users.access" },
                children: [
                    {
                        path: "list",
                        name: "ControlList",
                        component: () => import("../views/control/ControlList.vue"),
                        meta: { title: "集控列表" }
                    },
                    {
                        path: "create",
                        name: "CreateNode",
                        component: () => import("../views/control/NodeForm.vue"),
                        meta: { title: "创建节点" }
                    },
                    {
                        path: "details/:id",
                        name: "NodeDetail",
                        component: () => import("../views/control/NodeDetail.vue"),
                        meta: { title: "节点详情" }
                    },
                    {
                        path: "edit/:id",
                        name: "EditNode",
                        component: () => import("../views/control/NodeForm.vue"),
                        meta: { title: "编辑节点" }
                    },
                    {
                        path: "overview",
                        name: "ControlOverview",
                        component: () => import("../views/control/ControlOverview.vue"),
                        meta: { title: "集控总览" }
                    },
                    {
                        path: "map",
                        name: "ControlMap",
                        component: () => import("../views/control/ControlMap.vue"),
                        meta: { title: "集控地图" }
                    }
                ]
            },

            // 防火墙路由
            {
                path: "firewall",
                name: "FirewallManagement",
                meta: { title: "防火墙", permission: "users.access" },
                children: [
                    {
                        path: "rules",
                        name: "FirewallRules",
                        component: () => import("../views/firewall/FirewallRules.vue"),
                        meta: { title: "规则管理" }
                    },
                    {
                        path: "logs",
                        name: "FirewallLogs",
                        component: () => import("../views/firewall/FirewallLogs.vue"),
                        meta: { title: "日志查询" }
                    },
                    {
                        path: "security",
                        name: "FirewallSecurity",
                        component: () => import("../views/firewall/SecurityPolicy.vue"),
                        meta: { title: "安全策略" }
                    },
                    {
                        path: "alerts",
                        name: "FirewallAlerts",
                        component: () => import("../views/firewall/SecurityAlerts.vue"),
                        meta: { title: "安全告警" }
                    }
                ]
            },

            // 用户管理路由
            {
                path: "users",
                name: "UserManagement",
                meta: { title: "用户管理", permission: "users.access" },
                children: [
                    {
                        path: "",
                        name: "UserList",
                        component: () => import("../views/users/UserList.vue"),
                        meta: { title: "用户列表" }
                    },
                    {
                        path: "create",
                        name: "UserCreate",
                        component: () => import("../views/users/UserForm.vue"),
                        meta: { title: "创建用户", permission: "users.create" }
                    },
                    {
                        path: ":id",
                        name: "UserDetail",
                        component: () => import("../views/users/UserDetail.vue"),
                        meta: { title: "用户详情" }
                    },
                    {
                        path: ":id/edit",
                        name: "UserEdit",
                        component: () => import("../views/users/UserForm.vue"),
                        meta: { title: "编辑用户", permission: "users.edit" }
                    }
                ]
            },

            // 设置页面
            {
                path: "settings",
                name: "Settings",
                component: () => import("../views/settings/Settings.vue"),
                meta: { title: "系统设置", permission: "settings.access" }
            },
            {
                path: "profile",
                name: "Profile",
                component: () => import("../views/settings/Profile.vue"),
                meta: { title: "个人资料" }
            }
        ]
    },

    // 认证相关路由
    {
        path: "/auth",
        component: AuthLayout,
        children: [
            {
                path: "login",
                name: "Login",
                component: () => import("../views/auth/Login.vue"),
                meta: { title: "登录" }
            },
            {
                path: "register",
                name: "Register",
                component: () => import("../views/auth/Register.vue"),
                meta: { title: "注册" }
            },
            {
                path: "forgot-password",
                name: "ForgotPassword",
                component: () => import("../views/auth/ForgotPassword.vue"),
                meta: { title: "忘记密码" }
            },
            {
                path: "reset-password/:token",
                name: "ResetPassword",
                component: () => import("../views/auth/ResetPassword.vue"),
                meta: { title: "重置密码" }
            }
        ]
    },

    // 错误页面
    {
        path: "/403",
        name: "Forbidden",
        component: Forbidden,
        meta: { title: "权限不足" }
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: NotFound,
        meta: { title: "页面未找到" }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
    // 设置页面标题
    document.title = to.meta.title ? `${to.meta.title} - 米斯特模板` : "米斯特模板";

    // 检查用户是否已认证
    const isAuthenticated = localStorage.getItem("token");

    // 需要认证但未登录时，重定向到登录页
    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
        next({
            path: "/auth/login",
            query: { redirect: to.fullPath }
        });
        return;
    }

    // 权限检查（仅当用户已认证）
    if (isAuthenticated && to.meta.permission) {
        const userPermissions = JSON.parse(localStorage.getItem("permissions") || "[]");
        if (!userPermissions.includes(to.meta.permission)) {
            next({ path: "/403" });
            return;
        }
    }

    next();
});

export default router;