var a = function() {
  console.log('A');
}

function slowfunc(a){
  a();
}
slowfunc(a)
