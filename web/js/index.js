//--------------------------------------------------------------------
// Parameters
//--------------------------------------------------------------------
var _toggleAnimation = false;

var _squareSize = 128;
var _zIncrement = 0.1;
var _zMax = 45;
var _rotationIncrement = 0.05;	// degrees 0.05
var _rotationDirection = 1;
var _alphaStart = 0.0;
var _alphaEnd = 1.0;
var _alphaIncrement = 0.001;


//--------------------------------------------------------------------
// Local Variables
//--------------------------------------------------------------------
var m_zOffset = 0.0;
var m_zIncrementToggle = true;
var m_zDirection = -1;
var m_zDirectionToggle = false;

var m_rotation = 0;	// degrees

var m_alphaCube = 0.8;
var m_alphaCircle = 0.2;
var m_alphaToggle = false;

var m_dimStep = 0;
var m_dimTotal = 3;
var m_nRows = 4;
var m_nColumns = 4;
var m_nPages = 1;

var m_requestID;

// var	m_mousePosition = [0.0, 0.0];




//--------------------------------------------------------------------
// Initialization
//--------------------------------------------------------------------

function start() {
    initialize();
}


function initialize() {

   	// Window Resized Event Listener
   	window.addEventListener('resize', resized, false);

   	// Keyboard Event Listener
   	document.onkeyup = handleKeyUp;

   	// Mousemove Event Listener
   	// this.addEventListener('mousemove', mouseMove);

   	// Set Window Size and Draw
   	resized();

   	// Start Animating after 5 seconds
   	window.setTimeout(startAnimation, 5000);
}


function resized() {

	window.cancelAnimationFrame(m_requestID);

	var backgroundCanvas = document.getElementById("backgroundCanvas");
	backgroundCanvas.width = window.innerWidth; // 1440
 	backgroundCanvas.height = window.innerHeight; // 752

	var cubeCanvas = document.getElementById("cubeCanvas");
	cubeCanvas.width = window.innerWidth; // 1440
 	cubeCanvas.height = window.innerHeight; // 752

 	var circleCanvas = document.getElementById("circleCanvas");
	circleCanvas.width = window.innerWidth; // 1440
 	circleCanvas.height = window.innerHeight; // 752

 	_squareSize = (Math.min(backgroundCanvas.height / 6.0, backgroundCanvas.width / 6.0));
 	_zMax = 0.5 * _squareSize;
 	_zIncrement = _zMax * 1.0 * _rotationIncrement / 45.0;

 	reset();
 	

 	if (!_toggleAnimation) {
 		redraw();
 	} else {
 		tick();
 	}
}

function reset() {
	m_zOffset = 0.0;
    m_rotation = 0.0;
}


//--------------------------------------------------------------------
// Drawing and Animation
//--------------------------------------------------------------------

function startAnimation() {
	_toggleAnimation = true;
	tick();
}

function stopAnimation() {
	_toggleAnimation = false;
	window.cancelAnimationFrame(m_requestID);
}


function redraw() {

	var cubeCanvas = document.getElementById("cubeCanvas");
 	var circleCanvas = document.getElementById("circleCanvas");

	var cubeCtx = cubeCanvas.getContext("2d");
	var circleCtx = circleCanvas.getContext("2d");


	var size = _squareSize;
	var offset = m_zOffset;

	var nRows = m_nRows;
	var nColumns = m_nColumns;
	var nPages = m_nPages;
	var direction = m_zDirection;


	var xOrigin = (cubeCanvas.width - (nColumns * (size + (direction * offset)))) / 2.0;
	var yOrigin = (cubeCanvas.height - (nRows * (size + offset))) / 2.0;

	var xPos = xOrigin;
	var yPos = yOrigin;


	cubeCtx.setTransform(1, 0, 0, 1, 0, 0);
	cubeCtx.clearRect(0, 0, cubeCanvas.width, cubeCanvas.height);
	circleCtx.setTransform(1, 0, 0, 1, 0, 0);
	circleCtx.clearRect(0, 0, circleCanvas.width, circleCanvas.height);

	// Move registration point to the center of the canvas
	cubeCtx.translate(cubeCanvas.width/2, cubeCanvas.height/2);
	circleCtx.translate(circleCanvas.width/2, circleCanvas.height/2);
	// Rotate
	cubeCtx.rotate(m_rotation*Math.PI / 180);
	circleCtx.rotate(m_rotation*Math.PI / 180);
	// Move registration point back to the top left corner of canvas
	cubeCtx.translate(-cubeCanvas.width/2, -cubeCanvas.height/2);
	circleCtx.translate(-circleCanvas.width/2, -circleCanvas.height/2);

	// Draw Unit Cubes
	cubeCtx.beginPath();
	circleCtx.beginPath();

	for (var row = 0; row < nRows; row++) {
		for (var column = 0; column < nColumns; column++) {
			for (var page = 0; page < nPages; page++) {
				drawUnitCube(cubeCtx, circleCtx, xPos + direction*((page * offset)), yPos + (page * offset), size, offset, direction);
			}
			xPos += size;
		}
		xPos = xOrigin;
		yPos += size;
	}

	// Stroke
	cubeCtx.strokeStyle = "#FFF";
	cubeCtx.globalAlpha = m_alphaCube;
	cubeCtx.stroke();

	circleCtx.strokeStyle = "#FFF";
	circleCtx.globalAlpha = m_alphaCircle;
	circleCtx.stroke();
}


function drawUnitCube(cubeCtx, circleCtx, xOrigin, yOrigin, size, offset, direction) {
	
	var drawFrontCircles = true;
	var drawTopCircles = true;
	var drawSideCircles = true;
	
	var offsetScaler = 2 * Math.PI;		// Using 2*PI emperically. Need to figure out why!! :P

	var xOffset, yOffset;

	if (direction == 1) {
		xOffset = yOffset = offset;
	} else if (direction == -1) {
		xOffset = -offset;
		yOffset = offset;
	} 


	// Draw Necker Cube
	cubeCtx.rect(xOrigin, yOrigin, size, size);
	cubeCtx.rect(xOrigin + xOffset, yOrigin + yOffset, size, size);

	cubeCtx.moveTo(xOrigin, yOrigin);
	cubeCtx.lineTo(xOrigin + xOffset, yOrigin + yOffset);

	cubeCtx.moveTo(xOrigin+ size, yOrigin);
	cubeCtx.lineTo(xOrigin + size + xOffset, yOrigin + yOffset);

	cubeCtx.moveTo(xOrigin, yOrigin + size);
	cubeCtx.lineTo(xOrigin + xOffset, yOrigin + yOffset + size);

	cubeCtx.moveTo(xOrigin + size, yOrigin + size);
	cubeCtx.lineTo(xOrigin + size + xOffset, yOrigin + size + yOffset);


	// Draw Circles
	if (drawFrontCircles == true) {
		// Back
		circleCtx.moveTo(xOrigin + size, yOrigin + size/2.0);
		circleCtx.arc(xOrigin + size/2.0, yOrigin + size/2.0, size/2, 0, 2*Math.PI);

		// Front
		circleCtx.moveTo(xOrigin + size + xOffset, yOrigin + yOffset + size/2.0);
		circleCtx.arc(xOrigin + size/2.0 + xOffset, yOrigin + size/2.0 + yOffset, size/2, 0, 2*Math.PI);
	}

	if (drawTopCircles == true) {
		// Top
		circleCtx.moveTo(xOrigin + xOffset/2.0, yOrigin + yOffset/2.0);
		circleCtx.bezierCurveTo(xOrigin - xOffset/offsetScaler, yOrigin - yOffset/offsetScaler, xOrigin + size - xOffset/offsetScaler, yOrigin - yOffset/offsetScaler, xOrigin + xOffset/2.0 + size, yOrigin + yOffset/2.0);
		circleCtx.bezierCurveTo(xOrigin + xOffset + size + xOffset/offsetScaler, yOrigin + yOffset + yOffset/offsetScaler, xOrigin + xOffset + xOffset/offsetScaler, yOrigin + yOffset + yOffset/offsetScaler, xOrigin + xOffset/2.0, yOrigin + yOffset/2.0);

		// Bottom
		circleCtx.moveTo(xOrigin + xOffset/2.0, yOrigin + yOffset/2.0 + size);
		circleCtx.bezierCurveTo(xOrigin - xOffset/offsetScaler, yOrigin - yOffset/offsetScaler + size, xOrigin + size - xOffset/offsetScaler, yOrigin - yOffset/offsetScaler + size, xOrigin + xOffset/2.0 + size, yOrigin + yOffset/2.0 + size);
		circleCtx.bezierCurveTo(xOrigin + xOffset + size + xOffset/offsetScaler, yOrigin + yOffset + yOffset/offsetScaler + size, xOrigin + xOffset + xOffset/offsetScaler, yOrigin + yOffset + yOffset/offsetScaler + size, xOrigin + xOffset/2.0, yOrigin + yOffset/2.0 + size);
	}

	if (drawSideCircles == true) {
		// Left
		circleCtx.moveTo(xOrigin + xOffset/2.0, yOrigin + yOffset/2.0);
		circleCtx.bezierCurveTo(xOrigin - xOffset/offsetScaler, yOrigin - yOffset/offsetScaler, xOrigin - xOffset/offsetScaler, yOrigin + size - yOffset/offsetScaler, xOrigin + xOffset/2.0, yOrigin + yOffset/2.0 + size);
		circleCtx.bezierCurveTo(xOrigin + xOffset + xOffset/offsetScaler, yOrigin + yOffset + size + yOffset/offsetScaler, xOrigin + xOffset + xOffset/offsetScaler, yOrigin + yOffset + yOffset/offsetScaler, xOrigin + xOffset/2.0, yOrigin + yOffset/2.0);

		// Right
		circleCtx.moveTo(xOrigin + xOffset/2.0 + size, yOrigin + yOffset/2.0);
		circleCtx.bezierCurveTo(xOrigin - xOffset/offsetScaler + size, yOrigin - yOffset/offsetScaler, xOrigin - xOffset/offsetScaler + size, yOrigin + size - yOffset/offsetScaler, xOrigin + xOffset/2.0 + size, yOrigin + yOffset/2.0 + size);
		circleCtx.bezierCurveTo(xOrigin + xOffset + xOffset/offsetScaler + size, yOrigin + yOffset + size + yOffset/offsetScaler, xOrigin + xOffset + xOffset/offsetScaler + size, yOrigin + yOffset + yOffset/offsetScaler, xOrigin + xOffset/2.0 + size, yOrigin + yOffset/2.0);
	}
}


function tick() {

	if (m_zIncrementToggle == true) {
		m_zOffset += _zIncrement;
	} else {
		m_zOffset -= _zIncrement;
	}

    if (m_zOffset > _zMax) {
    	m_zIncrementToggle = false;
    }
    else if (m_zOffset < -_zMax) {
    	m_zIncrementToggle = true;
    }

    if ((m_zOffset.toFixed(3) < _zIncrement.toFixed(3)) && (m_zOffset.toFixed(3) > -_zIncrement.toFixed(3))) {
    	if (m_zDirectionToggle == true) {
    		m_zDirection *= -1;
    		m_zDirectionToggle = false;
    	} else {
    		m_zDirectionToggle = true;
    	}
    	m_dimStep += 1;
    	if (m_dimStep >= 2) { m_dimStep = 2; }
    	setDimensions();
    }


    m_rotation = (m_rotation + (_rotationDirection * _rotationIncrement)) % 360;
    if ((m_rotation.toFixed(3) < _rotationIncrement.toFixed(3)) && (m_rotation.toFixed(3) > -_rotationIncrement.toFixed(3))) {
		_rotationDirection *= -1;
    }


	if (m_alphaToggle == true) {
    	m_alphaCube += _alphaIncrement;
    	m_alphaCircle -= _alphaIncrement;
    } else {
    	m_alphaCube -= _alphaIncrement;
    	m_alphaCircle += _alphaIncrement;
    }

    if (m_alphaCube >= _alphaEnd) {
    	m_alphaToggle = false;
    } else if (m_alphaCube <= _alphaStart) {
    	m_alphaToggle = true;
    }


    redraw();

	if (_toggleAnimation == true) {
		m_requestID = requestAnimFrame(tick);
	}
}


window.requestAnimFrame = (function(callback) {
  	return 	window.requestAnimationFrame ||
        	window.webkitRequestAnimationFrame ||
        	window.mozRequestAnimationFrame ||
        	window.oRequestAnimationFrame ||
        	window.msRequestAnimationFrame ||
        	function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
        		window.setTimeout(callback, 1000/60);
        	};
})();

window.cancelAnimationFrame = 	window.cancelAnimationFrame ||
        						window.mozCancelAnimationFrame || 
        						window.webkitCancelAnimationFrame ||
        						window.msCancelAnimationFrame;


//--------------------------------------------------------------------
// UI Events
//--------------------------------------------------------------------

function handleKeyUp(event) {

	// alert(event.keyCode);

	if (event.keyCode == 32) {
		// Space Bar
		_toggleAnimation = !_toggleAnimation;
		if (_toggleAnimation) {
			tick();
		}
	}

	if (event.keyCode == 88) {
    	// 'x' Key
    	_rotationDirection *= -1;
    }

    if (event.keyCode == 90) {
    	// 'z' Key
    	m_zDirection *= -1;
    }

    if (event.keyCode == 67) {
    	// 'c' Key
    	reset();
    }

    if (event.keyCode == 38) {
    	// Up Arrow Key
    	m_dimStep = (m_dimStep + 1) % m_dimTotal;
    	setDimensions();
    }

    else if (event.keyCode == 40) {
    	// Down Arrow Key
    	m_dimStep = (m_dimStep - 1) % m_dimTotal;
    	if (m_dimStep < 0) { m_dimStep += m_dimTotal; }
    	setDimensions();
    }


    if (event.keyCode == 37) {
    	// Left Arrow Key
    }

    else if (event.keyCode == 39) {
    	// Right Arrow Key
    	tick();
    }


    if (!_toggleAnimation) {
    	redraw();
    }
}


function setDimensions() {
	switch (m_dimStep) {
		case 0:
			m_nRows = 4;
			m_nColumns = 4;
			m_nPages = 1;
			break;
		case 1:
			m_nRows = m_nColumns = 4;
			m_nPages = 2;
			break;
		case 2:
			m_nRows = m_nColumns = m_nPages = 4;
			break;
	}
}


function mouseMove(event) {
	// m_mousePosition[0] = event.pageX;
  	// m_mousePosition[1] = event.pageY;
}
