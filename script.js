//variables and constants
var probabilityArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var model = undefined;

const container = document.getElementsByClassName("container")[0];
const canvas = document.getElementById("cv");

//initialize drawing style
const ctx = canvas.getContext("2d");
ctx.lineJoin = "round";
ctx.lineCap = "round";
ctx.lineWidth = 20;
ctx.strokeStyle = "black";
var isDrawing = false;
var x = 0;
var y = 0;

//drawing function
function drawOnCanvas(e) {
	if(isDrawing) {
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(e.offsetX, e.offsetY);
		ctx.stroke();

		x = e.offsetX;
		y = e.offsetY;
	}
}

window.onload = async function() {
	//initialize
	clearCanvas();
	createArray();

	//initialize canvas functions
	canvas.addEventListener("mouseout", () => isDrawing = false);
	canvas.addEventListener("mousedown", (e) => {
		isDrawing = true;
		x = e.offsetX;
		y = e.offsetY;
	});
	canvas.addEventListener("mousemove", drawOnCanvas);
	canvas.addEventListener("mouseup", () => isDrawing = false);

	//load trained model
	model = await tf.loadLayersModel("model/model.json");
}

function createArray() {
	for(let i = 0; i < 10; i++) {
		let height = probabilityArray[i] * 280;
		container.innerHTML += `<div id="element${i}" class="array-element" style="width: 30px; height: ${height}px; transform: translateX(${window.innerWidth / 2 - 50 + i * 45}px);"><div class="number-label">${i}</div></div>`;;
	}
}

//function to clear canvas
function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//predict digit for drawing
async function runRecognizer() {
	let input = preprocessCanvas();
	//console.log(input.shape);
	let rawResults = await model.predict(input).data();
	let results = Array.from(rawResults);

	console.log(results);
	console.log(rawResults);

}

//preprocessing the canvas drawing
function preprocessCanvas() {
	let tensor = tf.browser.fromPixels(canvas).resizeNearestNeighbor([28, 28]).mean(2).expandDims(2).toFloat();
	
	//changing to black background and white drawing
	return tensor.div(255.0).sub(1.0).mul(-1.0);
}