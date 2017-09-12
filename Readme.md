IT Workshop - Box2dWeb
======================

# Introduction
Box2d is a physics engine originally written in C++. **Box2dWeb** is a version ported to JavaScript. The Documentation can be found [here](http://www.box2dflash.org/docs/2.1a/reference/). In the following the _stage_ is called _world_ to call it the same as the physics engine.

The file `script.js` contains all the logic for the application. It contains two empty functions:
* `initialize()`: This function is called only once at startup. Use it to initialize your world (e.g. static boundaries).
* `update()`: This function is called with every frame (approx. every 17ms). Use it to update the dynamic behavior of the objects or to place/remove some objects at runtime.

# Getting started
## Run an example
1. Download this repository to your computer.
2. Uncomment another `<script/>`-Tag in the file `index.html`. Make sure that all other lines with example files are commented as follows `<!-- <script ... /> -->` (do not forget the line with `script.js`!)
3. Open `index.html` in your prefered browser and see the magic happen.

## Run your own code
1. Download this repository to your computer.
2. Complete the functions `initialize()` and `update()` in the file `script.js` with your own code.
3. Open `index.html` in your prefered browser and see the magic happen.
