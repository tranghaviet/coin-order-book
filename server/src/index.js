const express = require('express');
const socketIo = require('socket.io');
// const path = require('path');
// const axios = require('axios');

const app = express();

// app.use(function (req, res, next) {
// 	res.header("Access-Control-Allow-Origin", "http://localhost:3000");
// 	res.header("Access-Control-Allow-Methods", "DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT");
// 	res.header("Access-Control-Allow-Credentials", "true");
//
// 	next();
// });

app.get('/', (req, res) => {
	res.send('<h1>Hello from Express Server</h1>');
});
// Serve the static files from the React app
// app.use(express.static(path.join(__dirname, 'client/build')));

function random(min, max, decimals) {
	return (Math.random() * (min - max) + max).toFixed(decimals)
}

function generateOrderBook() {
	let bids = [];
	let asks = [];

	const orderBookSize = 50;

	// max total bid value = 0.01 * 1 * 50 = 0.5
	while(bids.length < orderBookSize){
		let bid = random(0.01, 0.1, 4);
		if(bids.indexOf(bid) === -1) {
			bids.push([
				parseFloat(bid),
				parseFloat(random(0.1, 1, 2)),
			]);
		}
	}

	// max total ask size = 1 * 50 = 50
	while(asks.length < orderBookSize){
		let ask = random(0.1, 0.2, 4);
		if(asks.indexOf(ask) === -1) {
			asks.push([
				parseFloat(ask),
				parseFloat(random(0.1, 1, 2)),
			]);
		}
	}

	bids.sort(function (a, b) {
		return b[0] - a[0];
	});
	asks.sort(function (a, b) {
		return a[0] - b[0];
	});

	return { bids, asks};
}

// An api endpoint that returns orderbook
// app.get('/api/getList', (req, res) => {
// 	res.json(generateOrderBook());
// 	// const axios = require('axios');
// 	//
// 	// axios.get('https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=50')
// 	// 	.then(response => {
// 	// 		res.setHeader('Cache-Control', "public, max-age=60")
// 	// 		const data = response.data;
// 	// 		data.bids = data.bids.reverse();
// 	// 		res.json(data);
// 	// 		res.json(response.data);
// 	// 		console.log('Sent list of items');
// 	// 	})
// 	// 	.catch(error => {
// 	// 		console.log(error);
// 	// 	});
// });

// Handles any requests that don't match the ones above
// app.get('*', (req, res) => {
// 	res.sendFile(path.join(__dirname + '/client/build/index.html'));
// });

const port = process.env.PORT || 5000;
const server = app.listen(port);

// ========== Socket.io ============
const io = socketIo(server, {
	cors: {
		origin: 'http://localhost:3000',
	},
}) //in case server and client run on different urls

io.on('connection', (socket) => {
	console.log('client connected: ', socket.id)

	socket.join('orderbook')

	socket.on('disconnect', (reason) => {
		console.log(reason)
	})
});

setInterval(()=>{
	io.to('orderbook').emit('time', new Date())
	io.to('orderbook').emit('orderbook', generateOrderBook())
},1000);

console.log('App is listening on port ' + port);
