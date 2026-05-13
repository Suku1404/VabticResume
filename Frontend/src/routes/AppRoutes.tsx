
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

// ats routes
import AtsScore from '../pages/ATSScore/AtsScore'

const AppRoutes = () => {
  return (
    <div>
      <Router>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/user/login' element={<Login/>} />
            <Route path='/user/register' element={<Register/>} />
            <Route path='/user/notfound' element={<NotFound/>} />
            <Route path='/user/templates' element={<Templates/>} />
            <Route path='/dashboard' element={<Dashboard/>} />
            <Route path= '/authlayout' element={<AuthLayout/>} />
            <Route path= '/dashboardlayout' element={<DashboardLayout/>} />

            
        </Routes>
      </Router>
    </div>
  );
};

export default AppRoutes;
