function DotsGridBoard(canvas, board, style)
{
	this.canvas = canvas;
	this.board = board;
	this.style = style;
	
// PUBLIC INTERFACE
	this.coordinateFromCanvasToGrid = function(coordinates)
	{
		// https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
		return {
			x: Math.round(coordinates.x / this.board.gridSpacing),
			y: Math.round(coordinates.y / this.board.gridSpacing)
		};
	}
	
	this.draw = function(points, areas, pointers)
	{
		this.canvasClear();
		this.canvasDrawGrid();
		this.canvasDrawPoints(points);
		this.canvasDrawAreas(areas);
		this.canvasDrawPointers(pointers);
	}
	
	this.getSize = function()
	{
		return {
			width:this.board.width,
			height: this.board.height
		};
	}

// PRIVATE
	this.canvasClear = function()
	{
		canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	
	this.canvasDrawGrid = function ()
	{
		var can = canvas.context;

		can.lineWidth = this.style.gridLineWidth;
		can.strokeStyle = this.style.gridLineColor;

		can.beginPath();
		for (i=0; i<this.board.width; i++)
		{
			var x = i * this.board.gridSpacing;
			can.moveTo(x, 0);
			can.lineTo(x, this.board.gridSpacing * (this.board.height - 1));
		}
		for (i=0; i<this.board.height; i++)
		{
			var y = i * this.board.gridSpacing;
			can.moveTo(0, y);
			can.lineTo(this.board.gridSpacing * (this.board.width - 1), y);
		}
		can.stroke();
	}
	
	this.canvasDrawPoints = function(points)
	{
		var can = canvas.context;

		for (i=0; i<points.length; i++)
		{
			var point = points[i];

			var x = point.x * this.board.gridSpacing;
			var y = point.y * this.board.gridSpacing;
		
			can.beginPath();
			can.fillStyle = point.c;
			can.arc(x, y, this.style.dotSize, 0, 2 * Math.PI);
			can.fill();
			can.font = "10px consolas";
			can.fillStyle = "#000000";
			var text = "" + point.x + "," + point.y;
			can.fillText(text, x - 8, y - 6, 16);
		}
	}
	
	this.canvasDrawAreas = function(areas)
	{
		var can = canvas.context;

		can.lineWidth = 2;
		
		for (i=0; i<areas.length; i++)
		{
			var area = areas[i];
			var vertices = area.vertices;
			
			can.globalAlpha = this.style.alpha;
			can.fillStyle = area.fillColor;
			can.moveTo(vertices[0].x, vertices[0].y);
			can.beginPath();			
			for (j=0; j<vertices.length; j++)
			{
				var vertex = vertices[j];
				
				var x = vertex.x * this.board.gridSpacing;
				var y = vertex.y * this.board.gridSpacing;
				
				can.lineTo(x, y);
			}
			can.closePath();
			can.fill();
			can.globalAlpha = 1.0;

			// if (vertices.length == 1)
			{
				can.beginPath();
				can.fillStyle = area.lineColor;
				can.arc(vertices[0].x * this.board.gridSpacing,
					vertices[0].y * this.board.gridSpacing,
					3, 0, 2 * Math.PI);
				can.fill();
			}

			can.strokeStyle = area.lineColor;
			can.moveTo(vertices[0].x, vertices[0].y);
			can.beginPath();			
			for (j=0; j<vertices.length; j++)
			{
				var vertex = vertices[j];
				
				var x = vertex.x * this.board.gridSpacing;
				var y = vertex.y * this.board.gridSpacing;
				
				can.lineTo(x, y);
			}
			can.closePath();
			can.stroke();
		}
	}
	
	this.canvasDrawPointers = function(pointers)
	{
		var can = canvas.context;

		for (i=0; i<pointers.length; i++)
		{
			var pointer = pointers[i];
			
			var pointerX = pointer.x * this.board.gridSpacing;
			var pointerY = pointer.y * this.board.gridSpacing;

			can.beginPath();
			can.strokeStyle = pointer.c;
			can.lineWidth = this.style.pointerThickness;
			can.arc(pointerX, pointerY, this.style.pointerSize, 0, 2 * Math.PI);
			can.stroke();
		}
	}
}