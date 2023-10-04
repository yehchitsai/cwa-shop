import { atom } from 'recoil'

export const key = 'selectedProductsState'

export const selectedProductsState = atom({
  key,
  default: JSON.parse(window.localStorage.getItem('selectProducts')) || []
})
