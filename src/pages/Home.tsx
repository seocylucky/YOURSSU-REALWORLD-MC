import React, { useState, useEffect } from 'react'

import axios from 'axios'
import { Cookies } from 'react-cookie'
import { useRecoilState } from 'recoil'

import ArticleItem from '@/components/ArticleItem'

import { UserState } from '../State/userState'
import { GetArticleResponse } from '../Types/articles'

const Home = () => {
  const [currentUser] = useRecoilState(UserState)
  const [mode, setMode] = useState('Global Feed')
  const [tags, setTags] = useState<string[]>([])
  const [articles, setArticles] = useState<GetArticleResponse[]>([])
  const cookie = new Cookies()

  useEffect(() => {
    axios.get('https://api.realworld.io/api/tags', {}).then((res) => {
      console.log(res)
      setTags(res.data.tags)
    })
  }, [])

  useEffect(() => {
    handleArticle()
  }, [mode])

  const handleArticle = () => {
    console.log('handleArticle')
    if (mode === 'Your Feed') {
      axios
        .get('https://api.realworld.io/api/articles/feed?limit=10', {
          headers: {
            Authorization: `Bearer ${cookie.get('token')}`,
          },
        })
        .then((res) => {
          const data = res.data.articles
          console.log(data)
          setArticles(data)
        })
    } else if (mode === 'Global Feed') {
      axios.get('https://api.realworld.io/api/articles?limit=10', {}).then((res) => {
        console.log(res.data.articles)
        setArticles(res.data.articles)
        console.log(res.data.articlesCount)
      })
    } else {
      axios.get(`https://api.realworld.io/api/articles?tag=${mode}`, {}).then((res) => {
        setArticles(res.data.articles)
      })
    }
  }

  return (
    <div className="home-page">
      {!currentUser && (
        <div className="banner">
          <div className="container">
            <h1 className="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>
      )}

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                {currentUser && (
                  <li className="nav-item">
                    <div
                      className={`nav-link ${mode === 'Your Feed' && 'active'}`}
                      onClick={() => {
                        setMode('Your Feed')
                      }}
                    >
                      Your Feed
                    </div>
                  </li>
                )}
                <li className="nav-item">
                  <div
                    className={`nav-link ${mode === 'Global Feed' && 'active'}`}
                    onClick={() => {
                      setMode('Global Feed')
                    }}
                  >
                    Global Feed
                  </div>
                </li>
                {mode !== 'Your Feed' && mode !== 'Global Feed' && (
                  <li className="nav-item">
                    <div
                      className={`nav-link ${
                        mode !== 'Your Feed' && mode !== 'Global Feed' && 'active'
                      }`}
                      onClick={() => {
                        setMode('Global Feed')
                      }}
                    >
                      <i className="ion-pound"></i>
                      &nbsp;{mode}
                    </div>
                  </li>
                )}
              </ul>
              <ArticleItem
                articles={articles}
                handleArticle={handleArticle}
              />
            </div>
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <div className="tag-list">
                {tags &&
                  tags.map((tag, index) => (
                    <div
                      className="tag-pill tag-default"
                      key={index}
                      onClick={() => setMode(`${tag}`)}
                    >
                      {tag}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
