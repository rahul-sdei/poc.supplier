Meteor.startup(() => {
  smtp = {
    username: 'atorvia12@gmail.com',
    password: 'Atorvia@123',
    server: 'smtp.gmail.com',
    port: 465
  };
  Accounts.emailTemplates.resetPassword.text = function(user, url) {
    let myToken = user.services.password.reset.token;
    return "http://" + "localhost:8081/reset-password/" + myToken;
  };
  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':'
  + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':'
  + smtp.port;

});
