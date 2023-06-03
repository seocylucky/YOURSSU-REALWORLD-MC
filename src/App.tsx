import React from 'react'

import { Routes, Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import Footer from './Layout/Footer'
import Header from './Layout/Header'
import Home from './pages/Home'
import Register from './pages/Register'

const App = () => {
  return (
    <RecoilRoot>
      <Header />
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
      <Footer />
    </RecoilRoot>
  )
}

export default App
