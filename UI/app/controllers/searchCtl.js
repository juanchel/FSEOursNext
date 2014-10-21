module.exports = function(_, io, participants, passport) {
    return {
    getSearchResults: function(req, res) {
        res.render("search", {message: ""});
    },
    postSearchInfo: function(req, res) {
      res.render("search", {message: ""});
  },
    };
};