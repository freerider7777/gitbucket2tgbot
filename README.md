# gitbucket2tgbot
Send gitbucket webhooks to telegram bot in Node.js

The systems is the following:
Event in Gitbucket/TeamCity (push/pull request etc) -> webhook (POST to this service) -> send the formatted message to telegram group (simple POST)

This is a begining of a service to send events from Gitbucket (and github webhooks probably too) to telegram bot https://github.com/gitbucket/gitbucket/wiki/API-WebHook

So we can receive events in telegram group:
![image](https://github.com/freerider7777/gitbucket2tgbot/assets/6572573/e60b7e19-6ee2-43e6-988c-b90926cf3d30)

It also reveives webhooks from TeamCity:
![image](https://github.com/freerider7777/gitbucket2tgbot/assets/6572573/e7f0e409-110c-4434-8347-5afc2c054bb0)

Usage:
npm i

replace with your bot token (or use env), you can get one from BotFather (https://core.telegram.org/bots/tutorial):
const BOT_TOKEN = 'Your BOT TOKEN';

replace with your chat id (a group for a bot to send to):
const CHAT_ID = -1;

run the service:
node server.js (or start_webhook_bot.cmd for simple start on windows)

it listens on port 2020 by default

You need to also setup webhooks to /webHook in gitbucket to send to this service like so:
![image](https://github.com/freerider7777/gitbucket2tgbot/assets/6572573/b05df51a-4d84-4784-88c3-fc693c266e79)

And also in TeamCity (optional) to /tcWebHook and discord format:
![image](https://github.com/freerider7777/gitbucket2tgbot/assets/6572573/329af22a-b542-4bd7-af11-ceb74b7cb423)

Notice. It doesn't send messages at night time :) You can adjust it in checkDayTime function.
