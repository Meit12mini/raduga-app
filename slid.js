document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    let sliderItems = document.querySelectorAll(".slider__item");
    if (sliderItems.length === 0) {
      console.error("No slider items found.");
      return;
    }

    const slider = document.querySelector(".slider");
    const sliderContent = document.querySelector(".slider__content");
    const prevBtns = document.querySelectorAll(".slider__item__buttom__prev");
    const nextBtns = document.querySelectorAll(".slider__item__buttom__next");
    let currentIndex = 0;
    showItem(currentIndex); // Немедленно отобразить текущий слайд

    function changeSlide(direction) {
      sliderItems[currentIndex].classList.remove("current");
      currentIndex += direction;
      if (currentIndex < 0) {
        currentIndex = sliderItems.length - 1;
      } else if (currentIndex >= sliderItems.length) {
        currentIndex = 0;
      }
      sliderItems[currentIndex].classList.add("current");
    }

    function prevSlide() {
      sliderItems[currentIndex].classList.add("blur"); // Добавить эффект размытия на текущем слайде
      setTimeout(() => {
        sliderItems[currentIndex].classList.remove("blur"); // Убрать эффект размытия через 0.5 секунды
      }, 500);
      setTimeout(() => {
        sliderItems[currentIndex].classList.remove("current");
        sliderItems[currentIndex].classList.add("next");

        currentIndex--;
        if (currentIndex < 0) {
          currentIndex = sliderItems.length - 1;
        }

        sliderItems[currentIndex].classList.remove("next");
        sliderItems[currentIndex].classList.add("current");

        showItem(currentIndex); // Вызов функции showItem
      }, 500);
    }

    function nextSlide() {
      sliderItems[currentIndex].classList.add("blur"); // Добавить эффект размытия на текущем слайде
      setTimeout(() => {
        sliderItems[currentIndex].classList.remove("blur"); // Убрать эффект размытия через 0.5 секунды
      }, 500);

      setTimeout(() => {
        sliderItems[currentIndex].classList.remove("current");
        sliderItems[currentIndex].classList.add("next");

        currentIndex++;
        if (currentIndex > sliderItems.length - 1) {
          currentIndex = 0;
        }

        sliderItems[currentIndex].classList.remove("next");
        sliderItems[currentIndex].classList.add("current");

        showItem(currentIndex); // Вызов функции showItem
      }, 500);
    }

    prevBtns.forEach((btn) => {
      btn.addEventListener("click", prevSlide);
    });

    nextBtns.forEach((btn) => {
      btn.addEventListener("click", nextSlide);
    });

    function showItem(index) {
      let isAnyItemFlex = false;
      sliderItems.forEach((item) => {
        if (item !== sliderItems[index]) {
          item.style.display = "none";
        } else {
          if (isAnyItemFlex) {
            console.error("Ошибка: несколько слайдов имеют display: flex");
          } else {
            isAnyItemFlex = true;
            item.style.display = "flex";
          }
        }
      });
    }

    if (sliderItems.length > 0) {
      // Инициализируем слайдер
      // ...
    } else {
      console.error("No slider items found.");
    }
  }, 500);
});
