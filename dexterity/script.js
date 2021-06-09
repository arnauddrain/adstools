let RATIO = 2;
let WIDTH = 800;
let HEIGHT = 600;

let content = '';

function extractValue(measurements, index, name) {
	for (let i = 0; i < measurements[index].length; i++) {
		if (measurements[index][i].name == name) {
			return measurements[index][i].value;
		}
	}
	return 0;
}

function addFirstAndLastPoints(ctx, measurements) {
	const firstX = extractValue(measurements, 0, 'x') / RATIO;
	const firstY = extractValue(measurements, 0, 'y') / RATIO;
	ctx.fillStyle = 'red';
	ctx.fillRect(firstX - 3, firstY - 3,7,7);

	const lastX = extractValue(measurements, measurements.length - 1, 'x') / RATIO;
	const lastY = extractValue(measurements, measurements.length - 1, 'y') / RATIO;
	ctx.fillStyle = 'blue';
	ctx.fillRect(lastX - 3, lastY - 3,7,7);
}

function computeLevel(level, index) {
	const canvas = document.createElement('canvas');

	canvas.width = WIDTH / RATIO;
	canvas.height = HEIGHT / RATIO;
	canvas.style.border = "1px solid";
	canvas.id = 'canvas' + index;

	const result = document.getElementById('result');
	result.appendChild(canvas);

	const measurements = level.sensors[0].measurements;

	const ctx = document.getElementById('canvas' + index).getContext("2d");

	addFirstAndLastPoints(ctx, measurements);

	const firstX = extractValue(measurements, 0, 'x') / RATIO;
	const firstY = extractValue(measurements, 0, 'y') / RATIO;
	
	ctx.beginPath();
	ctx.moveTo(firstX, firstY);
	for (let i = 0; i < measurements.length; i++) {
		ctx.lineTo(extractValue(measurements, i, 'x') / RATIO, extractValue(measurements, i, 'y') / RATIO);
	}
	ctx.stroke();
	ctx.closePath();
}

function tracePoint(ctx, measurements, index) {
	ctx.beginPath();
	ctx.moveTo(extractValue(measurements, index, 'x') / RATIO, extractValue(measurements, index, 'y') / RATIO);
	ctx.lineTo(extractValue(measurements, index + 1, 'x') / RATIO, extractValue(measurements, index + 1, 'y') / RATIO);
	ctx.stroke();
	ctx.closePath();
	if (index < measurements.length - 2) {
		const time = 5000 / measurements.length;
		setTimeout(() => { tracePoint(ctx, measurements, index + 1 ) }, time);
	}
}

function animateLevel(level, index) {
	const canvas = document.getElementById('canvas' + index);
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	const measurements = level.sensors[0].measurements;
	addFirstAndLastPoints(ctx, measurements);
	
	tracePoint(ctx, measurements, 0);
}

function animateLevels() {
	const levels = content.mobileEvaluationTest.levels;
	for (let i = 0; i < levels.length; i++) {
		animateLevel(levels[i], i);
	}
}

function setEnvironment(content) {
	const screen = content.mobileDevice.screen;
	RATIO = document.getElementById('ratio').value;
	if (screen.widthPixels > screen.heightPixels) {	
		WIDTH = screen.widthPixels;
		HEIGHT = screen.heightPixels;
	} else {
		WIDTH = screen.heightPixels;
		HEIGHT = screen.widthPixels;
	}
}

function enableAnimation() {
	document.getElementById('animate').disabled = false;
}

function draw() {
	document.getElementById('result').innerHTML = '';
	setEnvironment(content);
	
	const levels = content.mobileEvaluationTest.levels;
	for (let i = 0; i < levels.length; i++) {
		computeLevel(levels[i], i);
	}
	
	enableAnimation();	
}

function readFile(e) {
	const file = e.target.files[0];
	const reader = new FileReader();
	reader.onload = e => {
    	content = JSON.parse(e.target.result);
    	draw();
  	};
  	reader.readAsText(file);
}