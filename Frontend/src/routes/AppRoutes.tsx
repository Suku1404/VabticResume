
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

// pages 

import {Home, Login, Register, NotFound, Templates, Dashboard,Builder} from '../pages/index'
// layouts

import { AuthLayout, DashboardLayout } from '../layout/index'

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
            <Route path='/builder/:templateId' element={<Builder/>} />
            <Route path='/ats-score-checker' element={<AtsScore/>} />
            
        </Routes>
      </Router>
    </div>
  );
};

export default AppRoutes;
