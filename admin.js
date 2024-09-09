async function fetchData(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}
let data = {};
let sectionsData = {};
let dompage = "";
let domdata = "";

getResponseAndPopulate().then((sectionsData) => {
  data = sectionsData;
});
document.getElementById("send").addEventListener("click", () => {
  var page_list = [
    "main_wabpage",
    "price_list",
    "news_container",
    "raduga",
    "svedeniya_obrazovatel_uchrezhdenii",
    "obrazovanie",
    "obrazovat_standart",
    "teachers_list",
    "mtooop",
    "dostyp_sreda",
    "fin_hoz",
    "vocantnie_mesta",
    "meshnarod",
  ];
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
  const labels = document.querySelectorAll('label[for="image-input"]');
  const datatextdel = document.getElementsByClassName("datatextdel");
  const dataimg = document.getElementsByClassName("dataimg");
  const imginput = document.getElementById("image-input");

  // textinputs.forEach((textinput) => {
  //   if (domdata === "text") {
  //     if (dompage == "main_wabpage") {
  //       textinput.style.width = "32%";
  //     }
  //   }
  // });
  labels.forEach((label) => {
    if (domdata === "text") {
      label.style.display = "none";
      imginput.style.display = "none";
      if (dompage == "main_wabpage") {
        document.querySelector(".new-banner").style.display = "block";
        document.querySelector(".new-news-cont").style.display = "none";
      } else {
        document.querySelector(".new-banner").style.display = "none";
      }
      for (let i = 0; i < datatextdel.length; i++) {
        datatextdel[i].style.display = "flex";
      }

      for (let i = 0; i < dataimg.length; i++) {
        dataimg[i].style.display = "none";
      }
      if (dompage == "news_container") {
        document.querySelector(".new-news-cont").style.display = "block";
        document.querySelector(".new-banner").style.display = "none";
      } else {
        document.querySelector(".new-news-cont").style.display = "none";
      }
    } else if (domdata === "photo") {
      document.querySelector(".new-banner").style.display = "none";
      document.querySelector(".new-news-cont").style.display = "none";
      label.style.display = "block";
      imginput.style.display = "block";
      for (let i = 0; i < datatextdel.length; i++) {
        datatextdel[i].style.display = "none";
      }

      for (let i = 0; i < dataimg.length; i++) {
        dataimg[i].style.display = "flex";
      }
    }
  });

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
          processItem(subItem, key, `${parentKey}-${index + 1}`)
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
          const state = {
            currentRedactElement: null,
            isRedactActive: 0,
          };

          const imgElement = document.createElement("img");
          imgElement.src = item;
          imgElement.alt = key;
          imgElement.classList.add("admin-img");
          imgElement.setAttribute("data-id", uniqueId);

          imgElement.addEventListener("click", () => {
            if (imgElement.classList.contains("redact")) {
              imgElement.classList.remove("redact");
              state.isRedactActive = 0;
              state.currentRedactElement = null;
            } else {
              if (state.isRedactActive === 0) {
                if (state.currentRedactElement) {
                  state.currentRedactElement.classList.remove("redact");
                }
                imgElement.classList.add("redact");
                state.currentRedactElement = imgElement;
                state.isRedactActive = 1;
              } else {
                console.log("Another image is already in redact mode.");
              }
            }
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
const Buttonnewbaner = document.getElementById("new-banner-create");
const Buttonnewnew = document.getElementById("new-news-create");
Buttonnewnew.addEventListener("click", () => {
  fetch("http://localhost:3001/create-new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: 1,
      title: "Новая новость",
      date: "от 8 мая 24г",
      text: "Текст новости",
      img: "https://lh3.googleusercontent.com/fife/ALs6j_GKievOMYkL0nYBvPbVyN6hhqzkMjtyHPbSM_ONQas8eU0tlT4_fDMmF9G29DNUKuSEQTFRlzWdlnSSKDXVxuZVpGe1fh0nc9QuFeJC15t6cOXMPrz5MCuOmLFaJKKl7E26RrQjkSSmAdbVCthIWXjTGkWdXqz68kKUosE5HoCwJxjf_NDQjkZWoDOBch3-jfev-ahgGNgjMc7WUHLibAPSidnt_H3O5rev0004Zvp2e1QcLh2cD-zsnqnqrB7fCygUiOX9PE60B2v50SYEb2wQgyKDvaMGT656YfTAC0Z6ch7IRnr37BRSVKxkCZvoGEVoApcqKt3F4B04IZzUx4DA_kRUYc-1MlQ-tWfbpXIJ1Xz2Bg6lTaOmkHH8_Jebmem2C8Mx-PYKTdEMOOdF6NyhbU8ouGns7-SClHT7X24KFwHSzRsOa9BZB8UuTuGjf8qkEpJg_Di1jr1cAIOY3PWSKx0fjegkWfofjrzYpEwS6iqppuhp6GiIeMppEKJ2P1isltsdhysf7h7Jv43xyZhQJSfWfWdcEjVPJ0cM0-d7YCPqBLVwIeS7S4nVCGINJsQCcM2HeAdB7tuIh0pcIJ5N0S9Kg62gBMkhUcz_sdFrtOW3A5YhLkE3uhIMDgvP179Z1IH0gL7WsNZj_fI1tzkLKQ0plQk4mhlSOcJaTbXpV3ZcYpa1MawnwKOD-YBiWUThYq3YBX-APJL8oa5DPevN_UOzBNMCTC-IvSDcswaWZOxpIBPhh7S8kAhpLyE8_kySTpEzOWfb0OU98BEi6YwlE1Oznmn2BBBqjeXLls215noNuxjIjMGfhoCudw8EhnqyjB-Yd30Q7DAv4_MzSNou7GwFDCmHnZ6ZvXyD8Z3dnzc-4JY25WLxAS7FFjc_kheMhH9OxbRuJiVnyt7QW3ToqPaMqGvhNGTx3MagylGOF6Ek18UMNUhS2BhO00LnuTine5u-Wub4eOYAERRN3rTmKQtqScIJkAzcMPEFdvZLji8foFsbKWA8YCVWvmdoLRY85MpVnF5_257N01LOWUDxyF8XXAPmxqrrhExRY9CM7JWf_uwcwCrgZAlXqVAdD-F1KDy6_aZ4N3a4LECC4zgw78KpFU_86HnXY_HXW0P08zG8hrlPxys_CgsZ65NAU66VGAhgmnxXWqdOqx6Eox5xReG8GWxukWDIYGfB27pUFtMtcHVbYsiKg-wbNxRi5vV4MrAENDURutJYOtVtj8L9dUve2N3s7pwMCdeMnxztJDcAt6nCBNDVZr6_Ex2GuqAw-rVnbOSN992ELgF8HoP4CpOy31BX4wqlDWcabqN6CNXlkoh9DBdXUCxdW9Xb1aqWso_FeDa0Q4RQxbFlhM7OfTVIRtRoNzEahgzSFRAsrMIWmBlJDKKOGCr7c4Y3sxCaAwEmF5EQB1l3Y6wO5Hp1f17F-BzzzACt3Sv8nYXgv-I8JCQleaXdWEe2AqVp95qsEnEmMCYTZTMmTsPAHhjY4h0m28V4KaVnr4GETMdoiBeVnDJuRbGiQvGW3H4_RbA71jtgQLdj78Ll3YUEnlbiuiH2Wdw0hPh3dbYLIRLvH1eQyNNf32Thov-j1ZYvTPB_sAlb6KCOXXFYi2yMAg=w1920-h891",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Баннер успешно создан:", data);
    })
    .catch((error) => {
      console.error("Ошибка при создании баннера:", error);
    });
});
Buttonnewbaner.addEventListener("click", () => {
  fetch("http://localhost:3001/create-banner", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: 1,
      title: "Новый баннер",
      imagess: [
        "https://lh3.googleusercontent.com/fife/ALs6j_FSAb1XEChOjVyM9s-hnmREiY6SMTQsVqdeSM96xKLIQVPqubhLbZorVKuSQf939e9mKJPsfRYHKxmM9EU60KwcAcTXO17TheUXqgU6C5Srh-1nAcNG7RGZzzj-KA7xAw63zh40m5FtsyNkbSLPVUG2eP8rImanJMD42-_5RPq5EEEGg0vcNqsFvvLIsRGseOuQXRK1tIr6gjsPd5u2Ua9zPioX7Sw5jlGexv-YLdQcRmNVORNtJ6YTrPeNTLOtmuEXnqzDyioslx3l1z6bVtbC4xQWKZj_6cCxRaG6-BQCwbctdDZEBdddzx6Sv7mjLcLrNZt_J1kGkCHD-jE-9C3acozzFFZ7oxhjLAG9FXWsOgs66hdIoTgdhNdZ9uLa2zxQUXfJ4b9BuQpifydKYGwyiQSMxk6KnR4WqSt1nTHyGr4tMdy4u0XyqyJabW8JWvea4lP0TdIm8jBgJx4I6YAjDEzG9j6MD7HSBdDCZIUHfJvjctMiJC0Bx2eEQw9EsVj0ILFCBzwrlSupIMUh7v27K_4AYg1A_sog6Ms-zjnpOiiiKL9bsv1mgdVymgfBI_v1oagry1TcDhbBPpKW0cgVXbK7FD2sx37AY6upo3eW7Z-fWhd_2JHey3amhTVIj2N_vnXC7jkvyfFP6mAti9ZbXai8JnDlyMDNGCn-4ZF1eLh9A7clhQ5zj4oG3Cr8_TTffC2AbwxjeYVG7TS7H9wetPLBJaGW-slaAYzwHKzYdDQmaW0pEE3ZGqfeo1-TpVuY1SXp_1wraWZNURuokqtZerV0I6dQ3rXgnLHqaRSvbslgkmtHPXP_F5fGBuE5n0eZb2YZZIgsBgBchJoCxx2EQVOrdeYXkb4kUZgXhDuL1mv1PxHLix6-SN9Iabk_jParW2KmyQfaLD60NRbOFBIlS8P4wPe33wjTBOktJGTY93nb-udwbU9moWLXoAU08iB2K7AkGloCnJlmZNkAazSNntpMzMwfgwJ5H7h4xe1y4cFDqaLAXCBJbcpZUltO722CwxlUHNIzuaYODApOs2xoR3IU_UfLICvsSuJmS4mCO4NGV5mNOBhy2fJPZubUWjPxxwnNyM23ShoUeUOHm_yEbmGgtKTlxqcfR5FjQjXYnIeRfLAwumJUkah5YdYLdzWkeft90D7BnFIT99bLPae7bDtNBzyrswxV9JPoAgXL5Ni_Uercz1zpZESnBDzlV_LZ-hpZhyX7GyvKHkKfb6W-grpeQcc14ZSDYTEfLVuXhdL5LJkcROQGEF_A-X3F9-FbXZkHDclqeUOKwPYTT__tBXd4llnJF-rY3lDVKKPo8_osQFvc_ggG8DWgZQH8pXAVLqndX4uNeMn9-CWAZAVZZ3Q4Gjd0sCh1zGgqzHPLvolY8ilCrD5Ej4AIcN3Gf7gU9kzCIidh36yfHOOumk8GoGYfwK0G9eRCm66kM9bIlBs3eZeM2uKA0UZMxY3mUGqpWSXcEnxHaNTQz97c1Q4ToC6UoXUcNynmPa3upiXruc1SjuPE0aoz7A7Xpp3QSGdUcFDng37whxBwiJ8oDMRAlWPCChmqGFFF3uROKICVvltw-q2jmMIIGR7uhda9B0cs1NWWqNh771c1lfw6ZBhsXk7pq_h-nHvnIH43WE9DuoB_Y2h5dTul=w1920-h891",
        "https://lh3.googleusercontent.com/fife/ALs6j_Fh0oOEMSNn-V8HOKqxbnI4YK6CVqQmi7ebeUPxIiUYZfcnxMnIJDBh_ylU9fjGYk2nmNZNcr8gGUN8rmj4KFF-JMG3Ec9lpp1tX-OmHRZ8Ogu01-JHn8E8SlMHQXuwzeqeN5vF1LMzTbYLmm0EViq5H-Tl0W9JsTehuSztABc3-taUsAyjuvMsrJuHi0HkM_68fwgKNrJ_Nu_0j5HIiql1rvV8HyFWmMR2EjYwdkvx5RZ_NY8wtr-VOwACk2fz1pHPeUNoyVt3q3LfWY3gu4ju8hfFGQ8CRUyhqooDdNkVGo1ok_c4GdWS7BDTK6wsxaDvcu_u7TYR42bgM16GF9yhHeIOfvgp0ut1rnJR9XooAcoV3CnwztiOjFuq7lARRQTwdw6BzH3QBPwrUXJDnpWyl_goDIH3TSusMhOry6GvX4BtiD1gSnuj6HKpBia1zNHxfI4XVQhWn5_AvRnCswf0je1vFE7kZ8SFr8toBDix0m60hfEDM1r6tUIRg8yH8NDnZ4RtKbihILAgxz8aA1H5BBEyJi87CRxPNHNAt9czcYNYpBL1JTyf0BHW3Ou0IXekgn7DzhifCVddNgWHE-r9xToZQQjhwRH7PSDMHT3nfbfyLvQsDhviizEaFDKDs9NrpofCJHZkxuozWHOya4qHATSqFBtInIuRCABPx9335e1vNzgECVBS7sOXH1VK83h_jI_CgCqLluneOvLEkZs_oFDjqriUGZsUtEmpbVYVvP9dF0tDteHTcU4IguhpbM4HiiugUTO5DTI0UXQBEzTPHPDLZAxXPjmYm0KoQx2sV2X4De-vX8ggIhGmnomMIq_CEd2Lo56u1QeAcIYrAsgM3rsHIIdQclKXz5Xbc8PX2L_gawvJm3NgjDkiYg_XzjtTucwKEOZkGWqaMfek1-vQyW0vCgqtf6pi7L3HLt2D7PUiYjBUmvT5QFyP76CzXDLgxQuIKv8YPEuE2-r0qUBcVeFv5oD58aIVUlzYaQpWzX03H5H5rrKZjtTk9P_IVxh-0BdErO20EI_-1RBDNqTY7Mmo7lxHDiYr_LYW_8F3CxKeWuOr77hke6nmDtZpa-FTBYI1haqf1HDger1mzjVk5RVxK5WlMfzUhRVPQhgLX3wD3E2ZngGfUM5Omhw7UN0sx3fa3AmU2y3osG_3ULl4zzdLj4ZhekJu8IZ_Hlryl5fDhyhpoLLXiYMbQKDTHqWVRXJSvD8ZgBIyWMhKLxryrZ0_pRvNiMP8j3yPuQ11s66i60lhbNS2EuoFldkDYc2tq-RWBgiPhxanXUND3ASbY1nDQ-g8p6yH0xdpnh7BzaYZ-CxA_UUhS7qx_vOQPlL7k2t7NXwUpygoxdO6uZoZVlwjUQnd69A5YDu1Umv2hJ5G_xGLELH_RRod06r3m3dZ_u_vhcq7V8MUo-7eJ62jdlNGJodLjwnh2xZlOZDLY2LQEdqX1f0ooDwMME8i3Zsmomwn4ShogDjfJfiLK253wNUKpgvSULtsDVGFuGP0lJDHYvxS_KGvyOQ5_B3jz7rdi3_Ywj6SUpvAQUJjM6MZ06CNNeMzcitVfDJsoosECVLoUOo-D6rBLAOW4ipdTejXe4Sdtn-awIko9LCMWw=w1920-h475",
      ],
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Баннер успешно создан:", data);
    })
    .catch((error) => {
      console.error("Ошибка при создании баннера:", error);
    });
});

const updateButton = document.getElementById("update-button");
updateButton.addEventListener("click", () => {
  const newImageUrl = document.getElementById("image-input").value;
  const DeltextID = document.getElementById("del-elem-input").value;
  if (DeltextID) {
    console.log("DeltextID: " + DeltextID);

    fetch("http://localhost:3001/delete-text", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: DeltextID }),
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
          console.error("Ошибка при удалении текста:", data.message);
          alert("Ошибка при удалении текста: " + data.message);
        } else {
          console.log("Текст успешно удален!");
        }
      })
      .catch((error) => console.error("Ошибка:", error));
  } else {
    console.log("Нет элемента для удаления.");
  }

  const selectedImage = document.querySelector("img.redact");
  const textAreas = document.querySelectorAll("textarea.admin-textarea");
  const inputFields = document.querySelectorAll("input.admin-input");
  let dataId;
  if (domdata == "photo") {
    dataId = selectedImage.getAttribute("data-id");
  }

  // if (selectedImage !== null) {
  //   dataId = selectedImage.getAttribute("data-id");
  // }

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
        dataId: dataId,
        dompageimg: dompage,
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
  }
  if (textAreas.length > 0 || inputFields.length > 0) {
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

    if (changes.length > 0 && !DeltextID) {
      fetch("http://localhost:3001/update-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ changes, dompage }),
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
        });
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
  };
  return sectionsData;
}

// Функция fetchData

getResponseAndPopulate();
