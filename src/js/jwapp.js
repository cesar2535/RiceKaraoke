(function () {
  'use strict';

  var JWPLAYER_STATE = {
    'IDLE': 'IDLE',
    'BUFFERING': 'BUFFERING',
    'PLAYING': 'PLAYING',
    'PAUSED': 'PAUSED'
  };

  var JWplayer = function () {
    this.player = undefined;
    this.state = JWPLAYER_STATE.IDLE;

    // @type {Array} An array for the media queue
    this.queue = [];
    this.history = [];
    /** Schema for file
     *  {
     *    title: 'title',
     *    sources: [{
     *      file: 'file',
     *      label: '720p HD'
     *    }, {
     *      file: 'file',
     *      label: '360p SD'
     *    }]
     *  }
     **/

    // @type {Number} A number for current media duration
    this.currentMediaDuration = 0;

  };

  JWplayer.prototype.setupJwplayer = function(container, file) {
    this.player = jwplayer(container).setup({
      playlist: file,
      aspectratio: '16:9',
      controls: true
    });

    this.initializePlaybackEvents();
  };

  JWplayer.prototype.initializePlaybackEvents = function() {
    this.player.onPlay(this.onPlayListener.bind(this));
    this.player.onPause(this.onPauseListener.bind(this));
    this.player.onBuffer(this.onBufferListener.bind(this));
    this.player.onIdle(this.onIdleListener.bind(this));
    this.player.onComplete(this.onCompleteListener.bind(this));
    this.player.onError(this.onErrorListener.bind(this));
  };

  JWplayer.prototype.addToQueue = function(file) {
    if (Array.isArray(file)) {
      this.queue = this.queue.concat(file);
    } else {  
      this.queue.push(file);
    }
  };

  JWplayer.prototype.playMedia = function() {
    if (this.queue.length === 0) {
      console.error('No media can play!')
      this.state = JWPLAYER_STATE.IDLE;
      return;
    }

    this.state = this.player.getState();
    if (this.state === 'PLAYING' || this.state === 'PAUSED') {
      this.player.play();
    } else {
      this.player.load(this.queue[0]);
      this.currentMediaDuration = this.player.getDuration();
      console.info('----- Play Media: ' + this.queue[0] + ' -----');
      this.player.play();
    }
  };

  JWplayer.prototype.nextMedia = function() {
    var skipped = this.queue.shift();
    this.history.push(skipped);
    this.playMedia();
  };

  JWplayer.prototype.onPlayListener = function(oldState) {
    this.state = JWPLAYER_STATE.PLAYING;
  };

  JWplayer.prototype.onPauseListener = function(oldState) {
    this.state = JWPLAYER_STATE.PAUSED;
  };

  JWplayer.prototype.onBufferListener = function(oldState) {
    this.state = JWPLAYER_STATE.BUFFERING;
  };

  JWplayer.prototype.onIdleListener = function(oldState) {
    this.state = JWPLAYER_STATE.IDLE;
  };

  JWplayer.prototype.onCompleteListener = function() {
    // var played = this.queue.shift();
    // this.history.push(played);
    // this.playMedia();
    this.nextMedia();
  };

  JWplayer.prototype.onErrorListener = function(message) {
    console.error(message);
  };

  var player = jwplayer('my-jwplayer').setup({
    playlist: [{
      title: 'Through the Fire and Flames',
      file: './assets/media/media01.mp3'
    }],
    height: 30,
    width: 640,
    cast: {
      appid: '2EE4C22E'
    },
    skin: 'five'.toLowerCase()
  });

  player.onComplete(function () {
    var num = Math.floor((Math.random() * 4) + 1);
    player.load({
      title: num, 
      sources: [{
        file: './assets/media/media0' + num + '.mp3'
      }]
    });
    player.play();
  });
  window.myJwplayer = player;

  window.JWplayer = JWplayer;
}) ();