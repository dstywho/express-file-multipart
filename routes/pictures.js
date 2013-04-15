var ejs = require('ejs');
var format = require('util').format;
var fs = require('fs');
var path = require('path');
exports.newAction=  function(req, res){
  res.render('layouts/application', 
      { title: 'Express'
        , body: fs.readFileSync(path.resolve('views/pictures/index.ejs')) 
  });
};

exports.create =  function(req,res,next){

  res.send(
      format('\nuploaded %s (%d Kb) to %s as %s'
      , req.files.image.name
      , req.files.image.size / 1024 | 0 
      , req.files.image.path
      , req.body.title)
  );

};
