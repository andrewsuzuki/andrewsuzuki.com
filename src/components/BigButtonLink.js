import React from "react"
import { Link } from "gatsby"
import classNames from "classnames"

export default function BigButtonLink({
  className,
  children,
  hasRightArrow = false,
  ...restProps
}) {
  return (
    <Link {...restProps} className={classNames(className, "big-button-link")}>
      {children}
      {hasRightArrow && <>&nbsp;→</>}
    </Link>
  )
}
