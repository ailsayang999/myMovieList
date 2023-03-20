const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies";
const POSTER_URL = BASE_URL + "/posters/";
const dataPanel = document.querySelector("#data-panel");
const paginator = document.querySelector("#paginator");
const MOVIES_PER_PAGE = 12;

// get data from localStorage
const favoriteMovieList =
  JSON.parse(localStorage.getItem("favoriteMovies")) || [];


// 即時Render favoriteMovieList裡第一頁的資料
renderMovieList(getMoviesByPage(1));
//render分頁器的長度
renderPaginator(favoriteMovieList.length);



// Add Event Listener to data panel
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    console.log(event.target.dataset.id);
    showMovieModal(event.target.dataset.id);
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id));
  }
});


//pagination標籤上裝上事件監聽器：當你按pagination的頁數時，會重新render每頁該有的資料
paginator.addEventListener('click', function onPaginatorClicked(event){
  //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== "A") return;

  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page);
  //更新畫面
  renderMovieList(getMoviesByPage(page));
})

///////////////////////////////// function area /////////////////////////////////////////

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
          <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
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
}


//Add showMovieModal() to request Show API
function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");
  axios.get(INDEX_URL + "/" + id).then((response) => {
    const data = response.data.results;
    modalTitle.innerText = data.title;
    modalDate.innerText = "Release date: " + data.release_date;
    modalDescription.innerText = data.description;
    modalImage.innerHTML = `<img src="${
      POSTER_URL + data.image
    }" alt="movie-poster" class="img-fluid">`;
  });
}


//remove from Favorite Movie List
function removeFromFavorite(id){
  //錯誤處理:如果收藏清單favoriteMovieList是空的，則return結束這個函式。
  if (!favoriteMovieList || !favoriteMovieList.length) return;

  //找出所要刪除的movie在 favoriteMovieList這個陣列中的index，如果傳入的 id 在收藏清單中不存在則return結束這個函式
  const movieIndex = favoriteMovieList.findIndex((item) => item.id === id);
  if (movieIndex === -1) return;

  //刪除該筆電影
  favoriteMovieList.splice(movieIndex, 1);

  //把更新後的favoriteMovieList，透過直接更改"favoriteMovies"這個key所對應的value，把更新後的favoriteMovieList的資料存到value裡
  localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovieList));

  //即時更新頁面
  renderMovieList(favoriteMovieList);
}


//分頁器：getMoviesByPage，當我輸入頁數時，這個函式要給我這頁的資料 (slice函式不會影響到原本的movies內部資料，而是會切出新的陣列)
function getMoviesByPage(page) {
  //filteredMovies.length ? 是條件，如果filteredMovies為true則return filteredMovies，如果movies為true則return movies。如果搜尋結果有東西，條件判斷為 true ，會回傳 filteredMovies，然後用 data 保存回傳值，有就是「如果搜尋清單有東西，就取搜尋清單 filteredMovies，否則就還是取總清單 movies」
  const data = favoriteMovieList;

  //計算起始 index
  const startIndex = (page - 1) * MOVIES_PER_PAGE;
  //回傳切割後的新陣列
  // return movies.slice(startIndex, startIndex + MOVIES_PER_PAGE);
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE);
}