import React from 'react'

import { Routes, Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import Footer from './Layout/Footer'
import Header from './Layout/Header'
import CreateArticle from './pages/CreateArticle'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Settings from './pages/Settings'

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
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/editor"
          element={<CreateArticle />}
        />
        <Route
          path="/settings"
          element={<Settings />}
        />
        <Route
          path="/:username"
          element={<Profile />}
        />
      </Routes>
      <Footer />
    </RecoilRoot>
  )
}

export default App
