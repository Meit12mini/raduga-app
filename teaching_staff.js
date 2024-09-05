document.querySelectorAll(".active-button").forEach((button) => {
  button.addEventListener("click", function () {
    const dataId = this.getAttribute("data-id");
    const guidanceElement = document.getElementById("guidance");

    if (dataId === "guidance") {
      // Проверка, скрыт ли элемент guidance
      if (guidanceElement.classList.contains("fade-out")) {
        // Плавное появление элемента guidance
        guidanceElement.classList.remove("fade-out");
        guidanceElement.classList.add("show");
      } else {
        // Скрытие элементов с классом staff-conteiner__content__staff__title и id teacher
        document
          .querySelectorAll(".staff-conteiner__content__staff__title")
          .forEach((item) => {
            item.style.display = "none";
          });
        document.getElementById("teacher").style.display = "none";
      }
    } else {
      // Плавное скрытие элемента guidance
      guidanceElement.classList.remove("show");
      guidanceElement.classList.add("fade-out");

      // Отображение элементов в teacher__teacher-content__scroll
      document
        .querySelectorAll(".teacher__teacher-content__scroll [data-structure]")
        .forEach((item) => {
          if (item.getAttribute("data-structure") === dataId) {
            item.style.display = "inline-block";
          } else {
            item.style.display = "none";
          }
        });
    }
  });
});
