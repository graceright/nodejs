var M = {
  v:'v',
  f:function(){
    console.log(this.v);
  }
}

module.exports = M; //M에 담겨있는 객체를 이 모듈 바깥에서 사용할 수 있도록 exports 하겠다.
