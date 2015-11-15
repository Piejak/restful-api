var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Bear = require('./app/models/bear');

//configure app to use body parser to get data from a POST request
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set the port

var router = express.Router(); //intance of the express router

//middleware for all requests
router.use(function(req, res, next){
  //do logging
  console.log('passing through middleware');
  next();//have to go to the next routes, otherwise we'll stop here
})

router.get('/', function(req, res){
  res.json({message: "hey! Welcome to the api"});
});

//route for requests ending in /bears
router.route('/bears')

  //create a bear (accessed by POST on localhost:8080/api/bears)
  .post(function(req,res){
    var bear = new Bear(); //new instance of the bear model
    bear.name = req.body.name; //set bears name from request

    //save bear and check for errors
    bear.save(function(err){
      if (err){
        res.send(err);
      }
      else{
        res.json({message: 'Bear created!'});
      }
    });
  })

  //get all the bears
  .get(function(req, res){
    Bear.find(function(err, bears){
      if(err){
        res.send(err);
      }
      else{
        res.json(bears);
      }
    });
  });

//route for looking for a specific bear
router.route('/bears/:bear_id')

  .get(function(req,res){
    Bear.findById(req.params.bear_id, function(err,bear){
      if(err){
        res.send(err);
      }
      else{
        res.json(bear);
      }
    });
  })

  .put(function(req,res){
    Bear.findById(req.params.bear_id, function(err, bear){
      if(err){
        res.send(err);
      }
      else{
        bear.name = req.body.name;
        bear.save(function(err){
          if(err){
            res.send(err);
          }
          else{
            res.json({message: "bear updated!"});
          }
        });
      }
    });
  })

  .delete(function(req, res){
    Bear.remove({
      _id: req.params.bear_id
    }, function(err, bear){
      if(err){
        res.send(err);
      }
      else{
        res.json({message: 'Successfully deleted'});
      }
    });
  });

app.use('/api', router);

mongoose.connect('mongodb://admin:password@ds042138.mongolab.com:42138/rest-test');

app.listen(port);
console.log('some wizardry is occuring on port ' + port);
