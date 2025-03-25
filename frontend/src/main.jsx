import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import store from "./store";
import { Provider } from "react-redux";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen.jsx";
import RegisterScreen from "./screens/RegisterScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import DengueInsightsScreen from "./screens/DengueInsightsScreen.jsx";
import ActivatedUserGraphsScreen from "./screens/ActivatedUserGraphsScreen.jsx";


import AdminRoute from "./components/AdminRoute";

import AdminDashboardScreen from "./screens/AdminDashboardScreen.jsx";
import DengueData from "./screens/DengueDataScreen.jsx";
import AdminDengueEditScreen from "./screens/AdminDengueEditScreen.jsx";
import AdminDengueEditUpdatedScreen from "./screens/DengueDataScreen.jsx";
import AdminDengueDataAdd from "./screens/AdminDengueDataAddScreen.jsx";
import AdminWeeklyDengueDataAddScreen from "./screens/AdminWeeklyDengueDataAddScreen.jsx";
import AdminWeeklyDengueDataScreen from "./screens/AdminWeeklyDengueDataScreen.jsx";

import AdminUsersScreen from "./screens/AdminUsersScreen.jsx";
import AdminUserEditScreen from "./screens/AdminUserEditScreen.jsx";
import AdminRegisterUserScreen from "./screens/AdminRgisterUserScreen.jsx";
import ResearcherDashboardScreen from "./screens/ResearcherDashboardScreen.jsx";
import UserFeedbackScreen from "./screens/UserFeedbackScreen.jsx";

import AdminGraphsInfoScreen from "./screens/AdminGraphsInfoScreen.jsx";
import AdminGraphCreateScreen from "./screens/AdminGraphCreateScreen.jsx";
import AdminGraphEditScreen from "./screens/AdminGraphEditScreen.jsx";
import AdminUserGraphsScreen from "./screens/AdminUserGraphsScreen.jsx";
import AdminCreateUserGraphScreen from "./screens/AdminCreateUserGraphScreen.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/activated-user-graphs" element={<ActivatedUserGraphsScreen />} />
      <Route path="/dengue-insights" element={<DengueInsightsScreen/>}/>


      <Route path="" element={<PrivateRoute />}>
        {" "}
        {/*Only allow for the logged users */}
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/researcher/dashboard" element={<ResearcherDashboardScreen />} />
        <Route path="/user/feedback" element={<UserFeedbackScreen />} />
      </Route>

      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboardScreen />} />

        {/* Dengue Data routes */}

        <Route path="/admin/dengueData" element={<DengueData />} />
        <Route path="/admin/dengueData/:id/edit" element={<AdminDengueEditScreen />}/>
        <Route path="/admin/dengueData/:id" element={<AdminDengueEditUpdatedScreen />} />
        <Route path="/admin/dengueData/add" element={<AdminDengueDataAdd />} />
        <Route path="/admin/weeklyDengueData/add" element={<AdminWeeklyDengueDataAddScreen />}/>
        <Route path="/admin/weeklyDengueData" element={<AdminWeeklyDengueDataScreen />}/>

        {/* User management routes */}

        <Route path="/admin/users" element={<AdminUsersScreen />} />
        <Route path="/admin/user/:id/edit" element={<AdminUserEditScreen />} />
        <Route path="/admin/user/:id" element={<AdminUsersScreen />} />
        <Route path="/admin/user/register" element={<AdminRegisterUserScreen />} />

        {/* NEW: Graphs-related routes */}
        <Route path="/admin/graphs" element={<AdminGraphsInfoScreen />} />
        <Route path="/admin/graphs/create" element={<AdminGraphCreateScreen />} />
        <Route path="/admin/graphs/:graphId/edit" element={<AdminGraphEditScreen />}/>

        {/* NEW: User Graphs routes */}
        <Route path="/admin/usergraphs" element={<AdminUserGraphsScreen />} />
        <Route path="/admin/usergraphs/create" element={<AdminCreateUserGraphScreen />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
