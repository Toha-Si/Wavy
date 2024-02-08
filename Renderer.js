class Renderer
{	
	renderMode = RENDER_MODE.Accumulated;
	iteration = 0;
	buffer;
	bufferData;
	canvas;
	ctx;
	isPressed = false;
	currentMouseButton = 0;
	width;
	height;
	brush;
	constructor()
	{
		this.width = canvas.width;
		this.height = canvas.height;
		this.buffer = ctx.createImageData(canvas.width, canvas.height);
		this.bufferData = this.buffer.data;
		this.brush = new Circle(new Vector2(0, 0), 2, SHAPE_MODE.Source, 0, 1, 255);
		canvas.onmousedown = (e) => 
		{
			this.isPressed = true;
			this.currentMouseButton = e.button;
		}
		canvas.onmouseup = (e) => 
		{
			this.isPressed = false;
			this.currentMouseButton = undefined;
		} 
		canvas.onmousemove = (e) => 
		{
	        var x = e.offsetX;
	        var y = e.offsetY;
	        var dx = e.movementX;
	        var dy = e.movementY;
	        if (this.isPressed) 
	        { 
	        	switch(this.currentMouseButton)
						{
							case 0:
								this.brush.StampHeight(x, y, 5);
							break;
							case 2:
							 	new Circle(new Vector2(x, y), 2, SHAPE_MODE.Obstacle, 20, 0, 190)
								//grid[i][j].Clear();
								//grid[i][j].Mass = 0;
								//grid[i][j].Color = 190;
							break;
						default:
	      					console.log(`Unknown button code: ${currentMouseButton}`);
						}
	        	/*	
		  		for(let i = x-2; i < x+2; i++)
				{
					for(let j = y-2; j < y+2; j++)
					{
						switch(this.currentMouseButton)
						{
							case 0:
								let h = grid[i][j].Mass[0] == 0 ? 0 : 3;
								grid[i][j].Height = h;
							break;
							case 2:
								grid[i][j].Clear();
								grid[i][j].Mass = 0;
								grid[i][j].Color = 190;
							break;
						default:
	      					console.log(`Unknown button code: ${currentMouseButton}`);
						}
					}
				}
				*/
	      	}
	    };
	}

	Render()
	{
		Renderer.Clear();
		ctx.putImageData(this.buffer, 0, 0);
	}

	static Clear()
	{
		ctx.clearRect(0, 0, this.width, this.height);
	}
	
	static DrawRay(start, direction, length)
	{
		ctx.beginPath();

		let sX = this.TransformToCanvasSpaceX(start.x);
		let sY = this.TransformToCanvasSpaceY(start.y);
		let eX = this.TransformToCanvasSpaceX(start.x + direction.x * length);
		let eY = this.TransformToCanvasSpaceY(start.y + direction.y * length);

		ctx.moveTo(sX, sY);
		ctx.lineTo(eX, eY);

		ctx.stroke();
		ctx.closePath();
	}

	static DrawLine(start, end)
	{
		ctx.beginPath();

		let sX = this.TransformToCanvasSpaceX(start.x);
		let sY = this.TransformToCanvasSpaceY(start.y);
		let eX = this.TransformToCanvasSpaceX(end.x);
		let eY = this.TransformToCanvasSpaceY(end.y);

		ctx.moveTo(sX, sY);
		ctx.lineTo(eX, eY);

		ctx.stroke();
		ctx.closePath();
	}
	static DrawPixel(pos, color)
	{
		ctx.fillStyle = color;
		ctx.fillRect(pos.x, pos.y, 1, 1);
	}
	static ShowTextWorld(text, pos)
	{
		let X = this.TransformToCanvasSpaceX(pos.x);
		let Y = this.TransformToCanvasSpaceY(pos.y);
		ctx.strokeText(text, X, Y);
	}

	static ShowText(text, X, Y)
	{
		ctx.strokeStyle = '#ffffff';
		ctx.strokeText(text, X, Y);
	}

	static DrawCircle(pos, radius = 1)
	{
		ctx.beginPath();
		let X = this.TransformToCanvasSpaceX(pos.x);
		let Y = this.TransformToCanvasSpaceY(pos.y);
		ctx.arc(X, Y, radius / camera.scale * standartLength, 0, 2 * Math.PI);

		ctx.stroke();
		ctx.closePath();
	}

	static DrawCircleColoured(pos, radius = 1, color)
	{
		ctx.beginPath();
		let X = this.TransformToCanvasSpaceX(pos.x);
		let Y = this.TransformToCanvasSpaceY(pos.y);
		ctx.arc(X, Y, radius / camera.scale * standartLength, 0, 2 * Math.PI);
		ctx.strokeStyle = color;
		ctx.stroke();
		ctx.closePath();
		ctx.strokeStyle = 'black';
	}
}