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

  AudioPlayer.prototype.addToPlaylist = function(media) {
    if (media) {
      if (Array.isArray(media))
        this.playlist = this.playlist.concat(media);
      else
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
    this.player.addEventListener('loadstart', this.onLoadStartListener.bind(this));
    this.player.addEventListener('durationchange', this.onDurationChangeListener.bind(this));
    this.player.addEventListener('loadedmetadata', this.onLoadedMetadataListener.bind(this));
    this.player.addEventListener('loadeddata', this.onLoadedDataListener.bind(this));
    this.player.addEventListener('progress', this.onProgressListener.bind(this));
    this.player.addEventListener('canplay', this.onCanPlayListener.bind(this));
    this.player.addEventListener('canplaythrough', this.onCanPlayThroughListener.bind(this));
    // Loading process Ended

    this.player.addEventListener('timeupdate', this.onTimeUpdateListener.bind(this));
    this.player.addEventListener('play', this.onPlayListener.bind(this));
    this.player.addEventListener('pause', this.onPauseListener.bind(this));
    this.player.addEventListener('ended', this.onEndedListener.bind(this));
  };

  AudioPlayer.prototype.onLoadStartListener = function() {
    console.info('----- load start -----');
  };

  AudioPlayer.prototype.onDurationChangeListener = function() {
    console.info('----- duration change -----');
  };

  AudioPlayer.prototype.onLoadedMetadataListener = function() {
    console.info('----- loaded metadata -----');
  };

  AudioPlayer.prototype.onLoadedDataListener = function() {
    console.info('----- loaded data -----');
  };

  AudioPlayer.prototype.onProgressListener = function() {
    console.info('----- progress -----');
  };

  AudioPlayer.prototype.onCanPlayListener = function() {
    this.canPlayFlag = true;
    this.currentMediaDuration = this.player.duration;
    console.log('Current Source: ' + this.player.currentSrc);

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

  AudioPlayer.prototype.onCanPlayThroughListener = function() {
    
  };

  AudioPlayer.prototype.onTimeUpdateListener = function() {
    // this.currentMediaTime = this.player.currentTime;
    // console.log('Current Time: ' + this.currentMediaTime);
  };

  AudioPlayer.prototype.onPlayListener = function() {
    console.log('----- Play Media: ' + this.player.currentSrc + ' -----');
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }

    this.timer = setInterval(this.incrementMediaTime.bind(this), this.timeSteps);
  };

  AudioPlayer.prototype.onPauseListener = function() {
    console.info('----- pause -----');
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }

  };

  AudioPlayer.prototype.onEndedListener = function() {
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