# Козак - Discord бот з відкритим кодом для українців!

Ми розробили бота, поглядаючи та захоплюючись українським інфопростором.

З великою подякою до усіх, хто розвиває українськомовний інтернет ❤️❤️❤️

# Додавання бота до себе на сервер

[Натисніть сюди](https://discord.com/oauth2/authorize?client_id=797395030851059713&permissions=1495655312618&scope=bot%20applications.commands) щоб перейти до процесу додавання бота на свій сервер.

# Встановлення бота до роботи

### Одразу після добавлення рекомендуємо встановити канал для сповіщень про події.

**Цей канал повинен бути доступним тільки для модераторів, а писати в ньому повинен тільки бот.**

Встановіть канал за допомогою `/prefs log channel`

![image](https://github.com/RomaDevWorld/cossac/assets/50528338/60bd55c0-3265-4a71-beb7-dc3bdd927916)

**Також не забудьте вказати, які типи сповіщень будуть відправлятись в канал** `/prefs log switch`

![image](https://github.com/RomaDevWorld/cossac/assets/50528338/286026a8-1a05-4a3b-8e41-7342bbdb33b8)

### Встановіть "Лобі" для створення приватних голосових кімнат

**Приватні голосові кімнати - це канали які створюються у Вас на сервері в окремій категорії та до яких буде мати доступ тільки їх творець та всі, кого він запросив**

Приєднайтесь до встановленого вами голосового каналу, бот повинен автоматично перемістити вас у новостворений канал з вашим іменем

![image](https://github.com/RomaDevWorld/cossac/assets/50528338/508d11cb-5e4b-4c5b-8f13-f8ad55925cf0)

Після цього, ви маєте можливість різноманітно керувати вашим особистим каналом: Запрошувати учасників, робити його публічним, керувати лімітом одночасних користувачів в каналі

![image](https://github.com/RomaDevWorld/cossac/assets/50528338/430daa52-77d8-4748-9c96-71d72d35ae79)

`/prefs vclobby`

![image](https://github.com/RomaDevWorld/cossac/assets/50528338/af8846a9-d33f-4ea6-995a-1d5ca769fffa)

### Встановіть лічильник учасників

**Бот автоматично оновлює назву вказаного Вами каналу відповідно до кількості учасників на сервері.**

`/prefs counter set`

![image](https://github.com/RomaDevWorld/cossac/assets/50528338/5492527b-9a9a-421f-9fb4-b222213bcb7d)

Дізнайтесь більше про лічильники [за посиланням](https://github.com/RomaDevWorld/RomaDevWorld/blob/master/cossac/counters-guide-assets/counters-guide.md)

### Ролі за реакції

Використовуйте команду `/prefs colors`, вказавши префікс ролей

![image](https://github.com/RomaDevWorld/cossac/assets/50528338/00bb7c59-835e-4ac2-815b-197fc401fe41)

Тепер, створіть ролі, назви яких будуть починатись з вказаного вами раніше символу

![image](https://github.com/RomaDevWorld/cossac/assets/50528338/d57d98f8-9e20-4ab6-9c90-074d0df3dad7)

Зачекайте поки хтось використає команду `/color`, або скористайтесь нею самі, ви повинні побачити список ролей, які доступні для видачі

![image](https://github.com/RomaDevWorld/cossac/assets/50528338/6a51bdbb-3e05-4155-8e69-95c02175992b)

### Відновлення та автоматична видача ролей

Використовуйте команду `/prefs roles restore`, щоб керувати функцією автоматичного відновлення ролей та нікнейму, у випадку якщо учасник пере зайде на сервер

![image](https://github.com/RomaDevWorld/cossac/assets/50528338/bbf9c337-6b3a-4d0c-be1e-c5cb0936a37a)

Скористайтесь командою `/prefs roles autorole`, щоб встановити роль, що буде автоматичного видана, як тільки учасник зайде на сервер

![image](https://github.com/RomaDevWorld/cossac/assets/50528338/96a56283-fe65-454b-b21a-f9b701f5a8cc)

### Система тікетів

Використайте команду `/ticket`, щоб надати можливість користувачам створювати тікети

![image](https://github.com/RomaDevWorld/cossac/assets/50528338/9f593f4f-444e-4c31-a752-baa83e0850db)

**Примітка:** Без вказування додаткових параметрів, створені тікети зможуть бачити тільки учасники з правом "Адміністратор", та учасник, який створив тікет.

Приклад тікету:

![image](https://github.com/RomaDevWorld/cossac/assets/50528338/255cc96e-7fcb-454e-85f2-f8e95ba40c17)

### Модеруйте зручніше

Команди, що допоможуть керувати сервером: `/warn`, `/mute`, `/purge`

![image](https://github.com/RomaDevWorld/cossac/assets/50528338/8bb3e448-e217-4d96-b91b-e4f2909f1caa)

### Визначайте судьбу через магію або демократію, кидайте кубики

![image](https://github.com/RomaDevWorld/cossac/assets/50528338/48d1ad6b-aa89-4861-82da-86a7fb9e4e54)

### Пес Патрон та Кіт ...?

Команди `/dog` та `/cat`

![Patron](https://github.com/RomaDevWorld/cossac/assets/50528338/ba12d48b-2ebe-44f2-8875-5f81e53d50ed)

# Вимикання окремих команд

Якщо Ви хочете вимкнути команду для усіх або конкретних учасників, Ви можете це зробити в

```
Налаштування серверу -> Інтеграції -> Kozak
```

![image](https://github.com/RomaDevWorld/cossac/assets/50528338/3b8dc956-3c45-439d-baf2-787741babb73)

**Команди продовжать працювати для тих, в кого є право "Адміністратор"**

# Кооперування

```bash
git clone https://github.com/RomaDevWorld/cossac/
```

Ми вітаємо запити на добавлення. Для великих змін, будь ласка спочатку [відкрийте нову дискусію](https://github.com/RomaDevWorld/cossac/issues) та обговоріть що ви хочете змінити/додати.

### Дякуємо що довіряєте нам 😘
