
const routes = [
  {
    path: '/',
    component: () => import('layouts/App'),
    meta: {
      breadcrumb: { label: 'Home', icon: 'home' },
    },
    children: [
      {
        path: '',
        component: () => import('pages/Index'),
        meta: {
          breadcrumb: { label: 'Index', icon: 'widgets' },
        },
      },

      {
        path: 'dashboard',
        component: () => import('pages/dashboard/default'),
        meta: {
          breadcrumb: { label: 'Dashboard', icon: 'widgets' },
        },

        // Now we define the sub-routes.
        // These are getting injected into
        // layout (from above) automatically
        // by using <router-view> placeholder
        // (need to specify it in layout)
        children: [
          {
            path: ':name',
            component: () => import('pages/dashboard/default'),
            meta: {
              breadcrumb: { label: 'child Dashboard', icon: 'widgets' },
            },
          },
          // {
          //   path: 'profile',
          //   component: () => import('pages/user-profile')
          // }
        ],
      },
    ],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
