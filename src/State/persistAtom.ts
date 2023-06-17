import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist({
  key: 'real-world',
  storage: localStorage,
})

export default persistAtom
