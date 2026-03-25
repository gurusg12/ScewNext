import  Filter  from './Filter'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const App = () => {
  return (

    <div>
     <Routes>
        <Route path="/" element={<Filter/>} />
        {/* Add more routes here later */}
     </Routes>
     </div>
    

  )
}

export default App