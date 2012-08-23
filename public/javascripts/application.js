$(function() {
  var faye = new Faye.Client('http://myfaye.herokuapp.com/faye');
  faye.subscribe("/messages/new", function(data) {
    eval(data);
  });
});
