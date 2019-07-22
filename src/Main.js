var canvasElement;
var board;
var game;

function BodyOnLoad()
{
	console.log("Body on load!");

	canvasElement = document.getElementById('board');
	if (!canvasElement.getContext)
	{
		console.log("Fatal error: couldn't get the canvas element");
		return;
	}
	canvasElement.addEventListener('mousemove', onMouseMove);
	canvasElement.addEventListener('mouseleave', onMouseLeave);
	canvasElement.addEventListener('mousedown', onMouseDown);
	canvasElement.addEventListener('mouseup', onMouseUp);

	var canvas =
	{
		context: canvasElement.getContext('2d'),
		width: canvasElement.width,
		height: canvasElement.height
	};
	var board = 
	{
		width: 15,
		height: 15,
		gridSpacing: 25
	};
	var boardStyle = 
	{
		gridLineWidth: 2,
		gridLineColor: "#c9f2ff",
		dotSize: 5,
		alpha: 0.4,
		pointerThickness: 3,
		pointerSize: 6
	};
	
	var gameSettings =
	{
		playerCount: 2
	};
	
	var gameStyle =
	{
		playerColor:
		[
			"#ff0000",
			"#0000ff"
		]
	};

	board = new DotsGridBoard(canvas, board, boardStyle);
	game = new DotsGame(board, gameSettings, gameStyle);
	game.registerStateChangeHandler(onGameStateChange);
	
	updateInfo();
}

function onGameStateChange()
{
	updateInfo();
}

function updateInfo()
{
	var stats = game.getStats();
	var statsElement = document.getElementById("stats");
	var playerCurrentElement = document.getElementById("playerCurrent");

	var text = "";
	for (i=0; i<stats.playerCount; i++)
	{
		text += "Player " + (i + 1) + ": " + stats.player[i].dotCount + " ";
	}

	statsElement.textContent = text;
	
	playerCurrentElement.textContent = "Player " + (stats.playerCurrent + 1);
	playerCurrentElement.style.color = stats.player[stats.playerCurrent].dotColor;
}

function onMouseMove(event)
{
	var rect = canvasElement.getBoundingClientRect();
	mouseX = event.clientX - rect.left;
	mouseY = event.clientY - rect.top;
	
	game.onMouseMove({x:mouseX, y:mouseY});
}

function onMouseLeave(event)
{
	game.onMouseMove(undefined);
}

function onMouseDown(event)
{
	game.onMouseDown();
}

function onMouseUp(event)
{
	game.onMouseUp();
}