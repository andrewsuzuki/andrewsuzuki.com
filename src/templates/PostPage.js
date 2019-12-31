import React from "react"
import { graphql, Link } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"

import Layout from "../components/Layout"
import SEO from "../components/SEO"
import PageTitle from "../components/PageTitle"
import PostInfo from "../components/PostInfo"

const SeriesMessage = ({ series, thisPostSlug }) => {
  if (!series) {
    return null
  }

  return (
    <div className="series-message">
      <div>
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
    </div>
  )
}

const PostPage = props => {
  const post = props.data.mdx

  const { series } = props.pageContext

  const { title } = post.frontmatter

  return (
    <Layout>
      <SEO title={title} />
      <PageTitle>{title}</PageTitle>
      <PostInfo
        date={post.frontmatter.date}
        categoryPath={post.fields.categoryWithPath.path}
        categoryName={post.fields.categoryWithPath.name}
        tagsWithPaths={post.fields.tagsWithPaths}
      />
      <SeriesMessage
        series={series}
        thisPostSlug={post.fields.slugWithPath.slug}
      />
      <section className="content">
        <MDXRenderer>{post.body}</MDXRenderer>
      </section>
    </Layout>
  )
}

export default PostPage

export const query = graphql`
  query($slug: String!) {
    mdx(fields: { slugWithPath: { slug: { eq: $slug } } }) {
      body
      fields {
        tagsWithPaths {
          tag
          path
        }
        categoryWithPath {
          path
          name
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
