import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./Header"

import "../styles/layout.scss"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div className="container">
      <div className="main">
        <Header siteTitle={data.site.siteMetadata.title} />
        <main className="content">{children}</main>
        <footer className="footer">
          © {new Date().getFullYear()} Andrew Suzuki
        </footer>
      </div>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
