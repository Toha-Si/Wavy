class SimulationObject
{
	position;
	isKinematic = false;
	constructor(pos = Vector2.zero)
	{
		this.position = pos;
	}

	set worldPosition(value)
	{
		if(value != undefined)
		this.position = value;
	}

	get worldPosition()
	{
		return this.position;
	}

	RequestDraw()
	{

	}
}

class Cell extends SimulationObject
{
	_ind = 0;
	_color = [0, 0, 0, 255];
	_speed;
	_dampening = 0.995;
	_avgs;
	_heights;
	_vels;
	_neighbours = []; //По какой-то причине не работает, если оставить без значения(((
	RGB_Shift;
	_cellType;

	linkedInverseCount = 0;
	
	constructor(pos = Vector2.zero, ind = 0, cellType = CELL_TYPE.Standart)
	{
		super(pos);
		this.Index = ind;
		this.CellType = cellType;

		switch(this.CellType)
		{
			case CELL_TYPE.Standart:
				this.RGB_Shift = [0, 0, 0];
				this.Speed = [1];
				this.Average = [0, 0, 0];
				this.Height = [0];
				this.Velocity = [0];
			break;

			case CELL_TYPE.Light:
				this.RGB_Shift = [-0.08, 0.0, 0.04];
				this.Speed = [1, 1, 1];
				this.Average = [0, 0, 0];
				this.Height = [0, 0, 0];
				this.Velocity = [0, 0, 0];
			break;
		}
		simulation.AddObject(this);
	}

	set Height(value)
	{
		switch(typeof value)
		{
			case "number":
				for(let i = 0; i < this._heights.length; i++)
				{
					this._heights[i] = value;
					//this._heights.forEach(h => h = value);
				}
			break;

			case "object":
				if(Array.isArray(value))
				{
					this._heights = value;
				}
				else
				{
					console.log("Height поддерживает только числа и массивы в качестве аргумента");
				}
			break;

			default:
				console.log("Height поддерживает только числа и массивы в качестве аргумента");
			break;
		}
	}

	get Height()
	{
		return this._heights;
	}
	
	set Velocity(value)
	{
		switch(typeof value)
		{
			case "number":
				this._vels.forEach(v => v = value);
			break;

			case "object":
				if(Array.isArray(value))
				{
					this._vels = value;
				}
				else
				{
					console.log("Velocity поддерживает только числа и массивы в качестве аргумента");
				}
			break;

			default:
				console.log("Velocity поддерживает только числа и массивы в качестве аргумента");
			break;
		}
	}

	get Velocity()
	{
		return this._vels;
	}

	set Color(value)
	{
		switch(typeof value)
		{
			case "number":
				this._color[3] = value;
			break;

			case "object":
				if(Array.isArray(value))
				{
					this._color = value;
				}
				else
				{
					console.log("Color поддерживает только числа и массивы в качестве аргумента");
				}
			break;

			default:
				console.log("Color поддерживает только числа и массивы в качестве аргумента");
			break;
		}
	}

	get Color()
	{
		return this._color;
	}
	
	set Average(value)
	{
		switch(typeof value)
		{
			case "number":
				this._avgs.forEach(avg => avg = value);
			break;

			case "object":
				if(Array.isArray(value))
				{
					this._avgs = value;
				}
				else
				{
					console.warn("Average поддерживает только числа и массивы в качестве аргумента");
				}
			break;

			default:
				console.warn("Average поддерживает только числа и массивы в качестве аргумента");
			break;
		}
	}

	get Average()
	{
		return this._avgs;
	}

	set LinkedCells(value)
	{
		switch(typeof value)
		{
			case "object":
				if(Array.isArray(value))
				{
					this._neighbours = value;
					this.linkedInverseCount = 1 / this._neighbours.length;
				}
				else
				{
					console.warn("LinkedCells поддерживает только числа и массивы в качестве аргумента");
				}
			break;

			default:
				console.log("Neighbours поддерживает только массивы в качестве аргумента");
			break;
		}
	}

	get LinkedCells()
	{
		return this._neighbours;
	}

	set CellType(value)
	{
		this._cellType = value;
	}

	get CellType()
	{
		return this._cellType;
	}

	set Index(value)
	{
		value = Math.max(0, value);
		this._ind = value;
	}

	get Index()
	{
		return this._ind;
	}

	set Speed(value) //Скорость звука
	{
		switch(typeof value)
		{
			case "number":
				for(let i = 0; i < this._speed.length; i++)
				{
					let m = value < 0.04 ? 0 : value - this.RGB_Shift[i];
					this._speed[i] = m;
				}
			break;

			case "object":
				if(Array.isArray(value))
				{
					this._speed = value;
					for(let i = 0; i < this._speed.length; i++)
					{
						let m = Math.max(0, value[i] - this.RGB_Shift[i]);
						this._speed[i] = m;
					}
				}
				else
				{
					console.warn("Speed поддерживает только числа и массивы в качестве аргумента");
				}
			break;

			default:
				console.log("Speed поддерживает только числа и массивы в качестве аргумента");
			break;
		}
	}

	get Speed()
	{
		return this._speed;
	}

	Clear()
	{
		this.Velocity = 0;
		this.Height = 0;
		this.Average = 0;
	}

	EarlyUpdate()
	{	
		for(let i = 0; i < this.Height.length; i++)
		{
			this.Height[i] += this.Velocity[i];
			this.Average[i] += Math.abs(this.Height[i] * 0.0008 * (this.Average[i] + 0.2));
		}
	}

	LateUpdate()
	{
		if(this.LinkedCells.length == 0) return;
		for(let i = 0; i < this.Height.length; i++)
		{
			let sum = 0;
			this.LinkedCells.forEach(n => sum += n.Height[i]);
			let avgHeight = sum * this.linkedInverseCount;
			this.Velocity[i] += (avgHeight - this.Height[i]) * this.Speed[i];
			this.Velocity[i] *= this._dampening;
		}
	}

	Draw()
	{	
		let source = renderer.renderMode == RENDER_MODE.Current ? this.Height : this.Average;
        for(let i = 0; i < 3; i++)
        {
        	renderer.bufferData[this.Index + i] =
        	 Math.pow(Math.min(source[i * this.CellType] + 0.3, 1), 2) * 255;
        }
        renderer.bufferData[this.Index + 3] = this.Color[3];
	}
}

class Shape extends SimulationObject
{
	constructor(pos)
	{
		super(pos);
		simulation.AddObject(this);
	}
}

class Circle extends Shape
{
	radius;
	shapeMode;
	lifetime = 1;
	speed;
	color;
	constructor(pos, radius, shapeMode, lifetime, speed = 1, color = 200)
	{
		super(pos);
		this.radius = radius;
		this.speed = speed;
		this.color = color;
		this.shapeMode = shapeMode;
		this.lifetime = lifetime;

		if(this.shapeMode == SHAPE_MODE.Obstacle)
		{
			for(let i = 0; i < renderer.width; i++)
			{
				for(let j = 0; j < renderer.height; j++)
				{
					if(Math.sqrt((i - this.position.x) ** 2 + (j - this.position.y) ** 2) < this.radius*this.radius) 
					{
						grid[i][j].Color = this.color;
						grid[i][j].Speed = this.speed;
					}
				}
			}
		}
	}

	StampHeight(x, y, height)
	{
		for(let i = x - this.radius; i < x + this.radius; i++)
		{
			for(let j = y - this.radius; j < y + this.radius; j++)
			{
				if(Math.sqrt((i - x) ** 2 + (j - y) ** 2) < this.radius*this.radius) 
				{
					grid[i][j].Height = height;
				}
			}
		}
	}

	StampObstacle(x, y, speed)
	{
		for(let i = 0; i < renderer.width; i++)
		{
			for(let j = 0; j < renderer.height; j++)
			{
				if(Math.sqrt((i - x) ** 2 + (j - y) ** 2) < this.radius*this.radius) 
				{

					grid[i][j].speed = speed;
				}
			}
		}
	}
	EarlyUpdate()
	{
		if(this.shapeMode == SHAPE_MODE.Obstacle || simulation.timeSinceStart/1000 > this.lifetime) return;
		//this.StampHeight(this.position.x, this.position.y, Math.sin(-simulation.timeSinceStart*0.01 + i)*5);
		for(let i = 0; i < renderer.width; i++)
		{
			for(let j = 0; j < renderer.height; j++)
			{
				if(Math.sqrt((i - this.position.x) ** 2 + (j - this.position.y) ** 2) < this.radius*this.radius) 
				{
					grid[i][j].Height = Math.sin(-simulation.timeSinceStart*0.01 + i)*5;
				}
			}
		}
	}

	LateUpdate()
	{

	}

	Draw()
	{

	}
}

class Triangle extends Shape
{
	scale;
	shapeMode;
	lifetime = 1;
	speed = 1;
	color = 200;

	constructor(pos, scale, shapeMode, lifetime, speed = 1, color = 200)
	{
		super(pos);
		this.scale = scale;
		this.speed = speed;
		this.color = color;
		this.shapeMode = shapeMode;
		this.lifetime = lifetime;

		if(this.shapeMode == SHAPE_MODE.Obstacle)
		{
			for(let i = pos.x; i < pos.x + scale.x; i++)
			{
				let y = Math.max(0, pos.y - (i - pos.x)*scale.y);
				for(let j = pos.y; j > y; j--)
				{
					grid[i][j].Color = this.color;
					grid[i][j].Speed = this.speed;
					
					grid[2*(pos.x + scale.x) - i - 1][j].Color = this.color;
					grid[2*(pos.x + scale.x) - i - 1][j].Mass = this.speed;
				}
			}
		}
	}


	EarlyUpdate()
	{
		if(this.shapeMode == SHAPE_MODE.Obstacle || simulation.timeSinceStart/1000 > this.lifetime) return;

		for(let i = this.position.x; i < this.position.x + this.scale.x; i++)
			{
				for(let j = this.position.y; j < this.position.y + (i - this.position.x)*this.scale.y; j++)
				{
					grid[i][j].Height = Math.sin(-simulation.timeSinceStart*0.01 + i) * 5;
					grid[2*(this.position.x + this.scale.x) - i - 1][j].Height = Math.sin(-simulation.timeSinceStart*0.01 + i) * 5;
				}
			}
	}

	LateUpdate()
	{

	}

	Draw()
	{

	}
}