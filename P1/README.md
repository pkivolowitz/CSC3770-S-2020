# Project 1

Time to put together all we've learned so far. The goal is to create what is necessary to render a disc, cylinder or cone in wireframe.

To do this, you will need to compute the position of all vertices as well as the array containing the indexes that specify which vertices combine to make each triangle (you will be rendering triangles in P2) and those that comprise a line segment (for wireframe).

## Constant color shader

Draw the wireframe using a single color specified by a `uniform` rather than defining a color per vertex. See *normals* for an example.

## Maybe start with just a circle

It doesn't make sense to reach for the brass disc right from the start. Try drawing a circle in wireframe (no triangles). Get that working first.

## InitializeDisc()

Write a class Disc with the following function (plus constructor if desired and a Draw function).

Write the function which initializes a disc according to parameters.

```text
InitializeDisc(slices, stacks, outer_radius, inner_radius, outer_center, inner_center, theta)
```

| Paramter | Type | Description |
| -------- | ---- | ----------- |
| slices | int | The number of points along the shape's arc. |
| stacks | int | The number of divisions between inner and outer edges. |
| outer_radius | float | Outer radius |
| inner_radius | float | Inner radius |
| outer_center | vec3 | Location of outer center |
| inner_center | vec3 | Location of the inner center |
| theta | float | The sweep of the arc starting at the positive X axis sweeping counter clockwise |

`theta` is expressed in degrees but recall javascript uses Radians.

## Draw()

```text
Draw(draw_triangles, draw_wireframe, any other parameters you need)
```

In this way you can use the same draw function to render triangles only, wireframe only or both together.

## Camera location / gaze

```text
mat4.lookAt(V, vec3.fromValues(5, 5, 10), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));
```

## Scene animation

You will dislay four models, one at a time cycling each time the `m` key is pressed.

* Full disc (i.e. theta is 360, inner radius close to 0)
* Ring (i.e. theta is 360, inner radius not close to 0)
* Cylinder (i.e. theta is 360, inner and outer radius are same, inner and outer centers different)
* Partial cone (i.e. theta is 270, radii differ, centers differ)

The object must rotate around the Y axis at exactly 15 RPM. Why 15 RPM? To require that you figire out how to scale input to a trig function (in this case).

## P2 - reuses this work

P2 will add computation of normals and lighting.
