var AdminUser = require('../models/AdministerRest');
var name_of_user = null;

module.exports = function(_, io, participants, passport) {
    return {
	
    getAdministerResult: function(req, res) {
	    if(req.session.passport.user.user_role == 3){
		  res.render("administer", {message: ""});
	    }else{
		  res.render("trespass", {message: ""});
	    }
    },

	getUserProfileFn : function(req, res) {
        name_of_user = req.body.administerUserName;

        AdminUser.getUserProfile(name_of_user, function(err, user) {
	
          var userRole = null;
          if(user.local.role == 0){
	        userRole = "Citizen";
          }else if(user.local.role == 1){
	        userRole = "Co-ordinator";
          }else if(user.local.role == 2){
	        userRole = "Monitor";
          }else if(user.local.role == 3){
	        userRole = "Administrator";
          }
          
          res.render('administer', {
    	    userName: user.local.name,
    	    priviligeLevel: userRole,
            accountStatus: "Active",
	        password: '*Cannot Display Password*',
          } );
        });
    },

    changeUserNameFn : function (req, res, next) {
	    var changedUserName = req.body.changeUserName;
        AdminUser.changeUser(changedUserName, name_of_user, function(error, user) {
          if (error){
            next(error);
          } else {}
        });
        name_of_user = changedUserName;
        res.render('administer', {} );
    },

    changePrivilegeLevelFn : function (req, res, next) {
	    var changedPrivilegeLevel = req.body.changePrivilegeLevel;
        AdminUser.changePrivilegeLevel(changedPrivilegeLevel, name_of_user, function(error, user) {
          if (error){
            next(error);
          } else {}
        });
        res.render('administer', {} );
    },  

    changeAccountStatusFn : function (req, res, next) {
	    var changedAccountStatus = req.body.changeAccountStatus;
        AdminUser.changeAccountStatus(changedAccountStatus, name_of_user, function(error, user) {
          if (error){
            next(error);
          } else {}
        });
        res.render('administer', {} );
    },    

    changePasswordFn : function (req, res, next) {
	    var changedPassword = req.body.changePassword;
        AdminUser.changePassword(changedPassword, name_of_user, function(error, user) {
          if (error){
            next(error);
          } else {}
        });
        res.render('administer', {} );
    },    

    };
};