var express = require("express"),
    nano = require('nano')('http://localhost:5984'),
    app = express();

var db = null;
nano.db.destroy('test', function(){
  nano.db.create('test', function(err, body){
    if(err) {
      console.log('Error creating database');
      console.log(err);
      return;
    }
    db = nano.db.use('test');

    app.listen(3000, function () {
      console.log('Express listening on port 3000');
    });
  });
});


app.get("/", function (req, res) {
  res.send("Hey buddy!");
});

app.get("/:name", function (req, res) {
  db.get(req.params.name, function (err, body) {
    if (body === undefined) {
      db.insert({'name': req.params.name}, req.params.name, function(err, b) {
        if (err) {
          console.log('Error creating a new thing');
          console.log(err);
          res.send(500);
        } else {
          res.send({returnObj: b, created:true});
        }
      });
    } else {
      res.send({returnObj: body, created:false});
    }
  });
});

