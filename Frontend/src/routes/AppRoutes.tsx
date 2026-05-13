
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

// pages 
 
import {Home, Login, Register, NotFound, Templates, Dashboard} from '../pages/index'


// layouts

import {AuthLayout, DashboardLayout} from'../layout/index'


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
  )
}

export default AppRoutes
