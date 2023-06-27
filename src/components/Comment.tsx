import React, { useState, useEffect } from 'react'

import axios from 'axios'
import { Cookies } from 'react-cookie'
import { Link } from 'react-router-dom'
import { useRecoilState } from 'recoil'

import { UserState } from '../State/userState'
import { CommentResponse } from '../Types/articles'

type CommentProps = {
  slug: string | undefined
}

const Comment = ({ slug }: CommentProps) => {
  const [newComment, setNewComment] = useState('')
  const [currentUser] = useRecoilState(UserState)
  const [commentsArr, setCommentsArr] = useState<CommentResponse[]>([])
  const cookie = new Cookies()

  useEffect(() => {
    console.log(slug)
    getComments()
  }, [])

  const getComments = () => {
    axios
      .get(`https://api.realworld.io/api/articles/${slug}/comments`, {
        headers: {
          Authorization: `Bearer ${cookie.get('token')}`,
        },
      })
      .then((res) => {
        console.log(res.data.comments)
        setCommentsArr(res.data.comments)
      })
  }

  const deleteComments = (id: number) => {
    axios
      .delete(`https://api.realworld.io/api/articles/${slug}/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${cookie.get('token')}`,
        },
      })
      .then(() => {
        getComments()
      })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    axios
      .post(
        `https://api.realworld.io/api/articles/${slug}/comments`,
        {
          comment: {
            body: newComment,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${cookie.get('token')}`,
          },
        }
      )
      .then(() => {
        setNewComment('')
        getComments()
      })
  }

  return (
    <div className="row">
      <div className="col-xs-12 col-md-8 offset-md-2">
        <form
          className="card comment-form"
          onSubmit={handleSubmit}
        >
          <div className="card-block">
            <textarea
              className="form-control"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => {
                setNewComment(e.target.value)
              }}
              rows={3}
            ></textarea>
          </div>
          <div className="card-footer">
            <img
              src={currentUser?.image}
              className="comment-author-img"
            />
            <button className="btn btn-sm btn-primary">Post Comment</button>
          </div>
        </form>
        {commentsArr &&
          commentsArr.map((comment) => (
            <div
              className="card"
              key={comment.id}
            >
              <div className="card-block">
                <p className="card-text">{comment.body}</p>
              </div>
              <div className="card-footer">
                <Link
                  to={`/${comment.author.username}`}
                  className="comment-author"
                >
                  <img
                    src={comment.author.image}
                    className="comment-author-img"
                  />
                </Link>
                &nbsp;
                <Link
                  to={`/${comment.author.username}`}
                  className="comment-author"
                >
                  {comment.author.username}
                </Link>
                <span className="date-posted">{`${new Date(comment.createdAt).toLocaleString(
                  'en-US',
                  {
                    month: 'long',
                  }
                )} ${new Date(comment.createdAt).getDate()}, ${new Date(
                  comment.createdAt
                ).getFullYear()}`}</span>
                {currentUser?.username === comment.author.username && (
                  <span className="mod-options">
                    <i
                      className="ion-trash-a"
                      onClick={() => {
                        deleteComments(comment.id)
                      }}
                    ></i>
                  </span>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Comment
