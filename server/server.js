const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3001;
const db = {
  read: () => JSON.parse(fs.readFileSync("db.json", "utf8")),
  write: (data) => fs.writeFileSync("db.json", JSON.stringify(data)),
};

const corsOptions = {
  origin: "http://127.0.0.1:5173",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

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
    jsonData.main_wabpage[0].banner.forEach((item) => {
      if (item.image === imageId) {
        item.image = newImageUrl;
        updated = true;
      }
    });

    jsonData.main_wabpage[0].banner_mobile.forEach((item) => {
      if (item.image === imageId) {
        item.image = newImageUrl;
        updated = true;
      }
    });

    if (jsonData.main_wabpage[0].raduga_info.img === imageId) {
      jsonData.main_wabpage[0].raduga_info.img = newImageUrl;
      updated = true;
    }

    if (jsonData.main_wabpage[0].raduga_director.fhoto_director === imageId) {
      jsonData.main_wabpage[0].raduga_director.fhoto_director = newImageUrl;
      updated = true;
    }

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
  const changes = req.body.changes;

  console.log("Получен запрос на обновление текста:", changes);

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
      console.log("Содержимое main_wabpage[0]:", jsonData.main_wabpage);

      console.log("Содержимое main_wabpage[0]:", jsonData.main_wabpage[0]);
    } catch (parseErr) {
      console.error("Ошибка парсинга JSON:", parseErr);
      return res
        .status(500)
        .json({ success: false, message: "Ошибка сервера при парсинге JSON" });
    }

    let updated = false;

    // Функция для обновления текста в объекте
    function updateText(obj, key, newText) {
      if (obj && obj.hasOwnProperty(key)) {
        console.log(`Обновление ключа ${key} значением ${newText}`);
        obj[key] = newText;
        updated = true;
      } else {
        console.log(`Ключ ${key} не найден в объекте`);
      }
    }

    changes.forEach((change) => {
      const [prefix, element, num, id, key] = change.id.split("-");
      console.log("num :", num, "id :", id, "  key :", key);

      const numericId = parseInt(id, 10) - 1; // Преобразование id в числовой индекс

      console.log(`Обработка изменения: ${change.id} -> ${change.text}`);
      switch (change.id) {
        case "nun-element-1-banner-id":
        case "nun-element-1-banner-title":
          console.log(
            "Содержимое jsonData.main_wabpage[0].banner:",
            jsonData.main_wabpage[0].banner
          );
          if (
            jsonData.main_wabpage[0].banner &&
            jsonData.main_wabpage[0].banner.hasOwnProperty(key)
          ) {
            updateText(jsonData.main_wabpage[0].banner, key, change.text);
          } else {
            console.log(
              `Ключ ${key} не найден в объекте main_wabpage[0].banner`
            );
          }
          break;
        case "nun-element-1-banner_mobile-id":
        case "nun-element-1-banner_mobile-title":
          console.log(
            "Содержимое jsonData.main_wabpage[0].banner_mobile:",
            jsonData.main_wabpage[0].banner_mobile
          );
          if (
            jsonData.main_wabpage[0].banner_mobile &&
            jsonData.main_wabpage[0].banner_mobile.hasOwnProperty(key)
          ) {
            updateText(
              jsonData.main_wabpage[0].banner_mobile,
              key,
              change.text
            );
          } else {
            console.log(
              `Ключ ${key} не найден в объекте main_wabpage[0].banner_mobile`
            );
          }
          break;
        case "nun-element-1-raduga_info-id":
        case "nun-element-1-raduga_info-title":
        case "nun-element-1-raduga_info-text":
          console.log(
            "Содержимое jsonData.main_wabpage[0].raduga_info:",
            jsonData.main_wabpage[0].raduga_info
          );
          if (
            jsonData.main_wabpage[0].raduga_info &&
            jsonData.main_wabpage[0].raduga_info.hasOwnProperty(key)
          ) {
            updateText(jsonData.main_wabpage[0].raduga_info, key, change.text);
          } else {
            console.log(
              `Ключ ${key} не найден в объекте main_wabpage[0].raduga_info`
            );
          }
          break;
        case "nun-element-1-raduga_director-fio_director":
        case "nun-element-1-raduga_director-additional_information":
          console.log(
            "Содержимое jsonData.main_wabpage[0].raduga_director:",
            jsonData.main_wabpage[0].raduga_director
          );
          if (
            jsonData.main_wabpage[0].raduga_director &&
            jsonData.main_wabpage[0].raduga_director.hasOwnProperty(key)
          ) {
            updateText(
              jsonData.main_wabpage[0].raduga_director,
              key,
              change.text
            );
          } else {
            console.log(
              `Ключ ${key} не найден в объекте main_wabpage[0].raduga_director`
            );
          }
          break;
        default:
          console.error(`Неизвестный элемент: ${change.id}`);
      }
    });

    if (updated) {
      db.write(jsonData);
      console.log("Текст успешно обновлен");
      res.json({ success: true, message: "Текст обновлен" });
    } else {
      console.error("Текст не найден для обновления");
      res.status(400).json({ success: false, message: "Текст не найден" });
    }
  });
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
