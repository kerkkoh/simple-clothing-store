import currency from 'currency.js'

const getCart = () => {
  const cartJSON = window.localStorage.getItem('cart')
  if (cartJSON) {
    const newCart = JSON.parse(cartJSON)
    return {
      ...newCart,
      items: newCart.items.map((product) => {
        return {...product, price: currency(product.price)}
      }),
    }
  } else return {items: []}
}

const addToCart = (item, cart) => {
  const newCart = {...cart, items: [...cart.items, item]}
  window.localStorage.setItem('cart', JSON.stringify(newCart))
  return newCart
}

const removeFromCart = (index, cart) => {
  const newCart = {...cart, items: cart.items.filter((itm, i) => index !== i)}
  window.localStorage.setItem('cart', JSON.stringify(newCart))
  return newCart
}

const applyDiscount = (code, amount, cart) => {
  const newCart = !code ? {...cart, discountAmount: undefined, discountCode: undefined} :
    {...cart, discountAmount: amount, discountCode: code}
  window.localStorage.setItem('cart', JSON.stringify(newCart))
  return newCart
}

const clearCart = () => {
  const newCart = {items: []}
  window.localStorage.setItem('cart', JSON.stringify(newCart))
  return newCart
}

const getOrders = () => {
  const ordersJSON = window.localStorage.getItem('orders')
  if (ordersJSON) {
    return JSON.parse(ordersJSON)
  } else {
    return []
  }
}

const addOrder = (id, orders) => {
  const newOrders = [...orders, id]
  window.localStorage.setItem('orders', JSON.stringify(newOrders))
  return newOrders
}

export default {
  getCart,
  addToCart,
  removeFromCart,
  getOrders,
  addOrder,
  applyDiscount,
  clearCart,
}
