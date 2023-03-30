const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        redirect: "viewer"
        //component: () => import("pages/Index.vue")
      },
      {
        path: "viewer",
        components: {
          default: () => import("pages/Viewer/Index.vue"),
          toolbar: () => import("pages/Viewer/Toolbar.vue")
        }
      }
    ]
  },

  {
    path: "/editor",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        components: {
          default: () => import("pages/Editor/Index.vue"),
          toolbar: () => import("pages/Editor/Toolbar.vue")
        }
      }
    ]
  },

  // {
  //   path: "viewer",
  //   component: () => import("pages/Error404.vue")
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
