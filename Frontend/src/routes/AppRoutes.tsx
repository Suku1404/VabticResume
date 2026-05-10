
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

// pages 
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import NotFound from '../pages/NotFound'
import Template from '../pages/Templates'
import Dashboard from '../pages/Dashboard'

// layouts
import AuthLayout from '../layout/AuthLayout'
import DashboardLayout from '../layout/DashboardLayout'


const AppRoutes = () => {
  return (
    <div>
      <Router>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/user/login' element={<Login/>} />
            <Route path='/user/register' element={<Register/>} />
            <Route path='/user/notfound' element={<NotFound/>} />
            <Route path='/user/template' element={<Template/>} />
            <Route path='/dashboard' element={<Dashboard/>} />
            <Route path= '/authlayout' element={<AuthLayout/>} />
            <Route path= '/dashboardlayout' element={<DashboardLayout/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default AppRoutes
