import { Router } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
NProgress.configure({ showSpinner: false }); // NProgress Configuration

export function createRouterGuards(router: Router) {
  // to, from, next
  router.beforeEach(async (to, from, next) => {
    console.log(to, from);
    NProgress.start();
    next();
  });

  // , failure
  router.afterEach((to, _, failure) => {
    console.log(to, failure);
    NProgress.done();
  });

  router.onError((error) => {
    console.log(error, '路由错误');
  });
}
