$(function() {
  var faye = new Faye.Client('http://myfayechat.herokuapp.com/faye');
  faye.subscribe("/messages/new", function(data) {
    eval(data);
  });
});
