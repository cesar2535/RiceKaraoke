(function () {
  'use strict';

  var numDisplayLines = 2;

  /**
   *  Playlist Schema:
   *  {
   *    title: '',
   *    artist: '',
   *    src: '*.mp3',
   *    lrc: []
   *  }
   **/


  var AudioPlayer = function (playerId) {
    this.player = undefined;
    this.canPlayFlag = false;
    this.playbackRate = 1;
    this.playlist = [];

    this.show = undefined;
    this.renderInterval = undefined;

    this.timer = undefined;
    this.timeSteps = 100;

    this.currentMediaDuration = 0;
    this.currentMediaTime = 0;
    this.lastMediaTime = 0;


    this.initial(playerId);
  };

  AudioPlayer.prototype.initial = function(playerId) {
    this.player = document.getElementById(playerId);

    if (!this.player)
      throw new Error('No player here!');

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
    // var karaoke = new RiceKaraoke(RiceKaraoke.simpleTimingToTiming(this.playlist[0].lrc));
    // var renderer = new SimpleKaraokeDisplayEngine('karaoke-display', numDisplayLines);
    // this.show = karaoke.createShow(renderer, numDisplayLines);
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
      this.loadMedia();
      this.playMedia();
    } else {
      console.error('No next media');
    }
  };

  AudioPlayer.prototype.incrementMediaTime = function() {
    this.currentMediaTime = this.player.currentTime;
    console.log('Current Time: ' + this.currentMediaTime);
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
    this.currentMediaDuration = this.player.duration;
    this.canPlayFlag = true;
    console.log('Current Source: ' + this.player.currentSrc);

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }

    this.timer = setInterval(this.incrementMediaTime.bind(this), this.timeSteps);

    // if (this.renderInterval)
    //   clearInterval(this.renderInterval);
    // this.renderInterval = setInterval(function () {
    //   if (this.player.currentTime < this.lastMediaTime){
    //     this.show.reset();
    //   }

    //   this.show.render(this.player.currentTime);
    //   this.lastMediaTime = this.player.currentTime;
    // });
  };

  AudioPlayer.prototype.canPlayThroughListener = function() {
    
  };

  AudioPlayer.prototype.timeUpdateListener = function() {
    // this.currentMediaTime = this.player.currentTime;
    // console.log('Current Time: ' + this.currentMediaTime);
  };

  AudioPlayer.prototype.playListener = function() {
    console.log('----- Play Media: ' + this.player.currentSrc + ' -----');
  };

  AudioPlayer.prototype.endedListener = function() {
    console.log('----- Media Ended -----');

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }

    this.nextMedia();
  };

  window.AudioPlayer = AudioPlayer;

  window.aud = new AudioPlayer('audio-player');
}) ();