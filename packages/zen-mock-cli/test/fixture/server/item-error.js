module.exports = {
    req:{
        method:'post'
    },
    resp:{
        body:{
            code:/\d{10}/,
            msg:'ok',
            data:{
                'record|1-4':[{
                    id:10,
                    app:/\w{10}/,
                    name:/\w{5}/,

                }]
            }
        }
    }
}