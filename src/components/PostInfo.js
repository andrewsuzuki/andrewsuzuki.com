import React, { Fragment } from "react"
import { Link } from "gatsby"

import Tag from "./Tag"

const PostInfo = ({ date, categoryPath, categoryName, tagsWithPaths }) => (
  <p className="post-info">
    <em>{date}</em>
    &nbsp;&middot;&nbsp;
    <Link to={categoryPath} title={`Category: ${categoryName}`}>
      {categoryName}
    </Link>
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
