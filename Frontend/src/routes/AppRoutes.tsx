
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Builder,
  Dashboard,
  Home,
  Login,
  NotFound,
  Register,
  Template,
} from "../pages/index";
import { AuthLayout, DashboardLayout } from "../layout/index";


const AppRoutes = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/login" element={<Login />} />
          <Route path="/user/register" element={<Register />} />
          <Route path="/user/notfound" element={<NotFound />} />
          <Route path="/user/templates" element={<Template />} />
          <Route path="/builder/:templateId" element={<Builder />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/authlayout"
            element={<AuthLayout>Auth Layout Preview</AuthLayout>}
          />
          <Route
            path="/dashboardlayout"
            element={
              <DashboardLayout>
                Dashboard Layout Preview
              </DashboardLayout>
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default AppRoutes;
