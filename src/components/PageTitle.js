import PropTypes from "prop-types"
import React from "react"

const PageTitle = ({ children }) => <h1 className="page-title">{children}</h1>

PageTitle.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PageTitle
