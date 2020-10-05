module.exports = {
  req: {
    method: 'post'
  },
  resp: {
    header: {
      'Set-Cookie': 'name=zenheart',
    },
    body: {
      data: {
        a: 1,
        b: 2
      }
    }
  }
}