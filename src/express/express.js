'use strict';

const express = require(`express`);
const path = require(`path`);
const {HttpCode} = require(`../constants`);

// Маршруты приложения мы опишем в отдельных файлах.
// Для определения маршрутов мы воспользуемся Router().
// Примеры маршрутов будут продемонстрированы ниже по тексту.
const offersRoutes = require(`./routes/offers-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);

// Зафиксируем порт для сервера
const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const app = express();

// Подключим созданные маршруты
app.use(`/offers`, offersRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use((req, res) => res.status(HttpCode.BAD_REQUEST).render(`errors/404`));

app.use((err, _req, res, _next) => {
  res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
});


app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);


// Запуск сервера
app.listen(process.env.PORT || DEFAULT_PORT);

