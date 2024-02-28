import { flow, set } from 'lodash-es'

const getRootPagesEntries = (pages) => {
  const rootPagesEntries = flow(
    () => Object.entries(pages),
    (pagesEntries) => pagesEntries.reduce((collect, pagesEntry, index) => {
      const [path, page] = pagesEntry
      const convertedPath = `./pages/${path.replace(/\/pages/, '').replace(/^\.\//, '')}`
      if (collect[convertedPath]) {
        return collect
      }

      set(collect, index, [path, page, convertedPath])
      return collect
    }, [])
  )()
  return rootPagesEntries
}

export default getRootPagesEntries
