class Simulation
{
	targetFPS = 0;
	timeScale = 1;
	#prevDate = 0;
	#curDate = 0;
	#timeElapsed = 0;
	frames = 0;
	#lastFPS = 0;
	timeSinceStart = 0;
	gameObjects = [];
	#simulation;
	#renderClock;
	state = SimulationState.Stopped;

	constructor(fps = 24)
	{
		this.targetFPS = fps;	
	}

	get fixedDeltaTime()
	{
		return this.timeScale / this.targetFPS;
	}

	get deltaTime()
	{
		return this.#curDate - this.#prevDate;
	}

	AddObject(GO)
	{
		this.gameObjects.push(GO);
	}

	RemoveObject(GO)
	{
		let index = this.gameObjects.indexOf(GO);
		if(index > -1)
		{
			this.gameObjects.splice(index, 1);
		}
	}

	Start()
	{
		if(this.state == SimulationState.Stopped || this.state == SimulationState.Paused)
		{
			this.#simulation = setInterval(this.FixedUpdate.bind(this), this.timeScale / this.targetFPS * 1000);
			this.#renderClock = setInterval(this.Update.bind(this));
			this.state = SimulationState.Running;
		}
	}

	Stop()
	{
		if(this.state = SimulationState.Running)
		{
			clearInterval(this.#simulation);
			this.state = SimulationState.Paused;
		}
	}

	FixedUpdate()
	{
		//Для нормальной работы симуляции необходимо два прохода
		this.gameObjects.forEach(obj =>
			{
				//shape.UpdatePosition();
				obj.EarlyUpdate();
			});
		this.gameObjects.forEach(obj =>
			{
				//shape.SweepTest();
				obj.LateUpdate();
				obj.Draw();
			});
		
		renderer.Render();
	}

	Update()
	{
		this.#GetFPS();
		this.ShowFPS();
	}

	#GetFPS()
	{
		this.frames += 1;
		
		this.#curDate = Date.now();
		this.#timeElapsed += this.#curDate - this.#prevDate;
		
		if(this.#timeElapsed >= 1000)
		{
			this.#lastFPS = this.frames;
			this.frames = 0;
			this.#timeElapsed = 0;
		}
		this.timeSinceStart += this.#curDate - this.#prevDate;
		if(this.timeSinceStart > 1000000000) this.timeSinceStart = 0; //Понимаю))
		this.#prevDate = this.#curDate;

	}

	ShowFPS()
	{
		Renderer.ShowText(this.#lastFPS + " FPS", 2, 10);
	}
}

const SimulationState = { Running: 'running into 90s', Paused: 'what are you waiting for?', Stopped: 'Im sleppy-eppy'};