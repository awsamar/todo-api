module.exports = function(db) {

	return {
		requireAuthentication: function(req, res, next) {
			var token = req.get('Auth');

			db.user.findByToken(token).then(function(user) {
				req.user = user;
				next();
			}, function() {
				// console.log('findByToken returned 401 in middleware.js');
				res.status(401).send();
			});
		}
	};

};