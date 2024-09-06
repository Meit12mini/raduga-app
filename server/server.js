const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const path = require("path");
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
  const changesbes = [
    { id: "nun-element-1-raduga_info-title", text: "Баннер который смог3" },
  ];
  const dompage = req.body.dompage;
  const dbData = db.read();
  // const countElements = changes[0].id.split("-").length;
  // console.log(countElements);
  console.log("update-text", changes);

  changes.forEach((change) => {
    if (change.id.split("-").length > 5) {
      const [prefix, element, ind, index, key, local] = change.id.split("-");
      const text = change.text;

      if (dompage === "main_wabpage") {
        // console.log(dbData[dompage]); // Показывает все данные для main_wabpage
        // console.log(dbData[dompage][0][key]); // Показывает данные для ключа "banner" в main_wabpage
        // console.log(dbData[dompage][0][key][index - 1][local]);
        dbData[dompage][0][key][index - 1][local] = text;
        // console.log(dbData[dompage][0][key][index - 1][local]);
        // console.log(dbData[dompage][0][key][0][local]); // Показывает значение "title" первого элемента в "banner"
        console.log("main_wabpage");
      }
    } else {
      const [prefix, element, index, key, local] = change.id.split("-");
      const text = change.text;
      console.log(
        prefix,
        ": prefix",
        element,
        ": element",
        index,
        ": index",
        key,
        ": key",
        local,
        ": local"
      );
      if (dompage === "main_wabpage") {
        if (key === "raduga_info") {
          // console.log(dbData[dompage][0][key][local]);
          dbData[dompage][0][key][local] = text;
          console.log("raduga_info");
        }
        if (key === "raduga_director") {
          // console.log(dbData[dompage][0][key][local]);
          dbData[dompage][0][key][local] = text;
          // console.log("raduga_director");
        }
        if (key === "raduga_info") {
          dbData[dompage][0][key][local] = text;
          // console.log("raduga_info", dbData[dompage][0][key][local]);
        }
        // console.log(dbData[dompage]); // Показывает все данные для main_wabpage
        // console.log(dbData[dompage][0][key]); // Показывает данные для ключа "banner" в main_wabpage
        // console.log(dbData[dompage][0][key][0][local]);
        // dbData[dompage][0][key][0][local] = text;
        // console.log(dbData[dompage][0][key][0][local]); // Показывает значение "title" первого элемента в "banner"
        // console.log("main_wabpage");

        // if (dompage === "price_list") {
        //   console.log("price_list");
        // }
        // if (dompage === "news_container") {
        //   console.log("news_container");
        // }
        // if (dompage === "raduga") {
        //   console.log("raduga");
        // }
      }
    }
  });

  //   const [prefix, element, index, key, local] = change.id.split("-");
  //   const text = change.text;
  //   console.log(
  //     prefix,
  //     ": prefix",
  //     element,
  //     ": element",
  //     index,
  //     ": index",
  //     key,
  //     ": key",
  //     local,
  //     ": local"
  //   );

  //   if (dompage === "main_wabpage") {
  //     // console.log(dbData[dompage]); // Показывает все данные для main_wabpage
  //     // console.log(dbData[dompage][0][key]); // Показывает данные для ключа "banner" в main_wabpage
  //     console.log(dbData[dompage][0][key][0][local]);
  //     dbData[dompage][0][key][0][local] = text;
  //     console.log(dbData[dompage][0][key][0][local]); // Показывает значение "title" первого элемента в "banner"
  //     console.log("main_wabpage");
  //   }

  //   if (dompage === "price_list") {
  //     console.log("price_list");
  //   }

  //   if (dompage === "news_container") {
  //     console.log("news_container");
  //   }

  //   if (dompage === "raduga") {
  //     console.log("raduga");
  //   }
  // });

  // const logFilePath = path.join(__dirname, "dbDataLog.json");
  // fs.writeFileSync(logFilePath, JSON.stringify(dbData, null, 2), "utf-8");

  // console.log(`Data has been logged to ${logFilePath}`);

  db.write(dbData);

  res.send("Текст обновлен успешно!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
