IT Workshop - Box2dWeb
======================

## Introduction
Box2d is a physics engine originally written in C++. **Box2dWeb** is a version ported to JavaScript. The Documentation can be found [here](http://www.box2dflash.org/docs/2.1a/reference/). In the following the _stage_ is called _world_ to call it the same as the physics engine.
The world has a size of `900px x 600px`. Placing objects outside of this area is possible but they will not be visible!

The file `script.js` contains all the logic for the application. It contains some empty functions:
* `initialize()`: This function is called only once at startup. Use it to initialize your world (e.g. static boundaries).
* `update()`: This function is called with every frame (approx. every 17ms). Use it to update the dynamic behavior of the objects or to place/remove some objects at runtime.
* `beginContact(contact)`: This function is called once two objects start touching each other.
* `endContact(contact)`: This function is called once two objects stop touching each other.
* `postSolveContact(contact, impulse)`: This function is called once the physical impact of the collision has been calculcated. It is always called after `endContact(contact)`.

## Getting started
### Run an example
1. Download this repository to your computer.
2. Uncomment another `<script/>`-Tag in the file `index.html`. Make sure that all other lines with example files are commented as follows `<!-- <script ... /> -->` (do not forget the line with `script.js`!)
3. Open `index.html` in your prefered browser and see the magic happen.

### Run your own code
1. Download this repository to your computer.
2. Complete the functions `initialize()` and `update()` in the file `script.js` with your own code.
3. Open `index.html` in your prefered browser and see the magic happen.

## Create your own code

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
		friction : 0.5,     // range [0,1] (Reibung)
		restitution : 0.5,  // range [0,1] (Stosszahl)
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

### Manipulate Objects
The returned object of `createObject(..)` is of type `b2Body`.
A more complete documentation can be found at http://www.box2dflash.org/docs/2.1a/reference/Box2D/Dynamics/b2Body.html.
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

### Destroy Objects
To destroy/remove an object, you have to call `world.DestroyBody(object);`
_Please note that `object` refers to the variable in the example section above!_

### Detect collisions
The following classes are needed:
* Class `b2Contact`: The class manages contact between two shapes. ([Documentation](http://www.box2dflash.org/docs/2.1a/reference/Box2D/Dynamics/Contacts/b2Contact.html))
  * `GetFixtureA()`: Returns the `b2Fixture` of object A
  * `GetFixtureB()`: Returns the `b2Fixture` of object B
* Class `b2Fixture`: A fixture is used to attach a shape to a body for collision detection. ([Documentation](http://www.box2dflash.org/docs/2.1a/reference/Box2D/Dynamics/b2Fixture.html))
  * `GetBody()`: Returns the body object of type `b2Body` (See section "_Manipulate Objects_")
  * `GetUserData()` and `SetUserData()`: Get/Set the user data. This is the same data as in section "_Manipulate Objects_"
  * `GetFriction()` and `SetFriction(Number friction)`: Get/Set the coefficient of friction.
  * `GetRestitution()` and `SetRestitution(Number restitution)`: Get/Set the coefficient of restitution.
  * `GetDensity()` and `SetDensity(Number density)`: Get/Set the density of this body.
* Class `b2ContactImpulse`: Contact impulses for reporting. Impulses are used instead of forces. ([Documentation](http://www.box2dflash.org/docs/2.1a/reference/Box2D/Dynamics/b2ContactImpulse.html))
  * `impulse.normalImpulses`: Array of different impulses applied to this object in normal direction.
  * `impulse.tangentImpulses`: Array of different impulses applied to this object in tangential direction.

There are tree prepared function you can use to do your collision detection:
* `beginContact(b2Contact contact)`: This function is called when two objects begin to touch eachother.
* `endContact(b2Contact contact)`: This function is called when two objects move away from eachother
* `postSolveContact(b2Contact contact, b2ContactImpulse impulse)`: This function is called after the physical influence of the contact of two objects has been calculated. This function is always called after `endContact(..)`!
