import React, {useState} from 'react'
import PropTypes from 'prop-types'
import currency from 'currency.js'

const Product = ({product, addToCart}) => {
  const [image, setImage] = useState(0)
  const [variant, setVariant] = useState(product.sync_variants[0].id)

  const submitAddCart = (event) => {
    event.preventDefault()
    addToCart(
      product.sync_variants.find((vari) => vari.id === variant),
    )
  }

  const switchImage = (next) => setImage((next ? image + 1 : Math.abs(image - 1)) % images.length)

  const images = [product.sync_product.thumbnail_url]

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-sm-12 p-2">
        <figure className="figure">
          <img className="figure-img img-fluid" src={images[image]} alt={product.name} />
          {
            images.length > 1 ?
              <figcaption>
                <div className="btn-group" role="group" aria-label="Basic example">
                  <button onClick={() => switchImage(false)} className="btn btn-pinkish">Back</button>
                  <button onClick={() => switchImage(true)} className="btn btn-pinkish">Next</button>
                </div>
              </figcaption> :
              <div></div>
          }
        </figure>
      </div>
      <div className="col-md-6 col-sm-12 p-2">
        <figure className="figure">
          <figcaption>
            <h5>{product.sync_product.name}</h5>
            <h6>{variant ? currency(product.sync_variants.find((vari) => vari.id === variant).retail_price).format(true) : '...'}</h6>
            <p>{product.description}</p>
            <form className="justify-content-center" onSubmit={(e) => submitAddCart(e)}>
              <div className="form-row justify-content-center">
                <div className="form-group">
                  <label className="col-form-label">Size:</label>
                  <select
                    name="size"
                    value={variant}
                    onChange={(event) => setVariant(parseInt(event.target.value))}
                    className="form-select mb-3"
                    aria-label="Select product size"
                    required >
                    {
                      product.sync_variants.map((vari) =>
                        <option key={vari.id} value={vari.id}>{vari.name}</option>,
                      )
                    }
                  </select>
                </div>
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-pinkish">Add to cart</button>
              </div>
            </form>
          </figcaption>
        </figure>
      </div>
    </div>
  )
}

Product.propTypes = {
  product: PropTypes.object,
  addToCart: PropTypes.func,
}

export default Product
