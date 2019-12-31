import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/Layout"
import SEO from "../components/SEO"
import PageTitle from "../components/PageTitle"
import PostList from "../components/PostList"

const IndexPage = props => {
  const posts = props.data.allMdx.edges

  return (
    <Layout>
      <SEO title="Home" />
      <PageTitle>Posts</PageTitle>
      <PostList posts={posts} />
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  {
    allMdx(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: { ne: true } } }
    ) {
      edges {
        node {
          fields {
            slugWithPath {
              path
            }
            categoryWithPath {
              path
              name
            }
            tagsWithPaths {
              tag
              path
            }
          }
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD")
            category
          }
        }
      }
    }
  }
`
