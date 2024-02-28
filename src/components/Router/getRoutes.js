import { lazy } from 'react'
import { flow, get } from 'lodash-es'

const getRoutes = (pages, loaderMap = {}) => {
  const routes = flow(
    () => Object.entries(pages),
    (pagesEntries) => pagesEntries.reduce((collect, pagesEntry) => {
      const [path, page] = pagesEntry
      const fileName = path.match(/\.\/pages\/(.*)\.jsx$/)?.[1]
      if (!fileName) {
        return collect
      }

      const normalizedPathName = fileName
        .replace('$', ':')
        .replace(/\/index/, '')

      const isIndex = fileName === 'index'
      collect.push({
        path: isIndex ? '/' : `/${normalizedPathName.toLowerCase()}/`,
        element: lazy(page),
        loader: get(loaderMap, fileName, null)
      })
      return collect
    }, [])
  )()
  return routes
}

export default getRoutes
