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

function InitializeSolidColorShader() {
	solid_shader.program = CreateShader(solid_color_shader.vrtx, solid_color_shader.frag);
	console.log('Solid Shader Program: ' + solid_shader.program);
	gl.useProgram(solid_shader.program);
	solid_shader.a_vertex_coordinates = gl.getAttribLocation(solid_shader.program, "a_vertex_coordinates");
	solid_shader.u_m = gl.getUniformLocation(solid_shader.program, "u_m");
	solid_shader.u_v = gl.getUniformLocation(solid_shader.program, "u_v");
	solid_shader.u_pj = gl.getUniformLocation(solid_shader.program, "u_pj");
	solid_shader.u_color = gl.getUniformLocation(solid_shader.program, "u_color");
	gl.useProgram(null);
	console.log('Vertex Coordinate handle: ' + solid_shader.a_vertex_coordinates);
	console.log('M Matrix handle: ' + solid_shader.u_m);
	console.log('V Matrix handle: ' + solid_shader.u_v);
	console.log('P Matrix handle: ' + solid_shader.u_pj);
	console.log('Color handle: ' + solid_shader.u_color);
}

function InitializeIndexedColorShader() {
	color_shader.program = CreateShader(index_color_shader.vrtx, index_color_shader.frag);
	console.log('Program: ' + color_shader.program);
	gl.useProgram(color_shader.program);
	color_shader.a_vertex_coordinates = gl.getAttribLocation(color_shader.program, "a_vertex_coordinates");
	color_shader.a_colors = gl.getAttribLocation(color_shader.program, "a_colors");
	color_shader.u_m = gl.getUniformLocation(color_shader.program, "u_m");
	color_shader.u_v = gl.getUniformLocation(color_shader.program, "u_v");
	color_shader.u_pj = gl.getUniformLocation(color_shader.program, "u_pj");
	gl.useProgram(null);
	console.log('Vertex Coordinate handle: ' + color_shader.a_vertex_coordinates);
	console.log('Color attribute handle: ' + color_shader.a_colors);
	console.log('M Matrix handle: ' + color_shader.u_m);
	console.log('V Matrix handle: ' + color_shader.u_v);
	console.log('P Matrix handle: ' + color_shader.u_pj);
}


