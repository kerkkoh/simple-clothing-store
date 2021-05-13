/* eslint-disable max-len */
/**
* Temporary Database/Configuration file
*
* For the "items" array, you get the id from the page of the product, or via the printful API.
* If you don't set a description, the system will automatically tell you what sort of object
* you should enter here for the description to work.
*
* In the discounts object, you have key-value pairs where the key is the string discount,
* and the following integer is 100-yourDiscount --> A 20% discount should be 100-20 = 80
*
* The "vat" entry is simply the percentage amount that your customers need to pay in VAT/
* value added tax.
*/
// TODO: should be changed to lowdb/nedb/mongodb in the future
// TODO: Make the discount amount more logical
const db = {
  items: [
    {
      'id': 5632658632,
      'description': 'This description would appear at yoursite.com/product/5632658632 if there was a product with this id.',
    },
  ],
  discounts: {
    'TEST': 80,
  },
  vat: 24,
}

module.exports = db
