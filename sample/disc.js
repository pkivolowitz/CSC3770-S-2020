;

class Disc  {
	constructor(inner_radius, outer_radius, slices, stacks) {
		this.InitializeVertices(inner_radius, outer_radius, slices, stacks);
	}

	/**
	* Responsible for initial creation of vertices, texture_coordinates and normals.
	*
	* In addition to the geometry, an index array assembling the triangles is created
	* which is useful even if indexed drawing is not used (this code will support both
	* kinds of drawing.
	*
	* Also created is an index array for the outlines of all triangles. This WILL be
	* drawn using indexed drawing.
	* @param {ir}		inner radius (float)
	* @param {or}		outer radius (float)
	* @param {slices}	slices (int)
	* @param {stacks}	stacks (int)
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

	RecalculateNormals() {
	}

	RecalculateDisplayNormals(scalar = 0.2) {
		this.display_normals = [ ];
		for (let i = 0; i < this.nrml.length / 3; i++) {
			let offset = i * 3;
			let o = this.vrts.slice(offset, offset + 3)
			this.PushVertex(this.display_normals, o);
			let n = this.nrml.slice(offset, offset + 3);
			vec3.normalize(n, n);
			vec3.scale(n, n, scalar);
			vec3.add(n, n, o);
			this.PushVertex(this.display_normals, n);
		}
	}

	LERP(a, b, t)
	{
		return a + (b - a) * t;
	}

	/**
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
}


class WireframeDisc extends Disc {
	/**
	* A WireframeDisc will use the base geometry and render only solid color wireframe.
	* Texturing will not be supported.
	*/
	constructor(inner_radius, outer_radius, slices, stacks, shader)
	{
		super(inner_radius, outer_radius, slices, stacks);
		this.shader = shader;
		this.InitGLLineSegments();
		this.InitGLDisplayNormals();
		this.InitGLTriangles();
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

	InitGLDisplayNormals(scalar = 0.2) {
		this.dn_vao = gl.createVertexArray();
		this.dn_vrts_buffer = gl.createBuffer();
		this.ReloadDisplayNormals();
	}

	Reload(vao, buffer, vrts) {
		gl.bindVertexArray(vao);
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.vertexAttribPointer(this.shader.a_vertex_coordinates, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.shader.a_vertex_coordinates);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vrts), gl.DYNAMIC_DRAW);
	}

	Unbind() {
		gl.bindVertexArray(null);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}

	ReloadDisplayNormals() {
		this.Reload(this.dn_vao, this.dn_vrts_buffer, this.display_normals);
		this.Unbind();
	}

	ReloadGLTriangles() {
		this.Reload(this.t_vao, this.t_vrts_buffer, this.tr_vrts);
		this.Unbind();
	}

	ReloadGLLineSegments(do_index_buffer = false) {
		this.Reload(this.vao, this.vrts_buffer, this.vrts);
		if (do_index_buffer) {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.line_segs_indicies_buffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.ls_indicies), gl.STATIC_DRAW);
		}
		this.Unbind();
	}

	DrawNormals(mvp, color) {
		gl.useProgram(this.shader.program);
		gl.uniformMatrix4fv(this.shader.u_mvp, false, mvp);
		gl.uniform4fv(this.shader.u_color, color);
		gl.bindVertexArray(this.dn_vao);
		gl.drawArrays(gl.LINES, 0, this.display_normals.length / 3.0);
		gl.bindVertexArray(null);
		gl.useProgram(null);
	}

	DrawSolid(mvp, color) {
		gl.useProgram(this.shader.program);
		gl.uniformMatrix4fv(this.shader.u_mvp, false, mvp);
		gl.uniform4fv(this.shader.u_color, color);
		gl.bindVertexArray(this.t_vao);
		gl.drawArrays(gl.TRIANGLES, 0, this.tr_vrts.length / 3.0);
		gl.bindVertexArray(null);
		gl.useProgram(null);
	}

	DrawWireframe(mvp, color) {
		gl.useProgram(this.shader.program);
		gl.uniformMatrix4fv(this.shader.u_mvp, false, mvp);
		gl.uniform4fv(this.shader.u_color, color);
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
