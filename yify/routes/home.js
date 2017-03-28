/**
 * Created by muneef on 22/03/17.
 */
var express = require('express');
var router = express.Router();
var path = require("path");


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('landing');
});

router.get('/download', function(req, res, next) {
    var file =  path.join(__dirname, '/../public/apk/yify-1.2.apk');
    console.log(file);
    res.download(file);
});

//app.use(express.static('public/apk.apk'))


module.exports = router;
