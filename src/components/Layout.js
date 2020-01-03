import React, { createContext, useState } from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./Header"
import Modal from "./Modal"

import "../styles/layout.scss"

export const ModalContext = createContext()

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
    <ModalContext.Provider value={setModal}>
      <div className="container">
        <div className="site">
          <Header siteTitle={data.site.siteMetadata.title} />
          <main className="main">{children}</main>
          <footer className="footer">
            © {new Date().getFullYear()} Andrew Suzuki
          </footer>
        </div>
      </div>
      {modal && <Modal>{modal}</Modal>}
    </ModalContext.Provider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
