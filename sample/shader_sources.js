;

/*	The indexed color shader is a NON-LIGHTED shader feeding vertex colors as attributes.
*/

var index_color_shader = {
	vrtx: "",
	frag: ""
};

/*	The solid color shader is a NON-LIGHTED shader taking a single color as a uniform.
*/

var solid_color_shader = {
	vrtx: "",
	frag: ""
};

// INDEX_COLOR_SHADER

index_color_shader.vrtx = `#version 300 es
uniform mat4 u_mvp;

in vec3 a_vertex_coordinates;
in vec3 a_colors;

out vec4 colors;

void main(void)
{
	gl_Position = u_mvp * vec4(a_vertex_coordinates, 1.0);
	colors = vec4(a_colors, 1.0);
}`;

index_color_shader.frag = `#version 300 es
precision mediump float;

in vec4 colors;

out vec4 frag_color;

void main(void)
{
	frag_color = colors;
}`;

// SOLID COLOR SHADER

solid_color_shader.vrtx = `#version 300 es
uniform mat4 u_mvp;

in vec3 a_vertex_coordinates;

void main(void)
{
	gl_Position = u_mvp * vec4(a_vertex_coordinates, 1.0);
}`;

solid_color_shader.frag = `#version 300 es
precision mediump float;

uniform vec4 u_color;

out vec4 frag_color;

void main(void)
{
	frag_color = u_color;
}`;
