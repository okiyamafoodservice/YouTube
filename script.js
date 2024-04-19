// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
let player;
let youtubeId = "MbO5hcQuJaQ";

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "100%",
    width: "100%",
    videoId: youtubeId,
    playerVars: {
      //③パラメータの設定
      playsinline: 1,
      controls: 0,
    },
    events: {
      onReady: onPlayerReady,
      //onStateChange: onPlayerStateChange,
    },
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo(); //①最初の再生を止める
  let currentVol = 5; //②最初のボリュームを設定（0〜100）
  event.target.setVolume(currentVol); //③Playerのボリュームに設定
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}
function stopVideo() {
  player.stopVideo();
}

// select要素の値が変わったときに動画を切り替える
const movieID = document.getElementById("MovieId");
document.getElementById("MovieId").addEventListener("change", function () {
  const selectedVideo = this.value;
  if (selectedVideo) {
    player.loadVideoById(selectedVideo);
  }
});

// 再生・一時停止
document.getElementById("play-pause").addEventListener("click", function () {
  const playerState = player.getPlayerState();
  if (playerState === YT.PlayerState.PLAYING) {
    player.pauseVideo();
  } else if (playerState === YT.PlayerState.PAUSED) {
    player.playVideo();
  }
});

const onMuteBtn = document.querySelector(".onMuteBtn");

document.getElementById("mute").addEventListener("click", function () {
  if (player.isMuted()) {
    player.unMute();
    mute.src = "./images/unmute.svg";
  } else {
    player.mute();
    mute.src = "./images/mute.svg";
  }
});

// 早送り・巻き戻し 長押しで早送りまたは巻き戻し

let pressTimer;
let rewindInterval;

document.getElementById("do10sNext").addEventListener("mousedown", function () {
  pressTimer = window.setTimeout(function () {
    player.setPlaybackRate(10.0); // 4倍速再生
  }, 500); // 長押しと判断するまでの時間（ミリ秒）
});

document.getElementById("do10sNext").addEventListener("mouseup", function () {
  clearTimeout(pressTimer); // 長押しタイマーをクリア
  player.setPlaybackRate(1.0); // 通常速度に戻す
});

document.getElementById("do10sPrev").addEventListener("mousedown", function () {
  pressTimer = window.setTimeout(function () {
    player.setPlaybackRate(1.0); // 通常速度に戻す
    rewindInterval = setInterval(function () {
      let currentTime = player.getCurrentTime();
      player.seekTo(currentTime - 1); // 1秒巻き戻す
    }, 100); // 0.1秒ごとに巻き戻す
  }, 500); // 長押しと判断するまでの時間（ミリ秒）
});

document.getElementById("do10sPrev").addEventListener("mouseup", function () {
  clearTimeout(pressTimer); // 長押しタイマーをクリア
  clearInterval(rewindInterval); // 巻き戻しを停止
});

// 再生10秒スキップ

document.getElementById("do10sNext").addEventListener("click", function () {
  const currentTime = player.getCurrentTime();
  player.seekTo(currentTime + 10);
});

document.getElementById("do10sPrev").addEventListener("click", function () {
  const currentTime = player.getCurrentTime();
  player.seekTo(currentTime - 10);
});

let longpressTimer;
let volumeDownInterval;
const volume = document.querySelector(".volume");

document.querySelector(".play").addEventListener("click", function () {
  let currentVolume = player.getVolume();
  if (currentVolume < 100) {
    player.setVolume(currentVolume + 5); // 音量を5%上げる
  }
});

volume.addEventListener("click", function () {
  let currentVolume = player.getVolume();
  if (currentVolume > 0) {
    player.setVolume(currentVolume - 5); // 音量を5%下げる
  }
});

// 動画の再生位置をシークバーに反映
function updateSeekbar() {
  const duration = player.getDuration();
  const currentTime = player.getCurrentTime();
  const percentage = (currentTime / duration) * 100;
  document.getElementById("seekbar").value = percentage;
}

// シークバーの値を動画の再生位置に反映
document.getElementById("seekbar").addEventListener("input", function () {
  const duration = player.getDuration();
  const seekToTime = (this.value / 100) * duration;
  player.seekTo(seekToTime);
});

// 動画が再生されている間、シークバーを定期的に更新
let seekbarInterval = setInterval(updateSeekbar, 1000); // 1秒ごとに更新

// 検索
const selectvideo = document.querySelector(".searchlist");
//検索して、値を取得する関数
function ytSearch(val) {
  const key = "AIzaSyDBWgVJ1fwxCAClPI5qmZ-a7sX2EA_OT34"; //自分のキーに書き換えます。
  const num = 100;
  const part = "snippet";
  const type = "video";
  const query = val;
  fetch(
    `https://www.googleapis.com/youtube/v3/search?type=${type}&part=${part}&maxResults=${num}&key=${key}&q=${query}&playsinline=1`
  )
    .then((data) => data.json())
    .then((obj) => {
      selectvideo.innerHTML = "";
      for (let i in obj["items"]) {
        //各videoIdとタイトルを取得して変数に代入
        const ytId = obj["items"][i]["id"]["videoId"];
        const ytTitle = obj["items"][i]["snippet"]["title"];
        //optionを作成して、videoIdとtitleを所定の場所に設置し、要素を追加していく。
        const optionTag = document.createElement("option");
        optionTag.textContent = ytTitle;
        optionTag.setAttribute("value", ytId);
        selectvideo.appendChild(optionTag);
      }
    });
}

const ytSearchBtn = document.querySelector("#searchBtn");
ytSearchBtn.addEventListener("click", function (e) {
  const ytSearchVal = document.querySelector("#ytSearch").value;
  e.preventDefault(); //検索ボタンの送信をストップしておく。
  //ytSearch関数を呼び出す。
  ytSearch(ytSearchVal);
});

const options = document.querySelectorAll("option");
options.forEach((option) => {
  console.log(options.value);
});
