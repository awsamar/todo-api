var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var nextTodoId = 1;

app.use(bodyParser.json());

//GET todos
app.get('/todos', function(req, res) {
	res.json(todos);
});


//GET todos/:id
app.get('/todos/:id', function(req, res) {
	var searchForId = parseInt(req.params.id, 10);
	var matchTodo = _.findWhere(todos, {id: searchForId});

	if (matchTodo) {
		res.json(matchTodo);
	} else {
		res.status(404).send();
	}

//	res.send('Requesting todo with id ' + req.params.id);
});

// POST /todos/:id
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');


	if (!_.isBoolean(body.completed) || !_.isString(body.description) || (body.description.trim().length === 0)) {
		return res.status(400).send();
	};

	body.description = body.description.trim();
	body.id = nextTodoId;
	nextTodoId++;
	todos.push(body);

	res.json(body);
});

//DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var searchForId = parseInt(req.params.id, 10);
	var matchTodo = _.findWhere(todos, {id: searchForId});

	if (matchTodo) {
		todos = _.without(todos, matchTodo);
		res.status(200).json(matchTodo);
	} else {
		res.status(404).send();
	}

//	res.send('Requesting todo with id ' + req.params.id);
});


app.get('/', function(req, res) {
	res.send('Todo API Root');
});

app.listen(PORT, function() {
	console.log('Express listening on port ' + PORT + '!');
});