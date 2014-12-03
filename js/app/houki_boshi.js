//<![CDATA[
var numDisplayLines = 2; // Number of lines to do the karaoke with
var timings = [
  [7.2, 10.77, [
    [0, "yo"],
    [0.34, "zo"],
    [0.64, "ra "],
    [0.91, "o "],
    [1.23, "mi"],
    [1.48, "a"],
    [1.78, "ge "],
    [2.08, "hi"],
    [2.48, "to"],
    [2.96, "ri"]
  ]],
  [10.79, 13.82, [
    [0, "ho"],
    [0.21, "u"],
    [0.55, "ki"],
    [0.77, "boshi "],
    [1.32, "o "],
    [1.79, "mita "],
    [2.5, "no"]
  ]],
  [13.85, 16.85, [
    [0, "ima"],
    [0.41, "sugu "],
    [0.99, "a"],
    [1.34, "ita"],
    [2.05, "i "],
    [2.58, "yo"]
  ]],
  [16.87, 20.34, [
    [0, "dakedo "],
    [0.84, "sora "],
    [1.43, "wa "],
    [1.85, "to"],
    [2.04, "be"],
    [2.35, "na"],
    [2.66, "i "],
    [2.98, "kara"]
  ]],
  [20.47, 25.35, [
    [0, "moshi "],
    [0.41, "a"],
    [0.63, "ta"],
    [1.84, "shi "],
    [2.12, "ga "],
    [3.02, "h"],
    [3.42, "ou"],
    [4.4, "ki"],
    [4.63, "boshi"]
  ]],
  [25.39, 28.14, [
    [0, "ni "],
    [0.31, "nareta "],
    [1.25, "nara"],
    [1.86, "ba"]
  ]],
  [28.14, 33.04, [
    [0, "so"],
    [0.39, "ra "],
    [0.63, "ka"],
    [0.81, "ke"],
    [1.17, "nu"],
    [1.44, "ke "],
    [1.81, "ton"],
    [2.21, "de "],
    [2.73, "iku "],
    [3.57, "ki"],
    [4.32, "tto"]
  ]],
  [33.22, 40.59, [
    [0, "ka"],
    [0.2, "na"],
    [1.4, "ra"],
    [1.75, "zu "],
    [2.86, "todo"],
    [3.31, "ku "],
    [3.91, "kono "],
    [4.52, "isshun "],
    [5.32, "no "],
    [5.8, "hikari "],
    [6.39, "de"]
  ]],
  [40.72, 45.58, [
    [0, "anata "],
    [0.63, "no "],
    [1.1, "ima "],
    [1.57, "terashi "],
    [2.15, "sora "],
    [2.76, "o "],
    [3.53, "meguru "],
    [4.31, "wa"]
  ]],
  [45.62, 50.11, [
    [0, "a"],
    [0.23, "ta"],
    [1.48, "shi "],
    [1.75, "ga "],
    [2.89, "hou"],
    [3.97, "ki"],
    [4.25, "boshi"]
  ]],
  [50.15, 52.9, [
    [0, "ni "],
    [0.31, "nareta "],
    [1.21, "nara"],
    [1.86, "ba"]
  ]],
  [53.12, 56.69, [
    [0, "kito "],
    [0.54, "soba "],
    [1.22, "ni "],
    [1.84, "ite "],
    [2.18, "a"],
    [2.45, "ge"],
    [2.75, "ru"]
  ]],
  [56.7, 58.64, [
    [0, "do"],
    [0.42, "nna "],
    [1.02, "toki "],
    [1.48, "mo"]
  ]]
];
var musicFilename = 'houki_boshi';
var musicPath = 'karaoke/' + musicFilename + '.mp3';

var isScrubbing = false;
var wasPaused = false;
var show = null;
var player = null;
var scrubber = null;
var lastPosition = 0;

function getTimeString(t) {
  var min = Math.floor(t / 60);
  var secs = Math.floor(t % 60);
  return min + ':' + (secs < 10 ? '0' : '') + secs;
}

function changePosition(percent) {
  if (player != null) {
    var duration = player.loaded ? player.duration : player.durationEstimate;
    var position = duration * percent / 100;
    player.setPosition(position);
  }
}

function updateControls() {
  if (isScrubbing) {
    $('#play-button').attr('disabled', 'disabled');
  } else {
    $('#play-button').removeAttr('disabled');
  }

  if (player.paused) {
    $('#play-button').html('<img src="assets/images/play.png" alt="Play" />');
  } else {
    $('#play-button').html('<img src="assets/images/pause.png" alt="Pause" />');
  }

  updateStatus();
}

function updateStatus() {
  var duration = player.loaded ? player.duration : player.durationEstimate;
  $('#status').text(getTimeString(player.position / 1000) + ' / ' +
    getTimeString(duration / 1000));
}

function setup() {
  $('#loading-dialog').hide();
  $('#player').show();
  $('#play-button').click(function(e) {
    player.togglePause();
  });

  updateControls();
}

function init() {
  // Create the karaoke engine and get a show instance
  var karaoke = new RiceKaraoke(RiceKaraoke.simpleTimingToTiming(timings));
  var renderer = new SimpleKaraokeDisplayEngine('karaoke-display', numDisplayLines);
  show = karaoke.createShow(renderer, numDisplayLines);

  $('#loading-message').text("Initial buffering, please wait...");

  // Create the scrubber
  scrubber = $("#scrubber").slider({
    max: 100,
    min: 0,
    step: .001,
    start: function(event, ui) {
      isScrubbing = true;
      wasPaused = player.paused;
      player.pause();
    },
    stop: function(event, ui) {
      changePosition(ui.value);
      isScrubbing = false;
      if (!wasPaused) {
        player.resume();
      }
    },
    slide: function(event, ui) {
      changePosition(ui.value);
    }
  });

  // Create sound player
  player = soundManager.createSound({
    id: 'karaokeSound',
    url: musicPath,
    volume: 100,
    stream: true,
    autoPlay: true,
    onload: function(success) {
      if (this.readyState == 2) {
        alert('Failed to play the music file!');
      }
    },
    onstop: function() {
      updateControls();
    },
    onpause: function() {
      updateControls();
    },
    onresume: function() {
      updateControls();
    },
    onfinish: function() {
      this.play();
      this.pause();
      this.setPosition(0);
      updateControls();
    },
    whileplaying: function(e, p) {
      if (this.position < lastPosition) {
        show.reset();
      }

      if (!isScrubbing) {
        var duration = this.loaded ? this.duration : this.durationEstimate;
        scrubber.slider('value', this.position / duration * 100);
      }

      show.render(this.position / 1000, isScrubbing);
      updateStatus();
      lastPosition = this.position;
    }
  });

  setup();
}

$('#loading-message').text("Loading, please wait...");

// Start up the music
soundManager.url = 'assets/';
soundManager.onerror = function() {
  alert('SoundManager failed to load!');
}
soundManager.onload = function() {
  init();
}

/*
var i = 6.0;
var limit = 65;
var interval;
interval = setInterval(function() {
    if (i > limit) {
        clearInterval(interval);
    }
    i += .05;
    show.render(i);
    //console.debug(i);
}, .05*1000);
*/
//]]>
