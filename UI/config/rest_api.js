var host_url = "http://localhost:8080/ssnoc";

module.exports = {
  'get_all_users' : host_url + '/users',
  'is_password_valid' : host_url + '/user/',
  'get_user' : host_url + '/user/',
  'save_status' : host_url + '/user/',
  'post_new_user' : host_url + '/user/signup',
  'get_Status' : host_url + '/status/',
  'send_private_message' : host_url + '/message/{sender}/{receiver}',
  'get_chat_buddies' : host_url + '/users/{user}/chatbuddies',
  'get_private_messages' : host_url + '/messages/{user1}/{user2}',
  'get_message' : host_url + '/message/{messageId}',
  'save_public_message' : host_url + '/message/',
  'get_wall' : host_url + '/messages/wall',
  'get_pm' : host_url + '/messages/',
  'set_measure_performance_time' : host_url + '/test/start/',
  'measure_performance_post' : host_url + '/test/post/',
  'measure_performance_get' : host_url + '/test/get',
  'end_measure_performance' : host_url + '/test/end',
  'analyzing_network' : host_url + '/users/clusters/',
  
  'end_measure_performance' : host_url + '/test/end',
  'start_measure_memory' : host_url + '/memory/start',
  'save_measure_memory': host_url + '/memory/save',
  'end_measure_memory' : host_url + '/memory/end',
};
