function DotsGame(board, gameSettings, style)
{
	this.board = board;
	this.gameSettings = gameSettings;
	this.style = style;
	
	this.pointerCoordinates = undefined;
	
	this.getStats = function()
	{
		var stats = {};
		
		stats.inputMode = this.state.inputMode;
		stats.playerCount = this.gameSettings.playerCount;
		stats.playerCurrent = this.state.playerCurrent;
		stats.player = [];
		for (p=0; p<this.gameSettings.playerCount; p++)
		{
			var dotCount = this.state.players[p].dots.length;
			stats.player.push(
			{
				dotColor: this.style.playerColor[p],
				dotCount: dotCount
			});
		}
		
		return stats;
	}
	
	this.registerStateChangeHandler = function(handler)
	{
		this.stateChangeHandler = handler;
	}
	
	this.onMouseMove = function(coordinatesCanvas)
	{
		if (coordinatesCanvas !== undefined)
		{
			boardSize = this.board.getSize();
			this.pointerCoordinates = board.coordinateFromCanvasToGrid(coordinatesCanvas);
			if (this.pointerCoordinates.x > (boardSize.width - 1)
				|| this.pointerCoordinates.y > (boardSize.height - 1)
				|| this.pointerCoordinates.x < 0
				|| this.pointerCoordinates.y < 0)
			{
				this.pointerCoordinates = undefined;
			}
		}
		else
		{
			this.pointerCoordinates = undefined;
		}
		this.boardDraw();
	}
	
	this.onMouseDown = function()
	{
		var coordinates = {
			x: this.pointerCoordinates.x,
			y: this.pointerCoordinates.y,
		};
		
		this.gameOnDotClick(coordinates);
		this.boardDraw();
	}
	
	this.onMouseUp = function()
	{
	}

	this.inputModeToggle = function()
	{
		this.gameInputModeToggle();
		this.boardDraw();
	}
	
	this.boardDraw = function()
	{
		var points = [];
		var areas = [];
		var pointers = [];
		
		for (p=0; p<this.gameSettings.playerCount; p++)
		{
			var player = this.state.players[p];
			for (i=0; i<player.dots.length; i++)
			{
				var dot = player.dots[i];
				points.push(dot);
			}

			for (i=0; i<player.areas.length; i++)
			{
				var playerArea = player.areas[i];
				var vertices = [];
				for (j=0; j<playerArea.length; j++)
				{
					vertices.push(
					{
						x: playerArea[j].x,
						y: playerArea[j].y
					});
				}
				areas.push(
				{
					lineColor: this.style.playerColor[p],
					fillColor: this.style.playerColor[p],
					vertices: vertices
				});
			}
		}
		
		if (this.pointerCoordinates !== undefined)
		{
			var color;
			switch (this.state.inputMode)
			{
				default:
				case 0:
					color = "#ff6a00";
					break;
				case 1:
					color = "#006aff";
					break;
			}
			
			pointers.push(
			{
				x: this.pointerCoordinates.x,
				y: this.pointerCoordinates.y,
				c: color
			});
		}

		if (this.state.areaDraft.length > 0)
		{
			var vertices = [];
			for (i=0; i<this.state.areaDraft.length; i++)
			{
				var area = this.state.areaDraft[i];
				vertices.push(
				{
					x: area.x,
					y: area.y
				});
			}
			areas.push(
			{
				lineColor: "#808080",
				fillColor: this.style.playerColor[this.state.playerCurrent],
				vertices: vertices
			});
		}
		
		this.board.draw(points, areas, pointers);
	}
	
	
// PRIVATE

	// GAME STATE
	this.gameReset = function()
	{
		var state = 
		{
			players: [],
			playerCurrent: 0,
			inputMode: 0,
			areaDraft: []
		};
		
		for (i=0; i<this.gameSettings.playerCount; i++)
		{
			state.players.push(
			{
				dots: [],
				areas: []
			});
		}
		
		return state;
	}
	
	this.gameStateUpdate = function(newState)
	{
		this.state = newState;
		console.log(newState);
		this.stateChangeHandler();
	}
	
	this.gameStateCopy = function()
	{
		return JSON.parse(JSON.stringify(this.state));
	}
	
	// GAME LOGIC
	this.gameOnDotClick = function(coordinates)
	{
		switch (this.state.inputMode)
		{
			// dot placing
			case 0:
				this.gameDotPut(coordinates);
				break;
			// base drawing
			case 1:
				this.gameBaseFencePut(coordinates);
				break;
		}
	}

	this.gameIsDotThere = function(coordinates)
	{
		return this.gameDotGetPlayerIndex(coordinates) !== undefined;
	}

	this.gameDotGetPlayerIndex = function(coordinates)
	{
		for (p=0; p<this.gameSettings.playerCount; p++)
		{
			for (i=0; i<this.state.players[p].dots.length; i++)
			{
				var dot = this.state.players[p].dots[i];
				if (dot.x == coordinates.x
					&& dot.y == coordinates.y)
				{
					return p;
				}
			}
		}
		
		return undefined;
	}

	this.gameFenceTempGetVertexIndex = function(coordinates)
	{
		for (i=0; i<this.state.areaDraft.length; i++)
		{
			var vertex = this.state.areaDraft[i];
			if (vertex.x == coordinates.x
				&& vertex.y == coordinates.y)
			{
				return i;
			}
		}

		return undefined;
	}
	
	// put a dot for current player and advance to the next one
	this.gameDotPut = function(coordinates)
	{
		// check if this spot is free, ignore if it isn't
		if (this.gameIsDotThere(coordinates))
		{
			console.log("Dot already there");
			
			return;
		}
		
		this.gamePlayerDotAdd(coordinates, this.state.playerCurrent);
		this.gamePlayerNext();
	}

	this.gameBaseFencePut = function(coordinates)
	{
		// ignore inputs on other players dots
		if (this.gameDotGetPlayerIndex(coordinates) !== this.state.playerCurrent)
		{
			return;
		}

		var fenceVertexIndex = this.gameFenceTempGetVertexIndex(coordinates);

		// dot that is not part of the fence yet
		if (fenceVertexIndex === undefined)
		{
			// TODO: add checks for proximity to previous fence dot
			this.gameFenceTempAdd(coordinates, this.state.playerCurrent);
		}
		// the origin dot
		else if (fenceVertexIndex == 0)
		{
			// commit this temp fence as current players base
			this.gameFenceTempCommit(this.state.playerCurrent);
		}
		else
		{
			// ignore :)
		}
	}

	this.gamePlayerDotAdd = function(coordinates, playerIndex)
	{
		var state = this.gameStateCopy();
		state.players[playerIndex].dots.push(
		{
			x: coordinates.x,
			y: coordinates.y,
			c: this.style.playerColor[playerIndex]
		});
		this.gameStateUpdate(state);
	}

	this.gameFenceTempAdd = function(coordinates, playerIndex)
	{
		var state = this.gameStateCopy();
		state.areaDraft.push(
		{
			x: coordinates.x,
			y: coordinates.y
		});
		this.gameStateUpdate(state);
	}

	this.gameFenceTempCommit = function(playerIndex)
	{
		var state = this.gameStateCopy();
		state.players[playerIndex].areas.push(
			state.areaDraft
		);
		state.areaDraft = [];
		this.gameStateUpdate(state);
	}

	this.gamePlayerNext = function()
	{
		var state = this.gameStateCopy();
		if (++state.playerCurrent >= this.gameSettings.playerCount)
		{
			state.playerCurrent = 0;
		}
		this.gameStateUpdate(state);
	}

	this.gameInputModeToggle = function()
	{
		var state = this.gameStateCopy();
		state.inputMode = 1 - state.inputMode;
		state.areaDraft = [];
		this.gameStateUpdate(state);
	}

	// Initialize the state and draw
	this.state = this.gameReset();	
	// console.log(this.state);
	this.boardDraw();
}