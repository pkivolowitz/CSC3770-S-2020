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

function InitializePhongShader() {
	let s = phong_shader;
	s.program = CreateShader(phong_pp_shader.vrtx, phong_pp_shader.frag);
	gl.useProgram(s.program);
	s.a_vertex_coordinates = VERTEX_INDEX;
	s.a_normals = NORMAL_INDEX;
	s.u_mv = gl.getUniformLocation(s.program, "u_modelview_matrix");
	s.u_nm = gl.getUniformLocation(s.program, "u_normal_matrix");
	s.u_p = gl.getUniformLocation(s.program, "u_projection_matrix");
	s.u_material = gl.getUniformLocation(s.program, "u_material");
	s.u_light_pos = gl.getUniformLocation(s.program, "u_light_position");
	gl.useProgram(null);

	console.log('Phong shader:');
	console.log('Program: ' + s.program);
	console.log('MV handle: ' + s.u_mv);
	console.log('NM handle: ' + s.u_nm);
	console.log('P  handle: ' + s.u_p);
	console.log('Material handle: ' + s.u_material);
	console.log('Lght Pos handle: ' + s.u_light_pos);
}

function InitializeSolidColorShader() {
	let s = solid_shader;
	s.program = CreateShader(solid_color_shader.vrtx, solid_color_shader.frag);
	gl.useProgram(s.program);
	s.u_mvp = gl.getUniformLocation(s.program, "u_mvp");
	s.u_color = gl.getUniformLocation(s.program, "u_color");
	gl.useProgram(null);

	console.log('Solid shader:');
	console.log('Program: ' + solid_shader.program);
	console.log('MVP handle: ' + solid_shader.u_mvp);
	console.log('Color handle: ' + solid_shader.u_color);
}

function InitializeIndexedColorShader() {
	color_shader.program = CreateShader(index_color_shader.vrtx, index_color_shader.frag);
	gl.useProgram(color_shader.program);
	color_shader.u_mvp = gl.getUniformLocation(color_shader.program, "u_mvp");
	gl.useProgram(null);

	console.log('Color via attribute shader:');
	console.log('Program: ' + color_shader.program);
	console.log('MVP Matrix handle: ' + color_shader.u_mvp);
}


