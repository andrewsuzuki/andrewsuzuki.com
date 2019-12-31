import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/Layout"
import SEO from "../components/SEO"
import PageTitle from "../components/PageTitle"
import PostList from "../components/PostList"
import PostCount from "../components/PostCount"

const SeriesPage = props => {
  const { name } = props.pageContext
  const posts = props.data.allMarkdownRemark.edges
  const totalCount = props.data.allMarkdownRemark.totalCount

  const title = `Series: ${name}`

  return (
    <Layout>
      <SEO title={title} />
      <PageTitle>{title}</PageTitle>
      <PostCount count={totalCount} />
      <PostList posts={posts} />
    </Layout>
  )
}

export default SeriesPage

export const query = graphql`
  query($seriesSlug: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: ASC }
      filter: { fields: { seriesSlug: { eq: $seriesSlug } } }
    ) {
      totalCount
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
