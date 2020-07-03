import React, { createContext, useContext } from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"
import { Location } from "@reach/router"

export const ForcePostsActiveContext = createContext(false)

const Nav = () => {
  const forcePostsActive = useContext(ForcePostsActiveContext)

  return (
    <Location>
      {({ location }) => (
        <nav className="nav">
          <Link
            to="/"
            title="Posts"
            className={
              forcePostsActive ||
              location.pathname === "/" ||
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
}

const SecondaryNav = () => (
  <div className="secondary-nav">
    <Link to="/search" title="Search" className="search-link">
      Search
    </Link>
    <Link to="/tags/software" title="Tag: Software">
      Software
    </Link>
    <Link to="/tags/cycling" title="Tag: Cycling">
      Cycling
    </Link>
    <Link to="/tags/diy" title="Tag: DIY">
      DIY
    </Link>
    {/* <Link to="/tags/music" title="Tag: Music">
      Music
    </Link> */}
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
