import React from "react"
import { graphql, Link } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { MDXProvider } from "@mdx-js/react"

import Layout, { Content } from "../components/Layout"
import SEO from "../components/SEO"
import PageTitle from "../components/PageTitle"
import PostInfo from "../components/PostInfo"
import Tag from "../components/Tag"
import FullImageMDX from "../components/FullImageMDX"
import GalleryMDX from "../components/GalleryMDX"

const mdxComponents = {
  Tag,
  FullImageMDX,
  GalleryMDX,
}

const SeriesMessage = ({ series, thisPostSlug }) => {
  if (!series) {
    return null
  }

  return (
    <div className="series-message">
      <div>
        <h2>Series: {series.name}</h2>
        <ul>
          {series.posts.map(post => (
            <li key={post.postSlug}>
              {post.postSlug === thisPostSlug ? (
                <strong>{post.title}</strong>
              ) : (
                <Link to={post.path} title={post.title}>
                  {post.title}
                </Link>
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
        tagsWithPaths={post.fields.tagsWithPaths}
      />
      <SeriesMessage
        series={series}
        thisPostSlug={post.fields.slugWithPath.slug}
      />
      <Content>
        <MDXProvider components={mdxComponents}>
          <MDXRenderer>{post.body}</MDXRenderer>
        </MDXProvider>
      </Content>
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
        slugWithPath {
          slug
        }
      }
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
      }
    }
  }
`
