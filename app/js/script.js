const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies";
const POSTER_URL = BASE_URL + "/posters/";
const movies = [];
let filteredMovies = [];
const dataPanel = document.querySelector("#data-panel");
const paginator = document.querySelector("#paginator");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input"); 
const MOVIES_PER_PAGE = 12;

// axios get INDEX_URL
axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results);
    renderPaginator(movies.length); //把movies裡面item的總數量(amount)帶入
    renderMovieList(getMoviesByPage(1)); //一開始進來時先停留在第一頁
  })
  .catch((err) => console.log(err));


// Add Event Listener to data panel
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    console.log(event.target.dataset.id);
    showMovieModal(event.target.dataset.id);
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});


//Add event listener to paginator
paginator.addEventListener('click', function onPaginatorClicked(event){
  //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== "A") return;

  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page);
  //更新畫面
  renderMovieList(getMoviesByPage(page));
})



//搜尋關鍵字：Add Event Listener to searchForm 
searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  //取消預設事件
  event.preventDefault();
  //取得搜尋關鍵字
  const keyword = searchInput.value.trim().toLowerCase();
  //儲存符合篩選條件的項目
  //條件篩選 (filter裡面是一個function) 當使用者沒有輸入任何關鍵字時，畫面顯示全部電影 ( 在 include () 中傳入空字串，所有項目都會通過篩選）
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );
  //錯誤處理：無符合條件的結果
  if (filteredMovies.length === 0) {
    return window.alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`);
  }

  //重製分頁器
  renderPaginator(filteredMovies.length);
  //重新輸出至畫面
  renderMovieList(getMoviesByPage(1));
});



//renderMovieList function
function renderMovieList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    // title, image
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${
          POSTER_URL + item.image
        }" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${
            item.id
          }">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
        </div>
      </div>
    </div>
  </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}


//Render Pagination
function renderPaginator(amount) {
  //計算總頁數
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE);
  //製作 template
  let rawHTML = "";

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }
  //放回 HTML
  paginator.innerHTML = rawHTML;
  // console.log(paginator)
}



//Add showMovieModal() to request Show API
function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");
  axios.get(INDEX_URL + '/' + id).then((response) => {
    const data = response.data.results;
    modalTitle.innerText = data.title;
    modalDate.innerText = "Release date: " + data.release_date;
    modalDescription.innerText = data.description;
    modalImage.innerHTML = `<img src="${
      POSTER_URL + data.image
    }" alt="movie-poster" class="img-fluid">`;
  });
}


//addToFavorite function: to add favorite movies to localStorage
function addToFavorite(id){
  // 把localStorage裡原本用的資料取出，將 JSON 格式的字串轉回 JavaScript 原生物件，並把資料放到list裡
  //如果localStorage裡面沒有資料則list= []
  const favoriteMovieList =
    JSON.parse(localStorage.getItem("favoriteMovies")) || [];

  //找出movies陣列中，item的id === id的資料，找到後會return這個item放到favMovie
  const favMovie = movies.find((movie) => movie.id === id); //判斷數值
  // console.log("You want to add", favMovie, "to favoriteMovieList"); //印出找到的那筆item

  //看現在要加入的這個favMovie，在原本localStorage的list裡面是否已經有了，.some陣列方法，只要有部分符合，則為 true
  if (favoriteMovieList.some((movie) => movie.id === id)) {
    return alert("此電影已經在收藏清單中！");
  } else alert(`電影:【${favMovie.title}】  \n收藏成功!!!`);

  //更新favoriteMovieList這個Array
  favoriteMovieList.push(favMovie);
  // console.log("the favoriteMovieList now is:", favoriteMovieList);

  //更新localStorage裡favoriteMovies這個key所對應到的新value(也就是更新後的favoriteMovieList)
  localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovieList));
}


//分頁器：getMoviesByPage，當我輸入頁數時，這個函式要給我這頁的資料 (slice函式不會影響到原本的movies內部資料，而是會切出新的陣列)
function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies;

  //計算起始 index
  const startIndex = (page - 1) * MOVIES_PER_PAGE;
  //回傳切割後的新陣列
  // return movies.slice(startIndex, startIndex + MOVIES_PER_PAGE);
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE);
}