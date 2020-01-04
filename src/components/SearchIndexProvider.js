import React, { useEffect, createContext, useState } from "react"
import FlexSearch from "flexsearch"
import { flexSearchCreateOptions } from "../flexSearchCreateOptions"

// null => not loaded yet
// false => loading failed
// obj => loaded (the index)
export const SearchIndexContext = createContext(null)

const fetchIndex = () =>
  // default to global if we have it already
  window.__FLEXSEARCH__
    ? Promise.resolve(window.__FLEXSEARCH__)
    : // load json data into window variable
      fetch(`/search-index.json`)
        .then(response => {
          return response.json()
        })
        .then(body => {
          if (!body || !body.postDocs || !body.index) {
            throw new Error("bad response")
          }

          const index = FlexSearch.create(flexSearchCreateOptions)

          index.import(body.index, {
            serialize: false,
            index: true,
            doc: body.postDocs,
          })

          // make global on window object
          window.__FLEXSEARCH__ = index

          return index
        })
        .catch(function(e) {
          console.error(e)
          console.error("Failed fetch search index")
          return false
        })

const SearchIndexProvider = ({ children }) => {
  const [searchIndex, setSearchIndex] = useState(window.__FLEXSEARCH__ || null)

  useEffect(() => {
    fetchIndex().then(result => {
      setSearchIndex(result)
    })
  }, [])

  return (
    <SearchIndexContext.Provider value={searchIndex}>
      {children}
    </SearchIndexContext.Provider>
  )
}

export default SearchIndexProvider
