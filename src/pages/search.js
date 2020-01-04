import React from "react"

import Layout, { Content } from "../components/Layout"
import SEO from "../components/SEO"
import PageTitle from "../components/PageTitle"
import Search from "../components/Search"

const SearchPage = () => (
  <Layout>
    <SEO title="Search" />
    <PageTitle>Search</PageTitle>
    <Content>
      <Search />
    </Content>
  </Layout>
)

export default SearchPage
