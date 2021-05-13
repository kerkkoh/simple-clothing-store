import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const Shipment = ({shipment, getShipmentItemName}) => (
  <div key={shipment.id}>
    <b>Shipping ID:</b> {shipment.id}<br />
    <b>Shipping carrier:</b> {shipment.carrier}<br />
    <b>Shipping service:</b> {shipment.service}<br />
    <b>Tracking ID:</b>&nbsp;
    <a rel="noopener noreferrer" target="_blank" href={shipment.tracking_url}>
      {shipment.tracking_number}
    </a><br />
    <b>Shipment created:</b> {moment.unix(shipment.created).format('YYYY-MM-DD')}<br />
    <b>Shipping date:</b> {moment(shipment.ship_date).format('YYYY-MM-DD')}<br />
    {shipment.reshipment ? <b>This is a reshipment<br /></b> : <div></div>}
    <b>Items contained:</b>
    <ul>
      {shipment.items.map((item) => <li key={item.item_id}>{getShipmentItemName(item.item_id)} ({item.quantity})</li>)}
    </ul>
  </div>
)

Shipment.propTypes = {
  shipment: PropTypes.object,
  getShipmentItemName: PropTypes.func,
}

export default Shipment
