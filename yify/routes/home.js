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
    var visitorCount = { _id:1,
        $inc: { visit: 1 } }



    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('visitor-home').insertOne(visitorItem, function(err, result) {
            assert.equal(null, err);
            if(err!=null){
                console.log("error inserting data "+err);
            }else{
                console.log("no error in db");
            }
            console.log('IP  inserted');
           // db.close();
        });

       /* db.collection('count').updateOne(
            { $inc: { visit: 1 } }, function(err,result){
                assert.equal(null, err);
                console.log("view increased");
                //db.close();

            });*/
        db.collection('visitor-count').findOneAndUpdate({_id:1},{$inc:{visit:1}},function (err,result) {
            assert.equal(null, err);
            console.log("visitor count increased");
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

    var file =  path.join(__dirname, '/../public/apk/yify-1.3.apk');
    console.log(file);
    res.download(file);
});


function updateCount(){

    var resultArray = [];
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection('counts').find();
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            resultArray.push(doc);
        }, function() {
            db.close();
            res.render('index', {items: resultArray});
        });
    });

}
//app.use(express.static('public/apk.apk'))


module.exports = router;
