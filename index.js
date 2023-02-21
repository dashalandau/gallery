const API = "https://api.flickr.com/services/rest/?";
const API_KEY = "b9b865a7a966d097e5e8073a81b39a83";
const USER_ID = "155573498@N02";
const PER_PAGE = 50;
const COLS = 5;
const arr = [];

document.addEventListener("DOMContentLoaded", async () => {
  await getPhotos();
  arr[0].focus();
});

const updatePage = () => {
  let currentPage = 1;

  return () => {
    currentPage++;
    return currentPage;
  };
};

const getPage = updatePage();

async function getPhotos(page = 1, per_page = PER_PAGE) {
  const payload = {
    api_key: API_KEY,
    user_id: USER_ID,
    method: "flickr.favorites.getPublicList",
    extras: "url_q",
    format: "json",
    nojsoncallback: 1,
    per_page: per_page,
    page: page,
  };

  let request = await fetch(API + new URLSearchParams(payload));
  let obj = await request.json();
  let photos = obj.photos.photo;

  if (page === 2) {
    photos.splice(0, 10);
  }

  renderPhoto(photos);
}

function renderPhoto(photos) {
  photos.forEach((photo, i) => {
    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("img-wrap");

    const image = document.createElement("img");
    image.src = photo.url_q;
    image.alt = photo.title;

    imgWrapper.appendChild(image);
    const lastTabIndex =
      arr.length > 0
        ? Number(arr[arr.length - 1].getAttribute("tabindex"))
        : -1;
    imgWrapper.setAttribute("tabindex", lastTabIndex + 1);
    document.querySelector(".conteiner").appendChild(imgWrapper);

    arr.push(imgWrapper);
  });
}

document.onkeydown = keyHandler;

function keyHandler(e) {
  let currentIndex = Number(document.activeElement.tabIndex);

  switch (e.code) {
    case "ArrowRight":
      currentIndex = currentIndex + 1;
      break;
    case "ArrowDown":
      currentIndex = Math.min(currentIndex + COLS, arr.length - 1);
      break;
    case "ArrowLeft":
      currentIndex = Math.max(currentIndex - 1, 0);
      break;
    case "ArrowUp":
      currentIndex = currentIndex - COLS;
      break;
    case "Tab":
      return false;
  }

  if (loadMoreImage(currentIndex)) {
    getPhotos(getPage(), 40);
  }

  // e.preventDefault();
  arr[currentIndex].focus();
  arr[currentIndex].scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

function loadMoreImage(currentIndex) {
  const limit = arr.length - COLS * 2;

  return currentIndex >= limit;
}
