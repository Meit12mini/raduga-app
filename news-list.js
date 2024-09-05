let currentPage = 1;
const itemsPerPage = 12;
let allNewsData = [];
let newsDisplayed = 0;

async function getResponseAndPopulate() {
  const sectionsData = {
    news_container: await fetchData("http://localhost:3000/news_container"),
  };
  allNewsData = sectionsData.news_container;
  newsDisplayed = 9; // Установить количество новостей, уже отображенных на странице
}

async function fetchData(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

function displayNews() {
  const start = newsDisplayed;
  const end = start + itemsPerPage;
  const newsToDisplay = allNewsData.slice(start, end);

  const newsHTML = newsToDisplay
    .map(
      (newsItem) => `<a href="new__concret.html?id=${
        newsItem.id
      }" class="news__content__item">
        <img class="news__content__img" src="${newsItem.img}" />
        <div class="news__content__title">${newsItem.title}</div>
        <div class="news__content__date">${newsItem.date}</div>
        <div class="news__content__text">${unescape(newsItem.text)}</div>
      </a>`
    )
    .join("");

  document.querySelector(".news__content").innerHTML += newsHTML;

  newsDisplayed += newsToDisplay.length; // Увеличить количество новостей, уже отображенных на странице

  // Проверка, есть ли еще новости для загрузки
  if (newsDisplayed >= allNewsData.length) {
    document.querySelector(".button__page").style.display = "none";
    const noMoreNewsText = document.createElement("p");
    noMoreNewsText.classList.add("not-update");
    noMoreNewsText.textContent = "Новостей больше нет";
    document.querySelector(".news__update").appendChild(noMoreNewsText);
  }
}

document.querySelector(".button__page").addEventListener("click", () => {
  displayNews();
});

getResponseAndPopulate();
