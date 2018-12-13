module.exports = function(req,res) {
        setTimeout(() => {
            res.json({data1:1})
        },300)   
    }

