// Загрузка новостей из db.json
fetch("db.json")
  .then((response) => response.json())
  .then((data) => {
    const newsData = data.news_container;

    // Функция для получения параметра из URL
    function getQueryParam(param) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    }

    // Функция для отображения контента новости
    function displayNewsContent(newsId) {
      const news = newsData.find((item) => item.id === parseInt(newsId, 10));
      if (news) {
        const newsContent = document.getElementById("news-content");
        newsContent.innerHTML = `
          <div class="specific__news__content__title">
            <div class="specific__news__content__title__title-news">${news.title}</div>
            <div class="specific__news__content__title__date">${news.date}</div>
          </div>
          <div class="specific__news__content__img">
            <img src="${news.img}" alt="${news.title}">
          </div>
          <div class="specific__news__content__text">${news.text}</div>
        `;
      }
    }

    // Получаем ID новости из URL и отображаем контент
    const newsId = getQueryParam("id");
    if (newsId) {
      displayNewsContent(newsId);
    }
  })
  .catch((error) => console.error("Error:", error));

// Функция для отображения контента новости
function displayNewsContent(newsId) {
  const news = newsData.news_container.find(
    (item) => item.id === parseInt(newsId, 10)
  );
  if (news) {
    const newsContent = document.getElementById("news-content");
    newsContent.innerHTML = `
      <div class="specific__news__content__title">
        <div class="specific__news__content__title__title-news">${news.title}</div>
        <div class="specific__news__content__title__date">${news.date}</div>
      </div>
      <div class="specific__news__content__img">
        <img src="${news.img}" alt="${news.title}">
      </div>
      <div class="specific__news__content__text">${news.text}</div>
    `;
  }
}

// Получаем ID новости из URL и отображаем контент
const newsId = getQueryParam("id");
if (newsId) {
  displayNewsContent(newsId);
}
