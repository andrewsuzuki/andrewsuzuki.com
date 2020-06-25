import React, { Fragment } from "react"

import Tag from "./Tag"

const PostInfo = ({ date, tagsWithPaths }) => (
  <p className="post-info">
    <em>{date}</em>
    {tagsWithPaths && tagsWithPaths.length ? (
      <>
        &nbsp;&middot;&nbsp;
        {tagsWithPaths.map(({ tag }) => (
          <Fragment key={tag}>
            <Tag>{tag}</Tag>{" "}
          </Fragment>
        ))}
      </>
    ) : null}
  </p>
)

export default PostInfo
