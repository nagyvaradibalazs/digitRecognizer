import * as drawer from "./drawer.js";
import * as canvasHandler from "./canvas.js";
import * as predictionHandler from "./prediction.js";

//variables and constants
var model = undefined;
const container = document.getElementsByClassName("container")[0];
const canvas = document.getElementById("cv");
const ctx = canvas.getContext("2d");

//initialize
window.onload = async function() {
	//load trained model
	model = await tf.loadLayersModel("model/model.json");

	//initialize array elements
	for(let i = 0; i < 10; i++) {
		container.innerHTML += `<div id="element${i}" class="array-element" style="width: 30px; height: 0px; transform: translateX(${window.innerWidth / 2 - 50 + i * 45}px);"><div class="number-label">${i}</div></div>`;;
	}

	//initialize canvas functions
	drawer.initCanvas(canvas, ctx);
	document.getElementsByClassName("clear-button")[0].addEventListener("click", () => canvasHandler.clearCanvas(canvas, ctx));
	document.getElementsByClassName("go-button")[0].addEventListener("click", async () => { 
		var tensor = tf.tensor(canvasHandler.preprocessCanvas(ctx));
		var results = await predictionHandler.runRecognizer(tensor, model);
		update(results);
	});
	canvasHandler.clearCanvas(canvas, ctx);	
}

//update probabilities
function update(arr) {
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