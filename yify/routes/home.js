/**
 * Created by muneef on 22/03/17.
 */
var express = require('express');
var router = express.Router();
var path = require("path");
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');
var geoip = require('geoip-lite');

var url = 'mongodb://localhost:27017/yify';


/* GET home page. */
router.get('/', function(req, res, next) {

    var ip = req.headers['x-forwarded-for']
    var ipDetails = geoip.lookup(ip);
    console.log(ip);
    console.log(ipDetails);

    var visitorItem = {
        user_ip: ip,
        time: Date.now(),
        ip_geo: ipDetails
    };
console.log(visitorItem);

    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('visitor-home').insertOne(visitorItem, function(err, result) {
            assert.equal(null, err);
            console.log('IP  inserted');
            db.close();
        });
    });
    res.render('landing');

});

router.get('/download', function(req, res, next) {

    var visitorItem = {
        user_ip: req.headers['x-forwarded-for'],
        time: Date.now()
    };
    console.log(visitorItem);

    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('visitor-download').insertOne(visitorItem, function(err, result) {
            assert.equal(null, err);
            console.log('IP  inserted');
            db.close();
        });
    });

    var file =  path.join(__dirname, '/../public/apk/yify-1.2.apk');
    console.log(file);
    res.download(file);
});

//app.use(express.static('public/apk.apk'))


module.exports = router;
