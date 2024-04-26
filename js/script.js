const onMuteBtn = document.querySelector(".onMuteBtn");
const screenMenu = document.querySelector(".screen__menu");
const movieID = document.getElementById("MovieId");

const playPauseBtn = document.getElementById("play-pause");
const volume = document.querySelector(".volume");
const playBtn = document.querySelector(".play");
const seekbar = document.getElementById("seekbar");
const ytSearchBtn = document.querySelector("#searchBtn");

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
  let currentVol = 30; //②最初のボリュームを設定（0〜100）
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
movieID.addEventListener("click", function (event) {
  const selectedVideo = event.target.getAttribute("data-value");
  if (selectedVideo) {
    player.loadVideoById(selectedVideo);
  }
});

// 検索
const selectvideo = document.querySelector(".searchlist");
//検索して、値を取得する関数
function ytSearch(val) {
  const key = "AIzaSyDFzM2GTuzXLzvFtC3-89Vvsm8dekYY3_Y"; //自分のキーに書き換えます。
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
        // サムネイルURLを取得
        const ytThumbnail =
          obj["items"][i]["snippet"]["thumbnails"]["default"]["url"];
        //liを作成して、videoIdとtitleを所定の場所に設置し、要素を追加していく。
        const liTag = document.createElement("li");
        // サムネイルとタイトルを追加
        liTag.innerHTML = `<img src="${ytThumbnail}" alt="${ytTitle}">${ytTitle}`;
        liTag.setAttribute("data-value", ytId);
        liTag.classList.add("searchlist__content");
        selectvideo.appendChild(liTag);

        liTag.addEventListener("click", function () {
          screenMenu.classList.remove("displayblock");
        });
      }
    });
}

const searchlistContent = document.querySelectorAll(".searchlist__content");

// seachlistContentの要素がクリックされたときに、screenMenuを非表示にする
searchlistContent.forEach(function (item) {
  item.addEventListener("click", function () {
    screenMenu.classList.remove("displayblock");
  });
});

// "do10sNext"というIDを持つ要素にクリックイベントリスナーを追加
document.getElementById("do10sNext").addEventListener("click", function () {
  // select要素から選択された動画のIDを取得
  const selectedVideo = movieID.value;
  // 選択された動画のIDが存在する場合
  if (selectedVideo) {
    // 選択された動画を読み込む
    player.loadVideoById(selectedVideo);
  }
});

// 再生・一時停止
playPauseBtn.addEventListener("click", function () {
  const playerState = player.getPlayerState();
  if (playerState === YT.PlayerState.PLAYING) {
    player.pauseVideo();
  } else if (playerState === YT.PlayerState.PAUSED) {
    player.playVideo();
  }
});

//次の動画へ

const videoNextBtn = document.getElementById("do10sNext");
const videoPrevBtn = document.getElementById("do10sPrev");

// 次の動画へ
let currentIndex = 0; // グローバル変数として現在のインデックスを追跡

document.getElementById("do10sNext").addEventListener("click", function () {
  const listItems = document.querySelectorAll("#MovieId li");

  // 次のインデックスを計算
  currentIndex = (currentIndex + 1) % listItems.length;

  // 選択された動画を読み込む
  const videoId = listItems[currentIndex].dataset.value;
  if (videoId) {
    player.loadVideoById(videoId);
  }
});

let holdTimer;

videoNextBtn.addEventListener("mousedown", function () {
  holdTimer = window.setInterval(function () {
    // ここで10秒早送りする処理を書く
    const currentTime = player.getCurrentTime();
    player.seekTo(currentTime + 10);
  }, 1000); // 1000ミリ秒（1秒）ごとに発火
});

videoNextBtn.addEventListener("mouseup", function () {
  clearInterval(holdTimer); // ボタンを離したときにタイマーをクリア
});

videoNextBtn.addEventListener("mouseup", function () {
  clearInterval(holdTimer); // ボタンを離したときにタイマーをクリア
});

//前の動画へ
videoPrevBtn.addEventListener("click", function () {
  const listItems = document.querySelectorAll("#MovieId li");

  // 前のインデックスを計算
  currentIndex = (currentIndex - 1 + listItems.length) % listItems.length;

  // 選択された動画を読み込む
  const videoId = listItems[currentIndex].dataset.value;
  if (videoId) {
    player.loadVideoById(videoId);
  }
});

onMuteBtn.addEventListener("click", function () {
  screenMenu.classList.toggle("displayblock");

  if (screenMenu.classList.contains("displayblock")) {
    player.pauseVideo(); // 動画を一時停止
  } else {
    player.playVideo(); // 動画を再生
  }
});

let longpressTimer;
let volumeDownInterval;

// 動画の再生位置をシークバーに反映
function updateSeekbar() {
  const duration = player.getDuration();
  const currentTime = player.getCurrentTime();
  const percentage = (currentTime / duration) * 100;
  document.getElementById("seekbar").value = percentage;
}

// シークバーの値を動画の再生位置に反映

seekbar.addEventListener("input", function () {
  const duration = player.getDuration();
  const seekToTime = (this.value / 100) * duration;
  player.seekTo(seekToTime);
});

// 動画が再生されている間、シークバーを定期的に更新
let seekbarInterval = setInterval(updateSeekbar, 1000); // 1秒ごとに更新

ytSearchBtn.addEventListener("click", function (e) {
  const ytSearchVal = document.querySelector("#ytSearch").value;
  e.preventDefault(); //検索ボタンの送信をストップしておく。
  //ytSearch関数を呼び出す。
  ytSearch(ytSearchVal);
});

//nextBtnを押した場合の処理

document.getElementById("changeBtn").addEventListener("click", function () {});

document.getElementById("backBtn").addEventListener("click", function () {});

searchBtn.addEventListener("click", function () {
  screenMenu.classList.add("displayblock");
  if (screenMenu.classList.contains("displayblock")) {
    player.pauseVideo(); // 動画を一時停止
  } else {
    player.playVideo(); // 動画を再生
  }
});

searchBtn.addEventListener("click", function () {
  if (screenMenu.classList.contains("displayblock")) {
    removeClass("displayblock");
  } else {
    player.playVideo(); // 動画を再生
  }
});
