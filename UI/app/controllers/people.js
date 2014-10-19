module.exports = function(_, io, participants, passport) {
    return {
    getPeople: function(req, res) {
        res.render("monitor", {message: ""});
    }
    };
};