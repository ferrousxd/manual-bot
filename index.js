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
]).resize();

const startScene = new BaseScene('startScene');
startScene.enter((ctx) =>
  ctx.reply('Выберите действие из меню с кнопками', start_scene_keyboard)
);
startScene.hears('Узнать информацию по категориям студентов', (ctx) =>
  ctx.scene.enter('categoriesScene')
);
startScene.hears('Загрузить вложения по производственной практике', (ctx) =>
  ctx.scene.enter('filesScene')
);

const categoriesScene = new BaseScene('categoriesScene');
categoriesScene.enter(async (ctx) => {
  await ctx.reply(categoriesTitle);
  return ctx.reply(
    'Выберите нужную вам категорию из меню с кнопками',
    categories_scene_keyboard
  );
});
categoriesScene.hears('I категория', (ctx) =>
  ctx.replyWithHTML(firstCategoryText)
);
categoriesScene.hears('II категория', (ctx) =>
  ctx.replyWithHTML(secondCategoryText)
);
categoriesScene.hears('III категория', (ctx) =>
  ctx.replyWithHTML(thirdCategoryText)
);

const filesScene = new BaseScene('filesScene');
filesScene.enter(async (ctx) =>
  ctx.reply('Выберите интересующий вас файл', files_scene_keyboard)
);
filesScene.hears('Группы и руководители практики от Университета', (ctx) =>
  ctx.replyWithDocument({
    source: './attachments/Группы_и_руководители_практики_от_Университета.xlsx',
  })
);
filesScene.hears('Договор двусторонний', (ctx) =>
  ctx.replyWithDocument({ source: './attachments/Договор_двусторонний.docx' })
);
filesScene.hears('Договор на практику трехсторонний', (ctx) =>
  ctx.replyWithDocument({
    source: './attachments/Договор_на_практику_трехсторонний.docx',
  })
);
filesScene.hears('Заявление на перезачет', (ctx) =>
  ctx.replyWithDocument({
    source: './attachments/Заявление_на_перезачет.docx',
  })
);
filesScene.hears('Образец отчета + титульный', (ctx) =>
  ctx.replyWithDocument({
    source: './attachments/Образец_отчета_+_титульный.docx',
  })
);
filesScene.hears('Образец плана-графика', (ctx) =>
  ctx.replyWithDocument({ source: './attachments/Образец_плана-графика.docx' })
);
filesScene.hears('Образец характеристики', (ctx) =>
  ctx.replyWithDocument({ source: './attachments/Образец_характеристики.docx' })
);

const stage = new Stage([startScene, categoriesScene, filesScene]);
stage.hears('⬅️ Назад', async (ctx) => {
  await ctx.scene.leave();
  return ctx.scene.enter('startScene');
});

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session(), stage.middleware());
bot.command('start', async (ctx) => {
  await ctx.reply('Добро пожаловать в гид по производственной практики AITU');
  return ctx.scene.enter('startScene', remove_keyboard);
});
bot.on('text', (ctx) =>
  ctx.reply(
    'Я вас не понимаю. Попробуйте ввести команду /start для перезапуска бота'
  )
);
bot.catch((error) => console.error(error));
bot.launch();
