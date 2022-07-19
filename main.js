var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;

    if(pathname === '/') {  //root를 통한 정상적인 접근
      if(queryData.id === undefined) {  //메인 접근의 경우
        fs.readdir('data', function(err, filelist){
          var title = 'Welcome!';
          var description = 'Hello Node.js';
          var list = template.list(filelist);
          var html = template.html(title, list, `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`);
          response.writeHead(200);
          response.end(html);
        })
      } else {  //id값이 정의된 경우
        fs.readdir('data', function(err, filelist){
          var filteredId = path.parse(queryData.id).base;
          var list = template.list(filelist);
          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description);
          var html = template.html(title, list, `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
          `<a href="/create">create</a> <a href="/update?id=${sanitizedTitle}">update</a>
          <form action="delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>
          `);
          response.writeHead(200);
          response.end(html);
        });
      });
      }
    }
    else if (pathname === '/create') {  //create를 통한 접근
      fs.readdir('data', function(err, filelist){
        var title = 'WEB - create';
        var list = template.list(filelist);
        var html = template.html(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p><textarea name="description" rows="8" cols="80" placeholder="description"></textarea></p>
            <p><input type="submit"></p>
          </form>
          `, ``);
        response.writeHead(200);
        response.end(html);
      });
    }

    else if (pathname === "/create_process") {  //create form 내 제출을 통한 접근
      var body = '';
      request.on('data', function(data){  //data를 비동기식으로 하나씩 받아오고 callback
        body += data;
      });
      request.on('end', function() {  //정보가 더 이상 들어오지 않으면 callback
        var post = qs.parse(body);  //지금까지 받아와 저장한 body를 parsing 하여 post에 저장
        var title = post.title;
        var description = post.description;

        fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
          response.writeHead(302, {Location : `/?id=${title}`});
          response.end();
        });
      });
    }

    else if (pathname === '/update') {  //update 버튼을 통한 접근
      fs.readdir('data', function(err, filelist){
        var list = template.list(filelist);
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        var html = template.html(title, list,
          `
          <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p><textarea name="description" rows="8" cols="80" placeholder="description">${description}</textarea></p>
            <p><input type="submit"></p>
          </form>
          `,
        `<a href="/create">create</a> <a href="/update/?id=${title}">update</a>`);
        response.writeHead(200);
        response.end(html);
      });
    });
    }

    else if (pathname === '/update_process') {
      var body = '';
      request.on('data', function(data){  //data를 비동기식으로 하나씩 받아오고 callback
        body += data;
      });
      request.on('end', function() {  //정보가 더 이상 들어오지 않으면 callback
        var post = qs.parse(body);  //지금까지 받아와 저장한 body를 parsing 하여 post에 저장
        var id = post.id;
        var title = post.title;
        var description = post.description;

        fs.rename(`data/${id}`, `data/${title}`, function(err){ //파일 이름 수정
          fs.writeFile(`data/${title}`, description, 'utf8', function(error) {  //파일 내용 수정
            //redirecting...
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          })
        });

      });
    }

    else if (pathname = '/delete_process') {
      var body = '';
      request.on('data', function(data){  //data를 비동기식으로 하나씩 받아오고 callback
        body += data;
      });
      request.on('end', function() {  //정보가 더 이상 들어오지 않으면 callback
        var post = qs.parse(body);  //지금까지 받아와 저장한 body를 parsing 하여 post에 저장
        var id = post.id;
        var filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`, function(error){
          response.writeHead(302, {Location : `/`});
          response.end();
        })



      });    }

    else {
      response.writeHead(404);
      response.end('Not found');
  };
});



app.listen(3000);
