import React, { useState } from 'react'

import axios from 'axios'
import { Cookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'

import { UserState } from '../State/userState'

const Settings = () => {
  const [user, setUser] = useRecoilState(UserState)
  const [newData, setNewData] = useState({
    image: user?.image,
    username: user?.username,
    bio: user?.bio,
    email: user?.email,
    password: '',
  })
  const navigate = useNavigate()
  const cookie = new Cookies()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setNewData({ ...newData, [name]: value })
  }

  const handleLogout = () => {
    cookie.remove('token')
    setUser(undefined)
    navigate('/')
  }

  const handleSubmit = () => {
    axios
      .put(
        'https://api.realworld.io/api/user',
        {
          user: {
            image: newData.image,
            username: newData.username,
            bio: newData.bio,
            email: newData.email,
            password: newData.password,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${cookie.get('token')}`,
          },
        }
      )
      .then((res) => {
        const data = res.data.user
        const userData = {
          username: data.username,
          email: data.email,
          bio: data.bio,
          image: data.image,
        }
        cookie.set('token', data.token)
        setUser(userData)
      })
      .catch((err) => {
        console.log(err.data)
      })
    navigate(`/@/:${user?.username}`)
  }

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>
            <form onSubmit={handleSubmit}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="URL of profile picture"
                    name="image"
                    value={newData.image}
                    onChange={handleChange}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    name="username"
                    value={newData.username}
                    onChange={handleChange}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control form-control-lg"
                    rows={8}
                    placeholder="Short bio about you"
                    name="bio"
                    value={newData.bio}
                    onChange={handleChange}
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                    name="email"
                    value={newData.email}
                    onChange={handleChange}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={newData.password}
                    onChange={handleChange}
                  />
                </fieldset>
                <button className="btn btn-lg btn-primary pull-xs-right">Update Settings</button>
              </fieldset>
            </form>
            <hr />
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger"
            >
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
