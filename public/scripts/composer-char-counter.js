//run DOM
$(document).ready(function() {

  //event listener to monitor text input to the tweet text area
  $('.tweet-text').on('input', function() {
    //convert this to jQuery object and get value of text form element
    let textCount = $(this).val().length;

    //calculate characters remaining
    let textRemaining = 140 - textCount;

    //update counter display
    let counter = $('.counter').text(textRemaining);

    //if text count goes below zero, add negative class to change color to red
    if (textRemaining < 0){
      counter.addClass('negative');
    } else {
      counter.removeClass('negative');
    }
  });  
});