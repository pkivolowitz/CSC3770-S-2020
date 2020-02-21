;

class Axes {

	constructor() {
		this.vao = gl.createVertexArray();
		this.vrts_buffer = gl.createBuffer();
		this.indx_buffer = gl.createBuffer();
		this.colr_buffer = gl.createBuffer();
	
		// Displaced a tiny amount in z to avoid z-fighting.
		let offset = 0.004;

		this.vrts = [ ];
		this.vrts.push(0, 0, offset);
		this.vrts.push(1, 0, offset);
		this.vrts.push(0, 0, offset);
		this.vrts.push(0, 1, offset);
		this.vrts.push(0, 0, offset);
		this.vrts.push(0, 0, 1);
	
		this.colors = [ 1, 0, 0,   1, 0, 0,   0, 1, 0,   0, 1, 0,   0, 0, 1,   0, 0, 1 ];
		this.indices = [ 0, 1, 2, 3, 4, 5 ];
	
		gl.bindVertexArray(this.vao);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vrts_buffer);
		gl.vertexAttribPointer(color_shader.a_vertex_coordinates, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(color_shader.a_vertex_coordinates);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vrts), gl.STATIC_DRAW);
	
		gl.bindBuffer(gl.ARRAY_BUFFER, this.colr_buffer);
		gl.vertexAttribPointer(color_shader.a_colors, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(color_shader.a_colors);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indx_buffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
	
		/*	This unbinding of the VAO is necessary.
		*/
	
		gl.bindVertexArray(null);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	
		console.log('Axes:')
		console.log('Vertex buffer: ' + this.vrts_buffer);
		console.log('Vertices: ' + this.vrts);
		console.log('VAO: ' + this.vao);	
	}

	Draw(M, V, P) {
		gl.useProgram(color_shader.program);
		gl.uniformMatrix4fv(color_shader.u_m, false, M);
		gl.uniformMatrix4fv(color_shader.u_v, false, V);
		gl.uniformMatrix4fv(color_shader.u_pj, false, P);
		gl.bindVertexArray(this.vao);
		gl.drawElements(gl.LINES, 6, gl.UNSIGNED_SHORT, 0);
		gl.bindVertexArray(null);
		gl.useProgram(null);
	}
}
