const getSearchValuesFromUrl = (keys, searchString = window.location.search) => {
  const urlSearch = new URLSearchParams(searchString)
  const values = keys.map((key) => urlSearch.get(key))
  return values
}

export default getSearchValuesFromUrl
