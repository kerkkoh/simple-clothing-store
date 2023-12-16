# Simple Clothing Store

## IMPORTANT

**This project is currently broken** due to a Printful API update (see [the new API docs](https://developers.printful.com/docs/)) that is incompatible with the Printful API SDK used by this project. Printful is planning on releasing an even newer version of their API (see [v2 docs](https://developers.printful.com/docs/v2-beta/)) and thus updating the project to adhere to the old API will not be ideal. Instead, I will be updating the project in a major way to achieve v2.0.0, which will introduce major breaking changes. This is necessary, as this project is already 4 years old, and is not up to date with modern industry standards. I will be creating a separate `next` branch as soon as the version is partially working. You can expect the release in late December 2023 or sometime in Q1 2024.

The software development industry has changed a lot in 4 years. Specifically, serverless has become the new way of running both backend, frontend, and database services. Serverless means roughly what you think it does -- there is no constantly running server, but rather sleeping servers that wake up to perform operations, such as running an API route, serving a page, or performing a database function. This changes much of what traditional services could rely on, as there is no longer a server running constantly, and anything you save in memory (such as variables) is destroyed after the server has performed its operation. In accordance to this project's intention from day 1, it is a fresh and modern starting point for beginners, which shows them the industry standard way of creating semi-complex web services. 4 years ago that modern starting point was React with Create React App + Node.js, but this is clearly not the case when moving to 2024.

Namely, the following changes will be made to bring the project up to modern web development standards:
1. Migrate to using [Next.js](https://nextjs.org/) -- Allows for [SSR (server-side rendering)](https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering) and having an API backend + frontend in the same project
2. Migrate to using [TypeScript](https://www.typescriptlang.org/) -- Allows for much easier development without having to guess types of variables and is an industry-standard
3. Update any Printful API calls to either the current API version or Printful API v2
4. Ensure that the Paypal integration is up to date and functional
5. Introduce a light database element *if necessary*, as serverless/edge functions as API routes can not retain state (global variables) due to not running on a server 24/7. Likely this will be a lightweight persistent database, which is freely available for everyone such as [Vercel KV](https://vercel.com/docs/storage/vercel-kv) or [Vercel PostgreSQL](https://vercel.com/docs/storage/vercel-postgres)

Ultimately the goal is that beginners can run this project locally with the help of Docker, and **deploy it into the cloud for free** using Vercel. Vercel is of course just one option for a provider, but due to using Docker, the project will be able to be uploaded to any cloud provider (most of them support containers).

---

![banner](https://i.imgur.com/fg8F52a.png)

[![GitHub license](https://img.shields.io/github/license/kerkkoh/simple-clothing-store)](https://github.com/kerkkoh/simple-clothing-store/blob/master/LICENSE.md)

## Description

This project is a simple **clothing store** implemented with **React** and **Node.js**, aiming for an *almost* databaseless design by utilizing a **Printful** integration.

## Table of Contents

- [Demo](#demo)
- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Demo

The demo has a few obvious limitations:
1. You can't create new orders, some orders are included for you already to view
2. You can't pay for your orders
3. You can't buy anything, or receive products

### > Available on [Glitch](https://simple-clothing-store.glitch.me)

## Background


### Stack
* APIs
  * [Printful REST API](https://www.printful.com/docs)
  * [Paypal REST API](https://developer.paypal.com/docs/api/overview/)
* Backend
  * [Node.js](https://nodejs.org/en/)
  * [Express](https://www.npmjs.com/package/express)
* Frontend
  * [React (with hooks, no classes)](https://reactjs.org/docs/hooks-intro.html)
  * [React router](https://www.npmjs.com/package/react-router)
  * [Bootstrap](https://getbootstrap.com/)
  * [SASS](https://sass-lang.com/)

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
  * Simple theming support
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

### Configuration
1. Get your PayPal & Printful API keys
2. Rename the file called `.env.template` to `.env`
3. Set the variables in the `.env` file without inserting any spaces anywhere in the file. The variable names and comments should explain where to put what adequately. Save the file.
4. Navigate to the `frontend/src` folder and open the file `config.js`
5. In this file you should specify some information that is displayed on the site. You should also include the same PayPal API client id, as in the .env file previously, as it is needed for the payment process.
6. Navigate to the `lib` folder, and open the file `datab.js`
7. In this file you can specify
    1. Product descriptions in the `items` array by specifying a product id (You can get the id by visiting the store frontend and going to the page of a product, and then viewing the url like `yoursite.com/product/5632658632` where `5632658632` would be the id) and then specifying a `description` string for it.
    2. Discount codes in the section `discounts`
    3. Your VAT (Value Added Tax) percent **as an integer**.

### Installation

As of version 0.0.2, you can use docker to perform all of the gruntwork of running the server for you. Simply run `docker-compose up`, and docker will spin up a new container with Simple Clothing Store running on it.

If you do not wish to use Docker, you can build the frontend and run the backend manually. However, there are npm scripts for automating this. First run `npm install` in the root folder and then in the frontend folder.

If you are running a Linux system, run `npm run build-tux`, which will build the frontend, move it into the appropriate folder (./build) and start the server.

If you are running a Windows system, run `npm run build-win`, which will build the frontend, move it into the appropriate folder (./build) and start the server.

Both of these scripts have a "-clean" variant (`npm run build-tux-clean` & `npm run build-win-clean`), which is something you want to use after the first build, in order to also delete the build folder before building it again.

## Usage

To run the server, make sure you're in the root folder, and run:
```
npm start
```
or alternatively with Docker Compose
```
docker-compose up
```

This will start the server, and host the production build frontend with the port `process.env.PORT` or 3001. You can set the PORT variable in the file `simple-clothing-store/backend/.env` by creating a new line with the port you want the system to run on. If you're using services like Heroku to host the system, they should set this variable for you.

## Contributing

PRs accepted and appreciated.

## License

[MIT License](https://github.com/kerkkoh/simple-clothing-store/LICENSE.md)
