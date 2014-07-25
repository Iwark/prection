// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery.turbolinks
//= require jquery_ujs
//= require_tree .
//= require websocket_rails/main
//= require turbolinks

$(function(){
	var dispatcher = new WebSocketRails('localhost:3000/websocket');
	var channel = dispatcher.subscribe('comments');

	var canvas = document.getElementById( 'canvas' ).getContext( '2d' );
	canvas.font = "30pt Arial";

	var comments = []

	channel.bind('send_comment', function(comment) {
		alert("うーん");
		if(comments.length == 0){
			comments.push({ comment: comment, x:800, y:40 });
		}else{
			var y = 0;
			while(true){
				y += 40;
				var hit = false;
			  for(var i=0; i<comments.length; i++){
			  	var right_x = comments[i].x + canvas.measureText(comments[i].comment).width;
					if( y == comments[i].y && right_x >= 400){
						hit = true;
						break;
					}
				}
				if(!hit){
					comments.push({ comment: comment, x:800, y:y });
					break;
				}
			}
		}
	});

	setInterval(function(){
			canvas.fillStyle = "white";
			canvas.clearRect( 0, 0, 800, 800 );
			canvas.fillStyle = 'black';
			comments = $.map(comments, function(comment){
				return comment.x + canvas.measureText(comment.comment).width > 0 ? comment : null;
			});
			for(var i=0; i<comments.length; i++){
				var comment = comments[i];
				canvas.fillText( comment.comment, comment.x, comment.y);
				comment.x -= 4;
			}
	}, 20);

	$(".good-btn").click(function(){
		dispatcher.trigger('comments.send', 'おぉぉおぉぉぉ！！');

	});

	$(".bad-btn").click(function(){

		dispatcher.trigger('comments.send', 'よくわからん。');

	});

	$(".wait-btn").click(function(){

		dispatcher.trigger('comments.send', 'ちょい待って！');

	});

	$(".question-btn").click(function(){

		dispatcher.trigger('comments.send', 'は？？？？');

	});

});