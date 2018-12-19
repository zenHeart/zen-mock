module.exports = {
    header:{
        'Set-Cookie':"name=tom",
        'Etags':/\d{32}/
    },
    body:{
        code:/\d{2}/,
        msg:'ok',
        data:{
            'record|3-5':[{
                id:/\w{32}/
            }]
        }
    }
}