import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/Layout"
import SEO from "../components/SEO"
import PageTitle from "../components/PageTitle"
import PostList from "../components/PostList"
import PostCount from "../components/PostCount"

const CategoryPage = props => {
  const { name } = props.pageContext
  const posts = props.data.allMarkdownRemark.edges
  const totalCount = props.data.allMarkdownRemark.totalCount

  return (
    <Layout>
      <SEO title={`Category: ${name}`} />
      <PageTitle>{name}</PageTitle>
      <PostCount count={totalCount} />
      <PostList posts={posts} />
      <p>
        <Link to="/categories">View All Categories</Link>
      </p>
    </Layout>
  )
}

export default CategoryPage

export const query = graphql`
  query($category: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { category: { eq: $category }, draft: { ne: true } }
      }
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
