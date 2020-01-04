import React, { createContext, useState } from "react"
import PropTypes from "prop-types"
import { Link, useStaticQuery, graphql } from "gatsby"

import Header from "./Header"
import Modal from "./Modal"

import "../styles/layout.scss"
import SearchIndexProvider from "./SearchIndexProvider"

export const ModalContext = createContext()

export const Content = ({ children }) => (
  <section className="content">{children}</section>
)

const Layout = ({ children }) => {
  const [modal, setModal] = useState(null)

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
    <SearchIndexProvider>
      <ModalContext.Provider value={setModal}>
        <div className="container">
          <div className="site">
            <Header siteTitle={data.site.siteMetadata.title} />
            <main className="main">{children}</main>
            <footer className="footer">
              <div>
                © {new Date().getFullYear()} {data.site.siteMetadata.title}
              </div>
              <div className="links">
                <a href="/rss.xml" title="RSS">
                  RSS
                </a>
                <a
                  href="https://github.com/andrewsuzuki"
                  title="@andrewsuzuki on GitHub"
                >
                  Github
                </a>
                <Link to="/contact" title="Contact">
                  Contact
                </Link>
              </div>
            </footer>
          </div>
        </div>
        {modal && <Modal>{modal}</Modal>}
      </ModalContext.Provider>
    </SearchIndexProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
