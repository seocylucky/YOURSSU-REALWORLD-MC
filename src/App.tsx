import React from 'react'

import { Routes, Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import Home from './pages/Home'
import Register from './pages/Register'

const App = () => {
  return (
    <RecoilRoot>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
      </Routes>
    </RecoilRoot>
  )
}

export default App
