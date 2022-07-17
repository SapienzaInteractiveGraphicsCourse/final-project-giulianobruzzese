/**
 * @author Giuliano Bruzzese
 *
 * @title Snake3D Game
 *
 * Project as part of the Interactive Graphics course A.Y.  
 * 2021-2022
 *
 */

"use strict";

var canvas;
var gl;

var program;

var bufferId;
var cBufferId, vBufferId, tBufferId, nBufferId;
var colorLoc,positionLoc,textureLoc,normalLoc;

var END   = false;
var START = false;
var PAUSE = false;
var FULL  = false;
var AUDIO = true;
var changing_direction = false;
var perspectiveV = true;

var texSize              = 512;
var numVertices          = 24;
var maxNumSnakeParts     = 1000000;
var initialNumSnakeParts = 5;
var initialPointSize     = 30;
var initialSpeed         = 0.3;
var numColors            = 8;
var currentAngle;

var snake;
var food;
var poison;
var sun;
var blades;

var bladeStep  = 0.0001;
var numBlades  = 0;
var count      = 0;

var time  = 0;
var dt    = 100;
var score = 0;
var bestScore = score;

var numSnakeParts = initialNumSnakeParts;
var pointSize     = initialPointSize;
var dx            = 0.05;
var dz            = 0.0;
var dl            = 0.0;
var textureCase   = 0;
var food_x,food_z;
var poison1_x,poison1_z;
var poison2_x,poison2_z;
var poison3_x,poison3_z;
var poison4_x,poison4_z;
var eye_x, eye_y, eye_z;

var audio1 = document.getElementById("audio1");
var audio2 = document.getElementById("audio2");
var audio3 = document.getElementById("audio3");
var audio4 = document.getElementById("audio4");
var audio5 = document.getElementById("audio5");
var audio6 = document.getElementById("audio6");
var audio7 = document.getElementById("audio7");
var sound  = audio1;

var translateX =  0.0;
var translateY =  0.0;
var translateZ =  0.0;
var leftVP     = -2.0;
var rightVP    =  2.0;
var bottomVP   = -2.0;
var topVP      =  2.0;
var fovy       =  40;
var aspect     =  0.7;
var near       =  5.0;
var far        =  10.0;


var texture0,texture1,texture2,texture3;

var GFpointsArray      = [];
var GFcolorsArray      = [];
var GFtexCoordsArray   = [];
var pointsArray        = [];
var colorsArray        = [];
var normalsArray       = [];
var texCoordsArray     = [];


var projectionMatrix,modelViewMatrix,instanceMatrix;
var modelViewMatrixLoc;
var eye;
var at;
var up;

var lightPosition = vec4(
	2.0*Math.sin(0.1),
	1.0,
	2.0*Math.cos(0.1),
	1.0
);

var lightAmbient  = vec4(0.5, 0.5, 0.5, 1.0);
var lightDiffuse  = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient   = vec4(1.0, 0.0, 1.0, 1.0);
var materialDiffuse   = vec4(1.0, 0.8, 0.0, 1.0);
var materialSpecular  = vec4(1.0, 0.8, 0.0, 1.0);
var materialShininess = 10.0;

var ambientProduct  = mult(lightAmbient,materialAmbient);
var diffuseProduct  = mult(lightDiffuse,materialDiffuse);
var specularProduct = mult(lightSpecular,materialSpecular);


var vertices = [
  vec4( -1.4, -1.0,  1.4, 1.0 ),
  vec4( -1.4, -0.6,  1.4, 1.0 ),
  vec4(  1.4, -0.6,  1.4, 1.0 ),
  vec4(  1.4, -1.0,  1.4, 1.0 ),
  vec4( -1.4, -1.0, -1.4, 1.0 ),
  vec4( -1.4, -0.6, -1.4, 1.0 ),
  vec4(  1.4, -0.6, -1.4, 1.0 ),
  vec4(  1.4, -1.0, -1.4, 1.0 )
];

var points_x, points_y, points_z;
var color_x;
var color_y;
var color_z;


var vertexColors = [
	vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    	vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    	vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    	vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    	vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    	vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    	vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
    	vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];

var texCoord = [
     	vec2(0,0),
    	vec2(0,1),
     	vec2(1,1),
     	vec2(1,0)
];


var end_text = [
	"Oh, no!",
	"Maybe next time",
	"Nearly!",
	"You almost succeeded!",
	"Soon you will be perfect!",
	"You must be a born snake!",
	"Good work, snake!"
];


var greenSnake   = vec4(0.0305,0.610,0.108,1.0);
var redSnake     = vec4(1.0,0.0,0.0,1.0);
var yellowSnake  = vec4(0.0,1.0,1.0,1.0);
var magentaSnake = vec4(1.0,0.0,1.0,1.0);
var blueSnake    = vec4(0.0,0.0,1.0,1.0);

var headColor = greenSnake;
var bodyColor = greenSnake;





//--------------------------------------------------GAME ARRAY

var stack = [];
var game = [];

//-------------------------------------------FIGURES VARIABLES

var playingFieldId   = 0;
var playingField1Id  = 0;
var playingField2Id  = 1;
var playingField3Id  = 2;
var snakeId       = 3;
var foodId        = 4;
var sunId         = 5;
var poisonId      = 6;

var numNodes  = 7;
var numAngles = 8;
var angle     = 0;

var theta = [
	0, //playingFieldId
	0, //playingField1Id
	0, //playingField2Id
	0, //playingField3Id
	0, //snakeId
	0, //foodId
	0, //sunId
	0, //poisonId
	0
];


for(var i=0; i<numNodes; i++) 
	game[i] = createNode(null, null, null, null);

//-----------------------------------------------NODE FUNCTION

function createNode(transform,render,sibling,child)
{
    	var node =
	{
    		transform: transform,
    		render:    render,
    		sibling:   sibling,
    		child:     child,
    	}
    	return node;
}


function initNodes(Id)
{

    	var m = mat4();

    	switch(Id)
	{

    		case playingFieldId:
    		case playingField1Id:
    		case playingField2Id:
    		case playingField3Id:

			m = translate(
				translateX,
				translateY,
				translateZ
			);
	    		m = mult(
				m,
				rotate(
					theta[playingField1Id],
					vec3(1,0,0)
				)
			);

			m = mult(
				m,
				rotate(
					theta[playingField2Id],
					vec3(0,1,0)
				)
			);
	    		m = mult(
				m,
				rotate(
					theta[playingField3Id],
					vec3(0,0,1)
				)
			);


    			game[playingFieldId] = 
				createNode(m,playingField,null,snakeId);
    		
		break;

		case snakeId:

			m = translate(
				snake[0].position[0],
				snake[0].position[1],
				snake[0].position[2]
			);
    			game[snakeId] = 
				createNode(m,Snake,foodId,null);
    		
		break;
		case foodId:

			m = translate(
				food[0].position[0],
				food[0].position[1],
				food[0].position[2]
			);
    			game[foodId] = 
				createNode(m,Food,sunId,null);
    		
		break;

		case sunId:
			m = translate(
				sun[0].position[0],
				sun[0].position[1],
				sun[0].position[2]
			);

    			game[sunId] = 
				createNode(m,Sun,poisonId,null);
    		
		break;

		case poisonId:
			m = translate(
				poison[0].position[0],
				poison[0].position[1],
				poison[0].position[2]
			);
    			game[poisonId] = 
				createNode(m,Poison,null,null);
    		
		break;
    }

}
//-------------------------------------------TRAVERSE FUNCTION

function traverse(Id)
{
   	if(Id == null) return;

	stack.push(modelViewMatrix);
   	modelViewMatrix = mult(
		modelViewMatrix,
		game[Id].transform
	);
   	
	game[Id].render();
   	
	if(game[Id].child != null) 
		traverse(game[Id].child);
    	modelViewMatrix = stack.pop();
   
	if(game[Id].sibling != null)
		traverse(game[Id].sibling);
}

//----------------------------------------------GRASS FUNCTION

function playingField()
{
	instanceMatrix = mult(
		modelViewMatrix,
		translate(0.0,0.0,0.0)
	);
	gl.uniformMatrix4fv(
		modelViewMatrixLoc,
		false,
		flatten(instanceMatrix)
	);

	gl.uniform1i(
		gl.getUniformLocation(program,"isSnake"),
		0.0
	);
    	for (var i = 0; i < 6; i++) 
		gl.drawArrays(gl.TRIANGLE_FAN,i*4,4);
	
	gl.uniform1i(
		gl.getUniformLocation(program,"isSnake"),
		4.0
	);
	
	if (textureCase != 1 
	&& textureCase != 4
	&& textureCase != 5
	&& textureCase != 6)
	{
		for (var i=0; i<numBlades; i++)
		gl.drawArrays(gl.LINES,numVertices+i*2,2);
	}
}

//----------------------------------------------SNAKE FUNCTION

function Snake()
{
	snake.forEach(drawSnakePart)
}
function drawSnakePart(snakePart)
{
	gl.uniform1i(
		gl.getUniformLocation(program,"isSnake"),
		1.0
	);
	for (var i=0; i<numSnakeParts;i++)
	gl.drawArrays(
		gl.POINTS,
		numVertices+numBlades*2+i,
		1
	);
}

//-----------------------------------------------FOOD FUNCTION

function Food()
{
	gl.uniform1i(
		gl.getUniformLocation(program,"isSnake"),
		2.0
	);
	gl.drawArrays(
		gl.POINTS,
		numVertices+numBlades*2+numSnakeParts,
		1
	);
}

//------------------------------------------------SUN FUNCTION

function Sun() 
{
	gl.uniform1i(
		gl.getUniformLocation(program,"isSnake"),
		5.0
	);
	if (textureCase != 6)
	gl.drawArrays(
		gl.POINTS,
		numVertices+numBlades*2+numSnakeParts+1,
		1
	);
}

//---------------------------------------------POISON FUNCTION

function Poison()
{
	if(score>=250)
	{
		gl.uniform1i(
			gl.getUniformLocation(program,"isSnake"),
			3.0
		);
		if(score<350)
			gl.drawArrays(
				gl.POINTS,
				numVertices+numBlades*2+numSnakeParts+2,
				1
			);
		else if(score<400)
			for(var i=0; i<2; i++)
				gl.drawArrays(
					gl.POINTS,
					numVertices+numBlades*2							+numSnakeParts+2+i,
					1
				);
		else if(score<450)
			for(var i=0; i<3; i++)
				gl.drawArrays(
					gl.POINTS,
					numVertices+numBlades*2
					+numSnakeParts+2+i,
					1
				);
		else
			for(var i=0; i<4; i++)
				gl.drawArrays(
					gl.POINTS,
					numVertices+numBlades*2
					+numSnakeParts+2+i,
					1
				);
	}

}


//------------------------------------------MYRANDOM FUNCTIONS


function myRandom(min, max)
{
	return (Math.random()*(max-min)+min);
}


//--------------------------PLAYING FIELD COMPONENTS FUNCTIONS

function quad(a, b, c, d) {

    	var t1 = subtract(vertices[b], vertices[a]);
    	var t2 = subtract(vertices[c], vertices[b]); 
    	var normal = cross(t1, t2);
    	normal = vec3(normal);

     	pointsArray.push(vertices[a]);
     	pointsArray.push(vertices[b]);
    	pointsArray.push(vertices[c]);
     	pointsArray.push(vertices[d]);
     	
	GFpointsArray.push(vertices[a]);
     	GFpointsArray.push(vertices[b]);
    	GFpointsArray.push(vertices[c]);
     	GFpointsArray.push(vertices[d]);
    	
	texCoordsArray.push(texCoord[0]);
    	texCoordsArray.push(texCoord[1]);
    	texCoordsArray.push(texCoord[2]);
    	texCoordsArray.push(texCoord[3]);
    	
	GFtexCoordsArray.push(texCoord[0]);
    	GFtexCoordsArray.push(texCoord[1]);
    	GFtexCoordsArray.push(texCoord[2]);
    	GFtexCoordsArray.push(texCoord[3]);
    	
	normalsArray.push(normal);
    	normalsArray.push(normal);
    	normalsArray.push(normal);
    	normalsArray.push(normal);

	if(a==6)
	{
		colorsArray.push(vec4(0.344,1.0,0.18,1.0));
    		colorsArray.push(vec4(0.344,1.0,0.18,1.0));
    		colorsArray.push(vec4(0.344,1.0,0.18,1.0));
		colorsArray.push(vec4(0.344,1.0,0.18,1.0));
	
		GFcolorsArray.push(vec4(0.344,1.0,0.18,1.0));
    		GFcolorsArray.push(vec4(0.344,1.0,0.18,1.0));
    		GFcolorsArray.push(vec4(0.344,1.0,0.18,1.0));
		GFcolorsArray.push(vec4(0.344,1.0,0.18,1.0));
		//0.479,0.980,0.00980

	}
	else
	{
		colorsArray.push(vec4(0.650,0.338,0.0260,1.0));
    		colorsArray.push(vec4(0.650,0.338,0.0260,1.0));
    		colorsArray.push(vec4(0.650,0.338,0.0260,1.0));
		colorsArray.push(vec4(0.650,0.338,0.0260,1.0));
		
		GFcolorsArray.push(vec4(0.650,0.338,0.0260,1.0));
    		GFcolorsArray.push(vec4(0.650,0.338,0.0260,1.0));
    		GFcolorsArray.push(vec4(0.650,0.338,0.0260,1.0));
		GFcolorsArray.push(vec4(0.650,0.338,0.0260,1.0));

		//vec4(0.290,0.124,0.00580,1.0);
	}

}
function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

//------------------------------------------DRAWBLADE FUNCTION

function drawBlade(n) {

	points_x = myRandom(-1.4,1.4);
	points_y = myRandom(-0.55,-0.35);
	points_z = n;

	pointsArray.push(vec4(
		points_x,
		-0.6,
		points_z,
		1.0
		)
	);
	pointsArray.push(vec4(
		points_x,
		points_y,
		points_z,
		1.0
		)
	);

	GFpointsArray.push(vec4(
		points_x,
		-0.6,
		points_z,
		1.0
		)
	);
	GFpointsArray.push(vec4(
		points_x,
		points_y,
		points_z,
		1.0
		)
	);

    	var normal = subtract(
		vec4(	points_x,-0.6,points_z,1.0),
		vec4(points_x,points_y,points_z,1.0)
	);
    	normal = vec3(normal);
    	
	normalsArray.push(normal);
    	normalsArray.push(normal);
    	

	texCoordsArray.push(texCoord[0]);
    	texCoordsArray.push(texCoord[1]);

	color_x = myRandom(0.0806,0.384);
	color_y = myRandom(0.6000,0.730);
	color_z = myRandom(0.0120,0.308);
	colorsArray.push(vec4(
		color_x,
		color_y,
		color_z,
		1.0
		)
	);
	colorsArray.push(vec4(
		color_x,
		color_y,
		color_z,
		1.0
		)
	);
	GFcolorsArray.push(vec4(
		color_x,
		color_y,
		color_z,
		1.0
		)
	);
	GFcolorsArray.push(vec4(
		color_x,
		color_y,
		color_z,
		1.0
		)
	);

}

//-------------------------------------------GEN_FOOD FUNCTION

function gen_food() 
{  
   	food_x = myRandom(-1.38,1.38);
   	food_z = myRandom(-1.38,1.38);

	for(var i=0; i<numSnakeParts; i++)
		if (
			(snake[i].position[0] - 
 			food_x).toFixed(1) == 0.0
			&&
			(snake[i].position[2] - 
			food_z).toFixed(1) == 0.0
		)
		{
			food_x += 0.01;
			food_z += 0.01;
		} 


	food = [
		{
			position: vec4(food_x,-0.5,food_z,1),
			color: vec4(0.770,0.0154,0.0154,1.0)
		}
	];
}

//-----------------------------------------GEN_POISON FUNCTION

function gen_poison() 
{  
   	poison1_x = myRandom(-1.38,1.38);
   	poison1_z = myRandom(-1.38,1.38);
   	poison2_x = myRandom(-1.38,1.38);
   	poison2_z = myRandom(-1.38,1.38);
   	poison3_x = myRandom(-1.38,1.38);
   	poison3_z = myRandom(-1.38,1.38);
   	poison4_x = myRandom(-1.38,1.38);
   	poison4_z = myRandom(-1.38,1.38);


	poison = [
		{
			position: vec4(poison1_x,-0.5,poison1_z,1),
			color: vec4(0.489,0.0100,1.00,1.0)
		},
		{
			position: vec4(poison2_x,-0.5,poison2_z,1),
			color: vec4(0.489,0.0100,1.00,1.0)
		},
		{
			position: vec4(poison3_x,-0.5,poison3_z,1),
			color: vec4(0.489,0.0100,1.00,1.0)
		},
		{
			position: vec4(poison4_x,-0.5,poison4_z,1),
			color: vec4(0.489,0.0100,1.00,1.0)
		}
	];
}




//--------------------------------------------TEXTURE PATTERNS

var image0 = new Uint8Array(4*texSize*texSize);
for (var i = 0; i < texSize; i++)
	for (var j = 0; j < texSize; j++)
	{          
     		var c;
           var patchx = Math.floor(i/(texSize/512));
           var patchy = Math.floor(j/(texSize/512));
		if(
			((patchx)%512 && (patchy)%512) &&
			((patchx+1)%512 && (patchy+1)%512)
		) c = 255;
           else c = 0;

           image0[4*i*texSize+4*j]   = c;            
		image0[4*i*texSize+4*j+1] = c;
           image0[4*i*texSize+4*j+2] = c;
           image0[4*i*texSize+4*j+3] = 255;

	}

var image1 = new Uint8Array(4*texSize*texSize);
for(var i=0; i<texSize; i++)
	for(var j=0; j<texSize; j++)
	{
		var c;
    		var x = Math.PI*(4*i/texSize-2.0);
		var y = Math.PI*(4*j/texSize-2.0);
        	var r = 0.3*Math.sqrt(x*x+y*y);
        	if(r) c = 255*(1+Math.sin(r)/r);
        	else c = 255;
        	image1[4*i*texSize+4*j]   = c;
		image1[4*i*texSize+4*j+1] = c;
		image1[4*i*texSize+4*j+2] = c;
		image1[4*i*texSize+4*j+3] = 255;
    }

var image2 = new Uint8Array(4*texSize*texSize);
for (var i = 0; i < texSize; i++)
	for (var j = 0; j < texSize; j++)
	{          
     		var c;
           var patchx = Math.floor(i/(texSize/512));
           var patchy = Math.floor(j/(texSize/512));
		if(
			((patchx)%64 && (patchy)%64) &&
			((patchx+1)%64 && (patchy+1)%64)
		) c = 255;
           else c = 0;

           image2[4*i*texSize+4*j]   = c;            
		image2[4*i*texSize+4*j+1] = c;
           image2[4*i*texSize+4*j+2] = c;
           image2[4*i*texSize+4*j+3] = c;

	}

//---------------------------------CONFIGURE TEXTURES FUNCTION

function configureTexture() 
{
	texture0 = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0);
    	gl.bindTexture(gl.TEXTURE_2D, texture0);
	gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGBA,
			texSize,
			texSize,
			0,
			gl.RGBA,
			gl.UNSIGNED_BYTE,
			image0
	);
    	gl.generateMipmap(gl.TEXTURE_2D);
    	gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_MAG_FILTER,
			gl.NEAREST
	);
    	gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_MIN_FILTER,
			gl.LINEAR
	);
  	gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_WRAP_S,
			gl.CLAMP_TO_EDGE
	);
    	gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_WRAP_T,
			gl.CLAMP_TO_EDGE
	);
    	
	texture1 = gl.createTexture();
    	gl.bindTexture(gl.TEXTURE_2D, texture1);
    	gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGBA,
			texSize,
			texSize,
			0,
			gl.RGBA,
			gl.UNSIGNED_BYTE,
			image1
	);
	gl.generateMipmap(gl.TEXTURE_2D);
	    	gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_MAG_FILTER,
			gl.NEAREST
	);
    	gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_MIN_FILTER,
			gl.NEAREST
	);
  	gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_WRAP_S,
			gl.CLAMP_TO_EDGE
	);
    	gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_WRAP_T,
			gl.CLAMP_TO_EDGE
	);

	texture2 = gl.createTexture();
    	gl.bindTexture(gl.TEXTURE_2D, texture2);
    	gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGBA,
			texSize,
			texSize,
			0,
			gl.RGBA,
			gl.UNSIGNED_BYTE,
			image2
	);
	gl.generateMipmap(gl.TEXTURE_2D);
	    	gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_MAG_FILTER,
			gl.NEAREST
	);
    	gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_MIN_FILTER,
			gl.NEAREST
	);
  	gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_WRAP_S,
			gl.CLAMP_TO_EDGE
	);
    	gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_WRAP_T,
			gl.CLAMP_TO_EDGE
	);
}


//-----------------------------------------------INIT FUNCTION

window.onload = function init()
{

    	canvas = document.getElementById( "gl-canvas" );
    	gl = canvas.getContext('webgl2');
    	if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(0.340,1.00,0.824,1.0);
    	
	gl.enable(gl.CULL_FACE);
    	gl.enable(gl.DEPTH_TEST);
     	gl.depthFunc(gl.LEQUAL);

//-------------------------------------------BUTTONS & SLIDERS


////////SCENARIOS

    	document.getElementById("Texture Style").onclick =
    		function( event) {
          		switch(event.target.index) {
          			case 0: 
					textureCase = 0;
					theta[playingField3Id] = 0;
					initNodes(playingField3Id);
					theta[playingField2Id] = 0;
					initNodes(playingField2Id);
					theta[playingField1Id] = 0;
					initNodes(playingField1Id);
					eye_x = 5;
					eye_y = 5;
					eye_z = 1;
					perspectiveV = true;
					var projection = 
						document.
						getElementById("persproj");
					projection.checked = true;

    				break;
				case 1:
					textureCase = 1;
					theta[playingField3Id] = 0;
					initNodes(playingField3Id);
					theta[playingField2Id] = 0;
					initNodes(playingField2Id);
					theta[playingField1Id] = 0;
					initNodes(playingField1Id);
					eye_x = 5;
					eye_y = 5;
					eye_z = 1;
					perspectiveV = true;
					var projection = 
						document.
						getElementById("persproj");
					projection.checked = true;
					sound.pause();
					sound = audio1;
					if(!PAUSE)
					{
						sound.play()
						sound.loop = true;
					}
 				break;
				case 2: 
					textureCase = 2;
					theta[playingField3Id] = 0;
					initNodes(playingField3Id);
					theta[playingField2Id] = 0;
					initNodes(playingField2Id);
					theta[playingField1Id] = 0;
					initNodes(playingField1Id);
					eye_x = 5;
					eye_y = 5;
					eye_z = 1;
					perspectiveV = true;
					var projection = 
						document.
						getElementById("persproj");
					projection.checked = true;
					sound.pause();
					sound = audio1;
					if(!PAUSE)
					{
						sound.play()
						sound.loop = true;
					}
				break;
          			case 3: 
					textureCase = 3;
					theta[playingField3Id] = 0;
					initNodes(playingField3Id);
					theta[playingField2Id] = 0;
					initNodes(playingField2Id);
					theta[playingField1Id] = 0;
					initNodes(playingField1Id);
					eye_x = 5;
					eye_y = 5;
					eye_z = 1;
					perspectiveV = true;
					var projection = 
						document.
						getElementById("persproj");
					projection.checked = true;
					sound.pause();
					sound = audio7;
					if(!PAUSE)
					{
						sound.play()
						sound.loop = true;
					}
    				break;
				case 4:
					textureCase = 4;
					theta[playingField3Id] = 0;
					initNodes(playingField3Id);
					theta[playingField2Id] = 0;
					initNodes(playingField2Id);
					theta[playingField1Id] = 0;
					initNodes(playingField1Id);
					eye_x = 5;
					eye_y = 5;
					eye_z = 1;
					perspectiveV = true;
					var projection = 
						document.
						getElementById("persproj");
					projection.checked = true;
					sound.pause();
					sound = audio5;
					if(!PAUSE)
					{
						sound.play()
						sound.loop = true;
					}
 				break;
				case 5: 
					textureCase = 5;
					theta[playingField3Id] = 0;
					initNodes(playingField3Id);
					theta[playingField2Id] = 0;
					initNodes(playingField2Id);
					theta[playingField1Id] = 0;
					initNodes(playingField1Id);
					eye_x = 5;
					eye_y = 5;
					eye_z = 1;
					perspectiveV = true;
					var projection = 
						document.
						getElementById("persproj");
					projection.checked = true;
					sound.pause();
					sound = audio6;
					if(!PAUSE)
					{
						sound.play()
						sound.loop = true;
					}
				break;
				case 6:
					textureCase = 6;
					theta[playingField3Id] = 60;
					initNodes(playingField3Id);
					theta[playingField2Id] = 10;
					initNodes(playingField2Id);
					theta[playingField1Id] = 0.1;
					initNodes(playingField1Id);
					eye_x = 4.7;
					eye_y = 3.0;
					eye_z = 0.9;
					perspectiveV = false;
					var projection = 
						document.
						getElementById("orthproj");
					projection.checked = true;
					sound.pause();
					sound = audio1;
					if(!PAUSE)
					{
						sound.play()
						sound.loop = true;
					}
				break;
			}
	}



////////RADIO BUTTONS

	document.getElementById("persproj").onclick =
    	function( event) 
	{
		perspectiveV = true;
	};
	document.getElementById("orthproj").onclick =
    	function( event) 
	{
		perspectiveV = false;
	};



////////START BUTTON

	document.getElementById("start").onclick =
    	function( event) 
	{
		if(!END)
		{
		document.getElementById('ready').innerHTML =
			"";	
		document.getElementById('start').innerHTML =
			"";
		START = true;
			if(PAUSE)
			{	
			sound.play();
			sound.loop = true;
			audio2.pause();
				PAUSE = false;
			}
		}          
	};



////////RESTART BUTTON

	document.getElementById("restart_button").onclick =
    	function( event) 
	{
		numSnakeParts = 5;
	snake = [
		{
			position: vec4(0,-0.5,0,1),
			color: headColor 
		},
		{
			position: vec4(-0.05,-0.5,0,1),
			color: headColor 
		},
		{
			position: vec4(-0.1,-0.5,0,1),
			color: headColor 
		},
		{
			position: vec4(-0.15,-0.5,0,1),
			color: bodyColor 
		},
		{
			position: vec4(-0.2,-0.5,0,1),
			color: bodyColor
		},
	];
	
		pointsArray = [];
		colorsArray = [];

		for(var i=0; i<GFpointsArray.length;i++)
		pointsArray.push(GFpointsArray[i]);
		for(var i=0; i<GFcolorsArray.length;i++)
		colorsArray.push(GFcolorsArray[i]);
		
    		for(var i=0; i<numSnakeParts; i++)
		{
      		pointsArray.push(snake[i].position);
       		colorsArray.push(snake[i].color);
     		}
	
		gen_food();
		gen_poison();
		lightPosition[1] = 1.0;
		score = 0; 
    		pointsArray.push(food[0].position);
    		colorsArray.push(food[0].color);
		pointsArray.push(sun[0].position);
    		colorsArray.push(sun[0].color);
		pointsArray.push(poison[1].position);
    		colorsArray.push(poison[1].color);
		pointsArray.push(poison[2].position);
    		colorsArray.push(poison[2].color);
		pointsArray.push(poison[3].position);
    		colorsArray.push(poison[3].color);

    	gl.bindBuffer(gl.ARRAY_BUFFER,cBufferId);
    	gl.bufferSubData(
		gl.ARRAY_BUFFER,
		0,
		flatten(colorsArray)
	);
    	gl.bindBuffer(gl.ARRAY_BUFFER,vBufferId);
    	gl.bufferSubData(
		gl.ARRAY_BUFFER,
		0,
		flatten(pointsArray)
	);
    	gl.bindBuffer(gl.ARRAY_BUFFER,tBufferId);
    	gl.bufferSubData(
		gl.ARRAY_BUFFER,
		0,
		flatten(texCoordsArray)
	);
    	gl.bindBuffer(gl.ARRAY_BUFFER,nBufferId);
    	gl.bufferSubData(
		gl.ARRAY_BUFFER,
		0,
		flatten(normalsArray)
	);

		document.getElementById('ready').innerHTML =
			"";	
		document.getElementById('start').innerHTML =
			"";
		var scenario = 
			document.getElementById("Texture Style");
		scenario.disabled = false;
		document.getElementById('score').innerHTML = score;
		dx = 0.05;
		dz = 0.0;
		count = 0;
		START = false;
		END   = false;
		changing_direction = false;
		this.disabled = true;	
		document.getElementById('start').innerHTML =
			"RESTART GAME";
		document.getElementById('start').style.top =
			360 + "px";
 		document.getElementById('start').style.left = 
			500 + "px";
		sound.play();
		sound.loop = true;
		
	}



////////INFO BUTTON

	var modal = document.getElementById("InfoModal");
	var btn = document.getElementById("info_button");
	var span = document.getElementsByClassName("close")[0];
	btn.onclick = function()
	{
  		modal.style.display = "block";
		if(START)
		{
			var pause = document.getElementById('start');
			pause.innerHTML  = "pause";
			pause.style.top  = 360 + "px";
			pause.style.left = 630 + "px";
			START = false;
			PAUSE = true;
		sound.pause();
		audio2.play();
		audio2.loop = true;
		}
	}
	span.onclick = function()
	{
  		modal.style.display = "none";
		if(!PAUSE)
		{
		sound.play();
		sound.loop = true;
	}
	else
	{
		sound.pause();
		audio2.play();
		audio2.loop = true;
	}
	}

	window.onclick = function(event)
	{
		if (event.target == modal)
		{
    			modal.style.display = "none";
		if(!PAUSE)
	{
		sound.play();
		sound.loop = true;
	}
	else
	{
		sound.pause();
		audio2.play();
		audio2.loop = true;
	}
  		}
	}


////////AUDIO BUTTON

	document.getElementById("audio_button").onclick =
    	function( event) 
	{
		if(AUDIO)
		{
			sound.volume = 0.0;
			audio2.volume = 0.0;
			audio3.volume = 0.0;
			audio4.volume = 0.0;

			this.innerHTML =
				"<b>" + "Mute" + "</b>";

			AUDIO = false;
		}
		else
		{
			sound.volume = 1.0;
			audio2.volume = 1.0;
			audio3.volume = 1.0;
			audio4.volume = 1.0;

			this.innerHTML =
				"<b>" + "Audio" + "</b>";

			AUDIO = true;
		}

	}

//------------------------------------------------LOAD SHADERS

    	program = initShaders(
			gl,
			"vertex-shader",
			"fragment-shader"
	);


 	gl.useProgram(program);   	


//----------------------------------------ATTRIBUTES & BUFFERS

    	bufferId = gl.createBuffer();
    	gl.bindBuffer(gl.ARRAY_BUFFER,bufferId);


    	cBufferId = gl.createBuffer();
    	gl.bindBuffer(gl.ARRAY_BUFFER,cBufferId);
    	gl.bufferData(
		gl.ARRAY_BUFFER,
		16*(maxNumSnakeParts+numVertices),
		gl.STATIC_DRAW
	);
    	colorLoc = gl.getAttribLocation(program,"aColor");
    	gl.vertexAttribPointer(colorLoc,4,gl.FLOAT,false,	0,0);
    	gl.enableVertexAttribArray(colorLoc);


 	vBufferId = gl.createBuffer();
    	gl.bindBuffer(gl.ARRAY_BUFFER,vBufferId);
    	gl.bufferData(
		gl.ARRAY_BUFFER,
		16*(maxNumSnakeParts+numVertices),
		gl.STATIC_DRAW
	);
    	positionLoc = gl.getAttribLocation(program,"aPosition");
    	gl.vertexAttribPointer(positionLoc,4,gl.FLOAT,false,0,0);
    	gl.enableVertexAttribArray(positionLoc);


 	tBufferId = gl.createBuffer();
    	gl.bindBuffer(gl.ARRAY_BUFFER,tBufferId);
    	gl.bufferData(
		gl.ARRAY_BUFFER,
		16*(maxNumSnakeParts+numVertices),
		gl.STATIC_DRAW
	);
    	textureLoc = gl.getAttribLocation(program,"aTexCoord");
	gl.vertexAttribPointer(textureLoc,2,gl.FLOAT,false,0,0);
    	gl.enableVertexAttribArray(textureLoc);


 	nBufferId = gl.createBuffer();
    	gl.bindBuffer(gl.ARRAY_BUFFER,nBufferId);
    	gl.bufferData(
		gl.ARRAY_BUFFER,
		16*(maxNumSnakeParts+numVertices),
		gl.STATIC_DRAW
	);
    	normalLoc = gl.getAttribLocation(program,"aNormal");
 	gl.vertexAttribPointer(normalLoc,3,gl.FLOAT,false,0,0);
    	gl.enableVertexAttribArray(normalLoc);


//------------------------------------------CONFIGURE TEXTURES

	configureTexture();

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture0);
	gl.uniform1i(
		gl.getUniformLocation(program,"uTex0"),
		0
	);
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, texture1);
	gl.uniform1i(
		gl.getUniformLocation(program,"uTex1"),
		1
	);
	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, texture2);
	gl.uniform1i(
		gl.getUniformLocation(program,"uTex2"),
		2
	);

//------------------------------------------CONFIGURE MATRICES

	eye_x = 5.0;
	eye_y = 5.0;
	eye_z = 1.0;

    	at  = vec3(0.0, 0.0, 0.0);
    	up  = vec3(0.0, 1.0, 0.0);
    	eye = vec3(eye_x, eye_y, eye_z);

	modelViewMatrix  = lookAt(eye, at, up);

    	if (perspectiveV)
		projectionMatrix = perspective(
			fovy,
			aspect,
			near,
			far
		);
	
	else
		projectionMatrix = ortho(
			leftVP,
			rightVP,
			bottomVP,
			topVP,
			-near,
			far/2
		);

    	gl.uniformMatrix4fv(
		gl.getUniformLocation(program,"modelViewMatrix"),
		false,
		flatten(modelViewMatrix)
	);
    	gl.uniformMatrix4fv(
		gl.getUniformLocation(program,"projectionMatrix"),
		false,
		flatten(projectionMatrix)
	);

	modelViewMatrixLoc = 
		gl.getUniformLocation(program,"modelViewMatrix")

	var restart = 
		document.getElementById("restart_button");
	restart.disabled = true;



//--------------------------------------------------FULLSCREEN


	var displayWidth  = canvas.clientWidth;
	var displayHeight = canvas.clientHeight;
	var mode=0;

	function resize(canvas)
	{
		displayWidth  = canvas.clientWidth;
		displayHeight = canvas.clientHeight;
  		if(mode==1)
		{
    			displayWidth = 1024;
    			displayHeight = 900;
  		}
		//canvas.style.padding=20+"px";
		canvas.childNodes[1].width=1670;
		canvas.childNodes[1].height=700;
		canvas.childNodes[1].style.top=75+"px";
		canvas.childNodes[3].style.top=75+"px";

	}	

	var elem = document.querySelector("#FULL-SCREEN");
	document.getElementById("full_screen_button").onclick =
    	function( event) 
	{
		openFullscreen();
	};

	function openFullscreen()
	{
  		if (elem.requestFullscreen)
		{
    			elem.requestFullscreen();
  		}
		else if (elem.webkitRequestFullscreen)
		{
			elem.webkitRequestFullscreen();
  		}
		else if (elem.msRequestFullscreen)
		{
    			elem.msRequestFullscreen();
  		}
		resize(elem);
	}


//----------------------------------------TRACK MOUSE DRAGGING

  	
	currentAngle = vec2(0.0, 0.0);
	var dragging = false;
	var lastX = -1, lastY = -1;
  	canvas.onmousedown = function(e)
	{
		var x = e.clientX, y = e.clientY;
    		var rect = e.target.getBoundingClientRect();
    		if (rect.left <= x 
		&& x < rect.right 
		&& rect.top <= y 
		&& y < rect.bottom)
		{
      		lastX = x; lastY = y;
      		dragging = true;
    		}
  	};

  	canvas.onmouseup = function(e) 
	{ 
		dragging = false;  
	};
	canvas.onmousemove = function(e)
	{
    		var x = e.clientX, y = e.clientY;
    		if (dragging)
		{
     			var factor = 100/canvas.height;
     			var dx = factor * (x - lastX);
      		var dy = factor * (y - lastY);
      		currentAngle[0] = Math.max(
				Math.min(currentAngle[0]+dy,90.0),
				-90.0
			);
      		currentAngle[1] = currentAngle[1] + dx;
    		}
    		lastX = x, lastY = y;
  	};
    


//---------------------------------CALL TO SIMULATION FUNCTION

    	simulation();

}


//-----------------------------------------SIMULATION FUNCTION

var simulation = function()
{

    	gl.uniform1i(
		gl.getUniformLocation(program, "isSnake"),
		0
	);
    	colorCube();
	
	for (var j=-1.4; j<=1.4; j+=bladeStep)
	{
		numBlades++;
		drawBlade(j);
	}

	
	
    	gl.uniform1i(
		gl.getUniformLocation(program,"isSnake"),
		1
	);

	snake = [
		{
			position: vec4(0,-0.5,0,1),
			color: headColor 
		},
		{
			position: vec4(-0.05,-0.5,0,1),
			color: headColor 
		},
		{
			position: vec4(-0.1,-0.5,0,1),
			color: headColor 
		},
		{
			position: vec4(-0.15,-0.5,0,1),
			color: bodyColor 
		},
		{
			position: vec4(-0.2,-0.5,0,1),
			color: bodyColor
		},
	];

    	for(var i=0; i<numSnakeParts; i++)
	{
      	pointsArray.push(snake[i].position);
       	colorsArray.push(snake[i].color);
     	}


    	gl.uniform1i(
		gl.getUniformLocation(program,"isSnake"),
		2
	);
	gen_food();
    	pointsArray.push(food[0].position);
    	colorsArray.push(food[0].color);


    	gl.uniform1i(
		gl.getUniformLocation(program,"isSnake"),
		5
	);
	sun = [
		{
			position: vec4(
				lightPosition[0],
				lightPosition[1],
				lightPosition[2],
				1.0
			),
			color: vec4(0.960,0.848,0.00,1.0)
		}
	];
	pointsArray.push(sun[0].position);
    	colorsArray.push(sun[0].color);


    	gl.uniform1i(
		gl.getUniformLocation(program,"isSnake"),
		3
	);
	gen_poison();
	pointsArray.push(poison[1].position);
    	colorsArray.push(poison[1].color);
	pointsArray.push(poison[2].position);
    	colorsArray.push(poison[2].color);
	pointsArray.push(poison[3].position);
    	colorsArray.push(poison[3].color);



    	gl.bindBuffer(gl.ARRAY_BUFFER,cBufferId);
    	gl.bufferSubData(gl.ARRAY_BUFFER,0,flatten(colorsArray));
    	gl.bindBuffer(gl.ARRAY_BUFFER,vBufferId);
    	gl.bufferSubData(gl.ARRAY_BUFFER,0,flatten(pointsArray));
    	gl.bindBuffer(gl.ARRAY_BUFFER,tBufferId);
    	gl.bufferSubData(
		gl.ARRAY_BUFFER,
		0,
		flatten(texCoordsArray)
	);
    	gl.bindBuffer(gl.ARRAY_BUFFER,nBufferId);
    	gl.bufferSubData(
		gl.ARRAY_BUFFER,
		0,
		flatten(normalsArray)
	);

//----------------------------------CALL TO InitNODES FUNCTION

	for(var i=0; i<numNodes; i++) initNodes(i);


//-------------------------------------CALL TO RENDER FUNCTION

	render();

}




//------------------------------------HAS_GAME_ENDED FUNCTIONS

function has_game_ended() {
	for (var i = 4; i < snake.length; i++)
	{
		if(score<250)
		{
			if(
				(snake[i].position[0] ===
				snake[0].position[0]
				&&
				snake[i].position[2] ===
				snake[0].position[2])
				||
				((snake[i].position[0] -
				snake[0].position[0]).toFixed(1)
				=== 0.0
				&&
				(snake[i].position[2] -
				snake[0].position[2]).toFixed(1)
				=== 0.0)

			)
			return true;
		}
		else
		{
			if(score>250 && score<300)
				if(
					(snake[i].position[0] ===
					snake[0].position[0]
					&&
					snake[i].position[2] ===
					snake[0].position[2])
					||
					((snake[0].position[0] - 
 					poison[0].position[0]).toFixed(1) 
					== 0.0
					&&
					(snake[0].position[2] - 
					poison[0].position[2]).toFixed(1) 
					== 0.0)
					||
					((snake[0].position[0] - 
 					poison[1].position[0]).toFixed(1) 
					== 0.0
					&&
					(snake[0].position[2] - 
					poison[1].position[2]).toFixed(1) 
					== 0.0)
					||
					((snake[0].position[0] - 
 					poison[0].position[0]).toFixed(1) 
					== 0.0
					&&
					(snake[0].position[2] - 
					poison[0].position[2]).toFixed(1) 
					== 0.0)
				)
				return true;
				
			else if(score>300 && score<350)
				if(
					(snake[i].position[0] ===
					snake[0].position[0]
					&&
					snake[i].position[2] ===
					snake[0].position[2])
					||
					((snake[0].position[0] - 
 					poison[0].position[0]).toFixed(1) 
					== 0.0
					&&
					(snake[0].position[2] - 
					poison[0].position[2]).toFixed(1) 
					== 0.0)
					||
					((snake[0].position[0] - 
 					poison[1].position[0]).toFixed(1) 
					== 0.0
					&&
					(snake[0].position[2] - 
					poison[1].position[2]).toFixed(1) 
					== 0.0)
					||
					((snake[0].position[0] - 
 					poison[0].position[0]).toFixed(1) 
					== 0.0
					&&
					(snake[0].position[2] - 
					poison[0].position[2]).toFixed(1) 
					== 0.0)
					||
					((snake[0].position[0] - 
 					poison[1].position[0]).toFixed(1) 
					== 0.0
					&&
					(snake[0].position[2] - 
					poison[1].position[2]).toFixed(1) 
					== 0.0)
				)
				return true;
				
			else if(score>350 && score<400)
				if(
					(snake[i].position[0] ===
					snake[0].position[0]
					&&
					snake[i].position[2] ===
					snake[0].position[2])
					||
					((snake[0].position[0] - 
 					poison[0].position[0]).toFixed(1) 
					== 0.0
					&&
					(snake[0].position[2] - 
					poison[0].position[2]).toFixed(1) 
					== 0.0)
					||
					((snake[0].position[0] - 
 					poison[1].position[0]).toFixed(1) 
					== 0.0
					&&
					(snake[0].position[2] - 
					poison[1].position[2]).toFixed(1) 
					== 0.0)
					||
					((snake[0].position[0] - 
 					poison[0].position[0]).toFixed(1) 
					== 0.0
					&&
					(snake[0].position[2] - 
					poison[0].position[2]).toFixed(1) 
					== 0.0)
					||
					((snake[0].position[0] - 
 					poison[1].position[0]).toFixed(1) 
					== 0.0
					&&
					(snake[0].position[2] - 
					poison[1].position[2]).toFixed(1) 
					== 0.0)
					||
					((snake[0].position[0] - 
 					poison[0].position[0]).toFixed(1) 
					== 0.0
					&&
					(snake[0].position[2] - 
					poison[0].position[2]).toFixed(1) 
					== 0.0)
					||
					((snake[0].position[0] - 
 					poison[1].position[0]).toFixed(1) 
					== 0.0
					&&
					(snake[0].position[2] - 
					poison[1].position[2]).toFixed(1) 
					== 0.0)
					||
					((snake[0].position[0] - 
 					poison[2].position[0]).toFixed(1) 
					== 0.0
					&&
					(snake[0].position[2] - 
					poison[2].position[2]).toFixed(1) 
					== 0.0)
				)
				return true;

			else
				if(
					(snake[i].position[0] ===
					snake[0].position[0]
					&&
					snake[i].position[2] ===
					snake[0].position[2])
					||
					((snake[0].position[0] - 
 					poison[0].position[0]).toFixed(1) 
					== 0.0
					&&
					(snake[0].position[2] - 
					poison[0].position[2]).toFixed(1) 
					== 0.0)
					||
					((snake[0].position[0] - 
 					poison[1].position[0]).toFixed(1) 
					== 0.0
					&&
					(snake[0].position[2] - 
					poison[1].position[2]).toFixed(1) 
					== 0.0)
					||
					((snake[0].position[0] - 
 					poison[0].position[0]).toFixed(1) 
					== 0.0
					&&
					(snake[0].position[2] - 
					poison[0].position[2]).toFixed(1) 
					== 0.0)
					||
					((snake[0].position[0] - 
 					poison[1].position[0]).toFixed(1) 
					== 0.0
					&&
					(snake[0].position[2] - 
					poison[1].position[2]).toFixed(1) 
					== 0.0)
					||
					((snake[0].position[0] - 
 					poison[2].position[0]).toFixed(1) 
					== 0.0
					&&
					(snake[0].position[2] - 
					poison[2].position[2]).toFixed(1) 
					== 0.0)
					||
					((snake[0].position[0] - 
 					poison[3].position[0]).toFixed(1) 
					== 0.0
					&&
					(snake[0].position[2] - 
					poison[3].position[2]).toFixed(1) 
					== 0.0)
				)
				return true;
		}

     	}
	
	if (textureCase != 2)
	{
     	const hitLeftWall   = snake[0].position[0] < -1.38;
     	const hitRightWall  = snake[0].position[0] >  1.38;
     	const hitToptWall   = snake[0].position[2] < -1.38;
     	const hitBottomWall = snake[0].position[2] >  1.38;

	return (
		hitLeftWall  || 
		hitRightWall ||
		hitToptWall  || 
		hitBottomWall
	);
}
}



//-----------------------------------CHANGE_DIRECTION FUNCTION

function change_direction(e)
{
	const ENTER_KEY = 13;
	const ESC_KEY   = 27;	
     	const SPACE_KEY = 32;

     	const DOWN_KEY  = 37;
     	const LEFT_KEY  = 38;
    	const UP_KEY    = 39;
     	const RIGHT_KEY = 40;

	const ONE_KEY   = 49; //translate x+
	const TWO_KEY   = 50; //translate x-
	const THREE_KEY = 51; //translate y+
	const FOUR_KEY  = 52; //translate y-
	const FIVE_KEY  = 53; //translate z+
	const SIX_KEY   = 54; //translate z-
	const SEVEN_KEY = 55; //rotate x
	const EIGHT_KEY = 56; //rotate y
	const NINE_KEY  = 57; //rotate z

	const A_KEY     = 65; //eye_x+
	const D_KEY     = 68; //eye_x-
	const S_KEY     = 83; //eye_y-
	const W_KEY     = 87; //eye_y+
	const E_KEY     = 69; //eye_z+
	const R_KEY     = 82; //eye_z-

	const N_KEY     = 78;
	const F_KEY     = 70;
	
	const PLUS_KEY  = 171;
	const MINUS_KEY = 173;
     
	const keyPressed = e.keyCode;
	
	if (keyPressed === ENTER_KEY)
	{
		translateX =  0.0;
		translateY =  0.0;
		translateZ =  0.0;
		leftVP     = -2.0;
		rightVP    =  2.0;
		bottomVP   = -2.0;
		topVP      =  2.0;
		fovy       =  40;
		aspect     =  0.7;
		near       =  5.0;
		far        =  10.0;
		eye_x 	= 5.0;
		eye_y 	= 5.0;
		eye_z 	= 1.0;
    		at  		= vec3(0.0,0.0,0.0);
    		up  		= vec3(0.0,1.0,0.0);
		theta[playingField1Id] = 0;
		theta[playingField2Id] = 0;
		theta[playingField3Id] = 0;
        	initNodes(playingFieldId);
	}
	else if (keyPressed === ONE_KEY)
	{
		translateX += 1.0;
        	initNodes(playingFieldId);
	}
	else if (keyPressed === TWO_KEY)
	{
		translateX -= 1.0;
        	initNodes(playingFieldId);
	}
	else if (keyPressed === THREE_KEY)
	{
		translateY += 1.0;
        	initNodes(playingFieldId);
	}
	else if (keyPressed === FOUR_KEY)
	{
		translateY -= 1.0;
        	initNodes(playingFieldId);
	}
	else if (keyPressed === FIVE_KEY)
	{
		translateZ += 1.0;
        	initNodes(playingFieldId);
	}
	else if (keyPressed === SIX_KEY)
	{
		translateZ -= 1.0;
        	initNodes(playingFieldId);
	}
	else if (keyPressed === SEVEN_KEY)
	{
		theta[playingField1Id] += 1.0;
        	initNodes(playingField1Id);
	}
	else if (keyPressed === EIGHT_KEY)
	{
		theta[playingField2Id] += 1.0;
        	initNodes(playingField2Id);
	}
	else if (keyPressed === NINE_KEY)
	{
		theta[playingField3Id] += 1.0;
        	initNodes(playingField3Id);
	}
	else if (keyPressed === A_KEY)
	{
		eye_x += 0.1;
	}
	else if (keyPressed === D_KEY)
	{
		eye_x -= 0.1;
	}
	else if (keyPressed === S_KEY)
	{
		eye_y -= 0.1;
	}
	else if (keyPressed === W_KEY)
	{
		eye_y += 0.1;
	}
	else if (keyPressed === E_KEY)
	{
		eye_z += 0.1;
	}
	else if (keyPressed === R_KEY)
	{
		eye_z -= 0.1;
	}
	else if (keyPressed === PLUS_KEY)
	{
		if(perspectiveV)
		{ 
			if(fovy<180) fovy += 10.0;

			if      (fovy<=30)  pointSize = 40;
			else if (fovy>30 && fovy<=60)  pointSize = 30;
			else if (fovy>60 && fovy<=80)  pointSize = 20;
			else if (fovy>80 && fovy<=120) pointSize = 10;
			else if (fovy>120 && fovy<=160) pointSize = 5;
			else if (fovy>160 && fovy<=180) pointSize = 1;
		}
		else
		{
     			topVP    += 0.5;
        		bottomVP -= 0.5;
	     		rightVP  += 0.5;
	        	leftVP   -= 0.5;

			if 	(topVP<=0.5)
			 	pointSize = 50;
			else if (topVP>0.5 && topVP<=1.0)
				pointSize = 40;
			else if (topVP>1.0 && topVP<=4.0)
				pointSize = 30;
			else if (topVP>4.0 && topVP<=8.0)
				pointSize = 20;
			else if (topVP>8.0 && topVP<=12.0)
				pointSize = 10;
			else if (topVP>12.0 && topVP<=16.0)
				pointSize = 5;
			else if (topVP>16.0 && topVP<=20.0)
				pointSize = 1;

		}
	}
	else if (keyPressed === MINUS_KEY)
	{
		if(perspectiveV)
		{ 
			if(fovy>0)fovy -= 10.0;

			if      (fovy<=30)  pointSize = 40;
			else if (fovy>30 && fovy<=60)  pointSize = 30;
			else if (fovy>60 && fovy<=80)  pointSize = 20;
			else if (fovy>80 && fovy<=120) pointSize = 10;
			else if (fovy>120 && fovy<=160) pointSize = 5;
			else if (fovy>160 && fovy<=180) pointSize = 1;
		}
		else
		{
     			topVP    -= 0.5;
        		bottomVP += 0.5;
	     		rightVP  -= 0.5;
	        	leftVP   += 0.5;

			if 	(topVP<=1.0)  pointSize = 40;
			else if (topVP>1.0 && topVP<=4.0)
				pointSize = 30;
			else if (topVP>4.0 && topVP<=8.0)
				pointSize = 20;
			else if (topVP>8.0 && topVP<=12.0)
				pointSize = 10;
			else if (topVP>12.0 && topVP<=16.0)
				pointSize = 5;
			else if (topVP>16.0 && topVP<=20.0)
				pointSize = 1;
		}
	}
	else if (keyPressed === N_KEY)
	{
		near += 0.5;
		far  -= 0.5;
	}
	else if (keyPressed === F_KEY)
	{
		near -= 0.5;
		far  += 0.5;
	}
	else if (keyPressed === ESC_KEY)
	{
		var c = document.getElementById('gl-canvas');
		c.width=1400;
		c.height=700;
		c.style.top=0+"px";
		c.style.left=0+"px";

		var s = document.getElementById('score');
		s.style.top=0+"px";
		s.style.left=1040+"px";
	}
     	
	if(!START)
	{
		const keyPressed = e.keyCode;
		if (keyPressed === SPACE_KEY)
		{		
			document.getElementById('ready').innerHTML = 
				"";	
			document.getElementById('start').innerHTML = 
				"";
			START = true;
			PAUSE = false;
			sound.play();
			sound.loop = true;
			audio2.pause();

		}
	}    	
	else
	{
	if (changing_direction) return;
     	changing_direction = true;

	if (score < 200)
	{
		const keyPressed   = e.keyCode;
     		const goingUp      = dz === -0.05;
	     	const goingDown    = dz ===  0.05;
	     	const goingRight   = dx ===  0.05;
	     	const goingLeft    = dx === -0.05;

		if (keyPressed === SPACE_KEY)
		{	
			PAUSE = true;
			var pause =
				document.getElementById('start');
			pause.innerHTML  = "pause";
			pause.style.top  = 360 + "px";
			pause.style.left = 630 + "px";
			START = false;
			sound.pause();
			audio2.play();
			audio2.loop = true;


		}
	     	if (keyPressed === LEFT_KEY && !goingRight)
		{
	       	dx = -0.05;
	       	dz =  0.0;
		}
	     	if (keyPressed === UP_KEY && !goingDown)
		{
	       	dx =  0.0;
	       	dz = -0.05;
	     	}
	     	if (keyPressed === RIGHT_KEY && !goingLeft)
		{
	       	dx = 0.05;
	       	dz = 0.0;
	     	}
	     	if (keyPressed === DOWN_KEY && !goingUp)
		{
	       	dx = 0.0;
			dz = 0.05;
	     	}
	}

	else if (score >= 200 && score < 400)
	{
		const keyPressed   = e.keyCode;
	     	const goingUp      = dz === -0.07;
	     	const goingDown    = dz ===  0.07;
	     	const goingRight   = dx ===  0.07;
	     	const goingLeft    = dx === -0.07;

     		if (keyPressed === LEFT_KEY && !goingRight)
		{
       		dx = -0.07;
     			dz =  0.0;
		}
     		if (keyPressed === UP_KEY && !goingDown)
		{
       		dx =  0.0;
       		dz = -0.07;
     		}
     		if (keyPressed === RIGHT_KEY && !goingLeft)
		{
	       	dx = 0.07;
	       	dz = 0.0;
	     	}
	     	if (keyPressed === DOWN_KEY && !goingUp)
		{
	       	dx = 0.0;
			dz = 0.07;
	     	}
	}

	else if (score >= 400 && score < 600)
	{
		const keyPressed   = e.keyCode;
     		const goingUp      = dz === -0.07;
     		const goingDown    = dz ===  0.07;
     		const goingRight   = dx ===  0.07;
     		const goingLeft    = dx === -0.07;
	
     		if (keyPressed === LEFT_KEY && !goingRight)
		{
       		dx = -0.07;
			dz =  0.0;
		}
     		if (keyPressed === UP_KEY && !goingDown)
		{
       		dx =  0.0;
     	  		dz = -0.07;
     		}
     		if (keyPressed === RIGHT_KEY && !goingLeft)
		{
       		dx = 0.07;
       		dz = 0.0;
     		}
     		if (keyPressed === DOWN_KEY && !goingUp)
		{
       		dx = 0.0;
			dz = 0.07;
     		}
		dt = 50;
	}

	else
	{
		const keyPressed   = e.keyCode;
     		const goingUp      = dz === -0.9;
     		const goingDown    = dz ===  0.9;
     		const goingRight   = dx ===  0.9;
     		const goingLeft    = dx === -0.9;

     		if (keyPressed === LEFT_KEY && !goingRight)
		{
       		dx = -0.9;
       		dz =  0.0;
		}
     		if (keyPressed === UP_KEY && !goingDown)
		{	
       		dx =  0.0;
       		dz = -0.9;
     		}
     		if (keyPressed === RIGHT_KEY && !goingLeft)
		{
       		dx = 0.9;
       		dz = 0.0;
     		}
     		if (keyPressed === DOWN_KEY && !goingUp)
		{
       		dx = 0.0;
			dz = 0.9;
     		}
	}
	}
}
document.onkeydown = change_direction;



//---------------------------------------------UPDATE FUNCTION

var update = function()
{

//-----------------------------CALL TO HAS_GAME_ENDED FUNCTION
	if (has_game_ended())
	{
		var end1 = document.getElementById('ready');
		sound.pause();
		if (count<1)
		{
			audio3.play();
			count++;
		}
		end1.innerHTML = "GAME OVER";
		end1.style.left = 510 + "px";

		var end2 = document.getElementById('start');
		if(score<=50)
		{
			end2.innerHTML  = end_text[0];
			end2.style.left = 612 + "px";
		}
		if(score>50 && score<=100)
		{
			end2.innerHTML  = end_text[1];
		}
		if(score>100 && score<=150)
		{
			end2.innerHTML  = end_text[2];
			end2.style.left = 615 + "px";
		}
		if(score>150 && score<=200)
		{
			end2.innerHTML  = end_text[3];
			end2.style.left = 440 + "px";
		}
		if(score>200 && score<=300)
		{
			end2.innerHTML  = end_text[4];
			end2.style.left = 400 + "px";
		}
		if(score>300 && score<=400)
		{
			end2.innerHTML  = end_text[5];
			end2.style.left = 400 + "px";
		}
		if(score>400)
		{
			end2.innerHTML  = end_text[6];
		}
		END = true;
		var scenario = 
			document.getElementById("Texture Style");
		scenario.disabled = true;

		if (lightPosition[1]>-3.0)
		{
			lightPosition[1] -= 0.1;

			const newSun = {
				position: vec4(
					lightPosition[0],
					lightPosition[1],
					lightPosition[2],
					1.0
				),
				color: vec4(0.960,0.848,0.00,1.0)
			};
			sun.unshift(newSun);
			sun.pop();
		
			pointsArray = [];
			colorsArray = [];

			for(var i=0; i<GFpointsArray.length;i++)
			pointsArray.push(GFpointsArray[i]);
			for(var i=0; i<GFcolorsArray.length;i++)
			colorsArray.push(GFcolorsArray[i]);

    			for(var i=0; i<numSnakeParts; i++)
			{	
      			pointsArray.push(snake[i].position);
     			  	colorsArray.push(snake[i].color);
    			}
	
    			pointsArray.push(food[0].position);
	    		colorsArray.push(food[0].color);
	
			pointsArray.push(sun[0].position);
    			colorsArray.push(sun[0].color);

			pointsArray.push(poison[0].position);
    			colorsArray.push(poison[0].color);
			pointsArray.push(poison[1].position);
    			colorsArray.push(poison[1].color);
			pointsArray.push(poison[2].position);
    			colorsArray.push(poison[2].color);
			pointsArray.push(poison[3].position);
	    		colorsArray.push(poison[3].color);
    		
			gl.bindBuffer(gl.ARRAY_BUFFER,vBufferId);    
			gl.bufferSubData(
				gl.ARRAY_BUFFER,
				0,
				flatten(pointsArray)
				);
    			gl.bindBuffer(gl.ARRAY_BUFFER,cBufferId);
    			gl.bufferSubData(
				gl.ARRAY_BUFFER,
				0,
				flatten(colorsArray)
			);
		}
		else
	{
		var restart = 
			document.
			getElementById("restart_button");
		restart.disabled = false;
		}
		return;
	}
     	changing_direction = false;

     	const head = {
		position: vec4(
			snake[0].position[0] + dx,
			snake[0].position[1],
			snake[0].position[2] + dz,
			1.0
		),
		color: headColor
	};
	snake.unshift(head);

	if (textureCase == 2)
	{
     	if (snake[0].position[0] < -1.38)
		snake[0].position[0] = 
			1.38 + (snake[0].position[0] + 1.38);
     	if (snake[0].position[0] >  1.38)
		snake[0].position[0] = 
			-1.38 + (snake[0].position[0] - 1.38);
     	if (snake[0].position[2] < -1.38)
		snake[0].position[2] = 
			1.38 + (snake[0].position[2] + 1.38);
     	if (snake[0].position[2] >  1.38)
		snake[0].position[2] = 
			-1.38 + (snake[0].position[2] - 1.38);
}

	var has_eaten_food;
	if (
		(snake[0].position[0] - 
 		food[0].position[0]).toFixed(1) == 0.0
		&&
		(snake[0].position[2] - 
		food[0].position[2]).toFixed(1) == 0.0
	)
	 	has_eaten_food = true;
	else	has_eaten_food = false;

	if (has_eaten_food)
	{
		audio4.play();
		score += 10;
		document.getElementById('score').innerHTML = score;
		gen_food();
		if(score>=250) gen_poison();
		if(score > bestScore)
		{
			bestScore = score;
		document.getElementById('best_score').innerHTML =
			bestScore;
		}
		numSnakeParts++;

	}
     	else snake.pop();
	
	pointsArray = [];
	colorsArray = [];

	for(var i=0; i<GFpointsArray.length;i++)
	pointsArray.push(GFpointsArray[i]);
	for(var i=0; i<GFcolorsArray.length;i++)
	colorsArray.push(GFcolorsArray[i]);
	
    	for(var i=0; i<numSnakeParts; i++)
	{
      	pointsArray.push(snake[i].position);
       	colorsArray.push(snake[i].color);
    	}
	
    	pointsArray.push(food[0].position);
    	colorsArray.push(food[0].color);
	
	dl += 0.05;
	lightPosition[0] = 2.0*Math.sin(dl);
	lightPosition[2] = 2.0*Math.cos(dl);
		
	const newSun = {
		position: vec4(
			lightPosition[0],
			lightPosition[1],
			lightPosition[2],
			1.0
		),
		color: vec4(0.960,0.848,0.00,1.0)
	};
	sun.unshift(newSun);
	sun.pop();

	pointsArray.push(sun[0].position);
    	colorsArray.push(sun[0].color);

	pointsArray.push(poison[0].position);
    	colorsArray.push(poison[0].color);
	pointsArray.push(poison[1].position);
    	colorsArray.push(poison[1].color);
	pointsArray.push(poison[2].position);
    	colorsArray.push(poison[2].color);
	pointsArray.push(poison[3].position);
    	colorsArray.push(poison[3].color);



    	gl.bindBuffer(gl.ARRAY_BUFFER,vBufferId);    	gl.bufferSubData(gl.ARRAY_BUFFER,0,flatten(pointsArray));
    	gl.bindBuffer(gl.ARRAY_BUFFER,cBufferId);
    	gl.bufferSubData(gl.ARRAY_BUFFER,0,flatten(colorsArray));


//----------------------------------CALL TO InitNODES FUNCTION

	for(var i=0; i<numNodes; i++) initNodes(i);

//--------------------------------CALL TO PASSONBLADE FUNCTION

	passOnBlade();
}


//----------------------------------------PASSONBLADE FUNCTION

function passOnBlade()
{
	for(var j=24; j<GFpointsArray.length;j++)
	{	
		if (
			(snake[0].position[0] -
			pointsArray[j][0]).toFixed(1) == 0.0
			&&
			(snake[0].position[2] -
			pointsArray[j][2]).toFixed(1) == 0.0
		)
			pointsArray[j][1] = -0.6;
		else 
			pointsArray[j][1] = GFpointsArray[j][1];
	}
}


//---------------------------------------------RENDER FUNCTION

var render = function()
{


	setTimeout(function onTick()
	{
  		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		

		////MANAGEMENT TEXTURECASES AND HTML ELEMENTS
		if (textureCase == 6)
		{
			gl.clearColor(.04,1.0,0.36,1.0);
			
			lightAmbient = vec4(0.5,0.5,0.5,1.0);
			
			materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
			materialDiffuse = vec4(1.0,0.8,0.0,1.0);
			materialSpecular  = vec4(1.0, 0.8, 0.0, 1.0);
			materialShininess = 10.0;
			
			ambientProduct = 
				mult(lightAmbient,materialAmbient);
			diffuseProduct =
				mult(lightDiffuse,materialDiffuse);
			specularProduct =
				mult(lightSpecular,materialSpecular);



			var doc1 = document.getElementById("score");
			doc1.style.color = "black";
			doc1.style.textShadow = 
				"4px 4px 0px darkorange";
			var doc2 = document.getElementById("ready");
			doc2.style.color = "black";
			doc2.style.textShadow = 
				"2px 2px 0px darkorange";
			var doc3 = document.getElementById("start");
			doc3.style.color = "black";
			doc3.style.textShadow = "4px 4px 0px white";
			var doc4 = document.getElementById("rules0");
			doc4.style.color = "black";
			doc4.style.textShadow = "1px 1px 0px white";
			var doc5 = document.getElementById("rules1");
			doc5.style.color = "black";
			doc5.style.textShadow = "1px 1px 0px white";
			var doc6 = document.getElementById("rules2");
			doc6.style.color = "black";
			doc6.style.textShadow = "1px 1px 0px white";
			var doc7 = document.getElementById("rules3");
			doc7.style.color = "black";
			doc7.style.textShadow = "1px 1px 0px white";

			var doc8 = document.getElementById("arrowUp");
			doc8.style.borderColor = "black";
			doc8.style.color = "black";
			var doc9 = 
				document.getElementById("arrowLeft");
			doc9.style.borderColor = "black";
			doc9.style.color = "black";
			var doc10 = 
				document.getElementById("arrowDown");
			doc10.style.borderColor = "black";
			doc10.style.color = "black";
			var doc11 = 
				document.getElementById("arrowRight");
			doc11.style.borderColor = "black";
			doc11.style.color = "black";

			var doc12 = 
				document.querySelector("#Scenario");
			doc12.style.color = "black";
			var doc13 = 
				document.querySelector("#Projection");
			doc13.style.color = "black";
			var doc14 =
			document.getElementById("full_screen_button");
			doc14.style.borderColor = "black";
			doc14.style.color = "black";
			var doc15 =
			document.getElementById("restart_button");
			doc15.style.borderColor = "black";
			doc15.style.color = "black";
			doc15.style.backgroundColor = "#ff8c009c";
			var doc16 =
			document.getElementById("best_score_table");
			doc16.style.color = "black";
			doc16.style.textShadow = 
				"1px 1px 0px gold";
			var doc17 =
			document.getElementById("best_score_box");
			doc17.style.borderColor = "gold";
			var doc18 =
			document.getElementById("best_score");
			doc18.style.color = "black";
			doc18.style.textShadow = 
				"2px 2px 0px gold";


		}
		else if (textureCase == 4)
		{	
			gl.clearColor(0.0,0.0,0.0,1.0);

			lightAmbient = vec4(0.5,0.5,0.5,1.0);

			materialAmbient = vec4(1.0, 1.0, 1.0, 1.0);
			materialDiffuse   = vec4(1.0, 1.0, 1.0, 1.0);
			materialSpecular  = vec4(1.0, 0.2, 0.0, 1.0);
			materialShininess = 200.0;

			ambientProduct = 
				mult(lightAmbient,materialAmbient);
			diffuseProduct =
				mult(lightDiffuse,materialDiffuse);
			specularProduct =
				mult(lightSpecular,materialSpecular);

			
			var doc1 = document.getElementById("score");
			doc1.style.color = "white";
			doc1.style.textShadow = "4px 4px 0px grey";
			var doc2 = document.getElementById("ready");
			doc2.style.color = "white";
			doc2.style.textShadow = "2px 2px 0px grey";
			var doc3 = document.getElementById("start");
			doc3.style.color = "gold";
			doc3.style.textShadow = 
				"4px 4px 0px darkgoldenrod";
			var doc4 = document.getElementById("rules0");
			doc4.style.color = "white";
			doc4.style.textShadow = "1px 1px 0px grey";
			var doc5 = document.getElementById("rules1");
			doc5.style.color = "white";
			doc5.style.textShadow = "1px 1px 0px grey";
			var doc6 = document.getElementById("rules2");
			doc6.style.color = "white";
			doc6.style.textShadow = "1px 1px 0px grey";
			var doc7 = document.getElementById("rules3");
			doc7.style.color = "white";
			doc7.style.textShadow = "1px 1px 0px grey";

			var doc8 = document.getElementById("arrowUp");
			doc8.style.borderColor = "white";
			doc8.style.color = "white";
			var doc9 = 
				document.getElementById("arrowLeft");
			doc9.style.borderColor = "white";
			doc9.style.color = "white";
			var doc10 = 
				document.getElementById("arrowDown");
			doc10.style.borderColor = "white";
			doc10.style.color = "white";
			var doc11 = 
				document.getElementById("arrowRight");
			doc11.style.borderColor = "white";
			doc11.style.color = "white";

			var doc12 = 
				document.querySelector("#Scenario");
			doc12.style.color = "white";
			var doc13 = 
				document.querySelector("#Projection");
			doc13.style.color = "white";
			var doc14 =
			document.getElementById("full_screen_button");
			doc14.style.borderColor = "white";
			doc14.style.color = "white";
			var doc15 =
			document.getElementById("restart_button");
			doc15.style.borderColor = "white";
			doc15.style.color = "white";
			doc15.style.backgroundColor = "#8b00ff9c";
			var doc16 =
			document.getElementById("best_score_table");
			doc16.style.color = "white";
			doc16.style.textShadow = 
				"1px 1px 0px grey";
			var doc17 =
			document.getElementById("best_score_box");
			doc17.style.borderColor = "white";
			var doc18 =
			document.getElementById("best_score");
			doc18.style.color = "white";
			doc18.style.textShadow = 
				"2px 2px 0px grey";



		}
		else if (textureCase == 3 || textureCase == 5)
		{
			gl.clearColor(0.0184,0.319,0.920,1.0);

			lightAmbient = vec4(0.0184,0.229,0.920,1.0);

			materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
			materialDiffuse = vec4(1.00,0.952,0.0400,1.0);
			materialSpecular  = vec4(1.0, 0.8, 0.0, 1.0);
			materialShininess = 10.0;

			ambientProduct = 
				mult(lightAmbient,materialAmbient);
			diffuseProduct =
				mult(lightDiffuse,materialDiffuse);
			specularProduct =
				mult(lightSpecular,materialSpecular);


			if (textureCase == 5)
			{
				var doc1 =
					document.getElementById("score");
				doc1.style.color = "black";
				doc1.style.textShadow =
					"4px 4px 0px #3ce1c2";
				var doc2 =
					document.getElementById("ready");
				doc2.style.color = "black";
				doc2.style.textShadow =
					"2px 2px 0px #3ce1c2";
				var doc15 =
					document.getElementById(
						"restart_button"
				);
				doc15.style.borderColor = "black";
				doc15.style.color = "black";
				doc15.style.backgroundColor =
					"#3ce1c280";
	
			}
			else
			{
				var doc1 =
					document.getElementById("score");
				doc1.style.color = "black";
				doc1.style.textShadow = 
					"4px 4px 0px darkorange";
		
				var doc2 =
					document.getElementById("ready");
				doc2.style.color = "black";
				doc2.style.textShadow = 
					"2px 2px 0px darkorange";
				var doc15 =
					document.getElementById(
						"restart_button"
				);
				doc15.style.borderColor = "black";
				doc15.style.color = "black";
				doc15.style.backgroundColor =
					"#ff8c009c";

			}
			var doc3 = document.getElementById("start");
			doc3.style.color = "black";
			doc3.style.textShadow = "4px 4px 0px white";
			var doc4 = document.getElementById("rules0");
			doc4.style.color = "black";
			doc4.style.textShadow = "1px 1px 0px white";
			var doc5 = document.getElementById("rules1");
			doc5.style.color = "black";
			doc5.style.textShadow = "1px 1px 0px white";
			var doc6 = document.getElementById("rules2");
			doc6.style.color = "black";
			doc6.style.textShadow = "1px 1px 0px white";
			var doc7 = document.getElementById("rules3");
			doc7.style.color = "black";
			doc7.style.textShadow = "1px 1px 0px white";

			var doc8 = document.getElementById("arrowUp");
			doc8.style.borderColor = "black";
			doc8.style.color = "black";
			var doc9 = 
				document.getElementById("arrowLeft");
			doc9.style.borderColor = "black";
			doc9.style.color = "black";
			var doc10 = 
				document.getElementById("arrowDown");
			doc10.style.borderColor = "black";
			doc10.style.color = "black";
			var doc11 = 
				document.getElementById("arrowRight");
			doc11.style.borderColor = "black";
			doc11.style.color = "black";

			var doc12 = 
				document.querySelector("#Scenario");
			doc12.style.color = "black";
			var doc13 = 
				document.querySelector("#Projection");
			doc13.style.color = "black";
			var doc14 =
			document.getElementById("full_screen_button");
			doc14.style.borderColor = "black";
			doc14.style.color = "black";
		
		var doc16 =
		document.getElementById("best_score_table");
		doc16.style.color = "black";
		doc16.style.textShadow = 
			"1px 1px 0px #3ce1c2";
		var doc17 =
		document.getElementById("best_score_box");
		doc17.style.borderColor = "#3ce1c2";
		var doc18 =
		document.getElementById("best_score");
		doc18.style.color = "black";
		doc18.style.textShadow = 
			"2px 2px 0px #3ce1c2";


		}
		else 	
		{
			gl.clearColor(0.340,1.00,0.824,1.0);

			lightAmbient = vec4(0.5,0.5,0.5,1.0);
		
			materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
			materialDiffuse = vec4(1.0,0.8,0.0,1.0);
			materialSpecular  = vec4(1.0, 0.8, 0.0, 1.0);
			materialShininess = 10.0;

			ambientProduct = 
				mult(lightAmbient,materialAmbient);
			diffuseProduct =
				mult(lightDiffuse,materialDiffuse);
			specularProduct =
				mult(lightSpecular,materialSpecular);

			var doc1 = document.getElementById("score");
			doc1.style.color = "black";
			doc1.style.textShadow = 
				"4px 4px 0px darkorange";
			var doc2 = document.getElementById("ready");
			doc2.style.color = "black";
			doc2.style.textShadow = 
				"2px 2px 0px darkorange";
			var doc3 = document.getElementById("start");
			doc3.style.color = "black";
			doc3.style.textShadow = "4px 4px 0px white";
			var doc4 = document.getElementById("rules0");
			doc4.style.color = "black";
			doc4.style.textShadow = "1px 1px 0px white";
			var doc5 = document.getElementById("rules1");
			doc5.style.color = "black";
			doc5.style.textShadow = "1px 1px 0px white";
			var doc6 = document.getElementById("rules2");
			doc6.style.color = "black";
			doc6.style.textShadow = "1px 1px 0px white";
			var doc7 = document.getElementById("rules3");
			doc7.style.color = "black";
			doc7.style.textShadow = "1px 1px 0px white";

			var doc8 = document.getElementById("arrowUp");
			doc8.style.borderColor = "black";
			doc8.style.color = "black";
			var doc9 = 
				document.getElementById("arrowLeft");
			doc9.style.borderColor = "black";
			doc9.style.color = "black";
			var doc10 = 
				document.getElementById("arrowDown");
			doc10.style.borderColor = "black";
			doc10.style.color = "black";
			var doc11 = 
				document.getElementById("arrowRight");
			doc11.style.borderColor = "black";
			doc11.style.color = "black";

			var doc12 = 
				document.querySelector("#Scenario");
			doc12.style.color = "black";
			var doc13 = 
				document.querySelector("#Projection");
			doc13.style.color = "black";
			var doc14 =
			document.getElementById("full_screen_button");
			doc14.style.borderColor = "black";
			doc14.style.color = "black";
			var doc15 =
			document.getElementById("restart_button");
			doc15.style.borderColor = "black";
			doc15.style.color = "black";
			doc15.style.backgroundColor = "#ff8c009c";
			var doc16 =
			document.getElementById("best_score_table");
			doc16.style.color = "black";
			doc16.style.textShadow = 
				"1px 1px 0px gold";
			var doc17 =
			document.getElementById("best_score_box");
			doc17.style.borderColor = "gold";
			var doc18 =
			document.getElementById("best_score");
			doc18.style.color = "black";
			doc18.style.textShadow = 
				"2px 2px 0px gold";

		}


	/////MANAGEMENT MODEL VIEW MATRIX AND PROJECTION MATRIX
    	if (perspectiveV)
		projectionMatrix = perspective(
			fovy,
			aspect,
			near,
			far
		);
	
	else
		projectionMatrix = ortho(
			leftVP,
			rightVP,
			bottomVP,
			topVP,
			-near*2,
			far
		);

		eye = vec3(eye_x,eye_y,eye_z);
	    	modelViewMatrix  = lookAt(eye, at, up);

  		modelViewMatrix = mult(
			modelViewMatrix,
			rotate(currentAngle[0],0.0,0.0,1.0)
		);
		modelViewMatrix = mult(
			modelViewMatrix,
			rotate(-currentAngle[1],0.0,1.0,0.0)
		);
    		gl.uniformMatrix4fv(
			gl.getUniformLocation(
				program,
				"modelViewMatrix"
			),
			false,
			flatten(modelViewMatrix)
		);
    		gl.uniformMatrix4fv(
			gl.getUniformLocation(
				program,
				"projectionMatrix"
			),
			false,
			flatten(projectionMatrix)
		);


	    	var nMatrix = normalMatrix(modelViewMatrix, true);
    		gl.uniformMatrix3fv(
			gl.getUniformLocation(
				program,
				"normalMatrix"
			),
			false,
			flatten(nMatrix)
		);

		gl.uniform4fv(
			gl.getUniformLocation(
				program,
				"uLightPosition"
			),
			flatten(lightPosition)
		);

		gl.uniform4fv(
       		gl.getUniformLocation(
				program,
				"uAmbientProduct"
			),
       		ambientProduct
    		);
    		gl.uniform4fv(
       		gl.getUniformLocation(
				program,
				"uDiffuseProduct"
			),
       		diffuseProduct
    		);
    		gl.uniform4fv(
       		gl.getUniformLocation(
				program,
				"uSpecularProduct"
			),
       		specularProduct
    		);

    		gl.uniform1f(
     	  		gl.getUniformLocation(program,"uShininess"), 
     			materialShininess
	    	);

		
		gl.uniform1f(
			gl.getUniformLocation(program,"pointSize"),
			pointSize
		);

		gl.uniform1i(
       		gl.getUniformLocation(program,"uTextureCase"), 
     		  	textureCase
	    	);


//-----------------------------------CALL TO TRAVERSE FUNCTION
		traverse(playingFieldId);

//-------------------------------------CALL TO UPDATE FUNCTION

		if(START) update();

		requestAnimationFrame(render);

	}, dt)

}






