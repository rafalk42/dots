function DotsGame(board, engine, style)
{
	this.board = board;
	this.style = style;
	
	this.pointerCoordinates = undefined;
	
	this.getStats = function()
	{
		var state = engine.stateGet();
		var settings = engine.settingsGet();
		var stats = {};
		
		stats.inputMode = state.inputMode;
		stats.playerCount = settings.playerCount;
		stats.playerCurrent = state.playerCurrent;
		stats.player = [];
		for (p=0; p<settings.playerCount; p++)
		{
			var dotCount = state.players[p].dots.length;
			stats.player.push(
			{
				dotColor: this.style.playerColor[p],
				dotCount: dotCount,
				dotsLeft: state.players[p].dotsLeft
			});
		}
		
		return stats;
	}
	
	this.registerStateChangeHandler = function(handler)
	{
		engine.stateChangeHandlerRegister(handler);
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
		
		engine.gridPointClick(coordinates);
		this.boardDraw();
	}
	
	this.onMouseUp = function()
	{
	}

	this.inputModeToggle = function()
	{
		engine.inputModeToggle();
		this.boardDraw();
	}
	
	this.endTurn = function()
	{
		engine.turnEnd();
		this.boardDraw();
	}
	
	this.boardDraw = function()
	{
		var state = engine.stateGet();
		var settings = engine.settingsGet();
		var points = [];
		var areas = [];
		var pointers = [];
		
		for (p=0; p<settings.playerCount; p++)
		{
			var player = state.players[p];
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
			switch (state.inputMode)
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

		var fenceDraft = state.fenceDraft;
		if (fenceDraft.length > 0)
		{
			var vertices = [];
			for (i=0; i<fenceDraft.length; i++)
			{
				var area = fenceDraft[i];
				vertices.push(
				{
					x: area.x,
					y: area.y
				});
			}
			areas.push(
			{
				lineColor: "#808080",
				fillColor: this.style.playerColor[state.playerCurrent],
				vertices: vertices
			});
		}
		
		this.board.draw(points, areas, pointers);
	}
	
	engine.reset();
	this.boardDraw();
}
