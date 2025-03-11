import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'

import Login from './components/login'
import Chatbot from './components/popup'
function App() {
  const [count, setCount] = useState(0)

  return (
    <><div className='bg-blue-200'>
       <Routes>

        <Route path='/login' element={<Login/>}/>
        <Route path='/home' element={<Chatbot/>}/>
       </Routes>
    </div>
       
    </>
  )
}

export default App
