;

/*	Standards for compatible shaders:
 *	
 *	Attribute Index			Purpose
 *	0						vertex coordinates
 *	1						colors
 *	2						normals
*/

var	VERTEX_INDEX = 0;
var COLOR_INDEX = 1;
var NORMAL_INDEX = 2;

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

var phong_pp_shader = {
	vrtx: "",
	frag: ""
};

// INDEX_COLOR_SHADER

index_color_shader.vrtx = `#version 300 es
uniform mat4 u_mvp;

layout(location = 0) in vec3 a_vertex_coordinates;
layout(location = 1) in vec3 a_colors;

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

layout(location = 0) in vec3 a_vertex_coordinates;

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

phong_pp_shader.vrtx = `#version 300 es
precision mediump float;

layout(location = 0) in vec3 a_vertices;
layout(location = 2) in vec3 a_normals;

uniform mat4 u_modelview_matrix;
uniform mat3 u_normal_matrix;
uniform mat4 u_projection_matrix;

out vec3 v_eyeCoords;
out vec3 v_normal;

void main()
{
	v_normal = normalize(u_normal_matrix * a_normals);
	v_eyeCoords = vec3(u_modelview_matrix * vec4(a_vertices,1.0) );
	gl_Position = u_projection_matrix * vec4(v_eyeCoords,1.0);
}`;

phong_pp_shader.frag = `#version 300 es
precision mediump float;

in vec3 v_eyeCoords;
in vec3 v_normal;

out vec4 frag_color;

struct Material
{
	vec3 k_ambient;
	vec3 k_diffuse;
	vec3 k_specular;
	float k_shininess;
};

uniform Material u_material;
uniform vec4 u_light_position;

const float ONE_OVER_PI = 1.0 / 3.14159265;

vec4 ads()
{
	vec3 diffuse2 = u_material.k_diffuse;
	vec3 n = normalize(v_normal);

	if (gl_FrontFacing)
	{
		return vec4(u_material.k_ambient, 1.0);
	}

	vec3 s = normalize(vec3(u_light_position) - v_eyeCoords);
	vec3 v = normalize(-v_eyeCoords);
	vec3 r = reflect(-s, n);
	vec3 diffuse = max(dot(s, n), 0.0) * diffuse2;
	vec3 specular = pow(max(dot(r, v), 0.0), u_material.k_shininess) * u_material.k_specular;

	return vec4(u_material.k_ambient + diffuse + specular, 1.0);
}

void main()
{	
	frag_color = ads();
}`;
