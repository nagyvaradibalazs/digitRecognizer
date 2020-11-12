//variables and constants
var model = undefined;

const container = document.getElementsByClassName("container")[0];
const canvas = document.getElementById("cv");

//initialize drawing style
const ctx = canvas.getContext("2d");
ctx.lineJoin = "round";
ctx.lineCap = "round";
ctx.lineWidth = 10;
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
		ctx.closePath();
		ctx.stroke();

		x = e.offsetX;
		y = e.offsetY;
	}
}

window.onload = async function() {
	//initialize
	createArray();
	clearCanvas();

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

//initialize array elements
function createArray() {
	for(let i = 0; i < 10; i++) {
		container.innerHTML += `<div id="element${i}" class="array-element" style="width: 30px; height: 0px; transform: translateX(${window.innerWidth / 2 - 50 + i * 45}px);"><div class="number-label">${i}</div></div>`;;
	}
}

//update probabilities
function update(arr) {
	//update propabilities
	let maxIndex = 0;
	let maxValue = 0;
	for(let i = 0; i < 10; i++) {
		document.getElementById(`element${i}`).style.setProperty("height", `${arr[i] * 280}px`);
		document.getElementById(`element${i}`).style.setProperty("background", "tomato");
		if(arr[i] > maxValue) {
			maxValue = arr[i];
			maxIndex = i;
		}
	}

	//update color
	document.getElementById(`element${maxIndex}`).style.setProperty("background", "green");
}

//function to clear canvas
function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for(let i = 0; i < 10; i++) {
		document.getElementById(`element${i}`).style.setProperty("height", "0px");
		document.getElementById(`element${i}`).style.setProperty("background", "tomato");
	}
}

//predict digit for drawing
async function runRecognizer() {
	let input = preprocessCanvas(ctx);

	let rawResults = await model.predict(input).data();
	let results = Array.from(rawResults);

	update(results);
}

//preprocessing the canvas drawing into 28x28 tensor input
function preprocessCanvas(img) {
	let data = img.getImageData(0, 0, 280, 280);

	let pxData = [];
	for(let i = 3; i < 313600; i += 4) {
		pxData.push(data.data[i]);
	}

	let avg1Data = [];
	for(let j = 0; j < 280; j++) {
		let temp = [];
		for(let i = 0; i < 28; i++) {
			let avg = 0;
			for(let k = 0; k < 10; k++) {
				avg += pxData[j * 280 + i * 10 + k];
			}
			avg = avg / 10.0;
			temp.push(avg);
		}
		avg1Data.push(temp);
	}
	
	let avgData = [];
	for(let i = 0; i < 28; i++) {
		let temp = [];
		for(let j = 0; j < 28; j++) {
			let avg = 0;
			for(let k = 0; k < 10; k++) {
				avg += avg1Data[j * 10 + k][i];
			}
			avg = avg / 10.0;
			temp.push(avg);
		}
		avgData.push(temp);
	}

	let resultData = [];
	for(let i = 0; i < 28; i++) {
		let temp = [];
		for(let j = 0; j < 28; j++) {
			let d = avgData[j][i];
			d = d / 255.0;
			temp.push(d);
		}
		resultData.push(temp);
	}

	return tf.tensor([resultData]);
}