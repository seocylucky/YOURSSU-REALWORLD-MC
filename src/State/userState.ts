import { atom } from 'recoil'

import { UserType } from '../Types/auth'

import persistAtom from './persistAtom'

export const UserState = atom<UserType | undefined>({
  key: 'UserState',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
})
