module.exports = function(req,res) {
        setTimeout(() => {
            res.json({data:1})
        },300)   
    }

