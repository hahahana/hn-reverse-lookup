// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Global variable containing the query we'd like to pass to Flickr. In this
 * case, kittens!
 *
 * @type {string}
 */
var LIMIT = 5;

var commentFinder = {
  /*
   * Flickr URL that will give us lots and lots of whatever we're looking for.
   *
   * See http://www.flickr.com/services/api/flickr.photos.search.html for
   * details about the construction of this URL.
   *
   * @type {string}
   * @private
   */
  searchOnFlickr_: 'https://secure.flickr.com/services/rest/?' +
      'method=flickr.photos.search&' +
      'api_key=90485e931f687a9b9c2a66bf58a3861a&' +
      'text=' + encodeURIComponent(QUERY) + '&' +
      'safe_search=1&' +
      'content_type=1&' +
      'sort=interestingness-desc&' +
      'per_page=20',

  getURL_: function(q) {
    return 'http://api.thriftdb.com/api.hnsearch.com/items/_search?q=' + encodeURIComponent(q);
  },

  /**
   * Sends an XHR GET request to grab photos of lots and lots of kittens. The
   * XHR's 'onload' event is hooks up to the 'showPhotos_' method.
   *
   * @public
   */
  count: 0,
  test: null,
  requestComments: function(test) {
    this.test = test;
    var url = this.test.url;
    var req = new XMLHttpRequest();
    req.open("GET", this.getURL_(url), true);
    req.onload = this.showResults_.bind(this);
    req.send(null);
  },

  requestMoarComments: function() {
    var url = this.test.title;
    var req = new XMLHttpRequest();
    req.open("GET", this.getURL_(url), true);
    req.onload = this.showResults_.bind(this);
    req.send(null);
  },

  /**
   * Handle the 'onload' event of our kitten XHR request, generated in
   * 'requestKittens', by generating 'img' elements, and stuffing them into
   * the document for display.
   *
   * @param {ProgressEvent} e The XHR ProgressEvent.
   * @private
   */

  showResults_: function (e) {
    var results = JSON.parse(e.target.responseText).results;
    for (var i = 0; i < results.length; i++) {
      var item = results[i].item;
      if (item.url !== null) {
        var newDiv = document.createElement('div');
        var newContent = document.createTextNode("Comments: " + item.num_comments);
        var a = document.createElement('a');
        var linkText = document.createTextNode("Comments");
        a.title= "Comments";
        a.href = "https://news.ycombinator.com/item?id=" + item.id;
        a.target = "_blank";
        a.appendChild(linkText);
        newDiv.appendChild(newContent); //add the text node to the newly created div.
        newDiv.appendChild(a); //add the text node to the newly created div.
        document.body.appendChild(newDiv);
      } else {
        var newDiv = document.createElement('div');
      var newContent = document.createTextNode("This article was not found on HN.");
      newDiv.appendChild(newContent); //add the text node to the newly created div.
      document.body.appendChild(newDiv);
      this.count = 1;
      this.requestMoarComments();
      }
    }
    if (results.length === 0 && this.count < 1) {
      var newDiv = document.createElement('div');
      var newContent = document.createTextNode("This article was not found on HN.");
      newDiv.appendChild(newContent); //add the text node to the newly created div.
      document.body.appendChild(newDiv);
      this.count = 1;
      this.requestMoarComments();
    }
  },

  /**
   * Given a photo, construct a URL using the method outlined at
   * http://www.flickr.com/services/api/misc.urlKittenl
   *
   * @param {DOMElement} A kitten.
   * @return {string} The kitten's URL.
   * @private
   */
  constructKittenURL_: function (photo) {
    return "http://farm" + photo.getAttribute("farm") +
        ".static.flickr.com/" + photo.getAttribute("server") +
        "/" + photo.getAttribute("id") +
        "_" + photo.getAttribute("secret") +
        "_s.jpg";
  }
};

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  // chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  //             commentFinder.requestComments(tabs[0]);
  //           });

});