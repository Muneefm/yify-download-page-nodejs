/**
 * Created by muneef on 22/03/17.
 */
var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('landing');
});


module.exports = router;
