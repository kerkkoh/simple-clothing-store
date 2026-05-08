import axios from 'axios'
const baseUrl = '/api/products'

/**
 * Fetches products; retries briefly while the list is empty so the UI is not
 * stuck ahead of the server's async Printful initialization (race on cold load).
 */
const getAll = async () => {
  const maxAttempts = 35
  const delayMs = 200
  let lastErr
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const {data} = await axios.get(baseUrl)
      if (Array.isArray(data) && (data.length > 0 || attempt === maxAttempts - 1)) {
        return data
      }
    } catch (err) {
      lastErr = err
      console.error(err)
      if (attempt === maxAttempts - 1) {
        return []
      }
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }
  if (lastErr) {
    console.error(lastErr)
  }
  return []
}

export default {getAll}
