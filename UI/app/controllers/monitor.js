module.exports = function(_, io, participants, passport) {
    return {
    getResult: function(req, res) {
	    if(req.session.passport.user.user_role == 2 || req.session.passport.user.user_role == 3){
		  res.render("monitor", {message: ""});
	    }
    }
    };
};