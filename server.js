var express = require('express');
var bodyParser = require('body-parser')

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
todosNextId = 1;

app.use(bodyParser.json());




app.get('/', function (req,res) {
	res.send('ToDo APT Root');
});

app.get('/todos', function (req, res) {
	res.json(todos); //<-- like strigify
});

app.get('/todos/:id', function (req, res) {
	todoID = parseInt(req.params.id, 10);
	var matchedToDo;
	todos.forEach(function (todo) {
		if (todoID === todo.id) {
		matchedToDo = todo;	
		}
	});

	if (matchedToDo) {
		res.json(matchedToDo);
	} else {
		res.status(404).send();
	}
});

// POST /todos/
app.post('/todos', function (req,res){
	var body =req.body;
	// add id field to body
	// push body into todos array
	body.id = todosNextId;
	
	todos.push(body);

	res.json(body);

	todosNextId += 1;

});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT);
});