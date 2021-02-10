//used variables
var isDrawing;
var x;
var y;
var ctx;

const initCanvas = (canvas, ctxOriginal) => {
	ctx = ctxOriginal;
	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	ctx.lineWidth = 10;
	ctx.strokeStyle = "red";

	isDrawing = false;
	x = 0;
	y = 0;

	//init canvas functions
	//for computer
	canvas.addEventListener("mouseout", () => isDrawing = false);
	canvas.addEventListener("mousedown", (e) => {
		isDrawing = true;
		x = e.offsetX;
		y = e.offsetY;
	});
	canvas.addEventListener("mousemove", drawOnCanvas);
	canvas.addEventListener("mouseup", () => isDrawing = false);

	//for mobile
	canvas.addEventListener("touchleave", () => isDrawing = false);
	canvas.addEventListener("touchstart", (e) => {
		if(e.target == canvas) {
			e.preventDefault();
		}

		isDrawing = true;
		x = e.offsetX;
		y = e.offsetY;
	});
	canvas.addEventListener("touchmove", (e) => {
		if(e.target == canvas) {
			e.preventDefault();
		}

		drawOnCanvas
	});
	canvas.addEventListener("touchend", () => isDrawing = false);
}

const drawOnCanvas = (e) => {
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

export { initCanvas };