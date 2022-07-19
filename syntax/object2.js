var f = function() {  //함수를 변수에 저장 - 객체
  console.log(1+1);
  console.log(1+2);
}
var a = [f]; //배열의 원소로서 함수를 저장할 수 있다.
a[0]();

var o = { //o의 프로퍼티로 f를 부여
  func:f
}
o.func();
