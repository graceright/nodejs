var fs = require('fs');  //filesystem module
fs.readFile('sample.txt', 'utf8', function(err,data){
  console.log(data);
})
