import { atom } from 'recoil'

import { UserType } from '../Types/auth'

export const UserState = atom<UserType>({
  key: 'userState',
  default: {
    username: '',
    email: '',
    bio: '',
    image: '',
  },
})
