/**
 * This class helps to use the Printful API
 * version 1.1
 * copyright 2014 Idea Bits LLC
 */


const PrintfulClient = function(key) {
  // API key
  var key = key

  const https = require('https')
  const querystring = require('querystring')
  const USER_AGENT = 'Printful API Node.js Library 1.1'

  /*
     * Perform a GET request to the API
     * path - Request path (e.g. 'orders' or 'orders/123')
     * params - Additional GET parameters as a hash
     */
  this.get = function(path, params) {
    return new Request('GET', path, null, params)
  }

  /*
     * Perform a DELETE request to the API
     * path - Request path (e.g. 'orders' or 'orders/123')
     * params - Additional GET parameters as a hash
     */
  this.delete = function(path, params) {
    return new Request('DELETE', path, null, params)
  }

  /*
     * Perform a POST request to the API
     * path - Request path (e.g. 'orders' or 'orders/123')
     * data - Request body data as a hash
     * params - Additional GET parameters as a hash
     */
  this.post = function(path, data, params) {
    return new Request('POST', path, data, params)
  }

  /*
     * Perform a PUT request to the API
     * path - Request path (e.g. 'orders' or 'orders/123')
     * data - Request body data as a hash
     * params - Additional GET parameters as a hash
     */
  this.put = function(path, data, params) {
    return new Request('PUT', path, data, params)
  }

  /*
     * Generic request wrapper returned by all API request functions
     * .success(callback) - set the success callback
     * .error(callback) - set the error callback
     */
  const Request = function(method, path, data, params) {
    let _success; let _error

    // Additinal info about the request
    const info = {
      code: null, // Response status code
      result: null, // Response result element data
      response: null, // Full Response data
      response_raw: null, // Raw response
      total_items: null, // Total information from paging (if any)
      method: method,
      path: path,
      data: data,
      params: params,
    }

    // Set up success callback
    this.success = function(callback) {
      _success = callback
      return this
    }

    // Set up error callback
    this.error = function(callback) {
      _error = callback
      return this
    }

    if (params) {
      path = path + '?' + querystring.stringify(params)
    }

    const options = {
      host: 'api.printful.com',
      port: 443,
      path: '/'+ path,
      method: method,
      auth: key,
      headers: {
        'User-Agent': USER_AGENT,
        'Content-Type': 'application/json',
      },
    }
    const req = https.request(options, function(res) {
      let body = ''

      res.on('data', function(chunk) {
        body += chunk
      })
      res.on('end', function() {
        info.response_raw = body
        try {
          var json = JSON.parse(body)
        } catch (e) {
          if (_error) {
            _error('Invalid JSON in the response', info)
          }
          return
        }
        info.response = json

        if (typeof json.code == 'undefined' ||
            typeof json.result == 'undefined') {
          if (_error) {
            _error('Invalid API response', info)
          }
          return
        } else {
          info.code = json.code
          info.result = json.result
          if (json.code <200 || json.code >=300) {
            if (_error) {
              _error(info.result, info)
            }
          } else if (_success) {
            if (json.paging) {
              info.total_items = json.paging.total
            }
            _success(info.result, info)
          }
        }
      })
    }).on('error', function(e) {
      if (_error) {
        _error('HTTP request failed - '+ e.message, info)
      }
    })
    if (data) {
      req.write(JSON.stringify(data))
    }
    req.end()
    return this
  }
}

module.exports = PrintfulClient
