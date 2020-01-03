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
    <Link to="/categories/software" title="Category: Software">
      software
    </Link>
    <Link to="/categories/cycling" title="Category: Cycling">
      cycling
    </Link>
    <Link to="/categories/diy" title="Category: DIY">
      diy
    </Link>
    <Link to="/categories/music" title="Category: Music">
      music
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
