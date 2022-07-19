var members = ['ash', 'blair', 'esca']; //배열
console.log(members[1]);

for(var i = 0; i < members.length; i++) {
  console.log('array loop : ' + members[i]);
}

var roles = { //객체
  'programmer':'Ash',
  'designer' : 'Park',
  'manager' : 'Hyun'
}
console.log(roles.designer);
for(var name in roles) {
  console.log('object test : ' + name);
  console.log('object name : ' + roles[name]);
}
