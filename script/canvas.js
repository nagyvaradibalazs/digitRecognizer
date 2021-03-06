/*var cv = document.getElementById("cvimg");
var ctxcv = cv.getContext("2d");
var dt = ctxcv.getImageData(0, 0, 28, 28);
var px = dt.data;*/

const clearCanvas = (canvas, ctx) => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for(let i = 0; i < 10; i++) {
		document.getElementById(`element${i}`).style.setProperty("height", "0px");
		document.getElementById(`element${i}`).style.setProperty("background", "tomato");
	}
};

//preprocessing the canvas drawing into 28x28 tensor input
const preprocessCanvas = (img) => {
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
			avg = avg / 1.0;
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
			avg = avg / 1.0;
			temp.push(avg);
		}
		avgData.push(temp);
	}

	let resultData = [];
	for(let i = 0; i < 28; i++) {
		let temp = [];
		for(let j = 0; j < 28; j++) {
			let d = avgData[j][i];
			d = Math.min(1.0, d / 255.0);
			temp.push([d]);
			//px[4*(28*i+j)+3] = d * 255;
		}
		resultData.push(temp);
	}
	//ctxcv.putImageData(dt, 0, 0);
	return [resultData];
};

export { clearCanvas, preprocessCanvas };