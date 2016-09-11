//--------------------------------------------------------------------
// Parameters
//--------------------------------------------------------------------
var _animationToggle 			= false;
var _animationStartTime 		= 2000;	// ms

var _fpsDefault 				= 60.0;
var _fpsRates					= [60.0, 30.0, 15.0];
var _fpsAnimation 				= 60.0;	// Throttle if _fpsAnimation < _fpsDefault

var _animationRateIncrement 	= 0.05;
var _animationRateMax			= 1.2;
var _animationRateMin 			= 0.05;
var _animationRate 				= 0.1;

var _squareSize 				= 128;
var _zIncrement 				= 0.1;
var _zMax 						= 45;
var _rotationDirection 			= 1;
var _alphaStart 				= 0.0;
var _alphaEnd 					= 1.0;
var _alphaIncrement 			= 0.001;


//--------------------------------------------------------------------
// Local Variables
//--------------------------------------------------------------------
var m_fpsCurrentTime 			= 0.0;
var m_fpsInterval 				= 0.0;
var m_fpsPreviousTime 			= 0.0;
var m_fpsElapsedTime 			= 0.0;
var m_fpsCurrentRateIndex		= 0;

var m_zOffsetCurrent			= 0.0;
var m_zIncrementToggle 			= true;
var m_zOffsetPrevious			= m_zIncrementToggle ? 0.1 : -0.1;
var m_zDirection 				= -1;
var m_zDirectionToggle 			= false;

var m_rotation 					= 0;	// degrees
var m_rotationIncrement			= 0.0;	// degrees
var m_alphaCube 				= 0.8;
var m_alphaCircle 				= 0.2;
var m_alphaToggle 				= false;

var m_dimStep 					= 0;
var m_dimStepToggle				= false;
var m_dimTotal 					= 8;
var m_nRows 					= 4;
var m_nColumns 					= 4;
var m_nPages 					= 1;

var m_helperDiv;
var m_helperToggle 				= false;

var	m_mousePosition 			= [0.0, 0.0];
var m_animationRequestID;

var m_logEscKeyToggle			= false;
var m_sessionStartTime			= 0.0;
var m_isUpKeyDown				= false;
var m_isDownKeyDown				= false;



//--------------------------------------------------------------------
// Initialization
//--------------------------------------------------------------------

function start() {

	// Get Start Time To Log Session Length
	m_sessionStartTime = performance.now();

    initialize();
}


function end() {
	var endTime = (performance.now() - m_sessionStartTime) / 1000.0;
	ga('send', 'timing', 'session', 'session-length', endTime);
}


function initialize() {

	initGoogleAnalytics();

   	// Window Resized Event Listener
   	window.addEventListener('resize', resized, false);

   	// Keyboard Event Listeners
   	document.onkeydown = handleKeyDown;
   	document.onkeyup = handleKeyUp;

   	// Mousemove Event Listener
   	// this.addEventListener('mousemove', mouseMove);

   	// Register Window Close
 	window.onbeforeunload = end;

   	// Set Window Size and Draw
   	resized();

   	// Start Animating after n seconds
   	window.setTimeout(startAnimation, _animationStartTime);
}


function resized() {

	window.cancelAnimationFrame(m_animationRequestID);

	var backgroundCanvas = document.getElementById("backgroundCanvas");
	backgroundCanvas.width = window.innerWidth; // 1440
 	backgroundCanvas.height = window.innerHeight; // 752

 	var backgroundHighlight = document.getElementById("backgroundHighlight");
	backgroundHighlight.width = window.innerWidth; // 1440
 	backgroundHighlight.height = window.innerHeight; // 752

	var cubeCanvas = document.getElementById("cubeCanvas");
	cubeCanvas.width = window.innerWidth;
 	cubeCanvas.height = window.innerHeight;

 	var circleCanvas = document.getElementById("circleCanvas");
	circleCanvas.width = window.innerWidth;
 	circleCanvas.height = window.innerHeight;

	m_fpsPreviousTime = performance.now();

	calculateParameters();

 	if (!_animationToggle) {
 		redraw();
 	} else {
 		tick();
 	}
}


function reset() {
	m_zOffsetCurrent 	= 0.0;
    m_rotation 			= 0.0;
}


function calculateParameters() {
	m_fpsInterval = 1000.0 / _fpsAnimation;
	m_rotationIncrement = (_animationRate * _fpsDefault) / _fpsAnimation;	// degrees (default 0.05 for 60fps)
	_squareSize = Math.min(backgroundCanvas.height / 6.0, backgroundCanvas.width / 6.0);
 	_zMax = 0.5 * _squareSize;
 	_zIncrement = m_rotationIncrement * _zMax / 45.0;
}




//--------------------------------------------------------------------
// Drawing and Animation
//--------------------------------------------------------------------

function startAnimation() {
	if (_animationToggle == false) {
		_animationToggle = true;
		tick();
	}
}

function stopAnimation() {
	_animationToggle = false;
	window.cancelAnimationFrame(m_animationRequestID);
}


function redraw() {

	var cubeCanvas = document.getElementById("cubeCanvas");
 	var circleCanvas = document.getElementById("circleCanvas");

	var cubeCtx = cubeCanvas.getContext("2d");
	var circleCtx = circleCanvas.getContext("2d");


	var size = _squareSize;
	var offset = m_zOffsetCurrent;

	var nRows = m_nRows;
	var nColumns = m_nColumns;
	var nPages = m_nPages;
	var direction = m_zDirection;


	var xOrigin = (cubeCanvas.width - (nColumns * (size + (direction * offset)))) / 2.0;
	var yOrigin = (cubeCanvas.height - (nRows * (size + offset))) / 2.0;

	var xPos = xOrigin;
	var yPos = yOrigin;


	// Set Unit Transform Matrix and Clear
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

	cubeCtx.closePath();
	circleCtx.closePath();

	// Stroke
	cubeCtx.strokeStyle = "#FFF";
	cubeCtx.globalAlpha = m_alphaCube;
	cubeCtx.stroke();

	circleCtx.strokeStyle = "#FFF";
	circleCtx.globalAlpha = m_alphaCircle;
	circleCtx.stroke();
}


function drawUnitCube(cubeCtx, circleCtx, xOrigin, yOrigin, size, offset, direction) {
	
	var no_antiAliasing = false;		// Use round number pixels instead of floating-point pixel interpolation

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


	if (no_antiAliasing == true) {
		xOrigin = ~~ (xOrigin+0.5);
		yOrigin = ~~ (yOrigin+0.5);
		size = ~~ (size+0.5);
		xOffset = ~~ (xOffset+0.5);
		yOffset = ~~ (yOffset+0.5);
		offsetScaler = ~~ (offsetScaler+0.5);
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

	if (_animationToggle == true) {
		m_animationRequestID = requestAnimFrame(tick);
	}


	// Throttle Animation
	if (_fpsAnimation != _fpsDefault) {
		m_fpsCurrentTime = performance.now();
		m_fpsElapsedTime = m_fpsCurrentTime - m_fpsPreviousTime;
		if (m_fpsElapsedTime < m_fpsInterval) {
			return;
		} else {
			m_fpsPreviousTime = m_fpsCurrentTime - (m_fpsElapsedTime % m_fpsInterval);
		}
	}


	// Z Direction Animation
	if (m_zIncrementToggle == true) {
		m_zOffsetCurrent += _zIncrement;
	} else {
		m_zOffsetCurrent -= _zIncrement;
	}

    if (m_zOffsetCurrent > _zMax) {
    	m_zIncrementToggle = false;
    } else if (m_zOffsetCurrent < -_zMax) {
    	m_zIncrementToggle = true;
    }

    if (Math.sign(m_zOffsetPrevious) != Math.sign(m_zOffsetCurrent)) {
    	if (m_zDirectionToggle == true) {
    		m_zDirection *= -1;
    		m_zDirectionToggle = false;
    	} else {
    		m_zDirectionToggle = true;
    	}

    	if (m_dimStepToggle == false) {
    		m_dimStep += 1;
    		if (m_dimStep >= 2) { m_dimStep = 2; }
    		setDimensions();
    	}
    }
    m_zOffsetPrevious = m_zOffsetCurrent;


    // Rotation Animation
    m_rotation = m_rotation + (_rotationDirection * m_rotationIncrement);
    if ((m_rotation >= 360.0) || (m_rotation <= 0.0)) {
    	_rotationDirection *= -1;
	}

	if (m_alphaToggle == true) {
    	m_alphaCube += _alphaIncrement;
    	m_alphaCircle -= _alphaIncrement;
    } else {
    	m_alphaCube -= _alphaIncrement;
    	m_alphaCircle += _alphaIncrement;
    }


    // Opacity Animation
    if (m_alphaCube >= _alphaEnd) {
    	m_alphaToggle = false;
    } else if (m_alphaCube <= _alphaStart) {
    	m_alphaToggle = true;
    }


    redraw();
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

function handleKeyDown(event) {
	if (event.keyCode == 40) {
		// Down Arrow Key
		m_isDownKeyDown = true;
		m_isUpKeyDown = false;
		changeAnimationRate();
	} else if (event.keyCode == 38) {
		// Up Arrow Key
		m_isDownKeyDown = false;
		m_isUpKeyDown = true;
		changeAnimationRate();
	}
}


function handleKeyUp(event) {

	if (event.keyCode == 32) {
		// Space Bar
		_animationToggle = !_animationToggle;
		if (_animationToggle) {
			tick();
		}
	}

	if (event.keyCode == 27) {
		// 'Esc'
		toggleHelper();

		if (m_logEscKeyToggle == false) {
			ga('send', 'event', 'keypress', 'launch-helper');
			m_logEscKeyToggle = true;
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

    if (event.keyCode == 39) {
    	// Right Arrow Key
    	m_dimStepToggle = true;
    	m_dimStep = (m_dimStep + 1) % m_dimTotal;
    	setDimensions();
    } else if (event.keyCode == 37) {
    	// Left Arrow Key
    	m_dimStepToggle = true;
    	m_dimStep = (m_dimStep - 1) % m_dimTotal;
    	if (m_dimStep < 0) { m_dimStep += m_dimTotal; }
    	setDimensions();
    }


    if (event.keyCode == 40) { // 40
    	// Down Arrow Key
    	m_isDownKeyDown = false;

    } else if (event.keyCode == 38) { // 38
    	// Up Arrow Key
    	m_isUpKeyDown = false;
    }

    if (event.keyCode == 191) {
    	// '/' Key
    	m_fpsCurrentRateIndex = (m_fpsCurrentRateIndex + 1) % _fpsRates.length;
    	_fpsAnimation = _fpsRates[m_fpsCurrentRateIndex];
    	calculateParameters();
    }

    if (!_animationToggle) {
    	redraw();
    }
}


function mouseMove(event) {
	m_mousePosition[0] = event.pageX;
  	m_mousePosition[1] = event.pageY;
}




//--------------------------------------------------------------------
// Helper Functions
//--------------------------------------------------------------------

function setDimensions() {
	switch (m_dimStep) {
		case 0: m_nRows = 4; m_nColumns = 4; m_nPages = 1; break;
		case 1: m_nRows = 4; m_nColumns = 4; m_nPages = 2; break;
		case 2: m_nRows = 4; m_nColumns = 4; m_nPages = 4; break;
		case 3: m_nRows = 1; m_nColumns = 1; m_nPages = 1; break;
		case 4: m_nRows = 2; m_nColumns = 1; m_nPages = 1; break;
		case 5: m_nRows = 2; m_nColumns = 2; m_nPages = 1; break;
		case 6: m_nRows = 2; m_nColumns = 2; m_nPages = 2; break;
		case 7: m_nRows = 4; m_nColumns = 2; m_nPages = 1; break;
	}
}


function toggleHelper() {
	
	var helperDiv  = document.getElementById("helper");
	
	if (m_helperToggle == true) {
		helperDiv.style.visibility = 'hidden';
		m_helperToggle = false;
	} else {
		helperDiv.style.visibility = 'visible';
		m_helperToggle = true;
	}
}


function flashBackground() {
	var backgroundHighlight = document.getElementById("backgroundHighlight");
	backgroundHighlight.style.visibility = 'visible';
	window.setTimeout(function() {
  		backgroundHighlight.style.visibility = 'hidden';
	}, 10);
}


function changeAnimationRate() {
	
	if (m_isUpKeyDown == true) 
	{
		_animationRate += _animationRateIncrement;
		if (_animationRate > _animationRateMax) {
			_animationRate = _animationRateMax;
			flashBackground();
		}
	} 

	else if (m_isDownKeyDown == true) 
	{
		_animationRate -= _animationRateIncrement;
		if (_animationRate < _animationRateMin) {
			_animationRate = _animationRateMin;
			flashBackground();
		}
	}

	calculateParameters();
}


function roundDec(num, dec) {
	var mult = Math.pow(10, dec);
	return (Math.round(num * mult) / mult);
}

function initGoogleAnalytics() {
	
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  	}) 	(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

	ga('create', 'UA-83877380-1', 'auto');
  	ga('send', 'pageview');
}


function startAudioLoopPlayback() {
	audio = new Audio('audio/DawnOutro.mp3'); 
	audio.addEventListener('ended', function() {
    	this.currentTime = 0;
    	this.play();
	}, false);
	
	audio.play();
}
