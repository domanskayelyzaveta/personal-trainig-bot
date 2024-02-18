// import TelegramBot from "node-telegram-bot-api";
// import moment from "moment";
// import dotenv from "dotenv";

// dotenv.config();
// const token = process.env.TOKEN;

// const bot = new TelegramBot(token, { polling: true });

// const chatState = {};
// const selectedTimes = {};

// const myId = 392593561;

// const start = () => {
//   bot.on("message", async (msg) => {
//     const text = msg.text;
//     const chatId = msg.chat.id;

//     if (text === "/start") {
//       const username = msg.from.username;

//       await bot.sendSticker(
//         chatId,
//         "https://tlgrm.ru/_/stickers/182/a1e/182a1e53-620d-41ec-937e-c4a1be34aa5d/1.webp"
//       );
//       return bot.sendMessage(
//         chatId,
//         `${username}, Ласкаво просимо в телеграм-бот для персональних тренувань! \nЩоб записатися на тренування обери команду /addTraining \nЩоб дізнатись інформацію про тренування обери команду /info  \nЩоб дізнатись інформацію про тренера обери команду /coachInfo \nВідкрити меню /menu`
//       );
//     }

//     // ---------------- * MENU BOT ---------------

//     if (msg.text == "/menu") {
//       await bot.sendMessage(msg.chat.id, `Меню`, {
//         reply_markup: {
//           keyboard: [
//             ["Загальна інформація", "Тренер"],
//             ["Записатись на тренування", "Контактна інформація"],
//           ],
//         },
//       });
//     }

//     // ---------------- * INFO ---------------------

//     if (text === "/info") {
//       const address = "м. Черкаси, вулиця Вʼячеслава Чорновола, 49";
//       const phoneNumber = "38000000000";
//       const encryptedUrl = Buffer.from(
//         "https://maps.app.goo.gl/pLkEe75VmsjmmUNx8"
//       ).toString("base64");

//       const message = `Дорогий учасник тренувань! Нагадуємо вам про необхідність взяти з собою змінне взуття. Якщо у вас є боксерське або борцівське взуття, воно вам буде найбільш зручним, але також можна тренуватися у босоніж. Проте, важливо пам'ятати, що взимку босоніж буде холодно, тому рекомендуємо взяти з собою змінне спортивне взуття, а також не забувайте про воду. Телефон для зв'язку з тренером: ${phoneNumber}. Адреса за якою проходять тренування: [${address}](https://maps.app.goo.gl/pLkEe75VmsjmmUNx8) . Бажаємо продуктивних та комфортних тренувань! Для того, щоб записатись на тренування обери команду наступну команду /addTraining`;

//       return bot.sendMessage(chatId, message, {
//         parse_mode: "Markdown",
//         disable_web_page_preview: false,
//       });
//     }

//     // ---------------- * COACH INFO ---------------------

//     if (text === "/coachInfo") {
//       return bot.sendMessage(
//         chatId,
//         "Тренер: Майдаков Дмитро, майстер спорту України з боксу, чемпіон Європи та багаторазовий чемпіон України. Має тренерську освіту та значний досвід у тренерській діяльності. Працює як з дорослими, так і з дітьми."
//       );
//     }

//     // ------------- * KEYBOARD ---------------------

//     function generateDateKeyboard() {
//       moment.locale("uk");

//       const dates = [];
//       const keyboard = { inline_keyboard: [] };

//       const daysInMonth = moment()
//         .startOf("month")
//         .add(1, "month")
//         .daysInMonth();
//       const currentDate = moment().startOf("week").add(1, "week");

//       for (let i = 0; i < daysInMonth; i++) {
//         const dateText = currentDate.format("DD.MM");
//         const callbackData = currentDate
//           .format("ddd DD.MM")
//           .replace(/\s+/g, "");

//         dates.push({ text: dateText, callback_data: `date${callbackData}` });

//         currentDate.add(1, "day");
//       }

//       while (dates.length > 0) {
//         keyboard.inline_keyboard.push(dates.splice(0, 7));
//       }

//       return keyboard;
//     }

//     //---------------- * /ADD TRAINING налаштування виводу дати --------//

//     if (text === "/addTraining") {
//       const keyboard = generateDateKeyboard();
//       console.log("keyboard:", keyboard);

//       return bot.sendMessage(chatId, "Обери дату, коли вам зручно:", {
//         reply_markup: keyboard,
//       });
//     }

//     return bot.sendMessage(
//       chatId,
//       "Я вас не розумію, використайте іншу команду "
//     );
//   });

//   //-------- * налаштування часу при обраній даті ----------//

//   bot.on("callback_query", async (callbackQuery) => {
//     const chatId = callbackQuery.message.chat.id;
//     const data = callbackQuery.data;
//     const user = callbackQuery.from;
//     console.log("USER:", user);
//     const username = callbackQuery.from.username;
//     const firstName = callbackQuery.from.first_name;
//     console.log(username);
//     console.log(firstName);

//     if (data.startsWith("date")) {
//       chatState[chatId] = data;

//       let timeIntervals = [];

//       const dayOfWeekStr = data.substring(7, 9);
//       const dayOfWeek = parseInt(dayOfWeekStr, 10);

//       if (!isNaN(dayOfWeek)) {
//         console.log("Day of week:", dayOfWeek);

//         if (dayOfWeek === 3 || dayOfWeek === 4) {
//           timeIntervals = [
//             "10:00",
//             "11:00",
//             "12:00",
//             "13:00",
//             "14:00",
//             "15:00",
//             "16:00",
//             "17:00",
//             "18:00",
//             "19:00",
//           ];
//         } else {
//           timeIntervals = ["17:00", "18:00", "19:00"];
//         }
//       } else {
//         console.error("Invalid dayOfWeek:", dayOfWeekStr);
//         timeIntervals = ["17:00", "18:00", "19:00", "17:00", "18:00", "19:00"];
//       }

//       const keyboard = {
//         inline_keyboard: timeIntervals.map((time) => [
//           { text: time, callback_data: `time-${time}` },
//         ]),
//       };

//       return bot.sendMessage(chatId, "Оберіть час:", {
//         reply_markup: keyboard,
//       });
//     } else if (data.startsWith("time-")) {
//       const selectedDate = chatState[chatId];
//       const newSelectedDate = selectedDate.slice(4);
//       const selectedTime = data.replace("time-", "");

//       const selectedDateTime = `${newSelectedDate} ${selectedTime}`;

//       if (!selectedTimes[selectedDate]) {
//         selectedTimes[selectedDate] = [];
//       }

//       // Проверяем, было ли уже выбрано это время для данной даты
//       if (selectedTimes[selectedDate].includes(selectedDateTime)) {
//         await bot.sendMessage(chatId, `Цей час вже зайнятий. Оберіть інший.`);
//       } else {
//         selectedTimes[selectedDate].push(selectedDateTime);
//         console.log("selectedTimes", selectedTimes);
//         console.log("Chosen date array:", selectedDateTime);

//         try {
//           // Отправка сообщения пользователю
//           await bot.sendMessage(
//             chatId,
//             `Ви обрали: ${newSelectedDate} ${selectedTime}. \nДякуємо, ваш запис прийнято.`
//           );

//           // const myId = 392593561;
//           // const myId = 486008562;

//           try {
//             await bot.sendMessage(
//               myId,
//               `${username} (${firstName}) записався на тренування у ${newSelectedDate} о(б) ${selectedTime}`
//             );
//           } catch (error) {
//             console.error("Ошибка при отправке сообщения:", error);
//           }
//         } catch (error) {
//           console.error("Ошибка при отправке тестового сообщения:", error);
//         }
//       }
//     }
//   });
// };

// start();

/////////////////////-------------------------------------------_///////////////

// import TelegramBot from "node-telegram-bot-api";
// import moment from "moment";
// import dotenv from "dotenv";

// dotenv.config();
// const token = process.env.TOKEN;

// const bot = new TelegramBot(token, { polling: true });

// const chatState = {};
// const selectedTimes = {};

// const myId = 392593561;

// const start = () => {
//   // Обработчики команд
//   bot.onText(/\/info/, async (msg) => {
//     const chatId = msg.chat.id;
//     const address = "м. Черкаси, вулиця Вʼячеслава Чорновола, 49";
//     const phoneNumber = "38000000000";
//     const encryptedUrl = Buffer.from(
//       "https://maps.app.goo.gl/pLkEe75VmsjmmUNx8"
//     ).toString("base64");
//     const message = `Адреса: ${address}\nТелефон: ${phoneNumber}\n[Карта](https://maps.app.goo.gl/pLkEe75VmsjmmUNx8)`;
//     await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
//   });

//   // Обработчики сообщений
//   bot.on("message", async (msg) => {
//     const text = msg.text;
//     const chatId = msg.chat.id;

//     if (text === "/start") {
//       const username = msg.from.username;

//       await bot.sendSticker(
//         chatId,
//         "https://tlgrm.ru/_/stickers/182/a1e/182a1e53-620d-41ec-937e-c4a1be34aa5d/1.webp"
//       );
//       return bot.sendMessage(
//         chatId,
//         `${username}, Ласкаво просимо в телеграм-бот для персональних тренувань! \nЩоб записатися на тренування обери команду /addTraining \nЩоб дізнатись інформацію про тренування обери команду /info  \nЩоб дізнатись інформацію про тренера обери команду /coachInfo \nВідкрити меню /menu`
//       );
//     }

//     // ---------------- * MENU BOT ---------------

//     if (text === "/menu") {
//       await bot.sendMessage(chatId, `Меню`, {
//         reply_markup: {
//           inline_keyboard: [
//             [{ text: "Загальна інформація", callback_data: "/info" }],
//             [{ text: "Тренер", callback_data: "/coach" }],
//             [
//               {
//                 text: "Записатись на тренування",
//                 callback_data: "/addTraining",
//               },
//             ],
//             [{ text: "Контактна інформація", callback_data: "/contact" }],
//           ],
//         },
//       });
//     }

//     return bot.sendMessage(
//       chatId,
//       "Я вас не розумію, використайте іншу команду "
//     );
//   });

//   // Обработчики callback-запросов
//   bot.on("callback_query", async (callbackQuery) => {
//     const chatId = callbackQuery.message.chat.id;
//     const data = callbackQuery.data;

//     // Если нажата кнопка "Загальна інформація"

//     if (data === "/info") {
//       const address = "м. Черкаси, вулиця Вʼячеслава Чорновола, 49";
//       const phoneNumber = "38000000000";
//       const encryptedUrl = Buffer.from(
//         "https://maps.app.goo.gl/pLkEe75VmsjmmUNx8"
//       ).toString("base64");

//       const message = `Дорогий учасник тренувань! Нагадуємо вам про необхідність взяти з собою змінне взуття. Якщо у вас є боксерське або борцівське взуття, воно вам буде найбільш зручним, але також можна тренуватися у босоніж. Проте, важливо пам'ятати, що взимку босоніж буде холодно, тому рекомендуємо взяти з собою змінне спортивне взуття, а також не забувайте про воду. Телефон для зв'язку з тренером: ${phoneNumber}. Адреса за якою проходять тренування: [${address}](https://maps.app.goo.gl/pLkEe75VmsjmmUNx8) . Бажаємо продуктивних та комфортних тренувань! Для того, щоб записатись на тренування обери команду наступну команду /addTraining`;

//       return bot.sendMessage(chatId, message, {
//         parse_mode: "Markdown",
//         disable_web_page_preview: false,
//       });
//     }

//     // Если нажата кнопка "Записатись на тренування"
//     if (data === "/addTraining") {
//       const keyboard = generateDateKeyboard();
//       console.log("keyboard:", keyboard);

//       return bot.sendMessage(chatId, "Обери дату, коли вам зручно:", {
//         reply_markup: keyboard,
//       });
//     }

//     // Если нажата кнопка "Тренер"
//     if (data === "/coach") {
//       return bot.sendMessage(
//         chatId,
//         "Тренер: Майдаков Дмитро, майстер спорту України з боксу, чемпіон Європи та багаторазовий чемпіон України. Має тренерську освіту та значний досвід у тренерській діяльності. Працює як з дорослими, так і з дітьми."
//       );
//     }

//     // ------------- * KEYBOARD ---------------------

//     function generateDateKeyboard() {
//       moment.locale("uk");

//       const dates = [];
//       const keyboard = { inline_keyboard: [] };

//       const daysInMonth = moment()
//         .startOf("month")
//         .add(1, "month")
//         .daysInMonth();
//       const currentDate = moment().startOf("week").add(1, "week");

//       for (let i = 0; i < daysInMonth; i++) {
//         const dateText = currentDate.format("DD.MM");
//         const callbackData = currentDate
//           .format("ddd DD.MM")
//           .replace(/\s+/g, "");

//         dates.push({ text: dateText, callback_data: `date${callbackData}` });

//         currentDate.add(1, "day");
//       }

//       while (dates.length > 0) {
//         keyboard.inline_keyboard.push(dates.splice(0, 7));
//       }

//       return keyboard;
//     }

//     //////////

//     // Если нажата кнопка "Контактна інформація"
//     if (data === "/contact") {
//       return bot.sendMessage(chatId, "Контактна інформація");
//     }

//     // Если нажата кнопка с датой
//     if (data.startsWith("date")) {
//       chatState[chatId] = data;

//       let timeIntervals = [];

//       const dayOfWeekStr = data.substring(7, 9);
//       const dayOfWeek = parseInt(dayOfWeekStr, 10);

//       if (!isNaN(dayOfWeek)) {
//         console.log("Day of week:", dayOfWeek);

//         if (dayOfWeek === 3 || dayOfWeek === 4) {
//           timeIntervals = [
//             "10:00",
//             "11:00",
//             "12:00",
//             "13:00",
//             "14:00",
//             "15:00",
//             "16:00",
//             "17:00",
//             "18:00",
//             "19:00",
//           ];
//         } else {
//           timeIntervals = ["17:00", "18:00", "19:00"];
//         }
//       } else {
//         console.error("Invalid dayOfWeek:", dayOfWeekStr);
//         timeIntervals = ["17:00", "18:00", "19:00", "17:00", "18:00", "19:00"];
//       }

//       const keyboard = {
//         inline_keyboard: timeIntervals.map((time) => [
//           { text: time, callback_data: `time-${time}` },
//         ]),
//       };

//       return bot.sendMessage(chatId, "Оберіть час:", {
//         reply_markup: keyboard,
//       });
//     }

//     // Если нажата кнопка с временем
//     if (data.startsWith("time-")) {
//       const selectedDate = chatState[chatId];
//       const newSelectedDate = selectedDate.slice(4);
//       const selectedTime = data.replace("time-", "");

//       const selectedDateTime = `${newSelectedDate} ${selectedTime}`;

//       if (!selectedTimes[selectedDate]) {
//         selectedTimes[selectedDate] = [];
//       }

//       // Проверяем, было ли уже выбрано это время для данной даты
//       if (selectedTimes[selectedDate].includes(selectedDateTime)) {
//         await bot.sendMessage(chatId, `Цей час вже зайнятий. Оберіть інший.`);
//       } else {
//         selectedTimes[selectedDate].push(selectedDateTime);
//         console.log("selectedTimes", selectedTimes);
//         console.log("Chosen date array:", selectedDateTime);

//         try {
//           // Отправка сообщения пользователю
//           await bot.sendMessage(
//             chatId,
//             `Ви обрали: ${newSelectedDate} ${selectedTime}. \nДякуємо, ваш запис прийнято.`
//           );

//           // const myId = 392593561;
//           // const myId = 486008562;

//           try {
//             await bot.sendMessage(
//               myId,
//               `${username} (${firstName}) записався на тренування у ${newSelectedDate} о(б) ${selectedTime}`
//             );
//           } catch (error) {
//             console.error("Ошибка при отправке сообщения:", error);
//           }
//         } catch (error) {
//           console.error("Ошибка при отправке тестового сообщения:", error);
//         }
//       }
//     }
//   });
// };

// start();
