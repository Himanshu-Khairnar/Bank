import { BrowserRouter, Routes,Route } from 'react-router-dom'
import ManagerLogin from './Pages/ManagerSignIn.js'
import LoginPage from './Pages/LoginPage'
import SignUpPage from './Pages/SignUpPage'
import Dashboard from './Pages/Dashboard'
import AdminDashboard from './Pages/AdminDashboard.js'
import SingleUser from './Pages/SingleUser'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />}/>
        <Route path='/login' element={<ManagerLogin/>}/>
        <Route path='/register' element={<SignUpPage/>}/>
        <Route path='/dashboard/:userId' element={<Dashboard/>}/>
        <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
        <Route path='/admin/user/:userId' element={<SingleUser/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
