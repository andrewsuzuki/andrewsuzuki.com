import React, { Fragment, useState } from "react"
import { graphql } from "gatsby"
import _ from "lodash"

import Layout, { Content } from "../components/Layout"
import SEO from "../components/SEO"
import PageTitle from "../components/PageTitle"
import Tag from "../components/Tag"

const TagsPage = props => {
  const [orderKey, setOrderKey] = useState("totalCount")

  const tags = props.data.allMdx.group

  const tagsCount = tags.length

  return (
    <Layout>
      <SEO title="All Tags" description="See and sort all post tags" />
      <PageTitle>All Tags</PageTitle>
      <Content>
        <p>
          Sort by:{" "}
          <button
            onClick={() => setOrderKey("totalCount")}
            className={orderKey === "totalCount" ? "active" : null}
          >
            post count
          </button>{" "}
          <button
            onClick={() => setOrderKey("fieldValue")}
            className={orderKey === "fieldValue" ? "active" : null}
          >
            name
          </button>
        </p>
        <p>
          {tagsCount} tag{tagsCount !== 1 && "s"}
        </p>
        <div>
          {_.orderBy(
            tags,
            [orderKey],
            [orderKey === "totalCount" ? "desc" : "asc"]
          ).map(({ fieldValue: tag, totalCount: count }) => (
            <Fragment key={tag}>
              <Tag>{tag}</Tag>
              <sup>{count}</sup>{" "}
            </Fragment>
          ))}
        </div>
      </Content>
    </Layout>
  )
}

export default TagsPage

export const query = graphql`
  query {
    allMdx(limit: 2000, filter: { frontmatter: { draft: { ne: true } } }) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
