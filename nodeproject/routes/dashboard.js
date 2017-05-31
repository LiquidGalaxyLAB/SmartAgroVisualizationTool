var express = require('express');
var router = express.Router();
var request = require('request');

/* GET dashboard page. */
router.get('/', function(req, res) {
    request({
        method: 'GET',
        uri: 'http://130.206.121.247:5000/flasklistener',
        headers: {}
    }, function (error, response, body){
        if(!error && response.statusCode == 200){
            //poll();
            getting();
            res.render('dashboard', { temperature: body});
            console.log("function success");
        }
    })
});

/*
function getting() {
    request({
        method: 'GET',
        uri: 'http://130.206.121.247:5000/flasklistener',
        headers: {}
    }, function (error, response, body){
        if(!error && response.statusCode == 200){
            console.log("getting...");
            setTimeout(function() {getting()}, 5000);
        }
    })
}
*/
module.exports = router;