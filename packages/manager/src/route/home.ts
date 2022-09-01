const overview = () => import("@/pages/overview/index.vue");
const overviewBasic = () => import("@/pages/overview/basic.vue");
const projects = () => import("@/pages/projects/index.vue");
const projectsList = () => import("@/pages/projects/list.vue");
const log = () => import("@/pages/log/index.vue");
const errorsList = () => import("@/pages/log/list.vue");

const homeRoutes = [
  {
    name: "view",
    path: "view",
    component: overview,
    redirect: "/home/view/basic",
    children: [
      {
        path: "basic",
        component: overviewBasic,
      },
    ],
  },
  {
    name: "projects",
    path: "projects",
    component: projects,
    redirect: "/home/projects/list",
    children: [
      {
        path: "list",
        component: projectsList,
      }
    ],
  },
  {
    name: "log",
    path: "log",
    component: log,
    redirect: "/home/log/list",
    children: [
      {
        path: "list",
        component: errorsList,
      }
    ],
  },
];

export default homeRoutes;
