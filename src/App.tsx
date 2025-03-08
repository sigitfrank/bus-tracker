import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BusForm from './components/bus-form'
import Map from './components/map'
import { ToastContainer } from 'react-toastify'
import LoginForm from './components/login-form'
import Auth from './components/layout/auth'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginForm />} />
        <Route path='/' element={<Auth><BusForm /></Auth>} />
        <Route path='/tracking/:id' element={<Auth><Map /></Auth>} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App