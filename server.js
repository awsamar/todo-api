var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
	id: 1,
	description: 'made dinner',
	completed: false
}, {
	id: 2,
	description: 'get groceries',
	completed: false
}, {
	id: 3,
	description: 'walk the dog',
	completed: true
}];

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

	// todos.forEach(function(todo) {
	// 	console.log(todo.id);

	// 	if (todo.id === searchForId) {
	// 		matchId = todo;
	// 	};
	// });

	if (matchTodo) {
		res.json(matchTodo);
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