import { atom } from 'jotai'

export const key = 'selectedProductsState'

const defaultValue = []

export const selectedProductsState = atom(defaultValue)
