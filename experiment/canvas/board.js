var canvasElement;

// defines
var defGridSpacing = 25;

// data
var dataPoints = [];
var dataLines = [];

function onLoad()
{
	canvasElement = document.getElementById('tutorial');
	if (!canvasElement.getContext)
	{
		return;
	}
	canvasElement.addEventListener('mousemove', onMouseMove);
	canvasElement.addEventListener('mousedown', onMouseDown);

	dataPoints.push({x:1, y:1, c:"#ff0000"});
	dataPoints.push({x:2, y:1, c:"#ff0000"});
	dataPoints.push({x:3, y:1, c:"#ff0000"});
	dataPoints.push({x:3, y:2, c:"#ff0000"});
	dataPoints.push({x:2, y:3, c:"#ff0000"});
	dataPoints.push({x:1, y:3, c:"#ff0000"});
	dataPoints.push({x:1, y:2, c:"#0000ff"});
	dataPoints.push({x:2, y:2, c:"#0000ff"});

	dataLines.push({x:1, y:1, d: 2, c:"#ff0000"})
	dataLines.push({x:2, y:1, d: 3, c:"#ff0000"})
	dataLines.push({x:3, y:2, d: 5, c:"#ff0000"})


	drawBoard(undefined);
}

function pointerCanvasToBoard(pointerOnCanvas)
{
	// https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
		return {
			x: Math.round(pointerOnCanvas.x / defGridSpacing),
			y: Math.round(pointerOnCanvas.y / defGridSpacing)
		};
}

function onMouseMove(event)
{
	var rect = canvasElement.getBoundingClientRect();
	mouseX = event.clientX - rect.left;
	mouseY = event.clientY - rect.top;

	drawBoard(pointerCanvasToBoard({x: mouseX, y: mouseY}));
}

function onMouseDown(event)
{
	var rect = canvasElement.getBoundingClientRect();
	mouseX = event.clientX - rect.left;
	mouseY = event.clientY - rect.top;

	pointerBoard = pointerCanvasToBoard({x: mouseX, y: mouseY});
	dataPoints.push(
		{
			x: pointerBoard.x,
			y: pointerBoard.y,
			c: "#123456"
		});

	drawBoard(pointerCanvasToBoard({x: mouseX, y: mouseY}));
}

function drawBoard(pointerCoordinates)
{
	var canvas = canvasElement.getContext('2d');
	var canvasWidth = canvasElement.width;
	var canvasHeight = canvasElement.height;

	if (pointerCoordinates !== undefined)
	{
		pointer = 
		{
			x: pointerCoordinates.x,
			y: pointerCoordinates.y,
			c:"#ffad29"
		};
	}
	else
	{
		pointer = undefined;
	}

	draw(canvas, canvasWidth, canvasHeight, defGridSpacing, dataPoints, dataLines, pointer);
}

function draw(canvas, canvasWidth, canvasHeight, gridSpacing, points, lines, pointer)
{
	canvas.lineWidth = 3;
	canvas.strokeStyle = "#c9f2ff";
	// canvas.shadowColor = "#c9f2ff";
	// canvas.shadowBlur = 5;

	var linesNoHorizontally = canvasWidth / gridSpacing;
	var linesNoVertically = canvasHeight / gridSpacing;

	canvas.clearRect(0, 0, canvasWidth, canvasHeight);

	canvas.beginPath();
	for (i=0; i<linesNoHorizontally; i++)
	{
		var x = i * gridSpacing;
		canvas.moveTo(x, 0);
		canvas.lineTo(x, canvasHeight);
	}
	for (i=0; i<linesNoVertically; i++)
	{
		var y = i * gridSpacing;
		canvas.moveTo(0, y);
		canvas.lineTo(canvasWidth, y);
	}
	canvas.stroke();

	for (i=0; i<points.length; i++)
	{
		var point = points[i];

		var x = point.x * gridSpacing;
		var y = point.y * gridSpacing;
	
		canvas.beginPath();
		canvas.fillStyle = point.c;
		canvas.arc(x, y, 4, 0, 2 * Math.PI);
		canvas.fill();
	}

	for (i=0; i<lines.length; i++)
	{
		var line = lines[i];

		var x = line.x * gridSpacing;
		var y = line.y * gridSpacing;
		
		canvas.beginPath();
		canvas.strokeStyle = line.c;
		canvas.lineWidth = 2;
		canvas.moveTo(x, y);

		var endX = x;
		var endY = y;
	// line direction
	// 	 7  0  1
	//	 6  P  2
	//	 5  4  3
		switch(line.d)
		{
			case 0:
				endY -= gridSpacing;
			break;
			case 1:
				endX += gridSpacing;
				endY -= gridSpacing;
			break;
			case 2:
				endX += gridSpacing;
			break;
			case 3:
				endX += gridSpacing;
				endY += gridSpacing;
			break;
			case 4:
				endY += gridSpacing;
			break;
			case 5:
				endX -= gridSpacing;
				endY += gridSpacing;
			break;
			case 6:
			case 7:
		}
		canvas.lineTo(endX, endY);
		canvas.stroke();
	}

	if (pointer !== undefined)
	{
		var pointerX = pointer.x * gridSpacing;
		var pointerY = pointer.y * gridSpacing;

		canvas.beginPath();
		canvas.strokeStyle = pointer.c;
		canvas.lineWidth = 2;
		canvas.arc(pointerX, pointerY, 5, 0, 2 * Math.PI);
		canvas.stroke();
	}
}
