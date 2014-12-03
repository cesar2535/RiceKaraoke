(function () {
  'use strict';

  var AudioPlayer = function () {
    this.player = document.getElementById('audio-player');
    this.canPlayFlag = false;
    this.playbackRate = 1;
    this.playlist = [];


    this.initializeAudioEvent();
  };

  AudioPlayer.prototype.AddToPlaylist = function(media) {
    if (media) {
      this.playlist.push(media);
    }
  };

  AudioPlayer.prototype.loadMedia = function() {
    this.player.src = this.playlist[0];
    this.player.load();
  };

  AudioPlayer.prototype.playMedia = function() {
    if (this.playlist.length <= 0) {
      console.error('Playlist is empty');
      return;
    }

    if (!this.canPlayFlag) {
      console.error('No media data');
      return;
    }
    this.player.play();
  };

  AudioPlayer.prototype.nextMedia = function() {
    if (this.playlist.length <= 0) {
      console.error('Playlist is empty');
      return;
    }

    this.playlist.shift();

    if (this.playlist[0]) {
      this.player.src = this.playlist[0];
      this.player.load();
      this.playMedia();
    } else {
      console.error('No next media');
    }
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
    this.player.addEventListener('play', this.playListener.bind(this));
    this.player.addEventListener('ended', this.endedListener.bind(this));
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
    this.canPlayFlag = true;
    console.log('Current Source: ' + this.player.currentSrc);
  };

  AudioPlayer.prototype.canPlayThroughListener = function() {
    
  };

  AudioPlayer.prototype.timeUpdateListener = function() {
    console.log('Current Time: ' + this.player.currentTime);
  };

  AudioPlayer.prototype.playListener = function() {
    console.log('----- Play Media: ' + this.player.currentSrc + ' -----');
  };

  AudioPlayer.prototype.endedListener = function() {
    console.log('----- Media Ended -----');
    this.nextMedia();
  };

  window.AudioPlayer = AudioPlayer;

  window.aud = new AudioPlayer();
}) ();