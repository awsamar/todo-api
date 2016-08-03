var express = require('express');
var bodyParser = require('body-parser');
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
	var matchTodo = undefined;
	var currentId;
	var todosLength = todos.length;
	var i = 0;
	while (i < todosLength && !(matchTodo)) {
	console.log('i='+ i + ', todo[i].id=' + todos[i].id + 'searchForId=' + searchForId);
		if (todos[i].id === searchForId) {
			matchTodo = todos[i];
		};
		i++;
	};
	if (matchTodo) {
		res.json(matchTodo);
	} else {
		res.status(404).send();
	}

//	res.send('Requesting todo with id ' + req.params.id);
});


app.post('/todos', function(req, res) {
	var body = req.body;

	body.id = nextTodoId;
	nextTodoId++;
	todos.push(body);
	
	console.log('description' + body.description);
	res.json(body);
});


app.get('/', function(req, res) {
	res.send('Todo API Root');
});

app.listen(PORT, function() {
	console.log('Express listening on port ' + PORT + '!');
});