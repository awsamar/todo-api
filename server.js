var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcrypt');


var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var nextTodoId = 1;

app.use(bodyParser.json());


//GET /
app.get('/', function(req, res) {
	res.send('Todo API Root');
});


//GET /todos?completed=true
app.get('/todos', function(req, res) {
	var query = req.query;
	var where = {};

	// filter for completed query parameter
	if (query.hasOwnProperty('completed')) {
		if (query.completed === 'true') {
			where.completed = true;
		} else if (query.completed === 'false') {
			where.completed = false;
		} else {
			res.status(400).send([{
				"error": "Completed attribute in query is bad"
			}]);
		};
	};

	//filter for q parameter value in description
	if (query.hasOwnProperty('q')) {
		if (query.q.length > 0) {
			where.description = {
				$like: '%' + query.q.toLowerCase() + '%'
			}
		} else {
			res.status(400).send([{"error": "q attribute in query is bad"}]);
		};
	};

	db.todo.findAll({where: where}).then(function(todos) {
		if (!!todos) {
			res.json(todos);
		} else {
			res.status(404).json('No todos found.');
		};
	}, function(e) {
		res.status(500).json(e);
	});
});






//GET todos/:id
app.get('/todos/:id', function(req, res) {
	var searchForId = parseInt(req.params.id, 10);

	db.todo.findById(searchForId).then(function(todo){
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).json('Todo with ID ' + searchForId + ' not found.');
		};
	}, function(e) {
		res.status(500).json(e);
	});

});

// POST /todos
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}, function(e) {
		res.status(400).json(e);
	});
});



//DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var searchForId = parseInt(req.params.id, 10);
	var where = {};
	where.id = searchForId;


	db.todo.destroy({where: where}).then(function(rowsDeleted) {
		if (rowsDeleted > 0) {
			res.status(204).send();
		} else {
			res.status(404).json('Todo with id=' + searchForId + ' not found.');
		};
	}, function(e) {
		res.status(500).json(e);
	});

});

//PUT /todos/:id
app.put('/todos/:id', function(req, res) {

	//first find the todo item for updating
	var searchForId = parseInt(req.params.id, 10);

	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	};

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	};

	db.todo.findById(searchForId).then(function(todo){
		if (todo) {
			todo.update(attributes).then(function(todo) {
				res.json(todo.toJSON());
			}, function(e){
				res.status(400).send(e);
			});
		} else {
			res.status(404).send();
		};
	}, function(e) {
		res.status(500).send();
	});
});


// POST /users
app.post('/users', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function(user) {
		res.json(user.toPublicJSON());
	}, function(e) {
		res.status(400).json(e);
	});
});

// POST /users/login
app.post('/users/login', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.authenticate(body).then(function(user) {
		res.json(user.toPublicJSON());
	}, function(){
		res.status(401).send();
	});

});




db.sequelize.sync({force: true}).then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});