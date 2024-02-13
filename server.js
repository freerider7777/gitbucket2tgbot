/**
 * @module GitBucket/TeamCity Webhook 2 Telegram bot
 * @license Apache License Version 2.0
 *
 * @author Pavel Biryukov
 * @copyright Copyright (c) Pavel Biryukov 2023
 */
const express = require("express");
const req = require("express/lib/request");
const app = express();
const fetch = require("node-fetch");
const {Headers} = require("node-fetch");

const BOT_TOKEN = 'Your BOT TOKEN';
const CHAT_ID = -1;

/** Check day time. */
function checkDayTime() {
	const currentTime = new Date();
	const startTime = new Date();
	const endTime = new Date();

	startTime.setHours(8, 0, 0); // Replace for start of day time
	endTime.setHours(23, 0, 0);  // Replace for end of day time

	if (currentTime >= startTime && currentTime <= endTime) {
		console.log("Current time is day time");
		return true;
	} else {
		console.log("Current time is NOT day time");
		return false;
	}
}

/** Send to Telegram. */
function sendWebHook(request) {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	const action = request.action || '';
	const commentBody = (request.comment && request.comment.body) === '+' ? ' (Approved!!!)' : '';
	const comment = request.comment && `<a href=\"${request.comment.html_url}\">Comment<b>${commentBody}</b></a>` || '';
	const pr = request.pull_request && `<a href=\"${request.pull_request.html_url}\">Pull request</a>` || '';
	const issue = request.issue && `Issue: <a href=\"${request.issue.html_url}\">${request.issue.title}</a>` || '';
	const txt = `Event in GitBucket
${action}
${comment}
${issue}
${pr}
Отправил(а) ${request.sender.login} 
Репозиторий <a href=\"${request.repository.html_url}\">${request.repository.name}</a>`;
const cleanedText = txt.replace(/\n{2,}/g, '\n');

	var raw = JSON.stringify({
	  chat_id: CHAT_ID,
	  parse_mode: "HTML",
	  text: cleanedText
	});
	
	var requestOptions = {
	  method: 'POST',
	  headers: myHeaders,
	  body: raw,
	  redirect: 'follow'
	};

	fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, requestOptions)
	  .then(response => response.text())
	  .then(result => console.log(result))
	  .catch(error => console.log('error', error));
}

function sendTCWebHook(request) {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	const title = request.embeds && request.embeds[0].title;
	const url = request.embeds && request.embeds[0].url;

	var raw = JSON.stringify({
	  chat_id: CHAT_ID,
	  parse_mode: "HTML",
	  text: `TeamCity event
<a href=\"${url}\">${title}</a>`
	});

	var requestOptions = {
	  method: 'POST',
	  headers: myHeaders,
	  body: raw,
	  redirect: 'follow'
	};

	fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, requestOptions)
	  .then(response => response.text())
	  .then(result => console.log(result))
	  .catch(error => console.log('error', error));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  console.log(`request:` + req.url);
  console.log(JSON.stringify(req.body));
  next();
});

app.post('/webHook', (req, res) => {
  console.log(req.body);
  
  if(checkDayTime()) {
  	sendWebHook(req.body);
  }

  res.setHeader('Content-Type', 'application/json');
  res.end(`{
    "errorMessage": "success",
    "errorcode": 0
}`);
});

app.post('/tcWebHook', (req, res) => {
  console.log(req.body);
  
  if(checkDayTime()) {
  	sendTCWebHook(req.body);
  }

  res.setHeader('Content-Type', 'application/json');
  res.end(`{
    "errorMessage": "success",
    "errorcode": 0
}`);
});

app.listen(2020, () => {
  console.log("Started TG Webhook Bot on http://localhost:2020");
});
