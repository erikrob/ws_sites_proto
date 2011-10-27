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


http_response = function(response, result, content) {
  response.writeHead(result, {"Content-Type": "text/html"});
  response.write(content);
  response.end();
}

//Constructor
function Site(db, site_id) {
  this.db = db;
  this.site_id = site_id;
}

//Public methods
Site.prototype.request = function (path, response, request) {
  //this.db.collection('site_content', this._request_collection_cb);
  var that=this;
  this.db.collection('site_content', function(error, collection) {
    console.log(that.site_id);
    console.log(path);
    collection.findOne({'site_id':that.site_id, 'page':path}, function(err, rec) {
      if (rec) {
        console.log("Found content context for site_id " + that.site_id + ", path:" + path);
        var context = rec;
        var template_content = "";
        console.log(context);
        this.http_response(response, 200, context.toString());
      } else {
        this.http_response(response, 200, "No content found in db for site_id " + that.site_id + ", path:" + path);
      }
    });
  });
}

exports.Site = Site;

