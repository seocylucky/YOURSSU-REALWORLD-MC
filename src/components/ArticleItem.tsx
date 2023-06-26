import React from 'react'

import { Article } from '../Types/articles'

type MyArticlesProps = {
  articles: Article[]
}

// 아티클 보여주는 공용 컴포넌트
const ArticleItem = ({ articles }: MyArticlesProps) => {
  return (
    <div>
      {articles && articles.length === 0 && (
        <div className="article-preview">No articles are here... yet.</div>
      )}
      {articles &&
        articles.map((article: Article) => (
          <div
            className="article-preview"
            key={article.slug}
          >
            <div className="article-meta">
              <a href="">
                <img src={article.author.image} />
              </a>
              <div className="info">
                <a
                  href=""
                  className="author"
                >
                  {article.author.username}
                </a>
                <span className="date">
                  {`${new Date(article.createdAt).toLocaleString('en-US', {
                    month: 'long',
                  })} ${new Date(article.createdAt).getDate()}, ${new Date(
                    article.createdAt
                  ).getFullYear()}`}
                </span>
              </div>
              <button className="btn btn-outline-primary btn-sm pull-xs-right">
                <i className="ion-heart"></i> {article.favoritesCount}
              </button>
            </div>
            <a
              href=""
              className="preview-link"
            >
              <h1>{article.title}</h1>
              <p>{article.description}</p>
              <span>Read more...</span>
            </a>
          </div>
        ))}
    </div>
  )
}

export default ArticleItem
