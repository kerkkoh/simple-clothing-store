import React, {useState, useEffect} from 'react'
import ConfettiGenerator from 'confetti-js'
import PropTypes from 'prop-types'
import moment from 'moment'
import axios from 'axios'
import Loader from '../utils/Loader'
import Price from './Price'
import Shipment from './Shipment'

const Order = ({orderId, setOrderNotification, addOrder, orders, storeInfo}) => {
  const [order, setOrder] = useState({})
  const [paid, setPaid] = useState(undefined)
  const [loading, setLoading] = useState(false)

  // Confetti for everyone who paid because they should feel good about their purchase o(*°▽°*)o
  useEffect(() => {
    if (paid) {
      const confettiSettings = {
        'target': 'confetti-holder',
        'max': '150',
        'size': '1',
        'animate': true,
        'props': ['circle', 'square', 'triangle', 'line'],
        'colors': [[40, 167, 69], [159, 9, 109]],
        'clock': '5',
        'rotate': true,
      }
      const confetti = new ConfettiGenerator(confettiSettings)
      confetti.render()
      return () => confetti.clear()
    }
  }, [paid])

  const shipmentDetails = {
    'draft': 'Your order hasn\'t been submitted for fulfillment yet.',
    'failed': 'There has been an error with fulfillment of your order. Please contact us immediately to get this resolved.',
    'pending': 'We are currently working on fulfilling your order.',
    'canceled': 'Your order has been cancelled. If this wasn\'t on purpose please contact us immediately.',
    'onhold': 'There has been an error with fulfillment of your order. Please contact us immediately to get this resolved.',
    'inprocess': 'Your order is currently being fulfilled and is no longer cancellable.',
    'partial': 'Some of your items have been shipped. The rest will be shipped later on. Contact us if you have any questions about this.',
    'fulfilled': 'All your products have been shipped.',
    'other': 'There is an error with your order. Please contact us immediately to get this resolved.',
  }

  const getShipmentItemName = (id) => order.items.find((item) => item.id === id).name

  useEffect(() => {
    axios.get(`/api/orders/${orderId}`).then((res) => {
      setOrder(res.data)
      if (!orders.includes(parseInt(orderId))) {
        addOrder(parseInt(orderId))
      }
      setPaid(res.data.status !== 'draft')
    }).catch(console.error)
  }, [orderId, addOrder, orders, loading, paid])

  const showIfNonEmpty = (content) => content ? <div>{content}<br /></div> : <div></div>

  if (!order.id) {
    return <Loader />
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 mt-2">
          <h2>
            Order {order.id}&nbsp;
            {
              paid ?
                <span className="badge bg-success">Paid <i className="material-icons">done</i></span> :
                <span className="badge bg-secondary">
                  {
                    loading ?
                      <div className="spinner-border" role="status"></div> :
                      <div>Not paid</div>
                  }
                </span>
            }
          </h2>
        </div>
      </div>
      <div className="row">
        <section className="col-md col-sm-12 p-2">
          <div className="card card-outline-secondary mb-3">
            <div className="card-body">
              <h3>Details</h3>
              Status: <span id="status">{order.status}</span><br />
              Created: {moment.unix(order.created).format('YYYY-MM-DD')}<br />
              Shipping method: <span id="shipping">{order.shipping_service_name}</span>
            </div>
          </div>
          <div className="card card-outline-secondary mb-3">
            <div className="card-body">
              <h3>Shipping address</h3>
              <address>
                {showIfNonEmpty(order.recipient.name)}
                {showIfNonEmpty(order.recipient.company)}
                {showIfNonEmpty(order.recipient.address1)}
                {showIfNonEmpty(order.recipient.address2)}
                {showIfNonEmpty(order.recipient.city)}
                {showIfNonEmpty(order.recipient.zip)}
                {showIfNonEmpty(order.recipient.state_name)}
                {showIfNonEmpty(order.recipient.country_name)}
                {showIfNonEmpty(order.recipient.phone)}
                {showIfNonEmpty(order.recipient.email)}
              </address>
            </div>
          </div>
          <div className="card card-outline-secondary mb-3">
            <div className="card-body">
              <h3>Shipping details</h3>
              {
                order.shipments.length !== 0 ?
                  order.shipments.map((shipment) =>
                    <Shipment key={shipment.id} shipment={shipment} getShipmentItemName={getShipmentItemName} />,
                  ) :
                  <div></div>
              }
              <p id="shipmentstatus">
                {shipmentDetails[order.status] ? shipmentDetails[order.status] : shipmentDetails.other}
              </p>
            </div>
          </div>
        </section>
        <section className="col-md col-sm-12 p-2">
          <Price
            order={order}
            setLoading={setLoading}
            setOrderNotification={setOrderNotification}
            paid={paid}
            setPaid={setPaid}
            storeInfo={storeInfo} />
        </section>
      </div>
      {paid ? <canvas id="confetti-holder" /> : <div></div>}
    </div>
  )
}

Order.propTypes = {
  orderId: PropTypes.number,
  setOrderNotification: PropTypes.func,
  addOrder: PropTypes.func,
  orders: PropTypes.array,
  storeInfo: PropTypes.object,
}

export default Order
