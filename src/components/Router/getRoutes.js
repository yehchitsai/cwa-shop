import { lazy } from 'react'
import { flow } from 'lodash-es'

const getRoutes = (pages) => {
  const routes = flow(
    () => Object.entries(pages),
    (pagesEntries) => pagesEntries.reduce((collect, pagesEntry) => {
      const [path, page] = pagesEntry
      const fileName = path.match(/\.\/pages\/(.*)\.jsx$/)?.[1]
      if (!fileName) {
        return collect
      }

      const normalizedPathName = fileName.includes('$')
        ? fileName.replace('$', ':')
        : fileName.replace(/\/index/, '')

      collect.push({
        path: fileName === 'index' ? '/' : `/${normalizedPathName.toLowerCase()}`,
        element: lazy(page)
      })
      return collect
    }, [])
  )()
  return routes
}

export default getRoutes
