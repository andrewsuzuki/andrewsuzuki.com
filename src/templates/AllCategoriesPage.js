import React from "react"

import Layout from "../components/Layout"
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
      <p>
        {categoriesCount} {categoriesCount === 1 ? "category" : "categories"}
      </p>
      <ul className="bulleted">
        {Object.entries(categories).map(([slug, { name }]) => (
          <li key={slug}>
            <Link to={`/categories/${slug}`}>{name}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export default AllCategoriesPage
