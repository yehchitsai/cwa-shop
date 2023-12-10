import { atom } from 'recoil'

export const key = 'orderDataState'

const defaultValue = {}

export const orderDataState = atom({
  key,
  default: defaultValue
})
