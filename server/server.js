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
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST", "PUT", "DELETE");
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
  const { changes, dompage } = req.body;
  const dbData = db.read();

  changes.forEach((change) => {
    const keys = change.id.split("-");
    const text = keys.includes("id") ? parseInt(change.text) : change.text;
    if (keys.length == 6) {
      const [prefix, element, ind, index, key, local] = keys;
      if (dompage == "main_wabpage" || dompage == "news_container") {
        dbData[dompage][0][key][index - 1][local] = text;
      }
    }
    if (keys.length == 5) {
      const [prefix, element, index, key, local] = keys;
      if (dompage == "main_wabpage" || dompage == "news_container") {
        dbData[dompage][0][key][local] = text;
      }
    }
    if (keys.length == 4) {
      const [prefix, element, index, local] = keys;
      dbData[dompage][index - 1][local] = text;
    }
  });

  db.write(dbData);
  res.send("Текст обновлен успешно!");
});
app.post("/create-message", (req, res) => {
  const dbData = db.read();
  const { name, phone, email, message, checkboxes } = req.body;
  const newMessage = {
    id: dbData.user_massage.length + 1,
    name,
    phone,
    mail: email,
    message,
  };
  dbData.user_massage.push(newMessage);
  db.write(dbData);
  res.json({ success: true, message: "Сообщение успешно создано" });
});

app.delete("/delete-text", (req, res) => {
  const { id } = req.body;

  // Выводим значение id в консоль
  console.log(`ID для удаления: ${id}`);
  const dbData = db.read();

  // Определяем тип и id элемента
  const keys = id.split("-");
  console.log("Тип и id элемента:", keys);

  if (keys.length == 6) {
    const [nun, element, ind, index, key, local] = keys;
    console.log("Элемент найден банер", nun, element, ind, index, key, local);
    dbData["main_wabpage"][0][key].splice(index - 1, 1);
  }
  if (keys.length == 4) {
    const [nun, element, index, local] = keys;
    console.log("Элемент найден новость", nun, element, index, local);

    // Удаляем новость из news_container
    const newsIndex = dbData["news_container"].findIndex(
      (news) => news.id === parseInt(index, 10)
    );
    if (newsIndex !== -1) {
      dbData["news_container"].splice(newsIndex, 1);
      db.write(dbData);
      console.log(`Новость с ID ${index} успешно удалена`);
    } else {
      console.log(`Новость с ID ${index} не найдена`);
    }
  }

  const elementId = parseInt(id, 10);

  // Удаляем элемент
  // deleteElement(dbData, type, elementId);
  db.write(dbData);
  res.json({ success: true, message: "Элемент успешно удален" });
});

app.post("/create-banner", (req, res) => {
  const { id, title, image } = req.body;

  // Чтение данных из db.json
  const dbData = db.read();

  // Увеличение id всех существующих баннеров на 1
  dbData.main_wabpage[0].banner.forEach((banner) => (banner.id += 1));
  dbData.main_wabpage[0].banner_mobile.forEach((banner) => (banner.id += 1));

  // Добавление нового баннера в начало списков
  dbData.main_wabpage[0].banner.unshift({ id, title, image });
  dbData.main_wabpage[0].banner_mobile.unshift({ id, title, image });

  // Запись обновленных данных обратно в db.json
  db.write(dbData);
  // Вывод данных в консоль
  console.log("Новый баннер добавлен:");
  console.log("ID:", id);
  console.log("Title:", title);
  console.log("Image:", image);

  res.json({ message: "Баннер успешно создан", id, title, image });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
