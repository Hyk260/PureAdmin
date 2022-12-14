/**
 *
 * keepAlive 需要被缓存的组件
 *
 */
const Login = () => import(/* webpackChunkName: "Login" */ "@/views/login/index.vue");
const Home = () => import("@/views/home/index.vue");
const NotFound = () => import("@/views/notfound/index.vue");

const routes = [
  { path: "/", redirect: "/home" },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      title: "登录",
      icon: "Eleme",
    },
  },
];

export default routes;
