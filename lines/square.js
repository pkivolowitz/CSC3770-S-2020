;

class Square {
	constructor() {
		this.vao_s = gl.createVertexArray();
		this.vao_l = gl.createVertexArray();
		this.vrts_buffer = gl.createBuffer();
		this.findx_buffer = gl.createBuffer();
		this.lindx_buffer = gl.createBuffer();
		this.colr_buffer = gl.createBuffer();

		// The vertices are the same in both VAOs.
		this.vrts = [ ];
		this.vrts.push( 0.5,  0.5, 0.0);
		this.vrts.push( 0.5, -0.5, 0.0);
		this.vrts.push(-0.5, -0.5, 0.0);
		this.vrts.push(-0.5,  0.5, 0.0);

		this.colors = [ 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1 ];
		this.filled_indices = [ 0, 3, 2, 0, 2, 1 ];
		this.line_segment_indices = [ 0, 1, 1, 2, 2, 3, 3, 0, 2, 0 ]

		gl.bindVertexArray(this.vao_s);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vrts_buffer);
		gl.vertexAttribPointer(color_shader.a_vertex_coordinates, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(color_shader.a_vertex_coordinates);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vrts), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.colr_buffer);
		gl.vertexAttribPointer(color_shader.a_colors, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(color_shader.a_colors);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.findx_buffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.filled_indices), gl.STATIC_DRAW);

		/*	This unbinding of the VAO is necessary.
		*/

		gl.bindVertexArray(null);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);


		gl.bindVertexArray(this.vao_l);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vrts_buffer);
		gl.vertexAttribPointer(solid_shader.a_vertex_coordinates, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(color_shader.a_vertex_coordinates);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vrts), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.lindx_buffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.line_segment_indices), gl.STATIC_DRAW);

		/*	This unbinding of the VAO is necessary.
		*/

		gl.bindVertexArray(null);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		console.log('Vertex buffer: ' + this.vrts_buffer);
		console.log('Vertices: ' + this.vrts);
		console.log('Filled VAO: ' + this.vao_s);
		console.log('Line Segment VAO:' + this.vao_l);
	}
}