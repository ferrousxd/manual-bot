const {
  Telegraf,
  session,
  Markup,
  Scenes: { BaseScene, Stage },
} = require('telegraf');
const {
  categoriesTitle,
  firstCategoryText,
  secondCategoryText,
  thirdCategoryText,
} = require('./constants');

const remove_keyboard = Markup.removeKeyboard();
const start_scene_keyboard = Markup.keyboard([
  'Узнать информацию по категориям студентов',
  'Загрузить вложения по производственной практике',
]).resize();
const categories_scene_keyboard = Markup.keyboard([
  'I категория',
  'II категория',
  'III категория',
  '⬅️ Назад',
]).resize();
const files_scene_keyboard = Markup.keyboard([
  'Группы и руководители практики от Университета',
  'Договор двусторонний',
  'Договор на практику трехсторонний',
  'Заявление на перезачет',
  'Образец отчета + титульный',
  'Образец плана-графика',
  'Образец характеристики',
  '⬅️ Назад',
]);

const startScene = new BaseScene('startScene');
startScene.enter(async (ctx) => {
  await ctx
    .reply('Добро пожаловать в гид по производственной практики AITU')
    .catch((error) => console.error(error));
  return ctx
    .reply('Выберите действие из меню с кнопками', start_scene_keyboard)
    .catch((error) => console.error(error));
});
startScene.hears('Узнать информацию по категориям студентов', (ctx) =>
  ctx.scene.enter('categoriesScene')
);
startScene.hears('Загрузить вложения по производственной практике', (ctx) =>
  ctx.scene.enter('filesScene')
);

const categoriesScene = new BaseScene('categoriesScene');
categoriesScene.enter(async (ctx) => {
  await ctx.reply(categoriesTitle).catch((error) => console.error(error));
  return ctx
    .reply(
      'Выберите нужную вам категорию из меню с кнопками',
      categories_scene_keyboard
    )
    .catch((error) => console.error(error));
});
categoriesScene.hears('I категория', (ctx) =>
  ctx.replyWithHTML(firstCategoryText).catch((error) => console.error(error))
);
categoriesScene.hears('II категория', (ctx) =>
  ctx.replyWithHTML(secondCategoryText).catch((error) => console.error(error))
);
categoriesScene.hears('III категория', (ctx) =>
  ctx.replyWithHTML(thirdCategoryText).catch((error) => console.error(error))
);

const filesScene = new BaseScene('filesScene');
filesScene.enter(async (ctx) =>
  ctx.reply('Выберите интересующий вас файл', files_scene_keyboard)
);
filesScene.hears('Группы и руководители практики от Университета', (ctx) =>
  ctx
    .replyWithDocument({
      source:
        './attachments/Группы_и_руководители_практики_от_Университета.xlsx',
    })
    .catch((error) => console.error(error))
);
filesScene.hears('Договор двусторонний', (ctx) =>
  ctx
    .replyWithDocument({ source: './attachments/Договор_двусторонний.docx' })
    .catch((error) => console.error(error))
);
filesScene.hears('Договор на практику трехсторонний', (ctx) =>
  ctx
    .replyWithDocument({
      source: './attachments/Договор_на_практику_трехсторонний.docx',
    })
    .catch((error) => console.error(error))
);
filesScene.hears('Заявление на перезачет', (ctx) =>
  ctx
    .replyWithDocument({
      source: './attachments/Заявление_на_перезачет.docx',
    })
    .catch((error) => console.error(error))
);
filesScene.hears('Образец отчета + титульный', (ctx) =>
  ctx
    .replyWithDocument({
      source: './attachments/Образец_отчета_+_титульный.docx',
    })
    .catch((error) => console.error(error))
);
filesScene.hears('Образец плана-графика', (ctx) =>
  ctx
    .replyWithDocument({ source: './attachments/Образец_плана-графика.docx' })
    .catch((error) => console.error(error))
);
filesScene.hears('Образец характеристики', (ctx) =>
  ctx
    .replyWithDocument({ source: './attachments/Образец_характеристики.docx' })
    .catch((error) => console.error(error))
);

const stage = new Stage([startScene, categoriesScene, filesScene]);
stage.hears('⬅️ Назад', async (ctx) => {
  await ctx.scene.leave();
  return ctx.scene.enter('startScene');
});

const BOT_TOKEN = process.env.BOT_TOKEN;

const bot = new Telegraf(BOT_TOKEN);
bot.use(session(), stage.middleware());
bot.command('start', (ctx) => ctx.scene.enter('startScene', remove_keyboard));
bot.on('text', (ctx) =>
  ctx
    .reply(
      'Я вас не понимаю. Попробуйте ввести команду /start для перезапуска бота'
    )
    .catch((error) => console.error(error))
);
bot.launch();