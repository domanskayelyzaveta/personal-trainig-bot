import TelegramBot from "node-telegram-bot-api";
import moment from "moment";
import dotenv from "dotenv";

dotenv.config();
const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

const chatState = {};
const selectedTimes = {};

console.log(selectedTimes);
// const myId = 486008562;

const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      const username = msg.from.username;

      await bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/182/a1e/182a1e53-620d-41ec-937e-c4a1be34aa5d/1.webp"
      );
      return bot.sendMessage(
        chatId,
        `${username}, Ласкаво просимо в телеграм-бот для персональних тренувань! Щоб дізнатись інформацію про тренування обери команду /info. Щоб записатися на тренування обери команду /addTraining`
      );
    }

    // ------------- * KEYBOARD ---------------------

    function generateDateKeyboard() {
      moment.locale("uk");

      const dates = [];
      const keyboard = { inline_keyboard: [] };

      const daysInMonth = moment()
        .startOf("month")
        .add(1, "month")
        .daysInMonth();
      const currentDate = moment().startOf("week").add(1, "week");

      for (let i = 0; i < daysInMonth; i++) {
        const dateText = currentDate.format("ddd DD.MM");
        const callbackData = currentDate
          .format("ddd DD.MM")
          .replace(/\s+/g, "");

        dates.push({ text: dateText, callback_data: `date${callbackData}` });

        currentDate.add(1, "day");
      }

      while (dates.length > 0) {
        keyboard.inline_keyboard.push(dates.splice(0, 7));
      }

      return keyboard;
    }

    //---------------- * /ADD TRAINING налаштування виводу дати --------//

    if (text === "/addTraining") {
      const keyboard = generateDateKeyboard();
      console.log("keyboard:", keyboard);

      return bot.sendMessage(chatId, "Обери дату, коли вам зручно:", {
        reply_markup: keyboard,
      });
    }

    return bot.sendMessage(
      chatId,
      "Я вас не розумію, використайте іншу команду "
    );
  });

  //-------- * налаштування часу при обраній даті ----------//

  bot.on("callback_query", async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    const user = callbackQuery.from;
    console.log("USER:", user);
    const username = callbackQuery.from.username;
    const firstName = callbackQuery.from.first_name;
    console.log(username);
    console.log(firstName);

    if (data.startsWith("date")) {
      chatState[chatId] = data;

      let timeIntervals = [];

      const dayOfWeekStr = data.substring(7, 9);
      const dayOfWeek = parseInt(dayOfWeekStr, 10);

      if (!isNaN(dayOfWeek)) {
        console.log("Day of week:", dayOfWeek);

        if (dayOfWeek === 3 || dayOfWeek === 4) {
          timeIntervals = [
            "10:00",
            "11:00",
            "12:00",
            "13:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00",
            "18:00",
            "19:00",
          ];
        } else {
          timeIntervals = ["17:00", "18:00", "19:00"];
        }
      } else {
        console.error("Invalid dayOfWeek:", dayOfWeekStr);
        timeIntervals = ["17:00", "18:00", "19:00", "17:00", "18:00", "19:00"];
      }

      const keyboard = {
        inline_keyboard: timeIntervals.map((time) => [
          { text: time, callback_data: `time-${time}` },
        ]),
      };

      return bot.sendMessage(chatId, "Оберіть час:", {
        reply_markup: keyboard,
      });
    } else if (data.startsWith("time-")) {
      const selectedDate = chatState[chatId];
      const newSelectedDate = selectedDate.slice(4);
      const selectedTime = data.replace("time-", "");

      const selectedDateTime = `${newSelectedDate} ${selectedTime}`;

      if (!selectedTimes[selectedDate]) {
        selectedTimes[selectedDate] = [];
      }

      // Проверяем, было ли уже выбрано это время для данной даты
      if (selectedTimes[selectedDate].includes(selectedDateTime)) {
        await bot.sendMessage(chatId, `Цей час вже зайнятий. Оберіть інший.`);
      } else {
        selectedTimes[selectedDate].push(selectedDateTime);
        console.log("selectedTimes", selectedTimes);
        console.log("Chosen date array:", selectedDateTime);

        try {
          // Отправка сообщения пользователю
          await bot.sendMessage(
            chatId,
            `Ви обрали: ${newSelectedDate} ${selectedTime}`
          );

          // const myId = 392593561;
          const myId = 486008562;

          try {
            // Отправка сообщения вам напрямую
            await bot.sendMessage(
              myId,
              `${username} (${firstName}) записався на тренування у ${newSelectedDate} о(б) ${selectedTime}`
            );
          } catch (error) {
            console.error("Ошибка при отправке сообщения:", error);
          }
        } catch (error) {
          console.error("Ошибка при отправке тестового сообщения:", error);
        }
      }
    }
  });
};

start();
