const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies";
const POSTER_URL = BASE_URL + "/posters/";
const dataPanel = document.querySelector("#data-panel");

// get data from localStorage
const favoriteMovieList =
  JSON.parse(localStorage.getItem("favoriteMovies")) || [];


renderMovieList(favoriteMovieList);



// Add Event Listener to data panel
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    console.log(event.target.dataset.id);
    showMovieModal(event.target.dataset.id);
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id));
  }
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
          <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
        </div>
      </div>
    </div>
  </div>`;
  });
  dataPanel.innerHTML = rawHTML;
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