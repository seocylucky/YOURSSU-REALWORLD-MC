import React, { useState, useEffect } from 'react'

import axios from 'axios'
import { Cookies } from 'react-cookie'
import { useParams, useNavigate } from 'react-router-dom'

import { PostArticleRequest } from '@/Types/articles'

const CreateArticle = () => {
  const { slug } = useParams()
  const [newArticle, setNewArticle] = useState<PostArticleRequest>({
    title: '',
    description: '',
    body: '',
    tagList: [],
  })
  const [newTag, setNewTag] = useState<string>('')
  const [error, setError] = useState({
    key: '',
    value: '',
  })
  const cookie = new Cookies()
  const navigate = useNavigate()

  useEffect(() => {
    if (slug) {
      axios
        .get(`https://api.realworld.io/api/articles/${slug}`, {
          headers: {
            Authorization: `Bearer ${cookie.get('token')}`,
          },
        })
        .then((res) => {
          const data = res.data.article
          setNewArticle({
            title: data.title,
            description: data.description,
            body: data.body,
            tagList: data.tagList,
          })
        })
    }
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setNewArticle({ ...newArticle, [name]: value })
  }

  const handleTagDelete = (index: number) => {
    const deletedTaglist = newArticle.tagList.filter((item, i) => i !== index)
    setNewArticle({ ...newArticle, tagList: deletedTaglist })
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    axios
      .post(
        'https://api.realworld.io/api/articles',
        {
          article: newArticle,
        },
        {
          headers: {
            Authorization: `Bearer ${cookie.get('token')}`,
          },
        }
      )
      .then(() => {
        setError({ key: '', value: '' })
        navigate('/')
      })
      .catch((err) => {
        if (err.response.status === 422) {
          const errData = err.response.data.errors
          const errKey: string[] = Object.keys(errData)
          const errValue: string[] = Object.values(errData)
          setError({ key: errKey[0], value: errValue[0] })
        }
      })
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    axios
      .put(
        `https://api.realworld.io/api/articles/${slug}`,
        {
          article: newArticle,
        },
        {
          headers: {
            Authorization: `Bearer ${cookie.get('token')}`,
          },
        }
      )
      .then((res) => {
        setError({ key: '', value: '' })
        navigate(`/article/${res.data.article.slug}`)
      })
      .catch((err) => {
        if (err.response.status === 422) {
          const errData = err.response.data.errors
          const errKey: string[] = Object.keys(errData)
          const errValue: string[] = Object.values(errData)
          setError({ key: errKey[0], value: errValue[0] })
        }
      })
  }

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ul className="error-messages">
              {error.key !== '' ? <li>{`${error.key} ${error.value}`}</li> : null}
            </ul>
            <form onSubmit={slug ? handleUpdate : handleCreate}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                    name="title"
                    value={newArticle.title}
                    onChange={handleChange}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="What's this article about?"
                    name="description"
                    value={newArticle.description}
                    onChange={handleChange}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows={8}
                    placeholder="Write your article (in markdown)"
                    name="body"
                    value={newArticle.body}
                    onChange={handleChange}
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tags"
                    name="tag"
                    value={newTag}
                    onChange={(e) => {
                      setNewTag(e.target.value)
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !newArticle.tagList.includes(newTag)) {
                        setNewTag('')
                        setNewArticle({ ...newArticle, tagList: [...newArticle.tagList, newTag] })
                      }
                    }}
                  />
                  <div className="tag-list">
                    {newArticle.tagList.map((item, index) => {
                      return (
                        <span
                          key={index}
                          className="tag-default tag-pill ng-binding ng-scope"
                        >
                          <i
                            className="ion-close-round"
                            onClick={() => handleTagDelete(index)}
                          ></i>
                          {item}
                        </span>
                      )
                    })}
                  </div>
                </fieldset>
                <button
                  className="btn btn-lg pull-xs-right btn-primary"
                  type="submit"
                >
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateArticle
