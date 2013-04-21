var ejs = require('ejs');
var format = require('util').format;
var fs = require('fs');
var path = require('path');

exports.newAction=  function(req, res){
  fs.readFile(path.resolve('views/pictures/index.ejs'), function(err,data){
    res.render('layouts/application', { 
        title: 'Uplead a  new picture', 
        body: data
    });
  }); 
};


var im = require('imagemagick');

var sizeOf = function(image_path,callback){
  im.readMetadata(path.resolve(image_path), function(err, metadata){
      if (err) throw err;
      var result = {width:metadata.exifImageWidth, height:metadata.exifImageHeight}
      callback.call(result, result);
  });
}

var scaleImage = function(originalSize, maxDimention){
  ratio = originalSize.width/originalSize.height
  if(originalSize.width > originalSize.height){
    resultantWidth = maxDimention
    resultantHeight = resultantWidth * (1/ratio)
  }else{
    resultantHeight = maxDimention
    resultantWidth = maxDimention * ratio
  }
  return {height: resultantHeight, width: resultantWidth}
}


var resizeForIphone = function(srcPath, callback){ 
  im.identify(srcPath, function(err, features){
    resizeImage(srcPath, features.format, scaleImage(features, 1136),callback)
  });
} 

var resizeImage = function(srcPath, format, size ,callback){
  var result = {outputfile: "/tmp/" + randomNumber() + '.' + format}


  function extention(filename){
      console.log(filename);
      return /\.\w+$/.exec(filename)[0]
  }

  function randomNumber(){
    return new Date().getTime() + Math.floor(Math.random() * 11)
  }


  im.resize({
      srcPath: srcPath,
      dstPath: result.outputfile,
      width: size.width,  
      height: size.height  
  }, function(err, stdout, stderr){
      if (err) throw err;
      console.log('resized to ' + size.width +'x' + size.height);
      callback.call(this, result);
  });

}

exports.create =  function(req,res,next){
  file_path = req.files.image.path
  res.send(
      format('\nuploaded %s (%d Kb) to %s as %s'
      , req.files.image.name
      , req.files.image.size / 1024 | 0 
      , req.files.image.path
      , req.body.title)
  );

  console.log("sending " + file_path  + 'to s3');

  resizeForIphone(file_path, function(result){
    console.log("sending " + result.outputfile + 'to s3');
  });

};
