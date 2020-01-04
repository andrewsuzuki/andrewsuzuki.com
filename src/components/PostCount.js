import React from "react"

const PostCount = ({ count, what = "post" }) => (
  <p>
    {count === 0 ? "No" : count} {what}
    {count !== 1 && "s"}
  </p>
)

export default PostCount
