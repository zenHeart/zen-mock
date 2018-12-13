module.exports = {
    header: {
        'Set-Cookie': 'name=zenheart',
        'token': /\d{10}/
    },
    body: {
        code: /\d{6}/,
        msg: 'ok'
    }
}