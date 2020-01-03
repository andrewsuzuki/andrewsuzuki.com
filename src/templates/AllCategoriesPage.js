import React from "react"

import Layout, { Content } from "../components/Layout"
import SEO from "../components/SEO"
import PageTitle from "../components/PageTitle"
import { Link } from "gatsby"

const AllCategoriesPage = ({ pageContext }) => {
  const { categories } = pageContext

  const categoriesCount = Object.keys(categories).length

  return (
    <Layout>
      <SEO title="All Categories" />
      <PageTitle>All Categories</PageTitle>
      <Content>
        <p>
          {categoriesCount} {categoriesCount === 1 ? "category" : "categories"}
        </p>
        <ul className="bulleted">
          {Object.entries(categories).map(([slug, { name }]) => (
            <li key={slug}>
              <Link to={`/categories/${slug}`} title={`Category: ${name}`}>
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </Content>
    </Layout>
  )
}

export default AllCategoriesPage
