var host_url = "http://localhost:8081/ssnoc";

module.exports = {
  'get_all_users' : host_url + '/users',
  'is_password_valid' : host_url + '/user/',
  'get_user' : host_url + '/user/',
  'save_status' : host_url + '/user/status',
  'post_new_user' : host_url + '/user/signup',
  'get_Status' : host_url + '/status/',
};
