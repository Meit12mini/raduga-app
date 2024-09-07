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
    const checkboxestext = document.querySelector(
      ".contact__application__text__text"
    );
    function highlightText(textElement, color, duration) {
      textElement.style.color = color;
      setTimeout(() => {
        textElement.style.color = "";
      }, duration);
    }

    function showAlert(message, inputElement) {
      const alertBox = document.createElement("div");
      alertBox.textContent = message;

      alertBox.className = "alert-box";

      alertBox.style.position = "absolute";
      alertBox.style.padding = "2px";
      alertBox.style.backgroundColor = "red";
      alertBox.style.color = "white";
      alertBox.style.zIndex = "1000";
      alertBox.style.fontSize = "15px";
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
      checkboxestext.classList.add("highlight");
      checkboxestext.classList.add("red");
      setTimeout(() => {
        checkboxestext.classList.remove("red");
      }, 2000);
      return;
    }
    if (messageInput.value.length <= 10) {
      showAlert("Минимум 10 символов", messageInput);
      return;
    }

    // Отправка данных на сервер
    const messageData = {
      name: nameInput.value,
      phone: phoneInput.value,
      email: emailInput.value,
      message: messageInput.value,
      checkboxes: Array.from(checkboxes).map((checkbox) => checkbox.checked),
    };

    fetch("http://localhost:3001/create-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
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
          console.error("Ошибка при создании сообщения:", data.message);
          alert("Ошибка при создании сообщения: " + data.message);
        } else {
          console.log("Сообщение успешно создано!");
        }
      })
      .catch((error) => console.error("Ошибка:", error));
  });
