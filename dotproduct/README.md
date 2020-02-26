# Demonstrating the Dot Product

This program draws two vectors. One is fixed on the x axis. The other rotates around the z axis. The coordinates of the end points of each vector is displayed. Further, the angle (in degrees) between the two vectors is displayed along with the value of the dot product.

## What else is demonstrated?

### A solid color shader

This program shows a vertex and fragment shader which renders in 3D in a user definable solid color. In this case, it would be appropriate to precompute the MVP in javascript but this is not done.

### Shader compiling and linking

This program provides a complete shader compilation and linking function providing error listings (should there be any).

### Extracting attribute and uniform locations

Uniforms are constants sent to shaders. Attributes are streams of values sent to shaders. This program demonstrates how the CPU side gains access to GPU side data.

### Initializing geometry and enabling settings

Buffers to hold geometry must be created and filled. This program demonstrates how to do that (for non-indexed models). This program also demonstrates how the pipes and spigots between the GPU and CPU must be set to allow the transfer of geometry from CPU to GPU.

### Drawing canvas text over WebGL

This program demonstrates how vertices in WebGL can be projected into(computed in) canvas space so that text can appear to live in the 3D world.

### Initializing and setting ModelView and Projection matrices

These matrices control the mathematics of graphics. This program demonstrates initializing them. Further, the modelview matrix is modified based upon time thus demonstrating animation.

### Gaining access to a GL and canvas context

This program demonstrates how to gain access to a WebGL 2 context as well as a canvas context.

### glmatrix

This program uses glmatrix 3. glmatrix is a library providing WebGL compatible math for vectors and matrices. glmatrix 3 is not completely compatible with earlier versions.

