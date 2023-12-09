const getSearchValuesFromUrl = (keys) => {
  const urlSearch = new URLSearchParams(window.location.search)
  const values = keys.map((key) => urlSearch.get(key))
  return values
}

export default getSearchValuesFromUrl
