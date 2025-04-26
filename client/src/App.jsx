import { useState } from 'react';
import React from 'react';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route} from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const [count, setCount] = useState(0)

  return (
      <div >
        <ToastContainer />
       <Routes>
         <Route path='/' element={<Home />} />
         <Route path='/login' element={<Login />} />
         <Route path='/email-verify' element={<EmailVerify />} />
         <Route path='/reset-password' element={<ResetPassword />} />
       </Routes>
      </div>
 )
}

export default App
 