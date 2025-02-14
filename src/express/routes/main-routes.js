'use strict';

// Подключаем и инициализируем экземпляр Router
const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();

// Определяем `GET` маршруты.
// В качестве ответа отправляем путь маршрута.

mainRouter.get(`/`, async (req, res) => {
  const offers = await api.getOffers();
  res.render(`main`, {offers});
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, async (req, res) => {
  try {
    const {search} = req.query;
    const results = await api.search(search);

    res.render(`search-result`, {
      results
    });
  } catch (arror) {
    res.render(`search-result`, {
      results: []
    });
  }
});

module.exports = mainRouter;
