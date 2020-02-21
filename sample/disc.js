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
		this.ls_indicies = [ ];
		this.tr_indicies = [ ];
		let incr_theta = Math.PI * 2.0 / slices;
		let incr_stack = 1.0 / stacks;
		let z_axis = [0, 0, 1];
		let inner_to_outer = 0;
		let p = vec3.create();
		for (let stk = 0; stk < stacks + 1; stk++) {
			let u = stk / stacks;
			let x = [this.LERP(ir, or, inner_to_outer), 0, 0];
			let r = mat4.create();

			for (var slc = 0; slc < slices; slc++) {
				var v = slc / slices;
				//console.log(slc + ' ' + v);
				vec3.transformMat4(p, x, r);
				this.PushVertex(this.vrts, p);
				this.PushVertex(this.nrml, [0, 0, 1]);
				this.PushVertex(this.txtc, [u, v]);
				mat4.rotate(r, r, incr_theta, z_axis);
			}
		}

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

		this.triangle_adjacency = Array(this.vrts.length / 3)
		for (let i = 0; i < this.vrts.length / 3; i++)
			this.triangle_adjacency[i] = [ ];
		
		for (let i = 0; i < this.tr_indicies.length / 3; i++)
		{
			// i is a triangle index. index_vn are indexies of vertexes withing triangles.
			var index_v0 = this.tr_indicies[i * 3 + 0];
			var index_v1 = this.tr_indicies[i * 3 + 1];
			var index_v2 = this.tr_indicies[i * 3 + 2];

			// Make the line segments for drawing outlines.
			this.ls_indicies.push(index_v0);
			this.ls_indicies.push(index_v1);
			this.ls_indicies.push(index_v1);
			this.ls_indicies.push(index_v2);
			this.ls_indicies.push(index_v2);
			this.ls_indicies.push(index_v0);

			// Make the adjacency data structure.
			this.triangle_adjacency[index_v0].push(i);
			this.triangle_adjacency[index_v1].push(i);
			this.triangle_adjacency[index_v2].push(i);
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
	* Texturing will not be supported. Normals will not be supported.
	*/
	constructor(inner_radius, outer_radius, slices, stacks, solid_shader)
	{
		super(inner_radius, outer_radius, slices, stacks);
		this.vao = gl.createVertexArray();
		this.vrts_buffer = gl.createBuffer();
		this.line_segs_indicies_buffer = gl.createBuffer();
		gl.bindVertexArray(this.vao);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vrts_buffer);
		gl.vertexAttribPointer(solid_shader.a_vertex_coordinates, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(solid_shader.a_vertex_coordinates);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vrts), gl.DYNAMIC_DRAW);
		gl.bindVertexArray(null);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}

}
