import React, { useState, useEffect } from 'react'

import { Link, useLocation } from 'react-router-dom'
import { useRecoilState } from 'recoil'

import { UserState } from '../State/userState'

const Header = () => {
  const [isLogined, setIsLogined] = useState<boolean>(false)
  const location = useLocation()
  const [user] = useRecoilState(UserState)

  useEffect(() => {
    if (user === undefined) {
      setIsLogined(false)
    } else {
      setIsLogined(true)
    }
  }, [user])

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link
          className="navbar-brand"
          to="/"
        >
          conduit
        </Link>
        {isLogined ? (
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/' ? 'active' : null}`}
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname.includes('/editor') ? 'active' : null}`}
                to="/editor"
                onClick={(e) => {
                  if (location.pathname.includes('/editor')) e.preventDefault()
                }}
              >
                {' '}
                <i className="ion-compose"></i>&nbsp;New Article{' '}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/settings"
                className={`nav-link ${location.pathname === '/settings' ? 'active' : null}`}
              >
                {' '}
                <i className="ion-gear-a"></i>&nbsp;Settings{' '}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === `/${user?.username}` ? 'active' : null
                }`}
                to={`/${user?.username}`}
              >
                <img
                  src={user?.image}
                  alt={user?.image}
                  className="user-pic"
                />
                {user?.username}{' '}
              </Link>
            </li>
          </ul>
        ) : (
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/' ? 'active' : null}`}
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/login' ? 'active' : null}`}
                to="/login"
              >
                Sign in
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/register' ? 'active' : null}`}
                to="/register"
              >
                Sign up
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  )
}

export default Header
