var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");

var templateHTML = (title, list, body) => {
  return `
          <!doctype html>
        <html>
        <head>
          <title>WEB - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          ${list}
          <a href="/create">create</a>
          ${body}
        </body>
        </html>
          `;
};

var templateList = (fileList) => {
  var list = "<ul>";
  var i = 0;
  while (i < fileList.length) {
    list = list + `<li><a href="?id=${fileList[i]}">${fileList[i]}</a></li>`;
    i += 1;
  }
  list = list + "</ul>";
  return list;
};

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", function (error, fileList) {
        var title = "Welcome";
        var description = "Hello, Node.js";
        var list = templateList(fileList);
        var template = templateHTML(
          title,
          list,
          `<h2>${title}</h2>${description}`
        );
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir("./data", function (error, fileList) {
        fs.readFile(
          `data/${queryData.id}`,
          "utf8",
          function (err, description) {
            var title = queryData.id;
            var list = templateList(fileList);
            var template = templateHTML(
              title,
              list,
              `<h2>${title}</h2>${description}`
            );
            response.writeHead(200);
            response.end(template);
          }
        );
      });
    }
  } else if (pathname === "/create") {
    fs.readdir("./data", function (error, fileList) {
      var title = "Web - create";
      var list = templateList(fileList);
      var template = templateHTML(
        title,
        list,
        `
          <form action="http://localhost:3000/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `
      );
      response.writeHead(200);
      response.end(template);
    });
  } else if (pathname === "/create_process") {
    var body = "";
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, `${description}`, "utf-8", (err) => {
        if (err) throw err;
        response.writeHead(302, {
          Location: `/?id=${title}`,
        });
        response.end("success");
        console.log("The file has been saved!!!!!!");
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
});
app.listen(3000);
