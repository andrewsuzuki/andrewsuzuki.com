import React from "react"
import { Link } from "gatsby"

import PostInfo from "./PostInfo"

export const graphqlPostEdgesToPosts = posts =>
  posts.map(post => ({
    title: post.node.frontmatter.title,
    date: post.node.frontmatter.date,
    slugWithPath: post.node.fields.slugWithPath,
    categoryWithPath: post.node.fields.categoryWithPath,
    tagsWithPaths: post.node.fields.tagsWithPaths,
  }))

const PostList = ({ posts }) => (
  <div className="post-listings">
    {posts.map(
      ({ title, date, slugWithPath, categoryWithPath, tagsWithPaths }) => (
        <div key={slugWithPath.path}>
          <div>
            <Link to={slugWithPath.path} title={title}>
              {title}
            </Link>
          </div>
          <PostInfo
            date={date}
            categoryPath={categoryWithPath.path}
            categoryName={categoryWithPath.name}
            tagsWithPaths={tagsWithPaths}
          />
        </div>
      )
    )}
  </div>
)

export default PostList
