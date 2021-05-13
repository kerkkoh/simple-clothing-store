import {Link, withRouter} from 'react-router-dom'

import PropTypes from 'prop-types'
import React from 'react'

const Navigation = ({cart, orders, location, storeInfo}) => (
  <div className="row">
    <div className="col-sm text-center">
      <h1 className="display-4 mt-2"><Link className="link-dark store-title" to="/">{storeInfo.name.toUpperCase()}</Link></h1>
      <ul className="nav nav-tabs" id="nav">
        <li className="nav-item me-auto">
          <Link className={`nav-link${location.pathname === '/' || location.pathname.includes('/product') ? ' active' : ''}`} to="/">
            All items
          </Link>
        </li>
        <li className="nav-item">
          <Link className={`nav-link${location.pathname.includes('/cart') ? ' active' : ''}`} to="/cart">
            Shopping cart ({cart.items.length})
          </Link>
        </li>
        {
          orders.length > 0 ?
            <li>
              <button
                className={`btn btn-link nav-link dropdown-toggle${location.pathname.includes('/order') ? ' active' : ''}`}
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false">
                My orders
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                {orders.map((order) => <Link key={order} className="dropdown-item" to={`/order/${order}`}>#{order}</Link>)}
              </div>
            </li> :
            <div></div>
        }
      </ul>
    </div>
  </div>
)

Navigation.propTypes = {
  cart: PropTypes.object,
  orders: PropTypes.array,
  location: PropTypes.object,
  storeInfo: PropTypes.object,
}

export default withRouter(Navigation)
