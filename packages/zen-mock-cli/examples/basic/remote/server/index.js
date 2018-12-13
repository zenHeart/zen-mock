module.exports = function(req,res) {
    setTimeout(() => {
        res.json({a:2})
    },300)   
}