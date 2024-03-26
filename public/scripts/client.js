/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  //event listener to submit POST request asynchronously
  $("#tweet-form").on("submit", function(event) {
    //prevent default behaviour
    event.preventDefault();


    const isTweetValid = function() {
      //define variable for number of characters in tweet text form with whitespace trimmed
      let charCount = $(".tweet-text").val().trim().length; 

      //display error if no text is entered
      if (charCount === 0) {
        $(".new-tweet-alert").text("Write something! Let the world!").slideDown("slow");
        return false;
      }
      //display error if character count exceeds 140
      if (charCount > 140) {
        $(".new-tweet-alert").text("You cannot post a tweet more than 140 characters long!").slideDown("slow");
        return false;
      }

      $(".new-tweet-alert").slideUp("slow");
      return true;
    };

    //if tweet is valid, continue with POST request
    if (isTweetValid()) {
      //turn form data into a query string
      let formData = $(this).serialize();
      //POST request to send serialized data to server
      $.post("/tweets", formData)
        .then(() => {
          loadTweets();
          $(".tweet-text").val("");
          $(".counter").text("140");
        });
    }
  });

  const loadTweets = function() {
    //GET request to load tweets using renderTweets function
    $.get("/tweets")
      .then((res) => {
        renderTweets(res);
      });
  };

  const renderTweets = function(tweets) {
    // loops through tweets
    tweets.forEach(tweet => {
      // calls createTweetElement for each tweet
      const $tweet = createTweetElement(tweet);
      // takes return value and appends it to the tweets container
      $('.tweet-container').prepend($tweet);
    });
  };
  
  //sanitize incoming text inputs
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML
  };

  //function to take object with tweet data and return an HTML article containing tweet info
  const createTweetElement = function(tweet) {

    //Utilize timeAgo library to format tweet submission dates
    const timeAgo = timeago.format(tweet.created_at, 'en_US');

    //define tweet based on object
    const { user: { name, avatars, handle }, content: { text }, created_at } = tweet;

    //define tweet HTML with applicable info from data above
    let $tweet = $(`
    <article class="tweet">
      <header class="tweet-header">
        <div class="tweet-person">
          <img src="${avatars}" alt="${name}'s avatar" />
          <p>${name}</p>
        </div>
        <div class="tweet-handle">${handle}</div>
      </header>
      <div class="tweet-content">
      <div>${escape(text)}</div>
      </div>
      <div class = "tweet-border"></div>
      <footer class="tweet-footer">
        <div class="tweet-date">
        <p>${timeAgo}</p>
        </div>
        <div class="tweet-icons">
          <i class="fa-solid fa-flag"></i>
          <i class="fa-solid fa-retweet"></i>
          <i class="fa-solid fa-heart"></i>
        </div>
      </footer>
    </article>
  `);

    //return tweet in HTML form
    return $tweet;
  };

});