var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});


sequelize.sync({
//	force: true
}).then(function() {
	console.log('Everything is synced.');
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


Todo.findById(5).then(function(todo){
	if (todo) {
		console.log(todo.toJSON());
	} else {
		console.log('Todo not found.')
	};
});

// Todo.create({
// 	description: 'Buy groceries',
// 	completed: false
// }).then(function(todo) {
// //	console.log('Walk the dog');
// 	console.log(todo);
// }).catch(function(e) {
// 	console.log(e);
// });

