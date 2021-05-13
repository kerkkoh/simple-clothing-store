import React from 'react'

/**
 * Wrapper for Bootstrap loader that can be included
 * instead of a page if the content isn't ready.
 */
const Loader = () => (
  <div className="d-flex justify-content-center">
    <div className="spinner-border m-5" role="status">
      <span className="sr-only"></span>
    </div>
  </div>
)

export default Loader
