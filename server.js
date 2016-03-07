var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
todosNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req,res) {
	res.send('ToDo APT Root');
});
// GET /todos
app.get('/todos', function (req, res) {
	res.json(todos); //<-- like strigify
});

app.get('/todos/:id', function (req, res) {
	todoID = parseInt(req.params.id, 10);
	var matchedToDo = _.findWhere(todos, {id: todoID});
	
	/* var matchedToDo; <-- REPLACED WITH _.findWhere
	// todos.forEach(function (todo) {
	// 	if (todoID === todo.id) {
	// 	matchedToDo = todo;	
	// 	}
	}); */ 

	if (matchedToDo) {
		res.json(matchedToDo);
	} else {
		res.status(404).send();
	}
});

// POST /todos/
app.post('/todos', function (req,res) {
	//data sanitization
	var body = _.pick(req.body,'description', 'completed');
	body.description = body.description.trim();
	//data validation
	if (!_.isBoolean(body.completed) || !_.isString(body.description) ||
	    body.description.length === 0) {
	 	return res.status(400).send();
	}
	
	body.id = todosNextId;
	todos.push(body);
	res.json(body);
	todosNextId += 1;

});

// DELETE /todos/:id

app.delete('/todos/:id', function (req,res) {
	var todoID = parseInt(req.params.id, 10);
	var matchedToDo = _.findWhere(todos, {id: todoID});
	
	if (!matchedToDo) {
		 res.status(404).send("no todo found");
	} else {
		todos = _.without(todos, matchedToDo);
		res.json(matchedToDo);
	}
});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT);
});