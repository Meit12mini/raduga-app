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
  const dompage = req.body.dompage;
  const dbData = db.read();

  changes.forEach((change) => {
    const [prefix, element, index, key] = change.id.split("-");
    const text = change.text;

    if (dbData[dompage] && dbData[dompage][0][element]) {
      if (Array.isArray(dbData[dompage][0][element])) {
        dbData[dompage][0][element][index][key] = text;
      } else {
        dbData[dompage][0][element][key] = text;
      }
    }
  });
  const logToFile = (dbData) => fs.appendFileSync("output.log", `${dbData}\n`);
  console.log = logToFile;

  console.log("Сохранено в файл.");

  // db.write(dbData);

  res.send("Текст обновлен успешно!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
