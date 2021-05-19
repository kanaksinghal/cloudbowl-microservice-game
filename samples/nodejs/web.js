const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const shootingRange = 3;

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
		res.send(findBestMove(req.body));
		myDir = req.body.arena.state[req.body._links.self.href].direction
	}
});

app.post('/set', function (req, res) {
	manualCMD = udlrToFLR(req.body.move)
	console.log(req.body, myDir, manualCMD, nextDir);
	res.send(`Saved ${manualCMD}`);
});

app.listen(process.env.PORT || 8080);

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

function turnDirection(turn, curDir) {
	switch(curDir) {
		case 'N':
			return turn=='R'?'E':(turn=='L'?'W':'N')
		case 'E':
			return turn=='R'?'S':(turn=='L'?'N':'E')
		case 'S':
			return turn=='R'?'W':(turn=='L'?'E':'S')
		case 'W':
			return turn=='R'?'N':(turn=='L'?'S':'W')
	}
	return curDir
}

function findBestMove(data) {
	let mystate = data.arena.state[data._links.self.href]
	let closest = {
		N: {y: 0},
		S: {y: Number.MAX_SAFE_INTEGER},
		W: {x: 0},
		E: {x: Number.MAX_SAFE_INTEGER},
	}

	for(let p in data.arena.state) {
		if(p==data._links.self.href) {
			continue;
		}
		ps = data.arena.state[p]
		ps.p = p
		if(ps.x != mystate.x && ps.y != mystate.y) {
			continue; // in diagonal
		}

		if(ps.x==mystate.x && ps.y < mystate.y && ps.y >= closest.N.y) {
			ps.distance = mystate.y - ps.y
			closest.N = ps
		}
		else if(ps.x==mystate.x && ps.y > mystate.y && ps.y <= closest.S.y) {
			ps.distance = ps.y - mystate.y
			closest.S = ps
		}
		else if(ps.y==mystate.y && ps.x < mxstate.x && ps.x >= closest.W.x) {
			ps.distance = mystate.x - ps.x
			closest.W = ps
		}
		else if(ps.y==mystate.y && ps.x > mxstate.x && ps.x <= closest.E.x) {
			ps.distance = ps.x - mystate.x
			closest.E = ps
		}
	}

	let closestInFront = closest[mystate.direction].distance
	if(closestInFront){
		if(closestInFront <= shootingRange) {
			return 'T'
		} else if (closestInFront == (shootingRange+1)) {
			return 'F'
		}
	}

	let closestInMyRight = closest[turnDirection('R', mystate.direction)].distance
	if(closestInMyRight && closestInMyRight <= shootingRange) {
		return 'R'
	}

	let closestInMyLeft = closest[turnDirection('L', mystate.direction)].distance
	if(closestInMyLeft && closestInMyLeft <= shootingRange) {
		return 'L'
	}

	return 'T' // by chance someone may appears in front form the sides or may enter in range. so keep shooting.
}

//   N
// W   E
//   S

// {
// 	"_links": {
// 	  "self": {
// 		"href": "https://YOUR_SERVICE_URL"
// 	  }
// 	},
// 	"arena": {
// 	  "dims": [4,3], // width, height
// 	  "state": {
// 		"https://A_PLAYERS_URL": {
// 		  "x": 0, // zero-based x position, where 0 = left
// 		  "y": 0, // zero-based y position, where 0 = top
// 		  "direction": "N", // N = North, W = West, S = South, E = East
// 		  "wasHit": false,
// 		  "score": 0
// 		}
// 		... // also you and the other players
// 	  }
// 	}
//   }
