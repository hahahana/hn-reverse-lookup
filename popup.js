var reverseLookup = {
  /*
   * Use the HNSearch API to see if the current tab is mentioned anywhere on Hacker News
   *
   * See https://www.hnsearch.com/api for documentation
   *
   */

  makeURL_: function(q) {
    return 'http://api.thriftdb.com/api.hnsearch.com/items/_search?q=' + 
      encodeURIComponent(q);
  },

  count: 0,
  test: null,

  requestComments: function(test) {
    this.test = test;
    var url = this.test.url;
    var req = new XMLHttpRequest();
    req.open("GET", this.makeURL_(url), true);
    req.onload = this.showResults_.bind(this);
    req.send(null);
  },

  addRow: function(title, subtext, commentCount, link, color) {
    $('tbody').append( $('<tr>')
              .append( $('<td>')
                .addClass("col-" + color) )
              .append( $('<td>')
                .addClass('col-left')
                .append( $('<div>')
                  .addClass('title')
                  .text(title) ) 
                .append( $('<div>')
                  .addClass('subtext')
                  .html(subtext) ) )
              .append( $('<td>')
                .addClass('col-right')
                .append( $('<div>')
                  .addClass('comment-no')
                  .append( $('<a>')
                    .text(commentCount)
                    .attr('href', link)
                    .attr('target', '_blank') ) ) ) );
  },

  addBlankRow: function() {
    color = "orange"
    title = "This article could not be found on Hacker News."
        $('tbody').append( $('<tr>')
              .append( $('<td>')
                .addClass("col-" + color) )
              .append( $('<td>')
                .addClass('col-left')
                .append( $('<div>')
                  .addClass('title')
                  .text(title) ) ) );
  },

  showResults_: function (e) {
    var results = JSON.parse(e.target.responseText).results;

    for (var i = 0; i < results.length; i++) {
      var item = results[i].item;

      if (item.url !== null) {
        
        var title = item.title;
        
        var postDate = moment(item.create_ts).format('l');
        var today = moment().startOf('day').format('l');
        if (today === postDate) {
          postDate = moment(item.create_ts).fromNow();
        }
        var subtext = item.points + ' points by ' + item.username + '<span class="bar"></span>' + postDate;
        
        commentCount = item.num_comments;

        colors = ['orange', 'red', 'tomato'];
        fac = i - 3 * Math.floor(i/3);

        link = "https://news.ycombinator.com/item?id=" + item.id;

        this.addRow(title, subtext, commentCount, link, colors[fac]);
      
      }


    //   else {
    //     var newDiv = document.createElement('div');
    //   var newContent = document.createTextNode("This article was not found on HN.");
    //   newDiv.appendChild(newContent); //add the text node to the newly created div.
    //   document.body.appendChild(newDiv);
    //   this.count = 1;
    //   }
    // }
    // if (results.length === 0 && this.count < 1) {
    //   var newDiv = document.createElement('div');
    //   var newContent = document.createTextNode("This article was not found on HN.");
    //   newDiv.appendChild(newContent); //add the text node to the newly created div.
    //   document.body.appendChild(newDiv);
    //   this.count = 1;
    // }

    } 

    if (results.length === 0) {
      this.addBlankRow();
    }
  }
};

document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    reverseLookup.requestComments(tabs[0]);
  });
});