var host_url = "http://localhost:8080/ssnoc";

module.exports = {
  'get_all_users' : host_url + '/users',
  'is_password_valid' : host_url + '/user/',
  'get_user' : host_url + '/user/',
  'save_status' : host_url + '/user/',
  'post_new_user' : host_url + '/user/signup',
  'save_public_message' : host_url + '/message/',
  'get_wall' : host_url + '/messages/wall',
  'get_pm' : host_url + '/messages/',
  'set_measure_performance_time' : host_url + '/test/start/',
  'measure_performance_post' : host_url + '/test/post/'
};
