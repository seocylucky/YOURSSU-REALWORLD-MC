import React, { useState } from 'react'

import axios from 'axios'
import { Cookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'

import { UserState } from '../State/userState'

const Login = () => {
  const [, setUserState] = useRecoilState(UserState)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState({
    both: '',
    email: '',
    password: '',
  })
  const navigate = useNavigate()

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const temp = {
      both: '',
      email: '',
      password: '',
    }
    axios
      .post('https://api.realworld.io/api/users/login', {
        user: {
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
          both: '',
          email: '',
          password: '',
        })
        navigate('/')
      })
      .catch((err) => {
        console.log(err)
        const errData = err.response.data.errors
        const errKey = Object.keys(errData)
        if (err.response.status === 422) {
          if (errKey.includes('email')) {
            temp.email = errData['email'][0]
          }
          if (errKey.includes('password')) {
            temp.password = errData['password'][0]
          }
        }
        if (err.response.status === 403) {
          if (errKey.includes('email or password')) {
            temp.both = errData['email or password'][0]
          }
        }
        setError(temp)
      })
  }

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <a href="">Need an account?</a>
            </p>

            <ul className="error-messages">
              {error.both !== '' ? <li>{`email or password ${error.both}`}</li> : null}
              {error.email !== '' ? <li>{`email ${error.email}`}</li> : null}
              {error.password !== '' ? <li>{`password ${error.password}`}</li> : null}
            </ul>

            <form onSubmit={handleSubmit}>
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

export default Login
