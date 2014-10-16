module.exports = {
    formatTimestamp : function(timestamp) {
      var year = timestamp.getFullYear();
      var month = timestamp.getMonth() + 1;
      var date = timestamp.getDate();
      var hour = timestamp.getHours();
      var minute = timestamp.getMinutes();
      
      if (month < 10) {
        month = "0" + month;
      }
      
      if (date < 10) {
        date = "0" + date;
      }
      
      if (hour < 10) {
        hour = "0" + hour;
      }
      
      if (minute < 10) {
        minute = '0' + minute;
      }
      
      return year + "-" + month + "-" + date + " " + hour + ":" + minute;
    },
};

