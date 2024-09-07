document
  .querySelector(".contact__application__text__button__text")
  .addEventListener("click", function () {
    const nameInput = document.querySelector(
      ".contact__application__application-container__user-container__input"
    );
    const phoneInput = document.querySelector(
      ".contact__application__application-container__phone-container__input"
    );
    const emailInput = document.querySelector(
      ".contact__application__application-container__mail-container__input"
    );
    const messageInput = document.querySelector(
      ".contact__application__text__input"
    );
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    function showAlert(message, inputElement) {
      const alertBox = document.createElement("div");
      alertBox.textContent = message;

      alertBox.className = "alert-box";

      alertBox.style.position = "absolute";
      alertBox.style.padding = "2px";
      alertBox.style.backgroundColor = "red";
      alertBox.style.color = "white";
      alertBox.style.zIndex = "1000";
      alertBox.style.fontSize = "16px";
      alertBox.style.fontFamily = "Futura PT Book";
      alertBox.style.borderRadius = "5px";

      if (inputElement === messageInput) {
        const titleElement = document.querySelector(".text");
        alertBox.style.left = `${
          messageInput.offsetLeft + titleElement.offsetWidth
        }px`;
        alertBox.style.top = `${titleElement.offsetTop}px`;
      } else {
        const titleElement = inputElement.parentElement.querySelector("div");
        alertBox.style.left = `${
          titleElement.offsetLeft + titleElement.offsetWidth
        }px`;
        alertBox.style.top = `${titleElement.offsetTop}px`;
      }

      inputElement.parentElement.appendChild(alertBox);
      setTimeout(() => {
        alertBox.classList.add("show");
      }, 10);

      // Плавное исчезновение
      setTimeout(() => {
        alertBox.classList.remove("show");
        setTimeout(() => {
          alertBox.remove();
        }, 500);
      }, 1500);
    }

    if (nameInput.value.length <= 3) {
      showAlert("Имя не корректно", nameInput);
      return;
    }

    const phonePattern = /^(?:\+7|8)\d{10}$/;
    if (!phonePattern.test(phoneInput.value)) {
      showAlert("Телефон не корректен", phoneInput);
      return;
    }

    if (!emailInput.value.includes("@")) {
      showAlert("Почта не корректна", emailInput);
      return;
    }

    let isChecked = false;
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        isChecked = true;
      }
    });

    if (!isChecked) {
      return;
    }

    if (messageInput.value.length <= 10) {
      showAlert("Минимум 10 символов", messageInput);
      return;
    }

    console.log("Отправлено");
  });
