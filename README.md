# Simple Clothing Store

![banner](https://i.imgur.com/fg8F52a.png)

[![license](https://img.shields.io/github/license/kerkkoh/simple-clothing-store.svg)](LICENSE)

This project is a simple **clothing store** implemented with **React** and **Node.js**, aiming for an *almost* databaseless design by utilizing a **Printful** integration.

## Table of Contents

- [Demo](#demo)
- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Demo

The demo has a few limitations for quite obvious reasons.
1. You can't create new orders, some orders are included for you already to view
2. You can't pay for your orders
3. You can't buy anything, or receive products

### > Available on [Glitch](https://simple-clothing-store.glitch.me)

## Background


### Utilized technologies
* APIs
  * [Printful REST API](https://www.printful.com/docs)
  * [Paypal REST API](https://developer.paypal.com/docs/api/overview/)
* Backend
  * [Node.js](https://nodejs.org/en/)
  * [Express](https://www.npmjs.com/package/express)
  * [currency.js](https://www.npmjs.com/package/currency.js)
  * [@paypal/checkout-server-sdk](https://www.npmjs.com/package/@paypal/checkout-server-sdk)
  * PrintfulClient utility class (No longer available through Printful)
* Frontend
  * [React (with hooks, no classes)](https://reactjs.org/docs/hooks-intro.html)
  * [React router](https://www.npmjs.com/package/react-router)
  * [Bootstrap](https://getbootstrap.com/)
  * [SASS](https://sass-lang.com/)
  * [Moment](https://www.npmjs.com/package/moment)
  * [currency.js](https://www.npmjs.com/package/currency.js)
  * [react-paypal-button-v2](https://www.npmjs.com/package/react-paypal-button-v2)
  * [react-helmet](https://www.npmjs.com/package/react-helmet)

### What's working
* Most frontend features:
  * Routes implemented with **React router**, including seamlessly moving between pages
  * A responsive design implemented with **Bootstrap** and customized with **SASS** (SCSS)
  * Loading of products and store data from the server
  * Products with multiple images (If printful ever decides to give us a feature for that) and sizes (product variants)
  * Persistent shopping cart
  * Correct handling of currency as its own datatype via **currency.js**
  * Discount codes that are confirmed by the server, and correctly applying them to the cart total
  * Showing orders, their statuses & shipping information from **Printful**
* Some backend features:
  * Loading products directly from the Printful API
  * A configuration file for setting file descriptions, discounts and VAT rates your store needs (This will be changed to be something less hardcoded in the future)

### What's planned/missing
* Frontend:
  * Admin panel with minimal controls for
    1. Setting product descriptions
    2. Creating discounts
    3. Monitoring orders
    4. Setting the VAT rate
  * Handling error cases and displaying messages
  * Cancelling of orders
  * Quantity for products in a basket
* Backend:
  * Hiding information better (product information like printfiles & costs shouldn't be sent to the client)
  * Calculating shipping & VAT before confirming the order
  * Refactoring
  * Better handling of errors
  * Handling of missing products, faulty carts, etc.
  * Emails

### Why?

This project is a hobby project that I started sketching out back in 2017 and decided to go through with in 2019 after giving it some thought. For me, this was a learning opportunity to familiarize myself with new APIs and solving problems that one might face in an implementation of an ecommerce system with modern web technologies.

Another reason was the lack of **open source** webstores implemented with a JS stack, similar to this project's stack. There are a few out there, but none of them are geared towards a clothing store that operates with Printful. One of this project's goals was also to be as **simple** as possible. This means keeping the stack very light with a focus on JS and popular libraries. This also means that payments are outsourced, production is outsourced, and orders are mostly outsourced. This should keep the maintenance of the system at minimum, while allowing the clothing store to operate smoothly.

### Why should I use it?

In most cases, you shouldn't. Not yet. It is at an early stage of development with most of the features being at most stubs of the eventual or necessary features.

These are some problem areas as of now:
  * Lack of a solid user, order or payment database
  * Lack of good information hiding from the users of the API
  * Security: while I've kept security in mind while developing the system, it hasn't been penetration tested by professionals, and this poses a constant risk if used in productions
  * No input validitation/verification of any kind
  * No handling situations where the local cart is out of sync with the products in the store

## Install

First, clone the repository from github.


Now you're going to need to setup some configuration files and environmental variables:
1. Get your PayPal & Printful API keys
2. Navigate to `simple-clothing-store/backend/`, and rename the file called `.env.template` to just `.env`
3. Set the variables in the `.env` file without inserting any spaces anywhere in the file. The variable names and comments should explain where to put what adequately. Save the file.
4. Navigate to `simple-clothing-store/frontend/src/` and open the file `config.js`
5. In this file you should specify some information that is displayed on the site. You should also include the same PayPal API client id in this file as a string.
6. Navigate to `simple-clothing-store/backend/lib/` and open the file `datab.js`
7. In this file you can specify
    1. Product descriptions in the `items` array by specifying a product id (You can get the id by visiting the store frontend and going to the page of a product, and then viewing the url like `yoursite.com/product/5632658632` where `5632658632` would be the id) and then specifying a `description` string for it.
    2. Discount codes in the section `discounts`
    3. Your VAT (Value Added Tax) percent **as an integer**.

Now you need to build the frontend and move the built folder into the backend and install everything.
```
cd simple-clothing-store/frontend
npm install && npm build
```
Depending on the operating system, the command for moving the build folder varies, on Linux:
```
mv build ../backend
```
and on Windows: 
```
mv build ../backend
```
And then to install the backend:
```
cd ../backend
npm install
```


## Usage

To run the server, make sure you're in the `simple-clothing-store/backend` folder, and run:
```
npm start
```
This will start the server, and host the production build frontend with the port `process.env.PORT` or 3001. You can set the PORT variable in the file `simple-clothing-store/backend/.env` by creating a new line with the port you want the system to run on. If you're using services like Heroku to host the system, they should set this variable for you.

## Contributing

PRs accepted.

## License

[MIT License](https://github.com/kerkkoh/simple-clothing-store/LICENSE.md)