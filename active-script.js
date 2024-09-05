document
  .querySelector(".bottom-menu__burger")
  .addEventListener("click", function () {
    this.classList.toggle("active");
    document.querySelector(".burger-menu").classList.toggle("open");
  });
document
  .querySelector(".burger-menu__close")
  .addEventListener("click", function () {
    document.querySelector(".bottom-menu__burger").classList.remove("active");
    document.querySelector(".burger-menu").classList.remove("open");
  });

document
  .querySelectorAll(
    ".footer__content__links__connection__reach__title, .footer__content__links__connection__address__title, .footer__content__links__company__title"
  )
  .forEach((element) =>
    element.addEventListener("click", function () {
      const listSelector = element.classList.contains(
        "footer__content__links__connection__reach__title"
      )
        ? ".footer__content__links__connection__reach__list"
        : element.classList.contains(
            "footer__content__links__connection__address__title"
          )
        ? ".footer__content__links__connection__address__list"
        : ".footer__content__links__company__list";
      const listElement = document.querySelector(listSelector);
      if (listElement.classList.contains("chek")) {
        listElement.style.transition = "height 0.3s ease-in-out";
        listElement.style.height = "0px";
        setTimeout(() => listElement.classList.remove("chek"), 300);
      } else {
        listElement.classList.add("chek");
        listElement.style.transition = "height 0.3s ease-in-out";
        if (
          element.classList.contains(
            "footer__content__links__connection__reach__title"
          )
        ) {
          listElement.style.height = "50px";
        } else if (
          element.classList.contains(
            "footer__content__links__connection__address__title"
          )
        ) {
          listElement.style.height = "80px";
        } else {
          listElement.style.height = "125px";
        }
      }
    })
  );
