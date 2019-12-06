import Dashboard from "views/Dashboard.jsx";
import UserProfile from "views/UserProfile.jsx";
import TableList from "views/TableList.jsx";
import TweetList from 'views/TweetList.jsx';
import TradesList from 'views/TradesList.jsx';
import CurrentPrices from 'views/CurrentPrices.jsx'
import StockList from 'views/StockList.jsx'
import Notifications from "views/Notifications.jsx";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/table",
    name: "Stock List",
    icon: "pe-7s-note2",
    component: StockList,
    layout: "/admin"
  },
  {
    path: "/trades",
    name: "Trades",
    icon: "pe-7s-bell",
    component: TradesList,
    layout: "/admin"
  },
  {
    path: "/tweets",
    name: "Tweets",
    icon: "fa fa-twitter",
    component: TweetList,
    layout: "/admin"
  },
  {
    path: "/prices",
    name: "Current Prices",
    icon: "fa fa-usd",
    component: CurrentPrices,
    layout: "/admin"
  },
  // {
  //   path: "/user",
  //   name: "User Profile",
  //   icon: "pe-7s-user",
  //   component: UserProfile,
  //   layout: "/admin"
  // },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   icon: "pe-7s-news-paper",
  //   component: Typography,
  //   layout: "/admin"
  // },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "pe-7s-science",
  //   component: Icons,
  //   layout: "/admin"
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "pe-7s-map-marker",
  //   component: Maps,
  //   layout: "/admin"
  // },

];

export default dashboardRoutes;
