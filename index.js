#!/usr/bin/env node

"use strict"; 

var https = require("https");
var http = require("http");
var express = require('express');
var app = express();


function getJSON(req, done){
    var key = process.env.CLASH_OF_CLANS_API_KEY || require("./.vscode/launch.json").configurations[0].env.CLASH_OF_CLANS_API_KEY;
    var request = {
        hostname: "api.clashofclans.com", 
        path: req.url,
        headers: {
            Authorization: "Bearer " + key,
            Accept: "application/json"
        }
    };
    https.get(request, function(response) { 
        var body = "";
        response.on("data", function(d) {
            body += d;
        });
        response.on("end", function() { 
            var parsed = {};
            try { 
                if (body !== ""){
                    parsed = JSON.parse(body);
                }
            } catch (e) {
                console.log(e, body);    
            }
            done(parsed);
        });
        response.on("error", function() { 
            console.log(arguments);
        });
    });
}

app.get("*", function(req, res){
    getJSON(req, function (data) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(data, null, 4));
        res.end();
    }); 
});

app.listen(process.env.PORT || require("./.vscode/launch.json").configurations[0].env.PORT || 9000); 
