var mongodb = require("mongodb");
var console_utils = require("./console_utils");

var content = {
sites: [
 {id:1, name: "jon"}
,{id:2, name: "ed"}
]
, site_content: [
 {site_id:1, page:"/", html_template:"basic", lang:"en", charset:"UTF-8", title:"My jon page title", description:"description", keywords:"keyword1, keyword2", style:"", body:"Welcome to my JON page"}
,{site_id:2, page:"/", html_template:"basic", lang:"en", charset:"UTF-8", title:"My ed page title", description:"description", keywords:"keyword1, keyword2", style:"", body:"Welcome to my ED page"}
]
, html_templates: [
 {name: "basic", text: "<!DOCTYPE html>\n<html lang=\"{{lang}}\">\n<head>\n  <meta charset=\"{{charset}}\" />\n  \n  <title>{{title}}</title>\n  \n  <meta name=\"description\" content=\"{{description}}\" />\n  <meta name=\"keywords\" value=\"{{keywords}}\" />\n  \n  <STYLE type=\"text/css\">\n  {{style}}\n  </STYLE>  \n\n</head>\n<body>\n{{body}}  \n</body>\n</html>\n"}
,{name: "basic2", text: "<!DOCTYPE html>\n<html lang=\"{{lang}}\">\n<head>\n  <meta charset=\"{{charset}}\" />\n  \n  <title>{{title}}</title>\n  \n  <meta name=\"description\" content=\"{{description}}\" />\n  <meta name=\"keywords\" value=\"{{keywords}}\" />\n  \n  <STYLE type=\"text/css\">\n  {{style}}\n  </STYLE>  \n\n</head>\n<body>\n{{body}}  \n</body>\n</html>\n"}
]
, style_templates: [
 {name: "empty", text: ""}
]
};

/*
lang = "en"
charset = "UTF-8"
title
description
keywords
style
body
*/

console_utils.ask("About to reset the DB and erase all prior content. OK? (y/n) ", /[yn]/, function(reply) {
  if (reply!="y") process.exit(); //exit immediately if not OK

  var server = new mongodb.Server("127.0.0.1", 27017, {});
  var db = new mongodb.Db('ws_sites', server, {});
  db.open(function (error, client) {
    //if (error) throw error;
    for (var coll in content) {
      coll_content = content[coll];
      client.collection(coll, function (error, collection) {
      collection.remove({}); //Deletes all the collection content
      for (var i=0; i < coll_content.length; i++) {
        c = coll_content[i];
        collection.insert(c);
        }
      });
    }
    db.close();
    process.exit(); // required because of ask that is looping around apparently...
  });
});


