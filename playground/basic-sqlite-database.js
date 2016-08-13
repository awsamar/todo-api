var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});



var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 256]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

var User = sequelize.define('user', {
	email: Sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo);



sequelize.sync({
//	force: true
}).then(function() {
	console.log('Everything is synced.');

	User.findById(2).then(function(user) {
		user.getTodos({where: {completed: false}}).then(function(todos) {
			todos.forEach(function(todo) {
				console.log(todo.toJSON());
			});

		});
	});


	// User.create({
	// 	email: 'amar.panchal@outlook.com'
	// }).then(function (retUser) {
	// 	return Todo.create({
	// 		description: 'Walk the cat'
	// 	}).then(function(retTodo) {
	// 		retUser.addTodo(retTodo);
	// 	});
	// });
});



// Todo.findById(5).then(function(todo){
// 	if (todo) {
// 		console.log(todo.toJSON());
// 	} else {
// 		console.log('Todo not found.')
// 	};
// });

