import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'
import currency from 'currency.js'
import Notification from '../utils/Notification'

const Cart = ({cart, removeFromCart, history, storeInfo, applyDiscount, clearCart}) => {
  const [discountNotification, setDiscountNotification] = useState([])
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(undefined)
  const [continuing, setContinuing] = useState(false)

  useEffect(() => {
    axios.get('/api/countries')
      .then((response) => setCountries(response.data))
      .catch(console.error)
  }, [])

  const submitInfo = (event) => {
    event.preventDefault()
    if (!selectedCountry) return

    // TODO: Make an order here after validation
    const form = event.target

    const firstName = form.firstName.value
    const lastName = form.lastName.value
    const email = form.email.value
    const phone = form.phone.value
    const address = form.address.value
    const secondAddress = form.secondAddress.value
    const country = form.country.value
    const city = form.city.value
    const zip = form.zip.value

    const body = {
      firstName,
      lastName,
      email,
      phone,
      address,
      secondAddress,
      country,
      city,
      zip,
      cart,
    }
    if (form.state) {
      body.state = form.state.value
    }

    setContinuing(true)
    axios.post('/api/orders', body)
      .then((response) => {
        const order = response.data
        clearCart()
        history.push(`/order/${order}`)
      }).catch((error) => {
        console.error(error)
      })
  }

  const clearDiscount = (event) => {
    event.preventDefault()
    applyDiscount(undefined, undefined)
  }

  const submitDiscount = (event) => {
    event.preventDefault()
    const code = event.target.discount.value
    axios.get(`/api/discount/${code}`)
      .then((response) => {
        const discount = response.data
        if (discount > 0) {
          applyDiscount(code, discount)
          setDiscountNotification(['Discount code applied!', 'alert-success'])
        } else {
          setDiscountNotification(['Sorry, this code isn\'t valid', 'alert-danger'])
        }
      }).catch((error) => {
        console.error(error)
        setDiscountNotification(['Sorry, there\'s a problem with the connection!', 'alert-danger'])
      })
  }

  /**
   * Calculate the subtotal and the total with discount included
   */
  const subtotal = cart.items.reduce((accum, current) => accum.add(current.retail_price), currency(0))
  const discountTotal = cart.discountAmount ? subtotal.multiply(100 - cart.discountAmount).divide(100) : currency(0)

  return (
    <div className="row">
      <section className="col-sm p-2">
        <div className="row">
          <div className="col">
            <div className="card card-outline-secondary mb-3">
              <div className="card-body container">
                <div className="row justify-content-between mb-2">
                  <div className="col-6"><b>Item</b></div>
                  <div className="col-6 text-right"><b>Price (USD)</b></div>
                </div>
                <div>
                  {
                    cart.items.length > 0 ?
                      <div>
                        {
                          cart.items.map((product, index) => {
                            return (
                              <div className="row justify-content-between" key={`${product.idSize}-${index}`}>
                                <div className="col-6 mb-1">
                                  <button className="btn btn-remove btn-danger" onClick={() => removeFromCart(index)}>&times;</button>&nbsp;
                                  {product.name}
                                </div>
                                <div className="mb-1 col-6 text-right">{currency(product.retail_price).format(true)}</div>
                              </div>
                            )
                          })
                        }
                        {
                          cart.discountCode ? (
                            <div className="row justify-content-between">
                              <div className="col-6">
                                <b>Discount{cart.discountCode ? ` (${cart.discountCode}, -${100 - cart.discountAmount}%)` : ''}</b>
                              </div>
                              <div className="col-6 text-right">-{discountTotal.format(true)}</div>
                            </div>
                          ) : <div></div>
                        }
                      </div> :
                      <div className="mb-2">Shopping cart empty</div>
                  }
                </div>
                <div className="row justify-content-between">
                  <div className="col-6"><b>Total</b></div>
                  <div className="col-6 text-right" id="cartSummaryTotal">{subtotal.subtract(discountTotal.value).format(true)}</div>
                </div>
                <div className="row justify-content-between">
                  <div className="col-12">{storeInfo.vat > 0 ? <span>The VAT and shipping costs will be applied based on your submitted information.</span> : <span>Shipping costs will be calculated after you submit your information.</span>}</div>
                </div>
              </div>
            </div>
            <div className="card card-outline-secondary mb-3">
              <div className="card-body">
                <Notification notification={discountNotification} setNotification={setDiscountNotification}/>
                <form onSubmit={(event) => submitDiscount(event)}>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="inputDiscount" className="col-form-label">Apply discount code</label>
                      <input type="text" className="form-control mb-2" name="discount" id="discount" placeholder="Discount code" defaultValue={cart.discountCode} required />
                      <button type="submit" className="btn btn-pinkish mb-2 me-2">Apply</button>
                      <button className="btn btn-pinkish mb-2" onClick={(event) => clearDiscount(event)}>Clear discount</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="col-sm p-2">
        <div className="row">
          <div className="col">
            <div className="card card-outline-secondary mb-3">
              <div className="card-body">
                <h3>Details</h3>
                <small className="text-muted">You can not change these after fulfillment, make sure they are correct!</small>
                <form onSubmit={(e) => submitInfo(e)}>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="inputFirstName" className="col-form-label">First Name</label>
                      <input name="firstName" type="text" className="form-control" id="inputFirstName" placeholder="First Name" required />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="inputLastName" className="col-form-label">Last Name</label>
                      <input name="lastName" type="text" className="form-control" id="inputLastName" placeholder="Last Name" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputEmail" className="col-form-label">Email</label>
                    <input name="email" type="email" className="form-control" id="inputEmail" placeholder="your@email.com" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputPhone" className="col-form-label">Phone Number (Including your country <a href="https://en.wikipedia.org/wiki/List_of_country_calling_codes">calling code</a>)</label>
                    <input name="phone" type="phone" className="form-control" id="inputPhone" placeholder="" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputAddress" className="col-form-label">Address</label>
                    <input name="address" type="text" className="form-control" id="inputAddress" placeholder="1234 Main St" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputAddress2" className="col-form-label">Address 2 (optional)</label>
                    <input name="secondAddress" type="text" className="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor" />
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="inputCountry" className="col-form-label">Country</label>
                      {
                        countries ?
                          <select name="country" value={selectedCountry} onChange={(event) => setSelectedCountry(event.target.value)} id="inputCountry" className="form-select" required>
                            {
                              countries.map((country) =>
                                <option key={country.code} value={country.code}>{country.name}</option>,
                              )
                            }
                          </select> :
                          <div></div>
                      }
                    </div>
                    {
                      selectedCountry && countries.find((country) => country.code === selectedCountry).states ?
                        <div className="form-group col-md-6">
                          <label htmlFor="inputState" className="col-form-label">State</label>
                          <select name="state" id="inputState" className="form-select" required>
                            {
                              countries
                                .find((country) => country.code === selectedCountry).states
                                .map((state) =>
                                  <option key={state.code} value={state.code}>{state.name}</option>,
                                )
                            }
                          </select>
                        </div> :
                        <div></div>
                    }
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-7">
                      <label htmlFor="inputCity" className="col-form-label">City</label>
                      <input name="city" type="text" className="form-control" id="inputCity" required />
                    </div>
                    <div className="form-group col-md-5">
                      <label htmlFor="inputZip" className="col-form-label">Zip</label>
                      <input name="zip" type="text" className="form-control" id="inputZip" required />
                    </div>
                  </div>
                  {
                    continuing ? <div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div> : <button type="submit" className="btn btn-pinkish mt-3">Continue to payment</button>
                  }
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

Cart.propTypes = {
  cart: PropTypes.object,
  removeFromCart: PropTypes.func,
  history: PropTypes.object,
  storeInfo: PropTypes.object,
  applyDiscount: PropTypes.func,
  clearCart: PropTypes.func,
}

export default withRouter(Cart)
