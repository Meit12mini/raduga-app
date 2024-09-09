async function getResponseAndPopulate() {
  const sectionsData = {
    main_wabpage: await fetchData("http://localhost:3000/main_wabpage"),
    news_container: await fetchData("http://localhost:3000/news_container"),
    price_list: await fetchData("http://localhost:3000/price_list"),
    raduga: await fetchData("http://localhost:3000/raduga"),
    svedeniya_obrazovatel_uchrezhdenii: await fetchData(
      "http://localhost:3000/svedeniya_obrazovatel_uchrezhdenii"
    ),
    teachers_list: await fetchData("http://localhost:3000/teachers_list"),
    obrazovat_standart: await fetchData(
      "http://localhost:3000/obrazovat_standart"
    ),
    mtooop: await fetchData("http://localhost:3000/mtooop"),
    fin_hoz: await fetchData("http://localhost:3000/fin_hoz"),
    dostyp_sreda: await fetchData("http://localhost:3000/dostyp_sreda"),
    vocantnie_mesta: await fetchData("http://localhost:3000/vocantnie_mesta"),
    mesh_narod_sotryd: await fetchData(
      "http://localhost:3000/mesh_narod_sotryd"
    ),
    obrazovanie: await fetchData("http://localhost:3000/obrazovanie"),
    soyoo: await fetchData("http://localhost:3000/soyoo"),
    guidance: await fetchData("http://localhost:3000/guidance"),
    document: await fetchData("http://localhost:3000/document"),
  };

  const sections = {
    "slider__content-sw": {
      syntax: (item) =>
        item.banner
          .map((bannerItem, index) => {
            const displayStyle = index === 0 ? "flex" : "none";
            return `<div class="slider__item" style="display: ${displayStyle}">
              <div class="slider__item__content">
                <div class="slider__item__text">
                  ${bannerItem.title}
                </div>
                <div class="slider__item__buttom" style="">
                  <div class="slider__item__buttom__prev">&#10094;</div>
                  <div class="slider__item__buttom__next">&#10095;</div>
                </div>
              </div>
              <img class="slider__item__img ps" src="${bannerItem.image}" />
            </div>`;
          })
          .join(""),
      data: sectionsData.main_wabpage.map((item) => ({
        banner: item.banner,
      })),
    },

    "swiper-wrapper": {
      syntax: (item) =>
        item.banner_mobile
          .map(
            (banner_mobileItem) =>
              `<div class="swiper-slide" style="width: 100%; margin-right: 30px;" role="group" aria-label="NaN / 2">
            <div class="slider__item-sw">
              <div class="slide-text">${banner_mobileItem.title}</div>
              <img class="slider__item__img" src="banner_mob 2.png" />
            </div>
          </div>`
          )
          .join(""),
      data: sectionsData.main_wabpage.map((item) => ({
        banner_mobile: item.banner_mobile,
      })),
    },
    fd: {
      syntax: (item) =>
        `<div class="raduga-info__title">${item.raduga_info.title}</div>
          <div class="raduga-info">
            <div class="raduga-info__text">
              <div class="raduga-info__text__title">${item.raduga_info.title}</div>
              <div class="raduga-info__text__main">
                ${item.raduga_info.text}
              </div>
            </div>
            <img class="raduga-info__img" src="${item.raduga_info.img}" />
          </div>`,
      data: sectionsData.main_wabpage.map((item) => ({
        raduga_info: item.raduga_info,
      })),
    },
    news__scroll: {
      syntax: (item) =>
        item.news
          .slice(0, 9)
          .map(
            (newsItem) => `
            <a href="new__concret.html?id=${
              newsItem.id
            }" class="news__scroll__item">
              <img class="news__scroll__img" src="${newsItem.img}" />
              <div class="news__scroll__title">${newsItem.title}</div>
              <div class="news__scroll__date">${newsItem.date}</div>
              <div class="news__scroll__text">
                ${unescape(newsItem.text)}
              </div>
            </a>
            `
          )
          .join(""),
      data: sectionsData.news_container.slice(0, 9).map((newsItem) => ({
        news: [newsItem],
      })),
    },
    news__content: {
      syntax: (item) =>
        item.news
          .slice(0, 9)
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
          .join(""),
      data: sectionsData.news_container.slice(0, 9).map((newsItem) => ({
        news: [newsItem],
      })),
    },
    "price-conteiner__price-list": {
      syntax: (item) =>
        `<div class="price-conteiner__price-list__main-text">${item.main_text}</div>
      <div class="price-conteiner__price-list__table">${item.table_text}</div>
      <div class="price-conteiner__price-list__conclusion">${item.conclusion}</div>
      `,

      data: sectionsData.price_list.map((item) => ({
        main_text: item.main_text,
        table_text: item.table_text,
        conclusion: item.conclusion,
      })),
    },
    "raduga-conteiner__main": {
      syntax: (item) =>
        `<div class="raduga-conteiner__main__top">${item.main_text_raduga
          .replace(/\\/g, "")
          .replace(/\[/g, "")
          .replace(/\]/g, "")}</div>
      <div class="raduga-conteiner__main__img"><img src="${item.img}"></div>
      <div class="raduga-conteiner__main__total">${item.conclusion_raduga
        .replace(/\\/g, "")
        .replace(/\[/g, "")
        .replace(/\]/g, "")}</div>
      `,

      data: sectionsData.raduga.map((item) => ({
        main_text_raduga: item.main_text_raduga,
        img: item.img,
        conclusion_raduga: item.conclusion_raduga,
      })),
    },
    "sved-conteiner__main": {
      syntax: (item) =>
        `<div class="sved-conteiner__main__top">${item.sved_text
          .replace(/\\/g, "")
          .replace(/\[/g, "")
          .replace(/\]/g, "")}</div>
  
      `,

      data: sectionsData.svedeniya_obrazovatel_uchrezhdenii.map((item) => ({
        sved_text: item.sved_text,
      })),
    },
    "teacher__teacher-content__scroll": {
      syntax: (item) =>
        `<div
                    class="teacher__teacher-content__scroll__item"
                    data-id="${item.id}"
                    data-structure="${item.teachers_structure}"
                    style="
                      display: inline-block;
                      width: 200px;
                      margin-right: 10px;
                    "
                  
                    <div  data-id="${item.id}" class="teacher__teacher-content__scroll__item__img">
                      <img  data-id="${item.id}" style="width: 150px; box-sizing: border-box;
  border: 4px solid rgba(220, 149, 84, 0.8);
  border-radius: 50%;" src="${item.img}" />
                    </div>
                  </div>`,

      data: sectionsData.teachers_list.map((item) => ({
        teachers_structure: item.teachers_structure,
        img: item.img,
        id: item.id,
      })),
    },
    "obrazovat_standart-conteiner__main": {
      syntax: (item) =>
        `<div class="obrazovat_standart-conteiner__main__text">${item.obraz_stand_text
          .replace(/\\/g, "")
          .replace(/\[/g, "")
          .replace(/\]/g, "")}</div>
  
      `,

      data: sectionsData.obrazovat_standart.map((item) => ({
        obraz_stand_text: item.obraz_stand_text,
      })),
    },
    "mtooop-conteiner__main": {
      syntax: (item) =>
        `<div class="mtooop-conteiner__main__text">${item.mtooop_text
          .replace(/\\/g, "")
          .replace(/\[/g, "")
          .replace(/\]/g, "")}</div>
  
      `,

      data: sectionsData.mtooop.map((item) => ({
        mtooop_text: item.mtooop_text,
      })),
    },
    "fin__hoz-conteiner__main": {
      syntax: (item) =>
        `<div class="fin__hoz-conteiner__main__text">${item.fin_hoz_text
          .replace(/\\/g, "")
          .replace(/\[/g, "")
          .replace(/\]/g, "")}</div>
  
      `,

      data: sectionsData.fin_hoz.map((item) => ({
        fin_hoz_text: item.fin_hoz_text,
      })),
    },
    "dostup-sreda-conteiner__main": {
      syntax: (item) =>
        `<div class="dostyp_sreda-conteiner__main__text">${item.dostyp_sreda_text
          .replace(/\\/g, "")
          .replace(/\[/g, "")
          .replace(/\]/g, "")}</div>
  
      `,

      data: sectionsData.dostyp_sreda.map((item) => ({
        dostyp_sreda_text: item.dostyp_sreda_text,
      })),
    },
    "vocantnie_mesta-conteiner__main": {
      syntax: (item) =>
        `<div class="vocantnie_mesta__main__text">${item.mesta_text
          .replace(/\\/g, "")
          .replace(/\[/g, "")
          .replace(/\]/g, "")}</div>
          <div class="vocantnie_mesta__main__text">${item.mesta_table
            .replace(/\\/g, "")
            .replace(/\[/g, "")
            .replace(/\]/g, "")}</div>
  
      `,

      data: sectionsData.vocantnie_mesta.map((item) => ({
        mesta_text: item.mesta_text,
        mesta_table: item.mesta_table,
      })),
    },
    "meshnarod-conteiner__main": {
      syntax: (item) =>
        `<div class="meshnarod-conteiner__main__text">${item.mesh_narod_text
          .replace(/\\/g, "")
          .replace(/\[/g, "")
          .replace(/\]/g, "")}</div>
          `,

      data: sectionsData.mesh_narod_sotryd.map((item) => ({
        mesh_narod_text: item.mesh_narod_text,
      })),
    },
    "obrazovanie-conteiner__main": {
      syntax: (item) =>
        `<div class="obrazovanie-conteiner__main__text">${item.obrazovanie_text}</div>
      `,

      data: sectionsData.obrazovanie.map((item) => ({
        obrazovanie_text: item.obrazovanie_text,
      })),
    },
    "soyoo-conteiner__main": {
      syntax: (item) =>
        `<div class="soyoo-conteiner__main__text">${item.soyoo_text
          .replace(/\\/g, "")
          .replace(/\[/g, "")
          .replace(/\]/g, "")}</div>
          `,

      data: sectionsData.soyoo.map((item) => ({
        soyoo_text: item.soyoo_text,
      })),
    },
    "guidance__guidance-content": {
      syntax: (item) =>
        `<div class="guidance__guidance-content__item">
                          <div class="guidance__guidance-content__item__img">
                            <img src="${item.guidance_img}" />
                          </div>
                          <div class="guidance__guidance-content__item__text">
                            <div class="fio">${item.guidance_name}</div>
                            <div>${item.guidance_job}</div>
                            <div>${
                              item.guidance_phone ? item.guidance_phone : ""
                            }</div>
                          </div>
                        </div>`,

      data: sectionsData.guidance.map((item) => ({
        guidance_img: item.guidance_img,
        guidance_name: item.guidance_name,
        guidance_job: item.guidance_job,
        guidance_phone: item.guidance_phone,
      })),
    },
    "document-conteiner__main": {
      syntax: (item) =>
        `<div class="document-conteiner__main__document">
      <img class="document-conteiner__main__document__img" src="${item.img}" data-id="${item.id}"/></div>
      `,

      data: sectionsData.document.map((item) => ({
        img: item.img,
        id: item.id,
      })),
    },
  };

  const updatedSections = {};

  console.log(updatedSections);

  for (let block in sections) {
    let blockElement = document.querySelector(`.${block}`);

    if (blockElement) {
      sections[block].data.forEach((item) => {
        let content = document.createElement("template");
        content.innerHTML = sections[block].syntax(item);

        // Append content of the template to the block element
        blockElement.appendChild(content.content);
      });
    }
  }
}
getResponseAndPopulate();
setTimeout(function () {
  const teacherItems = document.querySelectorAll(
    ".teacher__teacher-content__scroll__item"
  );
  teacherItems.forEach((item) => {
    item.addEventListener("click", function () {
      const teacherId = item.getAttribute("data-id");
      if (teacherId && !isNaN(teacherId)) {
        fetch("db.json")
          .then((response) => response.json())
          .then((data) => {
            const teachers = data.teachers_list;
            const teacher = teachers.find((t) => t.id === parseInt(teacherId));
            if (teacher) {
              updateTeacherInfo(teacher);
            } else {
              console.log("Преподаватель не найден");
            }
          });
      } else {
        console.log("Invalid data-id:", item);
      }
    });
  });
}, 1000);

const fullNameElement = document.querySelector(".teacher-info__full-name");
const schoolSubjectsElement = document.querySelector(
  ".teacher-info__school-subjects"
);
const historyOfTeachingElement = document.querySelector(
  ".teacher-info__history-of-teaching"
);

if (fullNameElement && schoolSubjectsElement && historyOfTeachingElement) {
  console.log("Все элементы присутствуют на странице");
} else {
  console.log("Одни или несколько элементов отсутствуют на странице");
}

// Функция для обновления информации о преподавателе
function updateTeacherInfo(teacher) {
  console.log("Updating teacher info:", teacher);
  document.querySelector(".teacher-info__full-name").textContent =
    teacher.teachers_name;
  document.querySelector(".teacher-info__school-subjects").textContent =
    teacher.teachers_subject;
  document.querySelector(".teacher-info__history-of-teaching").textContent =
    teacher.teachers_history;
}

// Добавление обработчика событий для элементов с классом teacher__teacher-content__scroll__item
document
  .querySelectorAll(".teacher__teacher-content__scroll__item")
  .forEach((item) => {
    const teacherId = item.getAttribute("data-id");
    if (teacherId && !isNaN(teacherId)) {
      fetch("db.json")
        .then((response) => response.json())
        .then((data) => {
          const teachers = data.teachers_list;
          const teacher = teachers.find((t) => t.id === parseInt(teacherId));
          if (teacher) {
            updateTeacherInfo(teacher);
          } else {
            console.log("Преподаватель не найден");
          }
        });
    } else {
      console.log("Invalid data-id:", item);
    }
    item.addEventListener("click", () => {
      const teacherId = parseInt(item.getAttribute("data-id"));
      if (isNaN(teacherId)) {
        console.log("Invalid data-id:", item);
        return;
      }
      console.log("Clicked item with ID:", teacherId);
      fetch("db.json")
        .then((response) => response.json())
        .then((data) => {
          const teachers = data.teachers_list;
          const teacher = teachers.find((t) => t.id === teacherId);
          console.log("Found teacher:", teacher);
          if (teacher) {
            updateTeacherInfo(teacher);
          } else {
            console.log("Teacher not found for ID:", teacherId);
          }
        });
    });
  });
async function fetchData(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}
