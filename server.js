var http = require("http");
var url = require("url");
var mongodb = require("mongodb");

var site = require("./site");

function hello(response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("Welcome to the GEM FFD web site");
  response.end();
}

function route(handle, pathname, response, request) {
  console.log("About to route a request for " + pathname);
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, request);
  } else {
    function onSiteRequest(db, site_id, path, response, request) {
      var my_site = new site.Site(db, site_id);
      my_site.request(path, response, request);
    }
    function noSiteExists(pathname, response, request) {
      console.log("No request handler found for " + pathname);
      response.writeHead(404, {"Content-Type": "text/html"});
      response.write("404 Not found");
      response.end();
    }
    site.test_exist(db, pathname, response, request, onSiteRequest, noSiteExists);
  }
}

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    route(handle, pathname, response, request);
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started on port 8888.");

  // console.log = function() {} // hack to turn OFF all console messages
}

var handle = {};
handle["/"] = hello;
handle["/hello"] = hello;

var server = new mongodb.Server("127.0.0.1", 27017, {});
var db = new mongodb.Db('ws_sites', server, {});

db.open(function (error, db) {
  start(route, handle);
});

