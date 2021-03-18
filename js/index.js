const URL = "https://api.jikan.moe/v3";

const Status = {
  loading: 0,
  loaded: 1,
  error: 2,
  empty: 3,
};

const Pages = {
  topAnime: 0,
  search: 1,
};

let currentPage = Pages.topAnime;
let currentSearchPage = 1;
let tableBody;
let title;
let searchBox;

let previousButton;
let buttonContainer;

let loading;
let loaded;
let error;
let empty;

window.onload = () => {
  buttonContainer = document.querySelector(".btn-container");
  loading = document.querySelector(".loading");
  empty = document.querySelector(".empty");
  loaded = document.querySelector(".loaded");
  error = document.querySelector(".error");
  previousButton = document.getElementById("previous-button");
  searchBox = document.getElementById("search-box");
  title = document.getElementById("title");
  tableBody = document.getElementById("tableBody");
  
  getTopAnimes(currentSearchPage);
};

async function getTopAnimes(nextPage) {
  hideButtons(false);
  changeStatus(Status.loading);
  changePage(Pages.anime);

  try {
    previousButton.style.display = nextPage == 1 ? "none" : "initial";
    const response = await fetch(`${URL}/top/anime/${nextPage}`);
    const json = await response.json();
    const topAnimes = json.top;
    insertElements(topAnimes);
    changeStatus(Status.loaded);
  } catch (requestError) {
    changeStatus(Status.error);
    console.error(requestError);
  }
}

async function searchAnimes() {
  hideButtons(true);
  changeStatus(Status.loading);
  changePage(Pages.search);
  try {
    const searchQuery = searchBox.value;
    const response = await fetch(`${URL}/search/anime?q=${searchQuery}`);
    const json = await response.json();
    const searchResults = json.results;

    if (json.status == 404) return changeStatus(Status.empty);

    insertElements(searchResults);
    changeStatus(Status.loaded);
  } catch (requestError) {
    changeStatus(Status.error);
    console.error(requestError);
  }
}

function insertElements(animes) {
  tableBody.innerHTML = "";

  for (let anime of animes) {
    const row = tableBody.insertRow(tableBody.rows.length);
    const imageCell = row.insertCell(0);
    const titleCell = row.insertCell(1);
    const rankCell = row.insertCell(2);

    imageCell.innerHTML = `<img class="anime-img" src="${anime.image_url}"/>`;
    titleCell.innerHTML = anime.title;
    rankCell.innerHTML = anime.score;
  }
}

function changeStatus(status) {
  loading.style.display = status == Status.loading ? "flex" : "none";
  loaded.style.display = status == Status.loaded ? "block" : "none";
  error.style.display = status == Status.error ? "flex" : "none";
  empty.style.display = status == Status.empty ? "flex" : "none";
}

function hideButtons(hide) {
  buttonContainer.style.display = !hide ? "flex" : "none";
}

function changePage(page) {
  currentPage = page;
  title.innerHTML = page == Pages.search ? "Search Results" : "Top Animes";
}