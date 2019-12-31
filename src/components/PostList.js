import React, { Fragment } from "react"
import { Link } from "gatsby"

import Tag from "./Tag"

const PostList = ({ posts }) => (
  <div className="post-listings">
    {posts.map(post => (
      <div key={post.node.fields.slugWithPath.path}>
        <div>
          <Link to={post.node.fields.slugWithPath.path}>
            {post.node.frontmatter.title}
          </Link>
        </div>
        <div>
          <em>{post.node.frontmatter.date}</em>
          &nbsp;&middot;&nbsp;
          <Link to={post.node.fields.categoryWithPath.path}>
            {post.node.fields.categoryWithPath.name}
          </Link>
          {post.node.fields.tagsWithPaths &&
          post.node.fields.tagsWithPaths.length ? (
            <>
              &nbsp;&middot;&nbsp;
              {post.node.fields.tagsWithPaths.map(({ tag }) => (
                <Fragment key={tag}>
                  <Tag>{tag}</Tag>{" "}
                </Fragment>
              ))}
            </>
          ) : null}
        </div>
      </div>
    ))}
  </div>
)

export default PostList
