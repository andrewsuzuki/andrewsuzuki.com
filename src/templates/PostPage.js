import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/Layout"
import SEO from "../components/SEO"
import PageTitle from "../components/PageTitle"

const PostPage = props => {
  const post = props.data.markdownRemark

  // const { series } = props.pageContext

  const { title } = post.frontmatter

  return (
    <Layout>
      <SEO title={title} />
      <PageTitle>{title}</PageTitle>
      <p>
        <em>{post.frontmatter.date}</em>
      </p>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </Layout>
  )
}

export default PostPage

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slugWithPath: { slug: { eq: $slug } } }) {
      html
      fields {
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
`
