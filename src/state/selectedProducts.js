import { atom } from 'recoil'

export const key = 'selectedProductsState'

let defaultValue = []
try {
  const storageValue = JSON.parse(window.localStorage.getItem(key)) || []
  defaultValue = storageValue
} catch (e) {
  console.log('parse selectedProductsState failed', e)
  window.localStorage.removeItem(key)
}

export const selectedProductsState = atom({
  key,
  default: defaultValue
})
