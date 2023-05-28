import Login from '../pages/Auth/Login'
import Deleted from '../pages/Deleted'
import Favourites from '../pages/Favourites'
import Home from '../pages/Home'

export interface routeInterface {
  path: string
  component?: any
  breadcrumb?: Record<string, string>[]
  children?: Array<routeInterface>
}

export const loginRoutes: routeInterface[] = [
  {
    path: "/",
    component: Login,
    breadcrumb: [{ title: "Login", route: "/" }],
  },
];

export const homeRoutes: routeInterface[] = [
  {
    path: "/home",
    component: Home,
    breadcrumb: [{ title: "Home", route: "/home" }],
  },
  {
    path: "/favourites",
    component: Favourites,
    breadcrumb: [{ title: "Favourites", route: "/favourites" }],
  },
  {
    path: "/deleted",
    component: Deleted,
    breadcrumb: [{ title: "Deleted", route: "/deleted" }],
  },
];

