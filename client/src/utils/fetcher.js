const base = 'http://localhost:3001'

const fetcher = (endpoint, options) => {
  return new Promise((resolve, reject) => {
    fetch(`${base}${endpoint}`, options)
      .then(res => {
        if (res.status === 200) {
          res.json().then(resolve)
        } else {
          reject(res.status)
        }
      })
      .catch(reject)
  })
}

export default fetcher
