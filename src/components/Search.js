import React, { useContext, useState, useEffect } from "react"
import useThrottle from "@react-hook/throttle"
import { SearchIndexContext } from "./SearchIndexProvider"
import PostList from "./PostList"
import PostCount from "./PostCount"

const SEARCH_THROTTLE_FPS = 4

const Search = () => {
  const index = useContext(SearchIndexContext)
  const [s, setS] = useThrottle("", SEARCH_THROTTLE_FPS, true)
  const [results, setResults] = useState([])

  useEffect(() => {
    if (index) {
      setResults(index.search(s))
    }
  }, [index, s])

  if (index === null) {
    return <p>Loading...</p>
  } else if (index === false) {
    return <p>There was an error loading the search. Try refreshing?</p>
  }

  return (
    <div className="search">
      <p>
        <input
          type="text"
          placeholder="Search"
          onChange={e => setS(e.target.value)}
        />
      </p>
      {!s ? (
        <p>Enter your search in the box above.</p>
      ) : (
        <>
          <PostCount count={results.length} what="result" />
          <PostList
            posts={results.map(result => ({
              // doesn't need it, but let's map fields directly
              // for future-proofing
              title: result.title,
              date: result.date,
              slugWithPath: result.slugWithPath,
              categoryWithPath: result.categoryWithPath,
              tagsWithPaths: result.tagsWithPaths,
            }))}
          />
        </>
      )}
    </div>
  )
}

export default Search
