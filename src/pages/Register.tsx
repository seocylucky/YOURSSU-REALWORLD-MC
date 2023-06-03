import React, { useState } from 'react'

import axios from 'axios'
import { Cookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'

import { UserState } from '../State/userState'

const Register = () => {
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [, setUserState] = useRecoilState(UserState)
  const navigate = useNavigate()

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    axios
      .post('https://api.realworld.io/api/users', {
        user: {
          username,
          email,
          password,
        },
      })
      .then((res) => {
        console.log(res)
        const cookie = new Cookies()
        const data = res.data.user
        const userData = {
          username: data.username,
          email: data.email,
          bio: data.bio,
          image: data.image,
        }
        cookie.set('token', data.token)
        setUserState(userData)
        setError({
          username: '',
          email: '',
          password: '',
        })
        navigate('/')
      })
      .catch((err) => {
        console.log(err)
        if (err.response.status === 422) {
          const errData = err.response.data.errors
          const errKey = Object.keys(errData)
          if (errKey.includes('username')) {
            setError({ ...error, username: errData['username'][0] })
          }
          if (errKey.includes('email')) {
            setError({ ...error, email: errData['email'][0] })
          }
          if (errKey.includes('password')) {
            setError({ ...error, password: errData['password'][0] })
          }
        }
      })
  }

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <a href="">Have an account?</a>
            </p>
            <ul className="error-messages">
              {error.username !== '' ? <li>{`username ${error.username}`}</li> : null}
              {error.email !== '' ? <li>{`email ${error.email}`}</li> : null}
              {error.password !== '' ? <li>{`password ${error.password}`}</li> : null}
            </ul>
            <form onSubmit={onSubmit}>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  value={username}
                  onChange={handleName}
                  placeholder="Your Name"
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="email"
                  value={email}
                  onChange={handleEmail}
                  placeholder="Email"
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  value={password}
                  onChange={handlePassword}
                  placeholder="Password"
                />
              </fieldset>
              <button className="btn btn-lg btn-primary pull-xs-right">Sign up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
