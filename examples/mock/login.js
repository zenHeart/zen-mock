const Mock = require('mockjs');

module.exports = {
  req: {
    method:'post',
    path: '/login',
    query:{
      a:1,
      b:2
    },
    body:{
      a:1,
      b:2
    }
  },
  resp:function(req,res){
    res.json(req.body);

  }
};
