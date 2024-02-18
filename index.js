import TelegramBot from "node-telegram-bot-api";
import moment from "moment";
import dotenv from "dotenv";

dotenv.config();
const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

const chatState = {};
const selectedTimes = {};

const myId = 392593561;
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
        `${username}, Ласкаво просимо в телеграм-бот для персональних тренувань! \nЩоб записатися на тренування обери команду /addTraining \nЩоб дізнатись інформацію про тренування обери команду /info  \nЩоб дізнатись інформацію про тренера обери команду /coachInfo \nВідкрити меню /menu`
      );
    }

    // ---------------- * MENU BOT ---------------

    if (text === "/menu") {
      await bot.sendMessage(chatId, `Меню`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Загальна інформація", callback_data: "/info" }],
            [{ text: "Тренер", callback_data: "/coach" }],
            [
              {
                text: "Записатись на тренування",
                callback_data: "/addTraining",
              },
            ],
            [{ text: "Контактна інформація", callback_data: "/contact" }],
          ],
        },
      });
    }

    // ---------------- * INFO ---------------------

    if (text === "/info") {
      const address = "м. Черкаси, вулиця Вʼячеслава Чорновола, 49";
      const phoneNumber = "38000000000";
      const encryptedUrl = Buffer.from(
        "https://maps.app.goo.gl/pLkEe75VmsjmmUNx8"
      ).toString("base64");

      const message = `Дорогий учасник тренувань! Нагадуємо вам про необхідність взяти з собою змінне взуття. Якщо у вас є боксерське або борцівське взуття, воно вам буде найбільш зручним, але також можна тренуватися у босоніж. Проте, важливо пам'ятати, що взимку босоніж буде холодно, тому рекомендуємо взяти з собою змінне спортивне взуття, а також не забувайте про воду. Телефон для зв'язку з тренером: ${phoneNumber}. Адреса за якою проходять тренування: [${address}](https://maps.app.goo.gl/pLkEe75VmsjmmUNx8) . Бажаємо продуктивних та комфортних тренувань! Для того, щоб записатись на тренування обери команду наступну команду /addTraining`;

      return bot.sendMessage(chatId, message, {
        parse_mode: "Markdown",
        disable_web_page_preview: false,
      });
    }

    // ---------------- * COACH INFO ---------------------

    if (text === "/coachInfo") {
      return bot.sendMessage(
        chatId,
        "Тренер: Майдаков Дмитро, майстер спорту України з боксу, чемпіон Європи та багаторазовий чемпіон України. Має тренерську освіту та значний досвід у тренерській діяльності. Працює як з дорослими, так і з дітьми."
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
        const dateText = currentDate.format("DD.MM");
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
    if (
      text !== "/menu" &&
      text !== "/addTraining" &&
      text !== "/info" &&
      text !== "/contact" &&
      text !== "лох" &&
      text !== "Лох"
    ) {
      return bot.sendMessage(chatId, "Я вас не розумію, оберіть іншу команду");
    }
    if (text.includes("Лох") || text.includes("лох")) {
      return bot.sendMessage(chatId, "Сам ты лох");
    }
  });

  //////////////////////////////////////// data handle

  bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data.startsWith("date")) {
      const selectedDate = data.replace("date", "");
      selectedTimes[chatId] = selectedDate;
      return bot.sendMessage(chatId, `Ви обрали дату: ${selectedDate}`);
    }

    switch (data) {
      case "/info":
        const address = "м. Черкаси, вулиця Вʼячеслава Чорновола, 49";
        const phoneNumber = "38000000000";
        const encryptedUrl = Buffer.from(
          "https://maps.app.goo.gl/pLkEe75VmsjmmUNx8"
        ).toString("base64");

        const message = `Дорогий учасник тренувань! Нагадуємо вам про необхідність взяти з собою змінне взуття. Якщо у вас є боксерське або борцівське взуття, воно вам буде найбільш зручним, але також можна тренуватися у босоніж. Проте, важливо пам'ятати, що взимку босоніж буде холодно, тому рекомендуємо взяти з собою змінне спортивне взуття, а також не забувайте про воду. Телефон для зв'язку з тренером: ${phoneNumber}. Адреса за якою проходять тренування: [${address}](https://maps.app.goo.gl/pLkEe75VmsjmmUNx8) . Бажаємо продуктивних та комфортних тренувань! Для того, щоб записатись на тренування обери команду наступну команду /addTraining`;

        return bot.sendMessage(chatId, message, {
          parse_mode: "Markdown",
          disable_web_page_preview: false,
        });

      case "/coach":
        return bot.sendMessage(
          chatId,
          "Тренер: Майдаков Дмитро, майстер спорту України з боксу, чемпіон Європи та багаторазовий чемпіон України. Має тренерську освіту та значний досвід у тренерській діяльності. Працює як з дорослими, так і з дітьми."
        );

      case "/addTraining":
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
            const dateText = currentDate.format("DD.MM");
            const callbackData = currentDate
              .format("ddd DD.MM")
              .replace(/\s+/g, "");

            dates.push({
              text: dateText,
              callback_data: `date${callbackData}`,
            });

            currentDate.add(1, "day");
          }

          while (dates.length > 0) {
            keyboard.inline_keyboard.push(dates.splice(0, 7));
          }

          return keyboard;
        }

        const keyboard = generateDateKeyboard();
        console.log("keyboard:", keyboard);

        return bot.sendMessage(chatId, "Обери дату, коли вам зручно:", {
          reply_markup: keyboard,
        });

      case "/contact":
        return bot.sendMessage(
          chatId,
          "Ви можете звʼязатись зі мною у телеграм @varun_dm"
        );

      case "Обери дату, коли вам зручно:":
        const selectedDate = data.replace("date", "");
        return bot.sendMessage(chatId, `Вы выбрали время: ${selectedDate}`);
    }
  });
};

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
    console.log("dayOfWeekStr", dayOfWeekStr);
    const dayOfWeek = parseInt(dayOfWeekStr, 10);

    if (!isNaN(dayOfWeek)) {
      console.log("Day of week:", dayOfWeek);

      if (dayOfWeek === 4 || dayOfWeek === 5) {
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

    const usersWhoAccepted = {};

    if (selectedTimes[selectedDate].includes(selectedDateTime)) {
      await bot.sendMessage(chatId, `Цей час вже зайнятий. Оберіть інший 😉`);
    } else {
      await bot.sendMessage(
        chatId,
        `Ви обрали: ${newSelectedDate} ${selectedTime}. Дійсно хочете записатися на цей час?`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Так", callback_data: "yes" }],
              [{ text: "Ні", callback_data: "no" }],
            ],
          },
        }
      );
    }

    // Обработчик нажатия на кнопки
    bot.on("callback_query", async (callbackQuery) => {
      const { message, data } = callbackQuery;
      const chatId = message.chat.id;

      if (data === "yes") {
        selectedTimes[selectedDate].push(selectedDateTime);

        usersWhoAccepted[chatId] = {
          selectedDate,
          selectedTime,
          newSelectedDate,
          selectedDateTime,
        };

        try {
          await bot.sendVideo(
            chatId,
            "https://media.stickerswiki.app/boxing_video/72801.512.mp4",
            {
              caption: `Ви обрали: ${newSelectedDate} ${selectedTime} \nДякуємо, ваш запис прийнято ❤️`,
            }
          );

          try {
            await bot.sendMessage(
              myId,
              `${username} (${firstName}) записався на тренування у ${newSelectedDate} о(б) ${selectedTime}`
            );
          } catch (error) {
            console.error(error);
          }
        } catch (error) {
          console.error(error);
        }
      } else if (data === "no") {
        await bot.sendMessage(
          chatId,
          `Ви відмінили ваш вибір : ${newSelectedDate} ${selectedTime} 😉`
        );
      }
    });
  }
});

start();

//Правильно выводит время в сб и вс

// bot.on("callback_query", async (callbackQuery) => {
//   const chatId = callbackQuery.message.chat.id;
//   const data = callbackQuery.data;
//   const user = callbackQuery.from;
//   console.log("USER:", user);
//   const username = callbackQuery.from.username;
//   const firstName = callbackQuery.from.first_name;

//   if (data.startsWith("date")) {
//     chatState[chatId] = data;

//     console.log("data 237", data.slice(4, 6));

//     let timeIntervals = [];

//     const nameOfDay = data.slice(4, 6);

//     if (nameOfDay === "сб" || nameOfDay === "нд") {
//       timeIntervals = [
//         "10:00",
//         "11:00",
//         "12:00",
//         "13:00",
//         "14:00",
//         "15:00",
//         "16:00",
//         "17:00",
//         "18:00",
//         "19:00",
//       ];
//     } else {
//       timeIntervals = ["17:00", "18:00", "19:00"];
//     }

//     const keyboard = {
//       inline_keyboard: timeIntervals.map((time) => [
//         { text: time, callback_data: `time-${time}` },
//       ]),
//     };

//     return bot.sendMessage(chatId, "Оберіть час:", {
//       reply_markup: keyboard,
//     });
//   } else if (data.startsWith("time-")) {
//     const selectedDate = chatState[chatId];
//     const newSelectedDate = selectedDate.slice(4);
//     const selectedTime = data.replace("time-", "");

//     const selectedDateTime = `${newSelectedDate} ${selectedTime}`;

//     if (!selectedTimes[selectedDate]) {
//       selectedTimes[selectedDate] = [];
//     }

//     const usersWhoAccepted = {};

//     if (selectedTimes[selectedDate].includes(selectedDateTime)) {
//       await bot.sendMessage(chatId, `Цей час вже зайнятий. Оберіть інший 😉`);
//     } else {
//       await bot.sendMessage(
//         chatId,
//         `Ви обрали: ${newSelectedDate} ${selectedTime}. Дійсно хочете записатися на цей час?`,
//         {
//           reply_markup: {
//             inline_keyboard: [
//               [{ text: "Так", callback_data: "yes" }],
//               [{ text: "Ні", callback_data: "no" }],
//             ],
//           },
//         }
//       );
//     }

//     // Обработчик нажатия на кнопки
//     bot.on("callback_query", async (callbackQuery) => {
//       const { message, data } = callbackQuery;
//       const chatId = message.chat.id;

//       if (data === "yes") {
//         selectedTimes[selectedDate].push(selectedDateTime);

//         usersWhoAccepted[chatId] = {
//           selectedDate,
//           selectedTime,
//           newSelectedDate,
//           selectedDateTime,
//         };

//         try {
//           await bot.sendVideo(
//             chatId,
//             "https://media.stickerswiki.app/boxing_video/72801.512.mp4",
//             {
//               caption: `Ви обрали: ${newSelectedDate} ${selectedTime} \nДякуємо, ваш запис прийнято ❤️`,
//             }
//           );

//           try {
//             await bot.sendMessage(
//               myId,
//               `${username} (${firstName}) записався на тренування у ${newSelectedDate} о(б) ${selectedTime}`
//             );
//           } catch (error) {
//             console.error(error);
//           }
//         } catch (error) {
//           console.error(error);
//         }
//       } else if (data === "no") {
//         await bot.sendMessage(
//           chatId,
//           `Ви відмінили ваш вибір : ${newSelectedDate} ${selectedTime} 😉`
//         );
//       }
//     });
//   }
// });

// start();
