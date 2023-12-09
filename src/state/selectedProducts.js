import { atom } from 'recoil'

export const key = 'selectedProductsState'

const defaultValue = []

export const selectedProductsState = atom({
  key,
  default: defaultValue
})
