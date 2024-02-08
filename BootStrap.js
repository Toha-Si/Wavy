'use strict';
const CELL_TYPE = { Standart: 0, Light: 1};
const RENDER_MODE = { Current: 0, Accumulated: 1};
const SHAPE_MODE = { Obstacle: 0, Source: 1}
window.addEventListener('load', BootStrap);

var renderer;
var simulation;

var grid = [];
var canvas;
var	ctx;

var clr;
var cur;
var avg;

function BootStrap()
{
	clr = document.getElementById('clear');
	cur = document.getElementById('current');
	avg = document.getElementById('average');

	clr.addEventListener('click', Clear);

	cur.addEventListener('click', ChooseRenderMode);
	avg.addEventListener('click', ChooseRenderMode);

	canvas = document.getElementById("canv");
	ctx =  this.canvas.getContext("2d");
	simulation = new Simulation();
	renderer = new Renderer();
	
	//Создаем поле из элементов пространства
	for(let i = 0; i < renderer.width; i++)
	{
		let row = [];
		for(let j = 0; j < renderer.height; j++)
		{
			let gridElem = new Cell(new Vector2(i, j), (i+j*renderer.width)*4, CELL_TYPE.Standart);
			row.push(gridElem);
		}
		grid.push(row);
	}

	for(let i = 1; i < renderer.width - 1; i++)
	{
		for(let j = 1; j < renderer.height - 1; j++)
		{
			grid[i][j].LinkedCells = [grid[i-1][j], grid[i+1][j], grid[i][j-1], grid[i][j+1]];
		}
	}
	//let circle1 = new Circle(new Vector2(80, 135), 5, SHAPE_MODE.Source, 10, 0.75, 200)
	let circle2 = new Circle(new Vector2(renderer.width/2, renderer.height/2), 10, SHAPE_MODE.Obstacle, 5, 0.85, 200)	
	let tri = new Triangle(new Vector2(120, 275), new Vector2(80, 3), SHAPE_MODE.Obstacle, 5, 0.25, 200)
	simulation.Start();
}

function Clear()
{
	for(let i = 0; i < renderer.width; i++)
	{
		for(let j = 0; j < renderer.height; j++)
		{
			grid[i][j].Clear();
		}
	}
}

function ChooseRenderMode(e)
{
	if(e.target == cur)
	{
		renderer.renderMode = RENDER_MODE.Current;
	}
	else
	{
		renderer.renderMode = RENDER_MODE.Accumulated;
	}
}