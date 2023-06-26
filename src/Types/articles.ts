export interface GetArticleResponse {
  slug: string
  title: string
  description: string
  body: string
  tagList: string[]
  createdAt: string
  updatedAt: string
  favorited: true
  favoritesCount: 0
  author: {
    username: string
    bio: string
    image: string
    following: true
  }
}

export interface PostArticleRequest {
  title: string
  description: string
  body: string
  tagList: string[]
}
