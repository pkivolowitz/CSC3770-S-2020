;

function CreateShader(vrtx, frag) {
	if (!vrtx)
		throw "Parameter 1 to CreateShader may be missing.";

	if (!frag)
		throw "Parameter 2 to CreateShader may be missing.";

	let success;

	let vertShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertShader, vrtx);
	gl.compileShader(vertShader);
	success = gl.getShaderParameter(vertShader, gl.COMPILE_STATUS);
	if (!success)
		throw "Could not compile vertex shader:" + gl.getShaderInfoLog(vertShader);

	let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragShader, frag);
	gl.compileShader(fragShader);
	success = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);
	if (!success)
		throw "Could not compile fragment shader:" + gl.getShaderInfoLog(fragShader);

	let shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertShader); 
	gl.attachShader(shaderProgram, fragShader);
	gl.linkProgram(shaderProgram);
	success = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
	if (!success)
		throw ("Shader program filed to link:" + gl.getProgramInfoLog (shaderProgram));
		
	return shaderProgram;
}
