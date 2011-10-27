var http = require("http");
var url = require("url");
var mongodb = require("mongodb");
var handlebars = require("handlebars");

exports.test_exist = function (db, pathname, response, request, callback_if_exists, callback_if_not_exists) {
  var path_head = pathname.split("/")[1]
  console.log("Checking to see if we have db entries for "+path_head);
  db.collection('sites', function (error, collection) {
    collection.findOne({'name':path_head}, function(err, rec) {
      if (rec) {
        path = pathname.split("/")[2] || "/";
        callback_if_exists(db, rec.id, path, response, request);
      } else {
        callback_if_not_exists(pathname, response, request);
      }
    });
  });
}


//Constructor
function Site(db, site_id) {
  this.db = db;
  this.site_id = site_id;
}

//Public methods
Site.prototype.request = function (path, response, request) {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("Welcome to processing of site_id: " + this.site_id + ", path:" + path);
    response.end();
}

exports.Site = Site;

