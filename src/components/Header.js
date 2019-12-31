import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import { Location } from "@reach/router"

const Nav = () => (
  <Location>
    {({ location }) => (
      <nav className="nav">
        <Link
          to="/"
          className={
            location.pathname === "/" ||
            location.pathname.startsWith("/posts") ||
            location.pathname.startsWith("/categories") ||
            location.pathname.startsWith("/series") ||
            location.pathname.startsWith("/tags") // TODO more startsWiths?
              ? "active"
              : null
          }
        >
          Posts
        </Link>
        <Link to="/about" activeClassName="active">
          About
        </Link>
        <Link to="/contact" activeClassName="active">
          Contact
        </Link>
      </nav>
    )}
  </Location>
)

const SecondaryNav = () => (
  <div className="secondary-nav">
    <Link to="/categories/software">software</Link>
    <Link to="/categories/cycling">cycling</Link>
    <Link to="/categories/diy">diy</Link>
    <Link to="/categories/music">music</Link>
  </div>
)

const Header = ({ siteTitle }) => (
  <header className="header">
    <div>
      <h1 className="site-title">
        <Link to="/">{siteTitle}</Link>
      </h1>
    </div>
    <div className="right">
      <Nav />
      <SecondaryNav />
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
