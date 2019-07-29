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
				dotCount: dotCount,
				dotsLeft: this.state.players[p].dotsLeft
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
		// ignore mouse down outside playing area
		if (this.pointerCoordinates === undefined)
		{
			return;
		}

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
	
	this.endTurn = function()
	{
		this.gamePlayerNext();
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
				dot.c = this.style.playerColor[p];
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
					color = "#00ff6a";
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
				dotsLeft: 1,
				dots: [],
				areas: []
			});
		}

		// FOR DEBUG PURPOSES!!!
		state.players[0].dots.push({x:1, y:1});
		state.players[0].dots.push({x:1, y:3});
		state.players[0].dots.push({x:1, y:5});
		state.players[0].dots.push({x:1, y:7});
		state.players[0].dots.push({x:1, y:9});
		state.players[0].dots.push({x:2, y:2});
		state.players[0].dots.push({x:2, y:4});
		state.players[0].dots.push({x:2, y:6});
		state.players[0].dots.push({x:2, y:8});
		state.players[0].dots.push({x:3, y:1});
		state.players[0].dots.push({x:3, y:3});
		state.players[0].dots.push({x:3, y:5});
		state.players[0].dots.push({x:3, y:7});
		state.players[0].dots.push({x:3, y:9});
		state.players[0].dots.push({x:4, y:2});
		state.players[0].dots.push({x:4, y:4});
		state.players[0].dots.push({x:4, y:6});
		state.players[0].dots.push({x:4, y:8});
		
		state.players[1].dots.push({x:4, y:1});
		state.players[1].dots.push({x:4, y:3});
		state.players[1].dots.push({x:4, y:5});
		state.players[1].dots.push({x:4, y:7});
		state.players[1].dots.push({x:4, y:9});
		state.players[1].dots.push({x:3, y:2});
		state.players[1].dots.push({x:3, y:4});
		state.players[1].dots.push({x:3, y:6});
		state.players[1].dots.push({x:3, y:8});
		state.players[1].dots.push({x:2, y:1});
		state.players[1].dots.push({x:2, y:3});
		state.players[1].dots.push({x:2, y:5});
		state.players[1].dots.push({x:2, y:7});
		state.players[1].dots.push({x:2, y:9});
		state.players[1].dots.push({x:1, y:2});
		state.players[1].dots.push({x:1, y:4});
		state.players[1].dots.push({x:1, y:6});
		state.players[1].dots.push({x:1, y:8});
		

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

	this.gameDotsLeft = function(playerIndex)
	{
		return this.state.players[playerIndex].dotsLeft;
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

	this.gameFenceIsValidLocation = function(coordinates, playerIndex)
	{
		// CHECK: proximity from previous
		// first post is not restricted
		if (this.state.areaDraft.length == 0)
		{
			return true;
		}
		// get last placed post
		var vertex = this.state.areaDraft[this.state.areaDraft.length - 1];
		// check the distance between previous and the next (attempted) post
		if (this.gameFenceDistance(coordinates, vertex) != 1)
		{
			return false;
		}

		// for (i=0; i<this.state.areaDraft.length; i++)
		// CHECK: 
		return true;
	}

	this.gameFenceIsValid = function()
	{
		if (this.state.areaDraft.length < 4)
		{
			return false;
		}

		return true;
	}

	this.gameFenceDistance = function(coordinatesA, coordinatesB)
	{
		var distanceX = Math.abs(coordinatesA.x - coordinatesB.x);
		var distanceY = Math.abs(coordinatesA.y - coordinatesB.y);

		return Math.max(distanceX, distanceY);
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

		if (this.gameDotsLeft(this.state.playerCurrent) <= 0)
		{
			console.log("Not dots left for player " + this.state.playerCurrent);

			return;
		}
		
		this.gamePlayerDotAdd(coordinates, this.state.playerCurrent);
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
			if (this.gameFenceIsValidLocation(coordinates, this.state.playerCurrent))
			{
				this.gameFenceTempAdd(coordinates);
			}
		}
		// the origin dot
		else if (fenceVertexIndex == 0)
		{
			if (this.gameFenceIsValidLocation(coordinates, this.state.playerCurrent)
				&& this.gameFenceIsValid())
			{
				// commit this temp fence as current players base
				this.gameFenceTempCommit(this.state.playerCurrent);
				this.gamePlayerGrantDots(1, this.state.playerCurrent);
			}
		}
		// dot that is a part of the fence
		else
		{
			this.gameFenceTempRevert(fenceVertexIndex);
		}
	}

	this.gamePlayerDotAdd = function(coordinates, playerIndex)
	{
		var state = this.gameStateCopy();
		state.players[playerIndex].dots.push(
		{
			x: coordinates.x,
			y: coordinates.y
		});
		state.players[state.playerCurrent].dotsLeft--;
		this.gameStateUpdate(state);
	}

	this.gameFenceTempAdd = function(coordinates)
	{
		var state = this.gameStateCopy();
		state.areaDraft.push(
		{
			x: coordinates.x,
			y: coordinates.y
		});
		this.gameStateUpdate(state);
	}
	
	this.gameFenceTempRevert = function(fenceVertexIndex)
	{
		var state = this.gameStateCopy();
		var areaDraft = [];
		for (i=0; i<=fenceVertexIndex; i++)
		{
			areaDraft.push(state.areaDraft[i]);
		}
		state.areaDraft = areaDraft;
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
		state.players[state.playerCurrent].dotsLeft = 1;
		state.inputMode = 0;
		state.areaDraft = [];
		this.gameStateUpdate(state);
	}

	this.gamePlayerGrantDots = function(count, playerIndex)
	{
		var state = this.gameStateCopy();
		state.players[state.playerCurrent].dotsLeft += count;
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