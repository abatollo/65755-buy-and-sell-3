'use strict';

// Подключаем и инициализируем экземпляр Router
const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {ensureArray} = require(`../../utils`);

const UPLOAD_DIR = `../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const api = require(`../api`).getAPI();
const offersRouter = new Router();

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

// Определяем `GET` маршруты.
// В качестве ответа отправляем путь маршрута.
// Следует помнить, что в первом параметре мы указываем путь маршрута
// без `offers`, т.к. уже указали этот прификс при подключении
// модуля маршрута в `express.js`.

offersRouter.get(`/category/:id`, (req, res) => res.render(`category`));

offersRouter.get(`/add`, (req, res) => res.render(`offers/new-ticket`));

offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [offer, categories] = await Promise.all([
    api.getOffer(id),
    api.getCategories()
  ]);
  res.render(`offers/ticket-edit`, {offer, categories});
});

offersRouter.post(`/add`,
    upload.single(`avatar`), // применяем middleware
    async (req, res) => {

      // в `body` содержатся текстовые данные формы
      // в `file` — данные о сохранённом файле

      const {body, file} = req;

      const offerData = {
        picture: file ? file.filename : ``,
        sum: body.price,
        type: body.action,
        description: body.comment,
        title: body[`ticket-name`],
        category: ensureArray(body.category),
      };

      try {
        await api.createOffer(offerData);
        res.redirect(`/my`);
      } catch (error) {
        res.redirect(`back`);
      }
    }
);

offersRouter.get(`/:id`, (req, res) => res.render(`offers/ticket`));

module.exports = offersRouter;
