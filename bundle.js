(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var $form = document.querySelector('form');
  $form.addEventListener('submit', function (e) {
    e.preventDefault();
    var $input = $form.querySelector('input');
    if ($input.value) {

      var searchPath = ~"cca41b90-8143-4f48-899d-1e911c0a6431-bluemix.cloudant.com".indexOf('cloudant') ? "styleguides" + '/_design/' + "styleguides" + '/_search/' + "styleguides" : '_fti/local/' + "styleguides" + '/_design/' + "styleguides" + '/' + "styleguides";

      var url = "https:" + '//' + "cca41b90-8143-4f48-899d-1e911c0a6431-bluemix.cloudant.com" + ':' + "443" + '/' + searchPath;

      var q = $input.value.trim();
      var xhr = new XMLHttpRequest();
      xhr.onload = function (e) {
        if (e.target.status >= 400) {
          return console.error(JSON.parse(e.target.responseText));
        }

        var data = JSON.parse(e.target.responseText);
        var $ul = document.getElementById('results');

        if (data.rows && data.rows.length) {
          $ul.innerHTML = data.rows.map(function (row) {
            console.log(row);
            return '<li>\n                 <h2><a href="' + row.fields.url + '">' + row.fields.title + '</a></h2>\n                 <span>' + row.fields.publisher + ' - score: ' + (row.score || row.order[0]) + '</span>\n                 <p>' + row.fields.about + '</p>\n               </li>';
          }).join('');
        } else {
          $ul.innerHTML = '<li>no results found</li>';
        }
      };
      xhr.onabort = function (e) {
        console.error('xhr aborted');
      };
      xhr.onerror = function (e) {
        console.error('xhr error');
      };
      xhr.open('GET', url + ('?q=' + q + '&limit=100'));
      xhr.send();
    }
  });
});

},{}]},{},[1]);
