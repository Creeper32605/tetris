let cfg = {
	width: 10,
	height: 22,
	fheight: 20,
	scale: 30
};
Object.defineProperty(cfg, 'dp', {
	enumerable: true,
	get: function() {
		return window.devicePixelRatio || 1;
	}
});
Object.defineProperty(cfg, 'dps', {
	enumerable: true,
	get: function() {
		return cfg.scale * (window.devicePixelRatio || 1);
	}
});
let ctx;
let ctn;
{
	let canvas = document.querySelector('#main-canvas');
	ctx = canvas.getContext('2d');

	canvas.width = cfg.width * cfg.dps;
	canvas.height = cfg.fheight * cfg.dps;
	canvas.style.width = cfg.width * cfg.scale + 'px';
	canvas.style.height = cfg.fheight * cfg.scale + 'px';

	ctx.fillRect(0, 0, cfg.width * cfg.dps, cfg.fheight * cfg.dps);

	let nextitem = document.querySelector('#next-item');
	ctn = nextitem.getContext('2d');

	nextitem.width = cfg.dps * 4;
	nextitem.height = cfg.dps * 4;
	nextitem.style.width = 4 * cfg.scale + 'px';
	nextitem.style.height = 4 * cfg.scale + 'px';
}
let colors = {
	0: '#6a6a6a',
	1: '#51b4ff',
	2: '#ffe84c',
	3: '#d54097',
	4: '#22d237',
	5: '#ff2d26',
	6: '#4331ff',
	7: '#ff7a21'
};
let tetr = {
	1: [
		[[0,0,0,0],
		 [0,0,0,0],
		 [1,1,1,1],
		 [0,0,0,0]],
		[[0,1,0,0],
		 [0,1,0,0],
		 [0,1,0,0],
		 [0,1,0,0]],
		[[0,0,0,0],
		 [0,0,0,0],
		 [1,1,1,1],
		 [0,0,0,0]],
		[[0,1,0,0],
		 [0,1,0,0],
		 [0,1,0,0],
		 [0,1,0,0]]
	],
	2: [
		[[0,0,0,0],
		 [0,1,1,0],
		 [0,1,1,0],
		 [0,0,0,0]],
		[[0,0,0,0],
		 [0,1,1,0],
		 [0,1,1,0],
		 [0,0,0,0]],
		[[0,0,0,0],
		 [0,1,1,0],
		 [0,1,1,0],
		 [0,0,0,0]],
		[[0,0,0,0],
		 [0,1,1,0],
		 [0,1,1,0],
		 [0,0,0,0]]
	],
	3: [
		[[0,0,0,0],
		 [0,1,0,0],
		 [1,1,1,0],
		 [0,0,0,0]],
		[[0,0,0,0],
		 [0,1,0,0],
		 [0,1,1,0],
		 [0,1,0,0]],
		[[0,0,0,0],
		 [0,0,0,0],
		 [1,1,1,0],
		 [0,1,0,0]],
		[[0,0,0,0],
		 [0,1,0,0],
		 [1,1,0,0],
		 [0,1,0,0]]
	],
	4: [
		[[0,0,0,0],
		 [0,1,1,0],
		 [1,1,0,0],
		 [0,0,0,0]],
		[[0,0,0,0],
		 [1,0,0,0],
		 [1,1,0,0],
		 [0,1,0,0]],
		[[0,0,0,0],
		 [0,1,1,0],
		 [1,1,0,0],
		 [0,0,0,0]],
		[[0,0,0,0],
		 [1,0,0,0],
		 [1,1,0,0],
		 [0,1,0,0]]
	],
	5: [
		[[0,0,0,0],
		 [1,1,0,0],
		 [0,1,1,0],
		 [0,0,0,0]],
		[[0,0,0,0],
		 [0,1,0,0],
		 [1,1,0,0],
		 [1,0,0,0]],
		[[0,0,0,0],
		 [1,1,0,0],
		 [0,1,1,0],
		 [0,0,0,0]],
		[[0,0,0,0],
		 [0,1,0,0],
		 [1,1,0,0],
		 [1,0,0,0]]
	],
	6: [
		[[0,0,0,0],
		 [0,1,0,0],
		 [0,1,1,1],
		 [0,0,0,0]],
		[[0,0,0,0],
		 [0,1,1,0],
		 [0,1,0,0],
		 [0,1,0,0]],
		[[0,0,0,0],
		 [1,1,1,0],
		 [0,0,1,0],
		 [0,0,0,0]],
		[[0,0,1,0],
		 [0,0,1,0],
		 [0,1,1,0],
		 [0,0,0,0]]
	],
	7: [
		[[0,0,0,0],
		 [0,0,1,0],
		 [1,1,1,0],
		 [0,0,0,0]],
		[[0,1,0,0],
		 [0,1,0,0],
		 [0,1,1,0],
		 [0,0,0,0]],
		[[0,0,0,0],
		 [0,1,1,1],
		 [0,1,0,0],
		 [0,0,0,0]],
		[[0,0,0,0],
		 [0,1,1,0],
		 [0,0,1,0],
		 [0,0,1,0]]
	]
};
let drawBlock = function(x, y, c, cto) {
	let ctv = cto || ctx;
	ctv.fillStyle = colors[c] || 'white';
	ctv.fillRect(Math.round(x * cfg.dps), Math.round((19 - y) * cfg.dps), cfg.dps, cfg.dps);
};
let grid;
let resetGrid = function() {
	grid = [];
	for (let y = 0; y < 22; y++) {
		let ln = [];
		for (let x = 0; x < 10; x++) {
			ln.push(0);
		}
		grid.push(ln);
	}
};
resetGrid();

let drawGrid = function() {
	for (let y = 0; y < 20; y++) {
		for (let x = 0; x < 10; x++) {
			drawBlock(x, y, grid[y][x]);
		}
	}
};
drawGrid();

let ActiveTetr = class ActiveTetr {
	constructor(type) {
		this.type = Math.max(Math.min(type, 7), 0) || Math.floor(7 * Math.random()) + 1;
		this.rotation = 0;
		this.shape = tetr[this.type][this.rotation];
		this.x = 3;
		this.y = 20;
		this.c = ctx;
	}
	draw() {
		for (let y = 0; y < 4; y++) {
			for (let x = 0; x < 4; x++) {
				if(this.shape[y][x] == 1) {
					drawBlock(this.x + x, this.y - y, this.type, this.c);
				}
			}
		}
	}
	rotate(d) {
		this.rotation = (this.rotation + 4 + d) % 4;
		this.shape = tetr[this.type][this.rotation];
		this.move(0, 0);
	}
	hasCollided() {
		for (let y = 0; y < 4; y++) {
			for (let x = 0; x < 4; x++) {
				if(this.shape[y][x] == 1) {
					if (grid[this.y - y - 1] && grid[this.y - y - 1][this.x + x] > 0) {
						return true;
					} else if (this.y - y == 0) {
						return true;
					}
				}
			}
		}
		return false;
	}
	isOutOfBounds() {
		let dx = 0;
		let dy = 0;
		for (let y = 0; y < 4; y++) {
			for (let x = 0; x < 4; x++) {
				if(this.shape[y][x] == 1) {
					let qy = this.y - y, qx = this.x + x;
					if (qy < 0) dy = qy;
					if (qy > 21) dy = qy - 21;
					if (qx < 0) dx = -qx;
					if (qx > 9) dx = -(qx - 9);
					if (grid[qy] && grid[qy][qx] > 0 && grid[qy][qx - 1] > 0) dx = 1;
					if (grid[qy] && grid[qy][qx] > 0 && grid[qy][qx + 1] > 0) dx = -1;
				}
			}
		}
		return dx == 0 && dy == 0 ? false : [dx, dy];
	}
	move(x, y) {
		if (this.hasCollided()) return;
		this.x = !isNaN(x) ? this.x + x : this.x;
		this.y = !isNaN(y) ? this.y - y : this.y;
		let dlp = this.isOutOfBounds();
		if (dlp) {
			this.x += dlp[0];
			this.y -= dlp[1];
		}
	}
	project() {
		for (let y = 0; y < 4; y++) {
			for (let x = 0; x < 4; x++) {
				if(grid[this.y - y] && grid[this.y - y][this.x + x] !== undefined && this.shape[y][x] == 1) {
					grid[this.y - y][this.x + x] = this.type;
				}
			}
		}
	}
};

let queue = [];
let genQueue = function() {
	let t = [1, 2, 3, 4, 5, 6, 7];
	for (let j, x, i = t.length; i; j = Math.floor(Math.random() * i), x = t[--i], t[i] = t[j], t[j] = x);
	queue = queue.concat(t);
};

let lastMove = Date.now();
let speed = 300;
let currentTile = null;
let nextTile = null;

let newCurrentTile = function() {
	if (queue.length < 5) genQueue();
	currentTile = new ActiveTetr(queue[0]);
	nextTile = new ActiveTetr(queue[1]);
	nextTile.c = ctn;
	nextTile.x = 0;
	nextTile.y = 19;
	queue.splice(0, 1);
};

let willAddNewTile = false;
let gameLoop = function() {
	requestAnimationFrame(gameLoop);

	if (!currentTile) newCurrentTile();
	if (lastMove < Date.now() - speed) {
		if (!willAddNewTile) {
			currentTile.move(0, 1);
			lastMove = Date.now();
			if(currentTile.hasCollided()) {
				willAddNewTile = true;
			}
		} else if (currentTile.hasCollided()) {
			willAddNewTile = false;
			currentTile.project();
			newCurrentTile();
		} else if (!currentTile.hasCollided()) {
			willAddNewTile = false;
		}
	}
	let itemOnLastLine = false;
	for (let i of grid[18]) {
		if (i > 0) itemOnLastLine = true;
	}

	if (itemOnLastLine) {
		resetGrid();
		newCurrentTile();
	}
	for (let ln in grid) {
		let items = 0;
		for (let i of grid[ln]) {
			if (i > 0) items++;
		}
		if (items == 10) {
			grid.splice(ln, 1);
			grid.push([0,0,0,0,0,0,0,0,0,0]);
		}
	}


	drawGrid();
	currentTile.draw();
	ctn.clearRect(0, 0, 4 * cfg.dps, 4 * cfg.dps);
	nextTile.draw();
};
gameLoop();

{
	window.addEventListener('keydown', function(e) {
		if (currentTile) {
			if (e.which == 72) {
				currentTile.move(-1);
			} else if (e.which == 74) {
				currentTile.rotate(-1);
			} else if (e.which == 75) {
				currentTile.rotate(1);
			} else if (e.which == 76) {
				currentTile.move(1);
			} else if (e.which == 32) {
				currentTile.move(0, 1);
			}
		}
	});
}