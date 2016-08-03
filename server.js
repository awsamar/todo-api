var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var nextTodoId = 1;

app.use(bodyParser.json());


//GET /
app.get('/', function(req, res) {
	res.send('Todo API Root');
});


//GET /todos
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

// POST /todos
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

//PUT /todos/:id
app.put('/todos/:id', function(req, res) {

	//first find the todo item for updating
	var searchForId = parseInt(req.params.id, 10);
	var matchTodo = _.findWhere(todos, {id: searchForId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (!matchTodo) {
		return res.status(404).send([{"error": "Could not find todo item"}]);
	}	



	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		res.status(400).send([{"error": "Completed attribute is bad"}]);
	};

	if (body.hasOwnProperty('description') && _.isString(body.description) &&body.description.trim().length > 0) {
		validAttributes.description = body.description.trim();
	} else if (body.hasOwnProperty('description')) {
		res.status(400).send([{"error": "Description attribute is bad"}]);
//		res.status(400).send();

	};


	_.extend(matchTodo, validAttributes);

	res.json(matchTodo);
});



app.listen(PORT, function() {
	console.log('Express listening on port ' + PORT + '!');
});