function DotsGame(board, gameSettings, style)
{
	this.board = board;
	this.gameSettings = gameSettings;
	this.style = style;
	
	this.pointerCoordinates = undefined;
	
	this.getStats = function()
	{
		var stats = {};
		
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
		
		this.gameDotPut(coordinates);
		this.boardDraw();
	}
	
	this.onMouseUp = function()
	{
	}
	
	this.boardDraw = function()
	{
		var points = [];
		var areas = [];
		var pointers = [];
		
		for (p=0; p<this.gameSettings.playerCount; p++)
		{
			for (i=0; i<this.state.players[p].dots.length; i++)
			{
				var dot = this.state.players[p].dots[i];
				points.push(dot);
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
		
		this.board.draw(points, areas, pointers);
	}
	
	
// PRIVATE

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
	
	this.gameIsDotThere = function(coordinates)
	{
		for (p=0; p<this.gameSettings.playerCount; p++)
		{
			for (i=0; i<this.state.players[p].dots.length; i++)
			{
				var dot = this.state.players[p].dots[i];
				if (dot.x == coordinates.x
					&& dot.y == coordinates.y)
				{
					return true;
				}
			}
		}
		
		return false;
	}
	
	// put a dot for current player and advance to the next one
	this.gameDotPut = function(coordinates)
	{
		var state = this.gameStateCopy();
		
		if (state.inputMode == 0)
		{
			// check if this spot is free
			if (this.gameIsDotThere(coordinates))
			{
				console.log("Dot already there");
				state.inputMode = 1 - state.inputMode;
				state.areaDraft.push(coordinates);
				
				this.gameStateUpdate(state);
				
				return;
			}
			
			// actually add the dot to current player's list of dots
			state.players[state.playerCurrent].dots.push(
			{
				x: coordinates.x,
				y: coordinates.y,
				c: this.style.playerColor[state.playerCurrent]
			});
			
			// go to the next player
			if (++state.playerCurrent >= this.gameSettings.playerCount)
			{
				state.playerCurrent = 0;
			}
			
			this.gameStateUpdate(state);
		}
		else
		{
			if (this.gameIsDotThere(coordinates))
			{
				console.log("Dot already there");
				state.inputMode = 1 - state.inputMode;
				state.areaDraft = [];

				this.gameStateUpdate(state);
				
				return;
			}
			
			state.areaDraft.push(coordinates);
			
			this.gameStateUpdate(state);
		}
	}

	this.state = this.gameReset();	
	console.log(this.state);
	this.boardDraw();
}