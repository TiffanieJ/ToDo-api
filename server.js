var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

//the todo is our model, we can multiple 
//a set of todos or todo items is called a collection
var todos = [
{
	id: 1,
	description: 'Meet mom for lunch',
	completed: false
},
{
	id:2,
	description: 'go to market',
	completed: false
},
{
	id:3,
	description: 'wash clothes',
	completed: true

}];

app.get('/', function (req,res) {
	res.send('ToDo APT Root');
});

app.get('/todos', function (req, res) {
	res.json(todos); //<-- like strigify
});

app.get('/todos/:id', function (req, res) {
	todoID = parseInt(req.params.id, 10);
	
	//itterate over todos arry for match
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
	
	
	

		
		
	//if match found call response.json(todoID)
	//if no match send 404: no match found
	
	
});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT);
});

