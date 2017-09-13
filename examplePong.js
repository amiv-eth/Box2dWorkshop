/* *******************************************
 * IT Workshop: Pong Game Example
 *
 * Author: Sandro Lutz <code@temparus.ch>
 * ******************************************* */

var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2AABB = Box2D.Collision.b2AABB;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint;
var b2ContactListener = Box2D.Dynamics.b2ContactListener;
var b2Math = Box2D.Common.Math.b2Math;

var canvas
var context;
var world;
var updateInterval;
var paused;
var worldScale;
var contactListener;

// =============================
// ADD YOUR CODE BELOW THIS LINE
// =============================

var gravity = new b2Vec2(0, 0);
var started;
var player1Points;
var player2Points;
var player1;
var player2;
var ball;

function initialize() {
	createObject('box', {width:20, height:600, x:-200, y:300, data:{name:'hiddenWall1'}});
	createObject('box', {width:20, height:600, x:1100, y:300, data:{name:'hiddenWall2'}});
	
	createObject('box', {width:1300, height:20, x:450, y:10, restitution:1, friction:0, data:{name:'borderTop'}});
	createObject('box', {width:1300, height:20, x:450, y:590, restitution:1, friction:0, data:{name:'borderBottom'}});
	
	player1 = createObject('box', {width:15, height:100, x:20, y:300, restitution:1, friction:0.2, data:{name:'player1'}});
	player1Points = 0;
	
	player2 = createObject('box', {width:15, height:100, x:880, y:300, restitution:1, friction:0.2, data:{name:'player2'}});
	player2Points = 0;
	
	ball = createBall();
	
	started = false;
	
	// capture keyboard inputs
	$(document).keydown(function(event)
	{
		if (!paused) {
			if (event.keyCode == 38) { // arrow up
				var currentPosition = player2.GetPosition();
				currentPosition.y = (currentPosition.y > 88/worldScale) ? currentPosition.y-18/worldScale : 70/worldScale;
				player2.SetPosition(currentPosition);
			} else if (event.keyCode == 40) { // arrow down
				var currentPosition = player2.GetPosition();
				currentPosition.y = (currentPosition.y < 512/worldScale) ? currentPosition.y+18/worldScale : 530/worldScale;
				player2.SetPosition(currentPosition);
			} else if (event.keyCode == 119 || event.keyCode == 87) { // w
				var currentPosition = player1.GetPosition();
				currentPosition.y = (currentPosition.y > 88/worldScale) ? currentPosition.y-18/worldScale : 70/worldScale;
				player1.SetPosition(currentPosition);
			} else if (event.keyCode == 115 || event.keyCode == 83) { // s
				var currentPosition = player1.GetPosition();
				currentPosition.y = (currentPosition.y < 512/worldScale) ? currentPosition.y+18/worldScale : 530/worldScale;
				player1.SetPosition(currentPosition);
			} else if (event.keyCode == 32 && !started) { // Space
				started = true;
				startRound();
			}
		}
	});
	
}

function update() {
	// Nothing to update here.
}

function createBall() {
	ball = createObject('circle', {width:40, height:40, x:450, y:300, restitution:1, friction:0.2,type:'dynamic', data:{name:'ball'}});
	//body.SetSleepingAllowed(false);
	return ball;
}

function startRound() {
	var velocityX = Math.random()*10 + 6;
	if (Math.random() > 0.5) {
		velocityX *= -1;
	}
	var velocityY = Math.random()*16;
	if (Math.random() > 0.5) {
		velocityY *= -1;
	}
	ball.SetActive(true);
	ball.SetAwake(true);
	ball.SetLinearVelocity(new b2Vec2(velocityX, velocityY));
}

// This function is called when two objects begin to touch eachother
function beginContact(contact) {
	var fixtureA = contact.GetFixtureA();
	var fixtureB = contact.GetFixtureB();
	var roundFinished = false;
	if ((fixtureA.GetBody().GetUserData()['name'] == 'ball' && fixtureB.GetBody().GetUserData()['name'] == 'hiddenWall1') || (fixtureB.GetBody().GetUserData()['name'] == 'ball' && fixtureA.GetBody().GetUserData()['name'] == 'hiddenWall1')) {
		player2Points++;
		roundFinished = true;
	}
	
	if ((fixtureA.GetBody().GetUserData()['name'] == 'ball' && fixtureB.GetBody().GetUserData()['name'] == 'hiddenWall2') || (fixtureB.GetBody().GetUserData()['name'] == 'ball' && fixtureA.GetBody().GetUserData()['name'] == 'hiddenWall2')) {
		player1Points++;
		roundFinished = true;
	}
	
	if (roundFinished) {
		ball.SetAwake(false);
		ball.SetActive(false);
		ball.SetLinearVelocity(new b2Vec2(0,0));
		ball.SetAngularVelocity(0);
		ball.SetPosition(new b2Vec2(450, 300));
		setTimeout(startRound, 1000);
	}
	
}

// This function is called when two objects move away from eachother
function endContact(contact) {
	// Place your code here...
}

// This function is called after the physical influence of the contact 
// of two objects has been calculated after endContact has been called.
function postSolveContact(contact, impulse) {
	// Place your code here...
}

// ======================================
// DO NOT CHANGE ANYTHING BELOW THIS LINE
//   UNLESS YOU KNOW WHAT YOU ARE DOING
// ======================================

$(document).ready(function() {
	canvas = $('#gameArea');
	context = canvas[0].getContext("2d");
	contactListener = new b2ContactListener
	contactListener.BeginContact = beginContact;
	contactListener.EndContact = endContact;
	contactListener.PostSolve = postSolveContact;
	worldScale = 30;
	paused = false;
	$('#buttonPause').click(function() {
		if (paused) {
			start();
			$(this).html("Pause");
		} else {
			pause();
			$(this).html("Resume");
		}
	});
	
	$('#buttonReset').click(function() {
		pause();
		initializeInternal();
		updateInternal();
	});
	
	initializeInternal();	
	updateInternal();
});

function clearCanvas() {
	context.save();
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.restore();
}

function createObject(type, options) {
	var defaults = {
		width : 0,
		height : 0,
		x: 0,
		y : 0,
		type : 'static', // allowed: dynamic, static
		angle : 0,
		density : 1,
		friction : 0.5,
		restitution : 0.5,
		data : {}
	};
	var bodyDef;
	var shape;
	var fixtureDef;
	var object;
				
	var data = $.extend(defaults, options);
	
	bodyDef = new b2BodyDef;
	bodyDef.type = (data['type'] == 'dynamic') ? b2Body.b2_dynamicBody : b2Body.b2_staticBody;
	bodyDef.position.Set(data['x']/worldScale,data['y']/worldScale);
	bodyDef.userData = data['data'];
	fixtureDef = new b2FixtureDef;
	switch(type)
	{
		case 'box':
			shape = new b2PolygonShape;
			shape.SetAsBox(data['width']/2/worldScale,data['height']/2/worldScale);
			fixtureDef.shape = shape;
			bodyDef.userData['width'] = data['width'];
			bodyDef.userData['height'] = data['height'];
			break;
		case 'circle':
			shape = new b2CircleShape(data['width']/4/worldScale);
			fixtureDef.shape = shape;
			bodyDef.userData['width'] = data['width'];
			bodyDef.userData['height'] = data['height'];
			break;
		default:
			console.log('unknown object type: ' + type);
			return null;
	}
	fixtureDef.density = parseFloat(data['density']);
	fixtureDef.friction = parseFloat(data['friction']);
	fixtureDef.restitution = parseFloat(data['restitution']);
	object = world.CreateBody(bodyDef);
	object.CreateFixture(fixtureDef);
	object.SetAngle(parseFloat(data['angle']));
				
	return object;
}

function initializeInternal() {
	clearCanvas();
	var debugDrawObj = new b2DebugDraw();
	debugDrawObj.SetSprite(context);
	debugDrawObj.SetDrawScale(30.0);
	debugDrawObj.SetFillAlpha(0.5);
	debugDrawObj.SetLineThickness(1.0);
	debugDrawObj.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	world = new b2World(gravity, true);
	world.SetDebugDraw(debugDrawObj);
	world.SetContactListener(contactListener);
	initialize();
	start();
}

function updateInternal() {
	update();
	world.Step(1/60,10,10);
	world.DrawDebugData();
}


function start() {
	paused = false;
	updateInterval = setInterval(updateInternal,1000/60);
}

function pause() {
	paused = true;
	clearInterval(updateInterval);
}