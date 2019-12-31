import React from "react"

const PostCount = ({ count }) => (
  <p>
    {count} post{count > 1 && "s"}
  </p>
)

export default PostCount
