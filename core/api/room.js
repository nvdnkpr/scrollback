var pool = require("../data.js");

module.exports = function(data, callback) {
	if (typeof data === "object") {
		pool.get(function(err, db) {
			if(err) return callback(err);
			
			db.query("INSERT INTO `rooms` SET `id`=?, `type`=?, `name`=?, `description`=?, `picture`=?, "+
			"`profile`=?, `createdOn`=NOW(), `owner`=?, `params`=?", [data.id, data.type || "room",
			data.name || "", data.description || "", data.picture || "", data.profile || "",
			data.owner|| data.id, data.params|| ""], function(err, data) {
				if(err)  return callback(err);
				
				db.end();
				console.log(err,data);
				if (callback) callback(err,data);
			});
		});
	}
	else {
		pool.get(function(err, db) {
			console.log(data);
			db.query("SELECT * FROM `rooms` WHERE `id`=? ", [data], function(err, room){
				if(err) return callback(err);
				db.query("SELECT * FROM `accounts` WHERE `room`=?", [data], function(err, accounts) {
					if(err) return callback(err);
					if(!room.accounts) room.accounts = [];
					
					db.end();
					if (callback) callback(err, room);
				});
			});
		});
	}
	
};