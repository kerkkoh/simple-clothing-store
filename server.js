require('dotenv').config()

const express = require('express')
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk')
const currency = require('currency.js')

const PrintfulClient = require('./lib/printfulclient.js')
const payPalClient = require('./lib/paypal.js')
const db = require('./lib/datab.js')

const pf = new PrintfulClient(process.env.PRINTFUL_SECRET)
const app = express()

let products = []
let storeInfo = {}

// FOR DEMO ONLY \/
const confirmed = []
// FOR DEMO ONLY /\

// Initialize products
const initProducts = () => {
  pf.get('store/products')
    .success((data, _info) => {
      products = data
      data.forEach((product) => {
        pf.get(`store/products/${product.id}`)
          .success((data, _info) => {
            products = products.map((prod) => {
              const dbEntry = db.items.find((dbProd) => dbProd.id === data.sync_product.id)
              return prod.id === product.id ?
                {
                  ...data,
                  description:
                    dbEntry ?
                      // eslint-disable-next-line max-len
                      dbEntry.description : `Open up backend/lib/datab.js, and in the array called "items" add in {id:${product.id}, description:'your description here'} to replace this!`,
                } : prod
            })
          })
      })
    })
    .error((_err, info) => console.error(info))
}

// Initialize store info
const initStoreInfo = () => {
  pf.get('store')
    .success((data, _info) => {
      // eslint-disable-next-line camelcase
      const {name, currency, packing_slip} = data
      storeInfo = {
        name,
        currency,
        email: packing_slip.email,
        vat: db.vat || 0,
      }
    })
    .error((_err, info)=>{
      console.error(info)
    })
}
initProducts()
initStoreInfo()

const variantById = (id) => {
  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    for (let j = 0; j < product.sync_variants.length; j++) {
      const variant = product.sync_variants[j]
      if (id == variant.id) {
        return variant
      }
    }
  }
}

app.use(express.static('build'))
app.use(express.json())

app.post('/api/confirm/:orderId', async (req, res) => {
  const orderID = req.params.orderId

  // Call PayPal to get the transaction details
  let order
  try {
    const request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID)
    order = await payPalClient.client().execute(request)
  } catch (err) {
    console.error(err)
    return res.sendStatus(500)
  }

  const printfulID = order.result.purchase_units[0].custom_id
  pf.get(`orders/${printfulID}`)
    .success((data, _info) => {
      if (data.status === 'draft' &&
          data.retail_costs.total === order.result.purchase_units[0].amount.value) {
        // TODO: More robust error handling, in a middleware
        if (process.env.DEMO) {
          // For demo
          confirmed.push(printfulID)
          res.sendStatus(200)
        } else {
          // This should run only in production \._./
          pf.post(`orders/${orderID}/confirm`).success(() => res.sendStatus(200)).error(() => res.sendStatus(400))
        }
      } else {
        res.sendStatus(400)
      }
    }).error((_err, info) => console.error(info))
})

app.get('/api/products', (_req, res) => res.json(products))

/**
 * Fetches necessary country/state information from Printful
 */
app.get('/api/countries', (req, res) => {
  pf.get('countries').success((data, info) => {
    res.json(data)
  }).error((err, info) => {
    console.error(info)
    res.sendStatus(400)
  })
})

/**
 * Fetches order details from Printful's API
*/
app.get('/api/orders/:orderId', (req, res) => {
  pf.get(`orders/${req.params.orderId}`).success((data, info) => {
    // For the demo of the store, we don't want to actually confirm any orders...
    if (process.env.DEMO && confirmed.includes(req.params.orderId)) {
      res.json({...data, status: 'pending'})
    } else {
      res.json(data)
    }
  }).error((_err, info) => {
    console.error(info)
    res.sendStatus(404)
  })
})

/**
 * Creates order with Printful's API
*/
app.post('/api/orders', (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    secondAddress,
    country,
    city,
    state,
    zip,
    cart,
  } = req.body
  const recipient = {
    name: `${firstName} ${lastName}`,
    email: email,
    phone: phone,
    address1: address,
    city: city,
    state_code: state,
    country_code: country,
    zip: zip,
  }
  if (secondAddress && secondAddress.length > 0) {
    recipient.address2 = secondAddress
  }

  const items = cart.items.map((item) => variantById(item.id))
  const parsedItems = items.map((item) => {
    return {
      sync_variant_id: item.id,
      quantity: 1,
      retail_price: item.retail_price,
    }
  })
  const subtotal = items.reduce((accum, current) => accum.add(current.retail_price), currency(0))

  const discount = db.discounts[cart.discountCode]
  // First we must estimate the shipping costs to account for them with VAT
  pf.post('orders/estimate-costs',
    {
      recipient,
      items: parsedItems,
    },
  ).success((data, info) => {
    const discountAmount = discount ? subtotal.multiply(100-discount).divide(100) : currency(0)
    const retailCosts = {
      discount: discountAmount,
      vat: subtotal
        .add(currency(data.costs.shipping).value)
        .subtract(discountAmount.value)
        .multiply(db.vat)
        .divide(100),
    }
    pf.post('orders',
      {
        recipient,
        items: parsedItems,
        retail_costs: {
          discount: retailCosts.discount.format(),
          tax: retailCosts.vat.format(),
          // Printful API doesn't seem to take in the VAT as of right now
          // I've emailed them about this, for now, we'll use tax field for VAT
          // vat: retailCosts.vat.format(),
        },
      },
    ).success((data, info) => {
      res.send(`${data.id}`)
    }).error((error, info) => {
      console.error(info)
      res.sendStatus(400)
    })
  }).error((error, info) => {
    console.error(info)
    res.sendStatus(400)
  })
})

/**
 * Fetches store details
*/
app.get('/api/store', (req, res) => {
  res.json(storeInfo)
})

/**
 * Checks a discount code and returns the proper discount for it
*/
app.get('/api/discount/:code', (req, res) => {
  // TODO: Concrete implementation
  const discount = db.discounts[req.params.code]
  discount ? res.send(`${discount}`) : res.send('0')
})

const listener = app.listen(process.env.PORT || 3001, () => {
  console.log('The clothing store is listening on port ' + listener.address().port)
})
