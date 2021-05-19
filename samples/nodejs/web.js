const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

let manualCMD = '';
let myDir = '';
let nextDir = '';

app.all('/*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.post('/', function (req, res) {
	if(manualCMD) {
		res.send(manualCMD);
		myDir = nextDir;
		manualCMD = '';
	} else {
		res.send('T');
		myDir = req.body.arena.state[req.body._links.self.href].direction
	}
});

app.post('/set', function (req, res) {
	manualCMD = udlrToFLR(req.body.move)
	console.log(req.body, myDir, manualCMD, nextDir);
	res.send(`Saved ${manualCMD}`);
});

function udlrToFLR(arrow) {
	switch (myDir) {
		case 'N':
			switch (arrow) {
				case 'U':
					nextDir = 'N';
					return 'F';
				case 'D':
				case 'R':
					nextDir = 'E';
					return 'R';
				case 'L':
					nextDir = 'W';
					return 'L';
			}
			break;
		case 'E':
			switch (arrow) {
				case 'R':
					nextDir = 'E';
					return 'F';
				case 'L':
				case 'D':
					nextDir = 'S';
					return 'R';
				case 'U':
					nextDir = 'N';
					return 'L';
			}
			break;
		case 'S':
			switch (arrow) {
				case 'D':
					nextDir = 'S';
					return 'F';
				case 'L':
				case 'U':
					nextDir = 'W';
					return 'R';
				case 'R':
					nextDir = 'E';
					return 'L';
			}
			break;
		case 'W':
			switch (arrow) {
				case 'L':
					nextDir = 'W';
					return 'F';
				case 'U':
				case 'R':
					nextDir = 'N';
					return 'R';
				case 'D':
					nextDir = 'S';
					return 'L';
			}
			break;
	}
	return ''
}

app.listen(process.env.PORT || 8080);

//   N
// W   E
//   S

