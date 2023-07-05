import React, { useEffect, useState } from 'react'

import axios from 'axios'
import { Cookies } from 'react-cookie'
import { useParams, useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'

import ArticleItem from '@/components/ArticleItem'
import Pagination from '@/components/Pagination'

import { UserState } from '../State/userState'
import { GetArticleResponse } from '../Types/articles'

const Profile = () => {
  const { username } = useParams()
  const [mode, setMode] = useState('My Articles')
  const [currentUser] = useRecoilState(UserState)
  const [offset, setOffset] = useState<number>(0)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [articles, setArticles] = useState<GetArticleResponse[]>([])
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({
    username: '',
    bio: '',
    image: '',
    following: false,
  })
  const cookie = new Cookies()

  const handleArticle = () => {
    if (mode === 'My Articles') {
      axios
        .get(`https://api.realworld.io/api/articles?author=${username}&limit=10&offset=${offset}`, {
          headers: {
            Authorization: `Bearer ${cookie.get('token')}`,
          },
        })
        .then((res) => {
          const data = res.data.articles
          console.log(data)
          setArticles(data)
          setTotalPage(res.data.articlesCount)
        })
    } else {
      axios
        .get(
          `https://api.realworld.io/api/articles?favorited=${username}&limit=10&offset=${offset}`,
          {
            headers: {
              Authorization: `Bearer ${cookie.get('token')}`,
            },
          }
        )
        .then((res) => {
          const data = res.data.articles
          console.log(data)
          setArticles(data)
          setTotalPage(res.data.articlesCount)
        })
    }
  }

  useEffect(() => {
    axios
      .get(`https://api.realworld.io/api/profiles/${username}`, {
        headers: {
          Authorization: `Bearer ${cookie.get('token')}`,
        },
      })
      .then((res) => {
        const data = res.data.profile
        console.log(data)
        setUserInfo({
          username: data.username,
          bio: data.bio,
          image: data.image,
          following: data.following,
        })
      })
  }, [])

  useEffect(() => {
    handleArticle()
  }, [mode, offset])

  const handleFollow = () => {
    axios
      .post(`https://api.realworld.io/api/profiles/${username}/follow`, null, {
        headers: {
          Authorization: `Bearer ${cookie.get('token')}`,
        },
      })
      .then((res) => {
        const data = res.data.profile
        console.log(data)
        setUserInfo({
          username: data.username,
          bio: data.bio,
          image: data.image,
          following: data.following,
        })
      })
  }

  const handleUnfollow = () => {
    axios
      .delete(`https://api.realworld.io/api/profiles/${username}/follow`, {
        headers: {
          Authorization: `Bearer ${cookie.get('token')}`,
        },
      })
      .then((res) => {
        const data = res.data.profile
        console.log(data)
        setUserInfo({
          username: data.username,
          bio: data.bio,
          image: data.image,
          following: data.following,
        })
      })
  }

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img
                src={userInfo?.image}
                className="user-img"
              />
              <h4>{userInfo.username}</h4>
              <p>{userInfo?.bio}</p>
              {currentUser?.username === userInfo.username ? (
                <button
                  className="btn btn-sm btn-outline-secondary action-btn"
                  onClick={() => navigate('/settings')}
                >
                  <i className="ion-gear-a"></i>
                  &nbsp; Edit Profile Settings
                </button>
              ) : userInfo.following === false ? (
                <button
                  className="btn btn-sm btn-outline-secondary action-btn"
                  onClick={handleFollow}
                >
                  <i className="ion-plus-round"></i>
                  &nbsp; Follow {userInfo.username}
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-outline-secondary action-btn"
                  onClick={handleUnfollow}
                >
                  <i className="ion-plus-round"></i>
                  &nbsp; Unfollow {userInfo.username}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <div
                    className={`nav-link ${mode === 'My Articles' ? 'active' : null}`}
                    onClick={() => {
                      setMode('My Articles')
                      setOffset(0)
                    }}
                  >
                    My Articles
                  </div>
                </li>
                <li className="nav-item">
                  <div
                    className={`nav-link ${mode === 'Favorited Articles' ? 'active' : null}`}
                    onClick={() => {
                      setMode('Favorited Articles')
                      setOffset(0)
                    }}
                  >
                    Favorited Articles
                  </div>
                </li>
              </ul>
            </div>
            <ArticleItem
              articles={articles}
              handleArticle={handleArticle}
            />
          </div>
          {totalPage > 10 && (
            <Pagination
              totalPage={totalPage}
              offset={offset}
              setOffset={setOffset}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
