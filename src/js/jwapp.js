(function () {
  'use strict';

  var JWplayer = function () {
    this.player = undefined;
    this.queue = [];

  };

  JWplayer.prototype.setupJwplayer = function(file) {
    this.player = jwplayer('my-jwplayer').setup({
      sources: [{
        file: file
      }],
      aspectratio: '16:9',
      controls: false
    });

    this.addPlaybackEventListener();
  };

  JWplayer.prototype.addToQueue = function(file) {
    this.queue.push({file: file});
  };

  JWplayer.prototype.playMedia = function() {
    this.player.load(this.queue[0]);
    this.player.play();
  };

  JWplayer.prototype.addPlaybackEventListener = function() {
    this.player.onPlay();
    this.player.onPause();
    this.player.onBuffer();
    this.player.onIdle();
    this.player.onComplete(this.onCompleteListener.bind(this));
    this.player.onError();
  };

  JWplayer.prototype.onPlayListener = function(oldState) {
    
  };

  JWplayer.prototype.onPauseListener = function(oldState) {
    
  };

  JWplayer.prototype.onBufferListener = function(oldState) {
    
  };

  JWplayer.prototype.onIdleListener = function(oldState) {
    
  };

  JWplayer.prototype.onCompleteListener = function() {
    this.queue.shift();
    this.playMedia();
  };

  JWplayer.prototype.onError = function(message) {
    console.error(message);
  };

  var player = jwplayer('my-jwplayer').setup({
    playlist: [{
      title: 'Through the Fire and Flames',
      file: './assets/media/media01.mp3'
    }],
    aspectratio: '16:9'
  });

  player.onComplete(function () {
    var num = Math.floor((Math.random() * 4) + 1);
    player.load({file: './assets/media/media0' + num + '.mp3'});
    player.play();
  });
  window.myJwplayer = player;
}) ();