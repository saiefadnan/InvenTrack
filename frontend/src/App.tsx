
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'

function App() {


  return (
    <BrowserRouter>
      <div className='min-h-screen bg-slate-950 text-slate-100 '>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Dashboard/>}></Route>
          <Route path='orders' element={<Orders/>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
