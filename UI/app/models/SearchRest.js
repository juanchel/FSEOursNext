var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');
var utils = require("../utils");
var User = require("./UserRest");
var PrivateMessage = require("./PrivateMessage");
