
const routes = [
  {
    path: '/',
    component: () => import('layouts/App'),
    children: [
      { path: '', component: () => import('pages/Index') },

      {
        path: 'dashboard',

        // We point it to our component
        // where we defined our QLayout
        component: () => import('layouts/Dashboard'),

        // Now we define the sub-routes.
        // These are getting injected into
        // layout (from above) automatically
        // by using <router-view> placeholder
        // (need to specify it in layout)
        children: [
          {
            path: '',
            component: () => import('pages/dashboard/default'),
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
