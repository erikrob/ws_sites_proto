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
  that.db.collection('site_content', function(error, site_content_collection) {
    // Find page content
    site_content_collection.findOne({'site_id':that.site_id, 'page':path}, function(err, site_content_rec) {
      if (site_content_rec) {
        console.log("Found content context for site_id " + that.site_id + ", path:" + path);
        var context = site_content_rec;
        var template_name = site_content_rec.html_template;
        console.log("template_name: "+template_name)
        // Find html template
        that.db.collection('html_templates', function(error, html_templates_collection) {
          html_templates_collection.findOne({'name':template_name}, function(err, html_template_rec) {
            if (html_template_rec) {
              console.log("Found " + template_name + " html template for site_id " + that.site_id + ", path:" + path);
              //We now have a template and the content... now render!
              var template = handlebars.compile(html_template_rec.text);
              var html = template(context);
              http_response(response, 200, html);
            } else {
              http_response(response, 200, "No html template found in db for site_id " + that.site_id + ", path:" + path);
            }
          });
        });
      } else {
        http_response(response, 200, "No content found in db for site_id " + that.site_id + ", path:" + path);
      }
    });
  });
}

exports.Site = Site;

