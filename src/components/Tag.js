import PropTypes from "prop-types"
import React from "react"
import { Link } from "gatsby"

const Tag = ({ children }) => (
  <Link to={`/tags/${children}`} className="tag" activeClassName="active">
    #{children}
  </Link>
)

Tag.propTypes = {
  children: PropTypes.string.isRequired,
}

export default Tag
