IT Workshop - Box2dWeb
======================

## Introduction
Box2d is a physics engine originally written in C++. **Box2dWeb** is a version ported to JavaScript. The Documentation can be found [here](http://www.box2dflash.org/docs/2.1a/reference/). In the following the _stage_ is called _world_ to call it the same as the physics engine.
The world has a size of `900px x 600px`. Placing objects outside of this area is possible but they will not be visible!

The file `script.js` contains all the logic for the application. It contains two empty functions:
* `initialize()`: This function is called only once at startup. Use it to initialize your world (e.g. static boundaries).
* `update()`: This function is called with every frame (approx. every 17ms). Use it to update the dynamic behavior of the objects or to place/remove some objects at runtime.

## Getting started
### Run an example
1. Download this repository to your computer.
2. Uncomment another `<script/>`-Tag in the file `index.html`. Make sure that all other lines with example files are commented as follows `<!-- <script ... /> -->` (do not forget the line with `script.js`!)
3. Open `index.html` in your prefered browser and see the magic happen.

### Run your own code
1. Download this repository to your computer.
2. Complete the functions `initialize()` and `update()` in the file `script.js` with your own code.
3. Open `index.html` in your prefered browser and see the magic happen.

### Gravity
You can define the gravity vector on line 32 as follows (where `x` and `y` are real numbers):

    var gravity = new b2Vec2(x,y);

### Create a new object
Call the function `createObject(type, options)` to create a new object in your world. The newly created object is returned by the function.
* `type` can be `circle` or `box`
* `options` is a named array with the following structure:
  ```
  {
		width : 0,          // mandatory
		height : 0,         // mandatory
		x: 0,               // real number
		y : 0,              // real number
		type : 'static',    // allowed: dynamic, static (explanation below)
		angle : 0,          // in radians (Bogenmass) counterclockwise
		density : 1,        // range [0, infinity)
		friction : 0.5,     // range [0,1]
		restitution : 0.5,  // range [0,1]
		data : {}           // any named array allowed! 
    }
    ```
    Please note that not every option in the second parameter must be present. The values above are the default values.
    `static`: No physics apply to this object (it does not move), but it influeces other dynamic objects when collisions occure!
    `dynamic`: Normal physics applies to this object (incl. gravity). This object can move.
    
    The origin is in the top-left corner to the displayed area. The **position (x,y)** always indicates the **center of the object!**
   Examples:
    * `createObject('box', {type: 'static', width: 900, height: 40, x: 450, y: 580, restitution: 1})`
    * `createObject('box', {width: 250, height: 20, x: 450, y: 250, angle: 0.7853982, friction: 0.2})`
    * `createObject('box', {width: 40, height: 40, x: 20, y: 20, data: {name: 'obstacle'}})`
    
    The returned object of type [`b2Body`](http://www.box2dflash.org/docs/2.1a/reference/Box2D/Dynamics/b2Body.html).
    Here are the most useful functions for those objects:
    * `SetLinearVelocity(b2Vec2 vector)`: Set the linear velocity of the center of mass.
    * `SetPositionAndAngle(b2Vec2 position, Number angle)`: Set the position of the body's origin and rotation (radians).
    * `SetUserData(data)` and `GetUserData()`: Set/Get the user data.
    * `SetAngularVelocity(Number omega)`: Set the angular velocity.
    * `ApplyForce(b2Vec2 force, b2Vec2 point)`: Apply a force at a world point. If the force is not applied at the center of mass, it will generate a torque and affect the angular velocity.
    
    Examples (starting point `var object = createObject('box', {type: 'dynamic', ...});`):
    * `object.SetLinearVelocity(new b2Vec2(-10, 0));`: Applies a velocity on the negative y-Axis for this object.
    * `object.SetUserData({name: 'player'});`: Sets a named array with custom information for the object.
    * `console.log(object.GetUserData()['name']);`: Prints `player` (the previously set custom value)
    