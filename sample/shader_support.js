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
	let s = solid_shader;
	s.program = CreateShader(solid_color_shader.vrtx, solid_color_shader.frag);
	gl.useProgram(s.program);
	s.a_vertex_coordinates = gl.getAttribLocation(s.program, "a_vertex_coordinates");
	s.u_mvp = gl.getUniformLocation(s.program, "u_mvp");
	s.u_color = gl.getUniformLocation(s.program, "u_color");
	gl.useProgram(null);

	console.log('Solid shader:');
	console.log('Program: ' + solid_shader.program);
	console.log('Vertex handle: ' + solid_shader.a_vertex_coordinates);
	console.log('MVP handle: ' + solid_shader.u_mvp);
	console.log('Color handle: ' + solid_shader.u_color);
}

function InitializeIndexedColorShader() {
	color_shader.program = CreateShader(index_color_shader.vrtx, index_color_shader.frag);
	gl.useProgram(color_shader.program);
	color_shader.a_vertex_coordinates = gl.getAttribLocation(color_shader.program, "a_vertex_coordinates");
	color_shader.a_colors = gl.getAttribLocation(color_shader.program, "a_colors");
	color_shader.u_mvp = gl.getUniformLocation(color_shader.program, "u_mvp");
	gl.useProgram(null);

	console.log('Color via attribute shader:');
	console.log('Program: ' + color_shader.program);
	console.log('Vertex handle: ' + color_shader.a_vertex_coordinates);
	console.log('Color handle: ' + color_shader.a_colors);
	console.log('MVP Matrix handle: ' + color_shader.u_mvp);
}


