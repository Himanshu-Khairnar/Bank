import React from 'react'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Home from './Pages/Home'
import LoginPage from './Pages/LoginPage'
import SignUpPage from './Pages/SignUpPage'
import Dashboard from './Pages/Dashboard'
import AdminDashboard from './Pages/adminDashboard'
import SingleUser from './Pages/SingleUser'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<SignUpPage/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
        <Route path='/admin/user/:userId' element={<SingleUser/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
