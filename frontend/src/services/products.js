import axios from 'axios'
const baseUrl = '/api/products'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data).catch(console.error)
}

export default {getAll}
