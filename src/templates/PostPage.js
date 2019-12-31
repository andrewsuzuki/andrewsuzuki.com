import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/Layout"
import SEO from "../components/SEO"
import PageTitle from "../components/PageTitle"

const SeriesMessage = ({ series, thisPostSlug }) => {
  if (!series) {
    return null
  }

  return (
    <div className="series-message">
      <h2>Series: {series.name}</h2>
      <ul className="bulleted">
        {series.posts.map(post => (
          <li key={post.postSlug}>
            {post.postSlug === thisPostSlug ? (
              <strong>{post.title}</strong>
            ) : (
              <Link to={post.path}>{post.title}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

const PostPage = props => {
  const post = props.data.markdownRemark

  const { series } = props.pageContext

  const { title } = post.frontmatter

  return (
    <Layout>
      <SEO title={title} />
      <PageTitle>{title}</PageTitle>
      <p>
        <em>{post.frontmatter.date}</em>
      </p>
      <SeriesMessage
        series={series}
        thisPostSlug={post.fields.slugWithPath.slug}
      />
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
        slugWithPath {
          slug
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
