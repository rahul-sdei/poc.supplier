Meteor.startup(() => {
  smtp = {
    username: 'atorvia12@gmail.com',
    password: 'Atorvia@123',
    server: 'smtp.gmail.com',
    port: 465
  };
  Accounts.emailTemplates.resetPassword.html = function(user, url) {
    let myToken = user.services.password.reset.token;
    let url = `http://localhost:8081/reset-password/${myToken}`;
    return `<h1>Change Password Request.</h1><br/>
      <p>To reset your password click the link below.
      <p><a href="${url}">${url}</a></p>
      <p>Team Atorvia</p>`;
  };
  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':'
  + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':'
  + smtp.port;

  Accounts.emailTemplates.verifyEmail.html = function(user, url) {
    let myToken = user.services.email.verificationTokens[0].token;
    let url = `http://localhost:8081/verify-email/${myToken}`;
    return `<h1>Thank you for your registration.</h1><br/>
      <p>To verify your email click the link below.
      <p><a href="${url}">${url}</a></p>
      <p>Team Atorvia</p>`;
  };

});
