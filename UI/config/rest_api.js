var host_url = "http://localhost:8081/ssnoc";

module.exports = {
  'get_all_users' : host_url + '/users',
  'is_password_valid' : host_url + '/user/',
  'get_user' : host_url + '/user/',
  'save_status' : host_url + '/status',
  'post_new_user' : host_url + '/user/signup',
  'get_Status' : host_url + '/status/',
  'send_private_message' : host_url + '/message/{sender}/{receiver}',
  'get_chat_buddies' : host_url + '/users/{user}/chatbuddies',
  'get_private_messages' : host_url + '/messages/{user1}/{user2}',
  'get_message' : host_url + '/message/{messageId}',
};
