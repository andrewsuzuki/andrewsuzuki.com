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
          title="Posts"
          className={
            location.pathname === "/" ||
            location.pathname.startsWith("/posts") ||
            location.pathname.startsWith("/categories") ||
            location.pathname.startsWith("/tags")
              ? "active"
              : null
          }
        >
          Posts
        </Link>
        <Link to="/about" title="About" activeClassName="active">
          About
        </Link>
        <Link to="/contact" title="Contact" activeClassName="active">
          Contact
        </Link>
      </nav>
    )}
  </Location>
)

const SecondaryNav = () => (
  <div className="secondary-nav">
    <Link to="/search" title="Search" className="search-link">
      Search
    </Link>
    <Link to="/categories/software" title="Category: Software">
      Software
    </Link>
    <Link to="/categories/cycling" title="Category: Cycling">
      Cycling
    </Link>
    <Link to="/categories/diy" title="Category: DIY">
      DIY
    </Link>
    <Link to="/categories/music" title="Category: Music">
      Music
    </Link>
  </div>
)

const Header = ({ siteTitle }) => (
  <header className="header">
    <div>
      <h1 className="site-title">
        <Link to="/" title="Home / Posts">
          {siteTitle}
        </Link>
      </h1>
      {/* <Search /> */}
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
