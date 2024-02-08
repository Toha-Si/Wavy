class Vector2
{
	x;
	y;

	static zero = new Vector2(0, 0);
	static up = new Vector2(0, 1);
	static right = new Vector2(1, 0);
	static one = new Vector2(1, 1);

	constructor(x = 0, y = 0)
	{
		this.x = x;
		this.y = y;
	}

	get length()
	{
		return this.#CalculateLength();
	}

	get sqrLength()
	{
		return Vector2.Dot(this, this);
	}

	get normalized()
	{
		let length = this.length;

		return (length == 0) ? Vector2.zero : new Vector2(this.x / length, this.y / length);
	}

	get reverted()
	{
		return new Vector2(-this.x, -this.y);
	}

	//Приватная функция ради приватной функции, продолжаем изучать возможности JS)
	#CalculateLength()
	{
		return Math.sqrt(Vector2.Dot(this, this));
	}
	//Вспоминаю, что проходил на линале
	static Dot(v1, v2)
	{
		return v1.x * v2.x + v1.y * v2.y;
	}

	static Sum(...vectors)
	{
		let x = 0;
		let y = 0;
		vectors.forEach(v =>
		{
			x += v.x;
			y += v.y;
		});
		return new Vector2(x, y);
	}
	static Substraction(...vectors)
	{
		let x = 2*vectors[0].x;
		let y = 2*vectors[0].y;
		vectors.forEach(v =>
		{
			x -= v.x;
			y -= v.y;
		});
		return new Vector2(x, y);
	}
	static Substract(v1, v2)
	{
		return new Vector2(v1.x - v2.x, v1.y - v2.y);
	}

	static Scale(v, num)
	{
		return new Vector2(v.x * num, v.y * num);
	}

	static Rotate(v, angle) //Не работает адекватно в некоторых случаях
	{
		let length = v.length;
		let axisAngle = Vector2.Angle(v, Vector2.right);
		return new Vector2(length * Math.cos(angle + axisAngle), length * Math.sin(angle + axisAngle));
	}

	static Angle(v1, v2) //Возвращает угол между векторами в радианах
	{
		return Math.acos((Vector2.Dot(v1, v2)) / (v1.length * v2.length));
	}

	static Project(v, to)
	{
		let length = Vector2.Dot(v, to);
		//console.log(length, v.x, v.y, to.x, to.y);
		return Vector2.Scale(to, length);
	}

	static Reflect(v, normal)
	{
		let projectOnNormal = Vector2.Project(v, normal);
		return Vector2.Substraction(v, projectOnNormal, projectOnNormal);
	}

	static Lerp(v1, v2, alpha) //v1=start, v2=end, alpha=0 => start, alpha=1 => end, alpha = 0.5 => start/2 + end/2
	{
		return new Vector2(v1.x*(1-alpha) + v2.x*alpha, v1.y*(1-alpha)+v2.y*alpha);
	}
}