(function () {
  'use strict';

  var AudioPlayer = function () {
    this.player = document.getElementById('audio-player');

    this.initializeAudioEvent();
  };

  AudioPlayer.prototype.loadMedia = function(mediaSource) {
    this.player.src = mediaSource;
    this.player.load();
  };

  AudioPlayer.prototype.playMedia = function() {
    this.player.play();
  };
  
  AudioPlayer.prototype.initializeAudioEvent = function() {
    // During the loading process of an audio/video, the following events occur, in this order:
    this.player.addEventListener('loadstart', this.loadStartListener.bind(this));
    this.player.addEventListener('durationchange', this.durationChangeListener.bind(this));
    this.player.addEventListener('loadedmetadata', this.loadedMetadataListener.bind(this));
    this.player.addEventListener('loadeddata', this.loadedDataListener.bind(this));
    this.player.addEventListener('progress', this.progressListener.bind(this));
    this.player.addEventListener('canplay', this.canPlayListener.bind(this));
    this.player.addEventListener('canplaythrough', this.canPlayThroughListener.bind(this));
    // Loading process Ended

    this.player.addEventListener('timeupdate', this.timeUpdateListener.bind(this));
  };

  AudioPlayer.prototype.loadStartListener = function() {
    
  };

  AudioPlayer.prototype.durationChangeListener = function() {
    
  };

  AudioPlayer.prototype.loadedMetadataListener = function() {
    
  };

  AudioPlayer.prototype.loadedDataListener = function() {
    
  };

  AudioPlayer.prototype.progressListener = function() {
    
  };

  AudioPlayer.prototype.canPlayListener = function() {
    console.log('Current Source: ' + this.player.currentSrc);
  };

  AudioPlayer.prototype.canPlayThroughListener = function() {
    
  };

  AudioPlayer.prototype.timeUpdateListener = function() {
    console.log('Current Time: ' + this.player.currentTime);
  };

  window.AudioPlayer = AudioPlayer;

  window.aud = new AudioPlayer();
}) ();