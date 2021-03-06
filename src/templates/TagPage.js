import React from "react"
import { graphql, Link } from "gatsby"

import Layout, { Content } from "../components/Layout"
import SEO from "../components/SEO"
import PageTitle from "../components/PageTitle"
import PostList, { graphqlPostEdgesToPosts } from "../components/PostList"
import Tag from "../components/Tag"
import PostCount from "../components/PostCount"

const TagPage = props => {
  const tag = props.pageContext.tag
  const posts = props.data.allMdx.edges
  const totalCount = props.data.allMdx.totalCount

  const title = `Posts Tagged #${tag}`

  return (
    <Layout>
      <SEO title={title} description={title} />
      <PageTitle>
        Posts Tagged <Tag>{tag}</Tag>
      </PageTitle>
      <Content>
        <PostCount count={totalCount} />
        <PostList posts={graphqlPostEdgesToPosts(posts)} />
        <p>
          <Link to="/tags" title="All Tags">
            View All Tags
          </Link>
        </p>
      </Content>
    </Layout>
  )
}

export default TagPage

export const query = graphql`
  query($tag: String) {
    allMdx(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] }, draft: { ne: true } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slugWithPath {
              path
            }
            tagsWithPaths {
              tag
              path
            }
          }
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD")
          }
        }
      }
    }
  }
`
