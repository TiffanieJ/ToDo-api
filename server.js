var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
todosNextId = 1;
console.log('hi');

app.use(bodyParser.json());

app.get('/', function (req,res) {
	res.send('ToDo APT Root');
});
// GET /todos?completed=true&q=house
//  (?foo=true) <-- query param ==foo
app.get('/todos', function (req, res) {
	var queryParms = req.query; //<-- creates query param (?param)
	var filteredTodos = todos; // <-- array

	//Searches through query paramaters and return obj with requested comlpeted value
	if (queryParms.hasOwnProperty('completed') && queryParms.completed 
	 	 === 'true') {
	 	 filteredTodos = _.where(filteredTodos, {completed:true});
	} else if (queryParms.hasOwnProperty('completed') && queryParms.completed 
	  === 'false') {
	 	 filteredTodos = _.where(filteredTodos, {completed:false});
	}

	//Searches through query paramaters and return obj with requested completed value
	if (queryParms.hasOwnProperty('q') && queryParms.q.length > 0)
	 {
	 	 filteredTodos = _.filter(filteredTodos, function (todo) { 
	 	 	return todo.description.toLowerCase().indexOf(queryParms.q.toLowerCase()) > -1;
	 	 });
	} 


	res.json(filteredTodos); 
});

app.get('/todos/:id', function (req, res) {
	todoID = parseInt(req.params.id, 10);
	var matchedToDo = _.findWhere(todos, {id: todoID});

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
	var todoID = parseInt(req.params.id, 10); // req.params stores url paramaters
	var matchedToDo = _.findWhere(todos, {id: todoID});
	
	if (!matchedToDo) {
		 res.status(404).send("no todo found");
	} else {
		todos = _.without(todos, matchedToDo);
		res.json(matchedToDo);
	}
});

//PUT /todos/:id
app.put('/todos/:id', function (req,res) {
	
	var todoID = parseInt(req.params.id, 10);
	var matchedToDo = _.findWhere(todos, {id: todoID});
	var body = _.pick(req.body,'description', 'completed');
	var validAttributes = {};

	if (!matchedToDo) {
		 return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	} 

	if (body.hasOwnProperty('description') && _.isString(body.description) &&
	    body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	} 

	

	_.extend(matchedToDo,validAttributes);
	res.json(matchedToDo);


	
});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT);
});