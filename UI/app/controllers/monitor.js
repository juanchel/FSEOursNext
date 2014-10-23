module.exports = function(_, io, participants, passport) {
    return {
    getResult: function(req, res) {
        res.render("monitor", {message: ""});
    }
    };
};