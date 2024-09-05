const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3001;

const corsOptions = {
  origin: "http://127.0.0.1:5173", // Укажите источник, с которого разрешены запросы
  methods: ["GET", "POST"], // Разрешенные методы
  allowedHeaders: ["Content-Type"], // Разрешенные заголовки
  optionsSuccessStatus: 200, // Для старых браузеров
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.post("/update-image", (req, res) => {
  const newImageUrl = req.body.image;
  const imageId = req.body.imageId;

  console.log(
    "Получен запрос на обновление изображения:",
    newImageUrl,
    imageId
  );

  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.error("Ошибка чтения файла:", err);
      return res
        .status(500)
        .json({ success: false, message: "Ошибка сервера при чтении файла" });
    }

    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseErr) {
      console.error("Ошибка парсинга JSON:", parseErr);
      return res
        .status(500)
        .json({ success: false, message: "Ошибка сервера при парсинге JSON" });
    }

    let updated = false;

    // Функция для обновления изображений в массиве
    function updateImages(array) {
      array.forEach((item) => {
        for (const key in item) {
          if (item.hasOwnProperty(key) && item[key] === imageId) {
            item[key] = newImageUrl;
            updated = true;
          }
        }
      });
    }

    // Обновление изображений в main_wabpage
    updateImages(jsonData.main_wabpage[0].banner);
    updateImages(jsonData.main_wabpage[0].banner_mobile);

    if (jsonData.main_wabpage[0].raduga_info.img === imageId) {
      jsonData.main_wabpage[0].raduga_info.img = newImageUrl;
      updated = true;
    }

    if (jsonData.main_wabpage[0].raduga_director.fhoto_director === imageId) {
      jsonData.main_wabpage[0].raduga_director.fhoto_director = newImageUrl;
      updated = true;
    }

    // Обновление изображений в raduga
    updateImages(jsonData.raduga);

    // Обновление изображений в news_container
    updateImages(jsonData.news_container);

    if (updated) {
      fs.writeFile("db.json", JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          console.error("Ошибка записи файла:", err);
          return res.status(500).json({
            success: false,
            message: "Ошибка сервера при записи файла",
          });
        }
        console.log("Изображение успешно обновлено");
        res.json({ success: true, message: "Изображение обновлено" });
      });
    } else {
      console.error("Изображение не найдено для обновления");
      res
        .status(400)
        .json({ success: false, message: "Изображение не найдено" });
    }
  });
});
app.post("/update-text", (req, res) => {
  const { dompage, changes } = req.body;

  if (!dompage || !changes) {
    return res
      .status(400)
      .json({ success: false, message: "Некорректные данные" });
  }

  console.log("Получен запрос на обновление текста:", dompage, changes);

  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.error("Ошибка чтения файла:", err);
      return res
        .status(500)
        .json({ success: false, message: "Ошибка сервера при чтении файла" });
    }

    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseErr) {
      console.error("Ошибка парсинга JSON:", parseErr);
      return res
        .status(500)
        .json({ success: false, message: "Ошибка сервера при парсинге JSON" });
    }

    let updated = false;

    // Функция для обновления текста в массиве
    function updateText(array, changes) {
      array.forEach((item) => {
        changes.forEach((change) => {
          if (item.id === change.id) {
            item.text = change.text;
            updated = true;
          }
        });
      });
    }

    if (jsonData[dompage]) {
      jsonData[dompage].forEach((section) => {
        if (Array.isArray(section)) {
          updateText(section, changes);
        } else {
          changes.forEach((change) => {
            if (section[change.id]) {
              section[change.id] = change.text;
              updated = true;
            }
          });
        }
      });

      if (updated) {
        fs.writeFile("db.json", JSON.stringify(jsonData, null, 2), (err) => {
          if (err) {
            console.error("Ошибка записи файла:", err);
            return res.status(500).json({
              success: false,
              message: "Ошибка сервера при записи файла",
            });
          }
          console.log("Текст успешно обновлен");
          res.json({ success: true, message: "Текст успешно обновлен!" });
        });
      } else {
        console.error("Текст не найден для обновления");
        res.status(400).json({ success: false, message: "Текст не найден" });
      }
    } else {
      res.status(400).json({ success: false, message: "Страница не найдена" });
    }
  });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
