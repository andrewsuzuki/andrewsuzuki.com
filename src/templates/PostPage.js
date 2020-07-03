import React from "react"
import { graphql, Link } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { MDXProvider } from "@mdx-js/react"

import Layout, { Content } from "../components/Layout"
import SEO from "../components/SEO"
import PageTitle from "../components/PageTitle"
import PostInfo from "../components/PostInfo"
import BigButtonLink from "../components/BigButtonLink"
import Tag from "../components/Tag"
import FullImageMDX from "../components/FullImageMDX"
import GalleryMDX from "../components/GalleryMDX"
import { ForcePostsActiveContext } from "../components/Header"

const mdxComponents = {
  BigButtonLink,
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
  const {
    body,
    fields: { tagsWithPaths, slugWithPath },
    frontmatter: { title, description, date },
  } = props.data.mdx
  const { series } = props.pageContext

  return (
    <ForcePostsActiveContext.Provider value={true}>
      <Layout>
        <SEO title={title} description={description} />
        <PageTitle>{title}</PageTitle>
        <PostInfo date={date} tagsWithPaths={tagsWithPaths} />
        <SeriesMessage series={series} thisPostSlug={slugWithPath.slug} />
        <Content>
          <MDXProvider components={mdxComponents}>
            <MDXRenderer>{body}</MDXRenderer>
          </MDXProvider>
        </Content>
      </Layout>
    </ForcePostsActiveContext.Provider>
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
        description
        date(formatString: "YYYY-MM-DD")
      }
    }
  }
`
