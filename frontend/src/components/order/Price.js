import React from 'react'
import PropTypes from 'prop-types'
import currency from 'currency.js'
import Payment from './Payment'

const Price = ({order, setLoading, setOrderNotification, paid, setPaid, storeInfo}) => {
  const costs = order.retail_costs && order.retail_costs.total ? order.retail_costs : order.costs

  return (
    <div className="card card-outline-secondary">
      <div className="card-body">
        <div className="row justify-content-between">
          <div className="col-4">
            <b>Price</b>
          </div>
          <div className="col-4 text-right">
            <b>$ USD</b>
          </div>
        </div>
        {
          order.items.map((item) =>
            <div key={item.name} className="row justify-content-between">
              <div className="col-6">
                {item.name} ({item.quantity})
              </div>
              <div className="col-4 text-right">
                <div>${item.retail_price || item.price}</div>
              </div>
            </div>,
          )
        }
        <div className="row justify-content-between">
          <div className="col-4">
            <b>Shipping</b>
          </div>
          <div className="col-4 text-right">
          ${costs.shipping}
          </div>
        </div>
        {
          costs.digitization ?
            <div className="row justify-content-between">
              <div className="col-4">
                <b>Digitization</b>
              </div>
              <div className="col-4 text-right">
              ${costs.digitization}
              </div>
            </div> :
            <div></div>
        }
        <div className="row justify-content-between">
          <div className="col-4">
            <b>Tax/VAT ({storeInfo.vat}%)</b>
          </div>
          <div className="col-4 text-right">
            {currency(costs.tax ? costs.tax : 0).add(currency(costs.vat ? costs.vat : 0).value).format(true)}
          </div>
        </div>
        <div className="row justify-content-between">
          <div className="col-4">
            <b>Discount</b>
          </div>
          <div className="col-4 text-right">
          -${costs.discount}
          </div>
        </div>
        <div className="row justify-content-between mb-4">
          <div className="col-4">
            <b>Total price</b>
          </div>
          <div className="col-4 text-right">
            <b>${costs.total}</b>
          </div>
        </div>
        {
          !paid ?
            <Payment
              costs={costs}
              order={order}
              setLoading={setLoading}
              setOrderNotification={setOrderNotification}
              setPaid={setPaid}
              clientID={storeInfo.paypalClientID}/> :
            <div></div>
        }
      </div>
    </div>
  )
}

Price.propTypes = {
  order: PropTypes.object,
  setLoading: PropTypes.func,
  setOrderNotification: PropTypes.func,
  paid: PropTypes.bool,
  setPaid: PropTypes.func,
  storeInfo: PropTypes.object,
}

export default Price
