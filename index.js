const telegramApi = require("node-telegram-bot-api");
const token = "6443008244:AAFOj70clLPR4krcXlJ1QIQrKgzZ2rE7YcU";

const bot = new telegramApi(token, { polling: true });

const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const userName = msg.chat.username;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/182/a1e/182a1e53-620d-41ec-937e-c4a1be34aa5d/1.webp"
      );
      return bot.sendMessage(
        chatId,
        "Ласкаво просимо в телеграм-бот для персональних тренувань! Щоб дізнатись інформацію про тренування обери команду /info"
      );
    }

    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        "Щоб записатить на тренування напишіть час за день, коли вам зручно:"
      );
    }
    return bot.sendMessage(
      chatId,
      "Я вас не розумію, використайте іншу команду "
    );
  });
};

start();
