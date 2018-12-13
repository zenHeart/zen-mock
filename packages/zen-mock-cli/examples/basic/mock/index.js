module.exports = function(req,res) {
    setTimeout(() => {
        res.json({a:1})
    },300)   
}