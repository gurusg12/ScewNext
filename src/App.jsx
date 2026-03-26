import  Filter  from './Filter'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import About from './Pages/About'
import Footer from './Pages/Footer'
import NavBar from './Pages/Navbar'
import Projects from './Pages/Projects'
const App = () => {

  return (
    <div>
      <NavBar/>
      <div>  
      <Routes>
        <Route path="/" element= {<Home/>} />
        <Route path="/about" element= {<About/>} />
        <Route path="/upload" element= {<Filter/>} />
        <Route path="/projects" element= {<Projects/>} />
     </Routes>
     </div>
    <Footer/>
     </div>
  )
}
export default App