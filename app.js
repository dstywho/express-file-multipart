var express = require('express')
  , format = require('util').format;


  var path = require('path');
  var util = require('util');

var im = require('imagemagick');
im.readMetadata(path.resolve('kittens.jpg'), function(err, metadata){
    if (err) throw err;
      console.log('Shot at '+metadata.exif.dateTimeOriginal);
      console.log('Shot at '+JSON.stringify(metadata));

    debugger
    util.print('hi');
    
    
})

im.resize({
    srcPath: 'kittens.jpg',
    dstPath: 'kittens-small.jpg',
    width:   256
}, function(err, stdout, stderr){
    if (err) throw err;
      console.log('resized kittens.jpg to fit within 256x256px');
});




var app = module.exports = express()

// bodyParser in connect 2.x uses node-formidable to parse 
// the multipart form data.
app.use(express.bodyParser())
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.send('<form method="post" enctype="multipart/form-data">'
    + '<p>Title: <input type="text" name="title" /></p>'
    + '<p>Image: <input type="file" name="image" /></p>'
    + '<p><input type="submit" value="Upload" /></p>'
    + '</form>');
});

app.post('/', function(req, res, next){
  // the uploaded file can be found as `req.files.image` and the
  // title field as `req.body.title`
  res.send(format('\nuploaded %s (%d Kb) to %s as %s'
    , req.files.image.name
    , req.files.image.size / 1024 | 0 
    , req.files.image.path
    , req.body.title));
});

if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
