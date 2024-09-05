async function fetchData(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}
let data = {};
let sectionsData = {};
let dompage = "";

getResponseAndPopulate().then((sectionsData) => {
  data = sectionsData;
});
document.getElementById("send").addEventListener("click", () => {
  var page_list = ["main_wabpage", "price_list", "news_container", "raduga"];
  var data_list = ["photo", "text", "other"];
  const filteredList = document.querySelector(".filtered-list");
  const dataFilter = document.querySelector(".data-filter__item");

  if (page_list.includes(filteredList.getAttribute("data-page"))) {
    dompage = filteredList.getAttribute("data-page");
    if (data_list.includes(dataFilter.getAttribute("data-filter"))) {
      domdata = dataFilter.getAttribute("data-filter");

      send__info(dompage, domdata);
    }
    return;
  } else {
    return;
  }
});
function send__info(dompage, domdata, mainKey) {
  const contentElement = document.getElementById("content");
  contentElement.innerHTML = ""; // Очистка содержимого

  console.log("dompage:", dompage);
  console.log("domdata:", domdata);

  if (data[dompage]) {
    const pageData = data[dompage]; // Предполагаем, что данные находятся в массиве

    // Рекурсивная функция для обработки вложенных объектов и массивов
    function processItem(item, key, parentKey = "") {
      if (Array.isArray(item)) {
        item.forEach((subItem, index) =>
          processItem(subItem, key, `${parentKey}`)
        );
      } else if (typeof item === "object" && item !== null) {
        for (const subKey in item) {
          if (item.hasOwnProperty(subKey)) {
            processItem(item[subKey], subKey, `${parentKey}-${key}`);
          }
        }
      } else {
        console.log("Processing item:", item, "with key:", key);
        const uniqueId = `${mainKey ? mainKey : "nun"}-${parentKey}-${key}`;

        if (
          domdata === "photo" &&
          (key === "img" || key === "image" || key === "fhoto_director")
        ) {
          const imgElement = document.createElement("img");
          imgElement.src = item;
          imgElement.alt = key;
          imgElement.classList.add("admin-img");
          imgElement.setAttribute("data-id", uniqueId);
          imgElement.addEventListener("click", () => {
            imgElement.classList.toggle("redact");
          });
          contentElement.appendChild(imgElement);
        } else if (
          domdata === "text" &&
          key !== "img" &&
          key !== "image" &&
          key !== "fhoto_director"
        ) {
          const htmlRegex = /<\/?[a-z][\s\S]*>/i;
          if (htmlRegex.test(item)) {
            const textareaElement = document.createElement("textarea");
            textareaElement.classList.add("admin-textarea");
            textareaElement.setAttribute("data-id", uniqueId);
            const formattedText = item
              .replace(/</g, "\n<")
              .replace(/>/g, ">\n");
            textareaElement.value = formattedText;
            contentElement.appendChild(textareaElement);
          } else {
            const inputElement = document.createElement("input");
            inputElement.type = "text";
            inputElement.value = item;
            inputElement.classList.add("admin-input");
            inputElement.setAttribute("data-id", uniqueId);
            contentElement.appendChild(inputElement);
          }
        }
      }
    }

    // Обработка всех элементов в pageData
    pageData.forEach((element, index) => {
      console.log("Processing element:", index);
      for (const key in element) {
        if (element.hasOwnProperty(key) && key !== "id") {
          processItem(element[key], key, `element-${index + 1}`);
        }
      }
    });
  } else {
    console.log("No data found for dompage:", dompage);
  }
}

const updateButton = document.getElementById("update-button");
updateButton.addEventListener("click", () => {
  const newImageUrl = document.getElementById("image-input").value;
  const selectedImage = document.querySelector("img.redact");
  const textAreas = document.querySelectorAll("textarea.admin-textarea");
  const inputFields = document.querySelectorAll("input.admin-input");

  if (selectedImage) {
    // Обновление изображения
    const imageId = selectedImage.id;
    fetch("http://localhost:3001/update-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: newImageUrl,
        imageId: selectedImage.src, // Отправляйте URL-адрес изображения
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(
              `Server error: ${response.status} ${response.statusText} - ${errorData.message}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        if (!data.success) {
          console.error("Ошибка при обновлении изображения:", data.message);
          console.log("Идентификатор изображения:", imageId);
          console.log("Новое URL изображения:", newImageUrl);
          // Отобразите сообщение об ошибке пользователю
          alert("Ошибка при обновлении изображения: " + data.message);
        } else {
          console.log("Изображение успешно обновлено!");
        }
      })
      .catch((error) => console.error("Ошибка:", error));
  } else if (textAreas.length > 0 || inputFields.length > 0) {
    const changes = [];

    textAreas.forEach((textarea) => {
      let newText = String(textarea.value);
      newText = newText.replace(/\n</g, "<").replace(/>\n/g, ">").trim();
      const id = textarea.getAttribute("data-id");
      changes.push({ id, text: newText });
    });

    inputFields.forEach((input) => {
      const newText = input.value.trim();
      const id = input.getAttribute("data-id");
      changes.push({ id, text: newText });
    });

    if (changes.length > 0) {
      fetch("http://localhost:3001/update-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ changes }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error(
                `Server error: ${response.status} ${response.statusText} - ${errorData.message}`
              );
            });
          }
          return response.json();
        })
        .then((data) => {
          if (!data.success) {
            console.error("Ошибка при обновлении текста:", data.message);
            alert("Ошибка при обновлении текста: " + data.message);
          } else {
            console.log("Текст успешно обновлен!");
          }
        })
        .catch((error) => console.error("Ошибка:", error));
    } else {
      console.log("Нет изменений для сохранения.");
    }
  }
});

// Функция getResponseAndPopulate
async function getResponseAndPopulate() {
  sectionsData = {
    main_wabpage: await fetchData("http://localhost:3000/main_wabpage"),
    news_container: await fetchData("http://localhost:3000/news_container"),
    raduga: await fetchData("http://localhost:3000/raduga"),
    price_list: await fetchData("http://localhost:3000/price_list"),
  };
  return sectionsData;
}

// Функция fetchData

getResponseAndPopulate();
