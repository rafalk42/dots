function DotsGameEngine(settings)
{
	this.settings = settings;

	this.stateChangeHandler = undefined;

	// PUBLIC INTERFACE
	this.reset = function()
	{
		var initialState = this.stateInitialGet();
		this.stateUpdate(initialState);
	}

	this.stateGet = function()
	{
		return this.stateCopy();
	}

	this.settingsGet = function()
	{
		return this.settingsCopy();
	}

	this.turnEnd = function()
	{
		var state = this.stateCopy();
		if (++state.playerCurrent >= this.settings.playerCount)
		{
			state.playerCurrent = 0;
		}
		state.players[state.playerCurrent].dotsLeft = 1;
		state.inputMode = 0;
		state.fenceDraft = [];
		this.stateUpdate(state);
	}

	this.inputModeToggle = function()
	{
		var state = this.stateCopy();
		state.inputMode = 1 - state.inputMode;
		state.fenceDraft = [];
		this.stateUpdate(state);
	}

	this.gridPointClick = function(coordinates)
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

	// PRIVATE ////////////////////////////////////////////////////////
	this.settingsCopy = function()
	{
		return JSON.parse(JSON.stringify(this.settings));
	}

	this.stateInitialGet = function()
	{
		var state = 
		{
			players: [],
			playerCurrent: 0,
			inputMode: 0,
			fenceDraft: []
		};
		
		for (i=0; i<this.settings.playerCount; i++)
		{
			state.players.push(
			{
				dotsLeft: 1,
				dots: [],
				areas: []
			});
		}

		// FOR DEBUG PURPOSES!!!
		for (x=1; x<6; x++)
		{
			for (y=(x%2+1); y<9; y+=2)
			{
				state.players[0].dots.push({x:x, y:y});
			}
		}
		for (x=1; x<6; x++)
		{
			for (y=((x-1)%2+1); y<9; y+=2)
			{
				state.players[1].dots.push({x:x, y:y});
			}
		}
		for (x=6; x<10; x++)
		{
			for (y=1; y<5; y++)
			{
				state.players[0].dots.push({x:x, y:y});
			}
		}
		for (x=6; x<10; x++)
		{
			for (y=5; y<9; y++)
			{
				state.players[1].dots.push({x:x, y:y});
			}
		}
		

		return state;
	}
	
	this.stateUpdate = function(newState)
	{
		this.state = newState;
		console.log(newState);
		if (this.stateChangeHandler !== undefined)
		{
			this.stateChangeHandler();
		}
	}
	
	this.stateCopy = function()
	{
		return JSON.parse(JSON.stringify(this.state));
	}

	this.stateChangeHandlerRegister = function(handler)
	{
		this.stateChangeHandler = handler;
	}
	
	// GAME LOGIC
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
		for (p=0; p<this.settings.playerCount; p++)
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
		for (i=0; i<this.state.fenceDraft.length; i++)
		{
			var vertex = this.state.fenceDraft[i];
			if (vertex.x == coordinates.x
				&& vertex.y == coordinates.y)
			{
				return i;
			}
		}

		return undefined;
	}

	this.gameFencePostIsValid = function(coordinates, playerIndex)
	{
		// CHECK: dot ownership
		// ignore inputs on other players dots
		if (this.gameDotGetPlayerIndex(coordinates) !== playerIndex)
		{
			console.log("ASDsa");
			return false;
		}

		// CHECK: proximity from previous
		// first post is not restricted
		if (this.state.fenceDraft.length > 0)
		{
			// get last placed post
			var vertexPrevious = this.state.fenceDraft[this.state.fenceDraft.length - 1];
			// check the distance between previous and the next (attempted) post
			var distance = this.gameFenceDistance(coordinates, vertexPrevious)
			if (distance > 1)
			{
				console.log("Post at " + coordinates.x + "x" + coordinates.y +
					" is too far (" + distance + ")");
				return false;
			}
		}

		// CHECK: dot is part a fence
		var player = this.state.players[playerIndex];
		for (i=0; i<player.areas.length; i++)
		{
			var playerArea = player.areas[i];
			for (j=0; j<playerArea.length; j++)
			{
				var vertex = playerArea[j];
				// if this dot is a part of player's fence, allow line through it
				if (vertex.x == coordinates.x
					&& vertex.y == coordinates.y)
				{
					return true;
				}
			}
		}
		
		// CHECK: dot freedom
		if (!this.gameDotIsFree(coordinates))
		{
			console.log("Dot at " + coordinates.x + "x" + coordinates.y +
				" is not free");
			return false;
		}

		return true;
	}

	this.gameDotIsFree = function(coordinates)
	{
		for (p=0; p<this.settings.playerCount; p++)
		{
			var player = this.state.players[p];
			for (i=0; i<player.areas.length; i++)
			{
				var playerArea = player.areas[i];
				var polygon = [];
				for (j=0; j<playerArea.length; j++)
				{
					var vertex = playerArea[j];
					polygon.push([vertex.x, vertex.y]);
				}

				if (this.polygonPointInside([coordinates.x, coordinates.y], polygon))
				{
					return false;
				}
			}
		}

		return true;
	}

	// from: https://github.com/substack/point-in-polygon
	// var polygon = [ [ 1, 1 ], [ 1, 2 ], [ 2, 2 ], [ 2, 1 ] ];
    // inside([ 1.5, 1.5 ], polygon);
	this.polygonPointInside = function (point, vs)
	{
		// ray-casting algorithm based on
		// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

		var x = point[0], y = point[1];

		var inside = false;
		for (var i = 0, j = vs.length - 1; i < vs.length; j = i++)
		{
			var xi = vs[i][0], yi = vs[i][1];
			var xj = vs[j][0], yj = vs[j][1];

			var intersect = ((yi > y) != (yj > y))
				&& (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
			if (intersect) inside = !inside;
		}

		return inside;
	}

	this.gameFenceIsValid = function()
	{
		if (this.state.fenceDraft.length < 4)
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
			console.log("No dots left for player " + this.state.playerCurrent);

			return;
		}
		
		this.gamePlayerDotAdd(coordinates, this.state.playerCurrent);
	}

	this.gameBaseFencePut = function(coordinates)
	{
		var fenceVertexIndex = this.gameFenceTempGetVertexIndex(coordinates);

		// dot that is not part of the fence yet
		if (fenceVertexIndex === undefined)
		{
			if (this.gameFencePostIsValid(coordinates, this.state.playerCurrent))
			{
				this.gameFenceTempAdd(coordinates);
			}
		}
		// the origin dot
		else if (fenceVertexIndex == 0)
		{
			if (this.gameFencePostIsValid(coordinates, this.state.playerCurrent)
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
		var state = this.stateCopy();
		state.players[playerIndex].dots.push(
		{
			x: coordinates.x,
			y: coordinates.y
		});
		state.players[state.playerCurrent].dotsLeft--;
		this.stateUpdate(state);
	}

	this.gameFenceTempAdd = function(coordinates)
	{
		var state = this.stateCopy();
		state.fenceDraft.push(
		{
			x: coordinates.x,
			y: coordinates.y
		});
		this.stateUpdate(state);
	}
	
	this.gameFenceTempRevert = function(fenceVertexIndex)
	{
		var state = this.stateCopy();
		var fenceDraft = [];
		for (i=0; i<=fenceVertexIndex; i++)
		{
			fenceDraft.push(state.fenceDraft[i]);
		}
		state.fenceDraft = fenceDraft;
		this.stateUpdate(state);
	}
	
	this.gameFenceTempCommit = function(playerIndex)
	{
		var state = this.stateCopy();
		state.players[playerIndex].areas.push(
			state.fenceDraft
		);
		state.fenceDraft = [];
		this.stateUpdate(state);
	}

	this.gamePlayerGrantDots = function(count, playerIndex)
	{
		var state = this.stateCopy();
		state.players[state.playerCurrent].dotsLeft += count;
		this.stateUpdate(state);
	}
}
