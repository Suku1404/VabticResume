import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

// pages 

import {Home, Login, Register, NotFound, Templates, Dashboard, Builder, AiResumeImprove, Profile} from '../pages/index'
// layouts
 

import { SaveResume, AuthLayout, DashboardLayout } from '../layout/index'

// ats routes
import AtsScore from '../pages/ATSScore/AtsScore'
import { PageHeader } from '../components/common'

const AppRoutes = () => {
  return (
    <div>
      <Router>
        <PageHeader />
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/user/login' element={<Login/>} />
            <Route path='/user/register' element={<Register/>} />
            <Route path='/user/notfound' element={<NotFound/>} />
            <Route path='/user/templates' element={<DashboardLayout activeItem="Templates"><Templates /></DashboardLayout>} />
            <Route path='/dashboard' element={<DashboardLayout activeItem="Dashboard"><Dashboard /></DashboardLayout>} />
            <Route path='/ai-resume-improve' element={<DashboardLayout activeItem="AI Assistant"><AiResumeImprove /></DashboardLayout>} />
            <Route path='/my-resume/:id' element={<SaveResume/>} />
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
            <Route path='/ats-score-checker' element={<DashboardLayout activeItem="ATS Checker"><AtsScore /></DashboardLayout>} />
            <Route path='/profile' element={<DashboardLayout activeItem="Profile"><Profile /></DashboardLayout>} />
            
        </Routes>
      </Router>
    </div>
  );
};

export default AppRoutes;