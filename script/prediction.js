//predict digit for drawing
const runRecognizer = async (input, model) => {
    
	let rawResults = await model.predict(input).data();
	let results = Array.from(rawResults);

	return results;
}

export { runRecognizer };