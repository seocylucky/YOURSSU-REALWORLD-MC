import React from 'react'

import axios from 'axios'
import { Cookies } from 'react-cookie'
import { Link, useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'

import { UserState } from '../State/userState'
import { GetArticleResponse } from '../Types/articles'

type MyArticlesProps = {
  articles: GetArticleResponse[]
  handleArticle: () => void
}

// 아티클 보여주는 공용 컴포넌트
const ArticleItem = ({ articles, handleArticle }: MyArticlesProps) => {
  const cookie = new Cookies()
  const [user] = useRecoilState(UserState)
  const navigate = useNavigate()

  const handleFavorite = (slug: string) => {
    axios
      .post(`https://api.realworld.io/api/articles/${slug}/favorite`, null, {
        headers: {
          Authorization: `Bearer ${cookie.get('token')}`,
        },
      })
      .then(() => {
        handleArticle()
      })
  }

  const handleUnfavorite = (slug: string) => {
    axios
      .delete(`https://api.realworld.io/api/articles/${slug}/favorite`, {
        headers: {
          Authorization: `Bearer ${cookie.get('token')}`,
        },
      })
      .then(() => {
        handleArticle()
      })
  }

  return (
    <div>
      {articles && articles.length === 0 && (
        <div className="article-preview">No articles are here... yet.</div>
      )}
      {articles &&
        articles.map((article: GetArticleResponse) => (
          <div
            className="article-preview"
            key={article.slug}
          >
            <div className="article-meta">
              <Link to={`/${article.author.username}`}>
                <img src={article.author.image} />
              </Link>
              <div className="info">
                <Link
                  to={`/${article.author.username}`}
                  className="author"
                >
                  {article.author.username}
                </Link>
                <span className="date">
                  {`${new Date(article.createdAt).toLocaleString('en-US', {
                    month: 'long',
                  })} ${new Date(article.createdAt).getDate()}, ${new Date(
                    article.createdAt
                  ).getFullYear()}`}
                </span>
              </div>
              <button
                className={`btn ${
                  article.favorited ? 'btn-primary' : 'btn-outline-primary'
                } btn-sm pull-xs-right`}
                onClick={() => {
                  if (!user) {
                    navigate('/register')
                  }
                  if (article.favorited) {
                    handleUnfavorite(article.slug)
                  } else {
                    handleFavorite(article.slug)
                  }
                }}
              >
                <i className="ion-heart"></i> {article.favoritesCount}
              </button>
            </div>
            <Link
              to={`/article/${article.slug}`}
              className="preview-link"
            >
              <h1>{article.title}</h1>
              <p>{article.description}</p>
              <span>Read more...</span>
              <ul className="tag-list">
                {article.tagList &&
                  article.tagList.map((tag, index) => (
                    <li
                      key={index}
                      className="tag-default tag-pill tag-outline ng-binding ng-scope"
                    >
                      {tag}
                    </li>
                  ))}
              </ul>
            </Link>
          </div>
        ))}
    </div>
  )
}

export default ArticleItem
