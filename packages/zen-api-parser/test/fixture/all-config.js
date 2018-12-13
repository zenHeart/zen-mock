module.exports = {
    req: {
        path: '/index/:id',
        method: 'post',
        params: {
            id: /\d{32}/
        },
        query: {
            timestamp: /\d{10}/
        },
        header: {
            Etag: /\d{6}/
        },
        body: {
            name: /\w{6}/
        },
    },
    resp: {
        header: {
            "Etag": 'demo'
        },
        body: {
            code: /\d{6}/
        }

    }
}