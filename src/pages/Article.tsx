import React, { useState, useEffect } from 'react'

import axios from 'axios'
import { Cookies } from 'react-cookie'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'

import { UserState } from '../State/userState'
import { GetArticleResponse } from '../Types/articles'
import Comment from '../components/Comment'

const Article = () => {
  const { slug } = useParams()
  const [isArticle, setIsArticle] = useState<GetArticleResponse | undefined>(undefined)
  const [currentUser] = useRecoilState(UserState)
  const [isAuthor, setIsAuthor] = useState(false)
  const [user, setUser] = useRecoilState(UserState)
  const cookie = new Cookies()
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(`https://api.realworld.io/api/articles/${slug}`, {
        headers: {
          Authorization: `Bearer ${cookie.get('token')}`,
        },
      })
      .then((res) => {
        const data = res.data.article
        setIsArticle(data)
        if (data.author.username === currentUser?.username) {
          setIsAuthor(true)
        } else setIsAuthor(false)
      })
  }, [])

  const handleDelete = () => {
    axios
      .delete(`https://api.realworld.io/api/articles/${slug}`, {
        headers: {
          Authorization: `Bearer ${cookie.get('token')}`,
        },
      })
      .then(() => {
        setIsArticle(undefined)
        navigate('/')
      })
  }

  const handleFollow = () => {
    axios
      .post(`https://api.realworld.io/api/profiles/${isArticle?.author.username}/follow`, null, {
        headers: {
          Authorization: `Bearer ${cookie.get('token')}`,
        },
      })
      .then((res) => {
        const data = res.data.profile
        setIsArticle(isArticle && { ...isArticle, author: data })
      })
  }

  const handleUnFollow = () => {
    axios
      .delete(`https://api.realworld.io/api/profiles/${isArticle?.author.username}/follow`, {
        headers: {
          Authorization: `Bearer ${cookie.get('token')}`,
        },
      })
      .then((res) => {
        const data = res.data.profile

        setIsArticle(isArticle && { ...isArticle, author: data })
      })
  }

  const handleFavorite = () => {
    axios
      .post(`https://api.realworld.io/api/articles/${isArticle?.slug}/favorite`, null, {
        headers: {
          Authorization: `Bearer ${cookie.get('token')}`,
        },
      })
      .then((res) => {
        const data = res.data.article
        setIsArticle(data)
      })
  }

  const handleUnfavorite = () => {
    axios
      .delete(`https://api.realworld.io/api/articles/${isArticle?.slug}/favorite`, {
        headers: {
          Authorization: `Bearer ${cookie.get('token')}`,
        },
      })
      .then((res) => {
        const data = res.data.article
        data && delete data.favoritedBy
        setIsArticle(data)
      })
  }

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{isArticle?.title}</h1>

          <div className="article-meta">
            <Link to={`/${isArticle?.author.username}`}>
              <img src={isArticle?.author.image} />
            </Link>
            <div className="info">
              <Link
                to={`/${isArticle?.author.username}`}
                className="author"
              >
                {isArticle?.author.username}
              </Link>
              {isArticle && (
                <span className="date">
                  {`${new Date(isArticle?.createdAt).toLocaleString('en-US', {
                    month: 'long',
                  })} ${new Date(isArticle?.createdAt).getDate()}, ${new Date(
                    isArticle?.createdAt
                  ).getFullYear()}`}
                </span>
              )}
            </div>
            {isAuthor ? (
              <>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => navigate(`/editor/${isArticle?.slug}`)}
                >
                  <i className="ion-edit"></i>
                  &nbsp; Edit Article <span className="counter"></span>
                </button>
                &nbsp;&nbsp;
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleDelete}
                >
                  <i className="ion-trash-a"></i>
                  &nbsp; Delete Article <span className="counter"></span>
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => {
                    isArticle?.author.following ? handleUnFollow() : handleFollow()
                  }}
                >
                  <i className="ion-plus-round"></i>
                  {isArticle?.author.following
                    ? ` Unfollow ${isArticle?.author.username}`
                    : ` Follow ${isArticle?.author.username}`}
                </button>
                &nbsp;&nbsp;
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => {
                    isArticle?.favorited ? handleUnfavorite() : handleFavorite()
                  }}
                >
                  <i className="ion-heart"></i>
                  {isArticle?.favorited ? ' Unfavorite Post' : ' Favorite Post'}{' '}
                  <span className="counter">{`(${isArticle?.favoritesCount})`}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <p>{isArticle?.body}</p>
          </div>
        </div>
        <ul className="tag-list">
          {isArticle &&
            isArticle.tagList.map((tag, index) => (
              <li
                className="tag-default tag-pill tag-outline ng-binding ng-scope"
                key={index}
              >
                {tag}
              </li>
            ))}
        </ul>

        <hr />

        <div className="article-actions">
          <div className="article-meta">
            <Link to={`/${isArticle?.author.username}`}>
              <img src={isArticle?.author.image} />
            </Link>
            <div className="info">
              <Link
                to={`/${isArticle?.author.username}`}
                className="author"
              >
                {isArticle?.author.username}
              </Link>
              {isArticle && (
                <span className="date">
                  {`${new Date(isArticle?.createdAt).toLocaleString('en-US', {
                    month: 'long',
                  })} ${new Date(isArticle?.createdAt).getDate()}, ${new Date(
                    isArticle?.createdAt
                  ).getFullYear()}`}
                </span>
              )}
            </div>
            {isAuthor ? (
              <>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => navigate(`/editor/${isArticle?.slug}`)}
                >
                  <i className="ion-edit"></i>
                  &nbsp; Edit Article <span className="counter"></span>
                </button>
                &nbsp;&nbsp;
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleDelete}
                >
                  <i className="ion-trash-a"></i>
                  &nbsp; Delete Article <span className="counter"></span>
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => {
                    isArticle?.author.following ? handleUnFollow() : handleFollow()
                  }}
                >
                  <i className="ion-plus-round"></i>
                  {isArticle?.author.following
                    ? ` Unfollow ${isArticle?.author.username}`
                    : ` Follow ${isArticle?.author.username}`}
                </button>
                &nbsp;&nbsp;
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => {
                    isArticle?.favorited ? handleUnfavorite() : handleFavorite()
                  }}
                >
                  <i className="ion-heart"></i>
                  {isArticle?.favorited ? ' Unfavorite Post' : ' Favorite Post'}{' '}
                  <span className="counter">{`(${isArticle?.favoritesCount})`}</span>
                </button>
              </>
            )}
          </div>
        </div>
        {user ? (
          <Comment slug={slug} />
        ) : (
          <div className="col-xs-12 col-md-8 pffset-md-2">
            <p style={{ display: 'inherit' }}>
              <Link to="/login">Sign in</Link>&nbsp;or&nbsp;<Link to="/register">sign up</Link> to
              add comments on this article.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Article
