# Progress - CSC 3770 Spring 2020

## February 6

Intro day - we talked about transformations including:

* Translate
* Scale
* Rotate

## February 11

* We learned about the viewing pipeline:
	* Object coordinates
    * Modeling trasformations / space
	* Viewing / Eye / World transformations / space
	* Projection / Clipping space / Normalized
	* Device Coordinates
	* P * V * M * p - this is multiplying by MVP
	* that the inverse process is also useful
* We were introduced to the difference between a shader `attribute` and `uniform`

## February 13

* We reviewed the viewing pipeline
* We studied plumbing - plumbing is required because we are working with two entirely separate computers
  * We can't share pointers to data between the computers since they are in different physical RAMs
  * So instead we rendezvous on the text of uniform and attribute names
  * The GPU assigns an array index recording certain information about the symbol
  * The index is reported back to the CPU and used in various `bind` calls
* `STATIC_DRAW` is a hint to the GPU on how to organize and store data in its own memory
* `DYNAMIC_DRAW` is a hint to the GPU that the data will be overwritten frequently
* These are just hints

## February 25

* We went over code from `sample`.
* We went deeply into:
   * Phong illumination
   * Phong shading
   * Gouraud shading
 
 ## February 27

We reviewed.

Today was a workday.

