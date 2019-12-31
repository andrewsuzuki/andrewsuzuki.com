import React from "react"
import { Link } from "gatsby"

import PostInfo from "./PostInfo"

const PostList = ({ posts }) => (
  <div className="post-listings">
    {posts.map(post => (
      <div key={post.node.fields.slugWithPath.path}>
        <div>
          <Link to={post.node.fields.slugWithPath.path}>
            {post.node.frontmatter.title}
          </Link>
        </div>
        <PostInfo
          date={post.node.frontmatter.date}
          categoryPath={post.node.fields.categoryWithPath.path}
          categoryName={post.node.fields.categoryWithPath.name}
          tagsWithPaths={post.node.fields.tagsWithPaths}
        />
      </div>
    ))}
  </div>
)

export default PostList
