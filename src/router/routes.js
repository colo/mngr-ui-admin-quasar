
const routes = [
  {
    path: '/',
    component: () => import('layouts/App'),
    meta: {
      breadcrumb: { label: 'Home', icon: 'home' }
    },
    children: [
      {
        path: '',
        component: () => import('pages/Index'),
        meta: {
          breadcrumb: { label: 'Index', icon: 'widgets' }
        }
      },

      {
        path: 'hosts',
        component: () => import('pages/dashboards/hosts'),
        meta: {
          breadcrumb: { label: 'Hosts', icon: 'fas fa-tachometer-alt' }
        },

        // Now we define the sub-routes.
        // These are getting injected into
        // layout (from above) automatically
        // by using <router-view> placeholder
        // (need to specify it in layout)
        children: [
          {
            path: ':host',
            component: () => import('pages/dashboards/host'),
            meta: {
              breadcrumb: { label: 'Host', icon: 'widgets' }
            }
          }
          // {
          //   path: 'profile',
          //   component: () => import('pages/user-profile')
          // }
        ]
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
