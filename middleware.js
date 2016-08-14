var cryptojs = require('crypto-js');

module.exports = function(db) {

	return {
		requireAuthentication: function(req, res, next) {
			var token = req.get('Auth') || '';

			/* first check if the Auth token is still valid by searching for its hash
			in the token table
			*/
			db.token.findOne({ 
				where: {
					tokenHash: cryptojs.MD5(token).toString()
				}
			})
			.then(function(tokenInstance) {
				//if the token is not valid, error out
				if (!tokenInstance) {
					throw new error;
				}

				//if valid token, find and return user for whom token was created
				req.token = tokenInstance;
				return db.user.findByToken(token);
			})
			.then(function(foundUser) {
				req.user = foundUser;
				next();
			})
			.catch(function() {
				res.status(401).send();
			});

			// db.user.findByToken(token).then(function(user) {
			// 	req.user = user;
			// 	next();
			// }, function() {
			// 	// console.log('findByToken returned 401 in middleware.js');
			// 	res.status(401).send();
			// });
		}
	};

};