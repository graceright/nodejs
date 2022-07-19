var fs = require('fs');

//readFileSync
console.log('A');
var result = fs.readFileSync('syntax/sample.txt', 'utf8');
console.log(result);
console.log('C');
//출력 : A B C


//readFile Async
console.log('A');
fs.readFile('syntax/sample.txt', 'utf8', function(err, result) {
  //file 읽음 -> function 실행(비동기)
  console.log(result);
});
console.log(result);
console.log('C');
//출력 : A C B
