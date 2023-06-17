import React, { useState, useEffect } from 'react'

import { Link, useLocation } from 'react-router-dom'
import { useRecoilState } from 'recoil'

import { UserState } from '../State/userState'

const Header = () => {
  const [isLogined, setIsLogined] = useState<boolean>(false)
  const location = useLocation()
  const [user] = useRecoilState(UserState)

  useEffect(() => {
    console.log(user)
    if (user === undefined) {
      setIsLogined(false)
    } else {
      setIsLogined(true)
    }
  }, [user])

  return (
    <div>
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
                  className={`nav-link ${location.pathname === '/editor' ? 'active' : null}`}
                  to="/editor"
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
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  className={`nav-link ${location.pathname === '/@:/username' ? 'active' : null}`}
                  to="/@:/username"
                >
                  <div>
                    <img
                      src={user?.image}
                      alt={user?.image}
                      height="26px"
                    />
                    {user?.username}
                  </div>
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
    </div>
  )
}

export default Header
