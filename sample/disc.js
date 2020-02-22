;

/** @name Disc */
class Disc  {
	/** constructor()
	* @param {float} ir	inner radius
	* @param {float} or	outer radius
	* @param {int} slices	number of slices around the disc
	* @param {int} stacks	number of stacks across the disc
	* @return {none} It's a constructor
	*/
	constructor(inner_radius, outer_radius, slices, stacks) {
		this.InitializeVertices(inner_radius, outer_radius, slices, stacks);
		this.InitGLLineSegments();
		this.InitGLDisplayNormals();
		this.InitGLTriangles();
	}

	/** InitializeVertices()
	* Responsible for initial creation of vertices, texture_coordinates and normals.
	*
	* In addition to the geometry, an index array assembling the triangles is created
	* which is useful even if indexed drawing is not used (this code will support both
	* kinds of drawing.
	*
	* Also created is an index array for the outlines of all triangles. This WILL be
	* drawn using indexed drawing.
	*
	* @param {float} ir	inner radius
	* @param {float} or	outer radius
	* @param {int} slices	number of slices around the disc
	* @param {int} stacks	number of stacks across the disc
	* @return {none}
	*/
	InitializeVertices(ir, or, slices, stacks) {
		if (slices < 2)
			throw new Error('Disc slices must be more than 2');
		this.vrts = [ ];
		this.txtc = [ ];
		this.nrml = [ ];
		this.tr_vrts = [ ];
		this.ls_indicies = [ ];
		this.tr_indicies = [ ];
		let incr_theta = Math.PI * 2.0 / slices;
		let incr_stack = 1.0 / stacks;
		let z_axis = [0, 0, 1];
		let inner_to_outer = 0;
		let p = vec3.create();
		// 'u' and 'v' will become texture coordinates. Currently they are
		// computed but not used in rendering. The LERP function linearly
		// interpolates its arguments. Here, from inner radius to outer
		// radius. This sets the magnitude of a vector along the x axis 
		// which will be rotated around a circle to produce each ring.
		for (let stk = 0; stk < stacks + 1; stk++) {
			let u = stk / stacks;
			let x = [this.LERP(ir, or, inner_to_outer), 0, 0];
			let r = mat4.create();

			for (var slc = 0; slc < slices; slc++) {
				var v = slc / slices;
				//console.log(slc + ' ' + v);
				vec3.transformMat4(p, x, r);
				this.PushVertex(this.vrts, p);
				// Every vertex gets a normal which is initially along the z-axis.
				// If the geometry changes over time, normals at each vertex must
				// be recomputed and reloaded.
				this.PushVertex(this.nrml, z_axis);
				// Reminder, texture coordinates are computed but not yet otherwise used.
				this.PushVertex(this.txtc, [u, v]);
				mat4.rotate(r, r, incr_theta, z_axis);
			}
			inner_to_outer += incr_stack;
		}

		// This loop assembles an array containing the indices of each triangle's vertex.
		// This data could be used directly for a call to 'drawElements' but it is also
		// useful to building other data structures even if 'drawElements' is never 
		// actually used.
		//
		// You the programmer know your model, so YOU must figure out how to assemble
		// triangles. There are 6 pushes - two triangles. Think of these as upper and
		// lower around each stack. This code may have to change a little to support
		// partial discs. Maybe. Depends on the rest of your design. Notice the use
		// of "mod".
		for (let stk = 0; stk < stacks; stk++) {
			for (let slc = 0; slc < slices; slc++)
			{
				this.tr_indicies.push(stk * slices + slc);
				this.tr_indicies.push(stk * slices + (slc + 1) % slices);
				this.tr_indicies.push((stk + 1) * slices + slc);
				this.tr_indicies.push(stk * slices + (slc + 1) % slices);
				this.tr_indicies.push((stk + 1) * slices + (slc + 1) % slices);
				this.tr_indicies.push((stk + 1) * slices + slc);
			}
		}

		// Our triangles exist in a mesh of connected triangles. To recomute 
		// normals (should the geometry change), you must know which triangles
		// share any given vertex. This loop only initializes space - it does
		// no computing. That is below.
		this.triangle_adjacency = Array(this.vrts.length / 3)
		for (let i = 0; i < this.vrts.length / 3; i++)
			this.triangle_adjacency[i] = [ ];
		
		// Given a definition of which vertex belongs to which triangle (given
		// by the triangle indicies), we must write out a new list of vertex 
		// values because we want to use 'drawArrays' and not 'drawElements'.
		// This is where duplicate vertices get written out.
		for (let i = 0; i < this.tr_indicies.length; i++) {
			let offset = this.tr_indicies[i];
			let v = this.vrts.slice(offset * 3, offset * 3 + 3);
			this.PushVertex(this.tr_vrts, v);
		}

		// Once again, 'tr_indicies' tells us what it connected to what. We use
		// this here to create line segments for every triangle edge. And, we 
		// build the adjacency data structure. 
		for (let i = 0; i < this.tr_indicies.length / 3; i++)
		{
			// i is a triangle index. index_vn are indexies of vertexes withing triangles.
			let index_v0 = this.tr_indicies[i * 3 + 0];
			let index_v1 = this.tr_indicies[i * 3 + 1];
			let index_v2 = this.tr_indicies[i * 3 + 2];

			// Make the line segments for drawing outlines.
			this.ls_indicies.push(index_v0);
			this.ls_indicies.push(index_v1);
			this.ls_indicies.push(index_v1);
			this.ls_indicies.push(index_v2);
			this.ls_indicies.push(index_v2);
			this.ls_indicies.push(index_v0);

			// Make the adjacency data structure. Every line segment touching a vertex
			// is added to a list indexable by vertex number.
			this.triangle_adjacency[index_v0].push(i);
			this.triangle_adjacency[index_v1].push(i);
			this.triangle_adjacency[index_v2].push(i);
		}
		// This functon will be used by you to adjust the constant z-axis normals to their
		// correct orientation. Then, the display normals will be rewritten from the new
		// normal values.
		this.RecalculateNormals();
		this.RecalculateDisplayNormals();
	}

	/** ReloadTriple()
	 * Both initially and when modifying geometry, this function stuff down
	 * the given TRIPLES into the specified buffer. Note this function is
	 * configured to work with Float32Array of TRIPLES.
	 * 
	 * Use of attribute_index allows us to break the too-tight connection between
	 * the shader and the geometry. Our vertex shaders must use the layout(location=n)
	 * declaration so that attribute indices can be known without loading them.
	 * 
	 * vao 		The Vertex Array Object to open. Closing is handled by Unbind().
	 * buffer 	The gl ARRAY_BUFFER to which the data is stuff.
	 * vrts		Float32 triples to stuff. 	
	 * const	The default value is gl.STATIC_DRAW. 	
	 * return 	{none}
	*/
	ReloadTriple(vao, buffer, vrts, draw_mode = gl.STATIC_DRAW, attribute_index = 0) {
		gl.bindVertexArray(vao);
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.vertexAttribPointer(attribute_index, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(attribute_index);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vrts), draw_mode);
	}

	/** RecalculateNormals()
	 * This will be written by you. It will use the adjacency data structure to
	 * recalcuate normals should geometry change. It is needed right away because
	 * geometry remains unchangable. After recalculating the normals, the line
	 * segments used to visualize them must be recalculated.
	*/
	RecalculateNormals(scalar = 0.2) {
		// Do stuff here.
		this.RecalculateDisplayNormals(scalar);
	}

	/*	Because "unbinding" is so frequent, it is abstracted here.
	*/
	Unbind() {
		gl.bindVertexArray(null);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	}

	/** RecalculateDisplayNormals()
	 * Whenever normals are recalculated, the line segments used to visualize
	 * them need to be recalculated as well.
	 * @param {float}	A scale factor appled to the normal - typically smallish.
	 * @return {none}
	*/
	RecalculateDisplayNormals(scalar = 0.2) {
		this.display_normals = [ ];
		for (let i = 0; i < this.nrml.length / 3; i++) {
			// Indexing by triple, meaning the beginning of each triple is a multiple of 3.
			let offset = i * 3;
			// The original value of the vertex is the base of the displayed normal.
			let o = this.vrts.slice(offset, offset + 3)
			this.PushVertex(this.display_normals, o);
			let n = this.nrml.slice(offset, offset + 3);
			vec3.normalize(n, n);
			vec3.scale(n, n, scalar);
			// Position the tip of the line segment "over" the original location.
			vec3.add(n, n, o);
			this.PushVertex(this.display_normals, n);
		}
	}

	/** LERP
	* Linear interpolation from a to be at fraction t.
	* @param {float} 	when t is zero, return this.
	* @param {float}	when t is one, return this.
	* @param {float}	t - between 0 and 1 inclusive.
	* @return {float}	the interpolated value between a and b inclusive.
	*/
	LERP(a, b, t)
	{
		return a + (b - a) * t;
	}

	/** PushVertex
	* Demultiplex a vecN, pushing each component onto the specified array.
	* @param {number array}	an array of floats representing vertex locations.
	* @param {vecN} the vertex whose component values will be pushed.
	* @return {none}
	*/
	PushVertex(a, v)
	{
		switch (v.length)
		{
			case 2:
				a.push(v[0], v[1]);
				break;

			case 3:
				a.push(v[0], v[1], v[2]);
				break;

			case 4:
				a.push(v[0], v[1], v[2], v[3]);
				break;
		}
	}

	InitGLTriangles() {
		this.t_vao = gl.createVertexArray();
		this.t_vrts_buffer = gl.createBuffer();
		this.ReloadGLTriangles();
	}

	InitGLLineSegments() {
		this.vao = gl.createVertexArray();
		this.vrts_buffer = gl.createBuffer();
		this.line_segs_indicies_buffer = gl.createBuffer();
		this.ReloadGLLineSegments(true);
	}

	InitGLDisplayNormals() {
		this.dn_vao = gl.createVertexArray();
		this.dn_vrts_buffer = gl.createBuffer();
		this.ReloadDisplayNormals();
	}

	ReloadDisplayNormals() {
		this.ReloadTriple(this.dn_vao, this.dn_vrts_buffer, this.display_normals, gl.DYNAMIC_DRAW);
		this.Unbind();
	}

	ReloadGLTriangles() {
		this.ReloadTriple(this.t_vao, this.t_vrts_buffer, this.tr_vrts, gl.DYNAMIC_DRAW);
		this.Unbind();
	}

	ReloadGLLineSegments(do_index_buffer = false) {
		this.ReloadTriple(this.vao, this.vrts_buffer, this.vrts, gl.DYNAMIC_DRAW);
		if (do_index_buffer) {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.line_segs_indicies_buffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.ls_indicies), gl.DYNAMIC_DRAW);
		}
		this.Unbind();
	}

	DrawNormals(mvp, color, shader = solid_shader) {
		if (this.DrawNormals.last_shader == 'undefined') {
		}
		gl.useProgram(shader.program);
		if (this.DrawNormals.last_shader != shader) {

			this.DrawNormals.last_shader = shader;
		}
		gl.uniformMatrix4fv(shader.u_mvp, false, mvp);
		gl.uniform4fv(shader.u_color, color);
		gl.bindVertexArray(this.dn_vao);
		gl.drawArrays(gl.LINES, 0, this.display_normals.length / 3.0);
		gl.bindVertexArray(null);
		gl.useProgram(null);
	}

	DrawSolid(mvp, color, shader = solid_shader) {
		gl.useProgram(shader.program);
		gl.uniformMatrix4fv(shader.u_mvp, false, mvp);
		gl.uniform4fv(shader.u_color, color);
		gl.bindVertexArray(this.t_vao);
		gl.drawArrays(gl.TRIANGLES, 0, this.tr_vrts.length / 3.0);
		gl.bindVertexArray(null);
		gl.useProgram(null);
	}

	DrawWireframe(mvp, color, shader = solid_shader) {
		gl.useProgram(shader.program);
		gl.uniformMatrix4fv(shader.u_mvp, false, mvp);
		gl.uniform4fv(shader.u_color, color);
		gl.bindVertexArray(this.vao);
		gl.drawElements(gl.LINES, this.ls_indicies.length, gl.UNSIGNED_SHORT, 0);
		gl.bindVertexArray(null);
		gl.useProgram(null);
	}

	Draw(what, mvp, color) {
		if (what.includes('solid'))
			this.DrawSolid(mvp, color);
		if (what.includes('wireframe'))
			this.DrawWireframe(mvp, color);
		if (what.includes('normals'))
			this.DrawNormals(mvp, color);
	}
}

