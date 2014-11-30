module.exports = function(_, io, participants, passport) {
  return {
    getVideoChat : function(req, res) {
      res.render("videoChat");
    },
  };
};
