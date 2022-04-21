import { App } from 'vue';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
// import { PageEnum } from '@/enums/pageEnum';
import { RedirectRoute } from '@/router/base';
import { createRouterGuards } from '@/router/router-guards';

const RootRouter: RouteRecordRaw = {
  path: '/',
  name: 'Root',
  component: () => import('@/views/home/index.vue'),
  meta: {
    title: 'Root',
    hidden: true,
  },
};

// 普通路由 无需权限验证
export const constantRouter: any[] = [RootRouter, RedirectRoute];

const router = createRouter({
  history: createWebHashHistory(''),
  routes: constantRouter,
  // strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export function setupRouter(app: App) {
  app.use(router);
  createRouterGuards(router);
}
