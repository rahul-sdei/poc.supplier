Meteor.startup(() => {
  let smtp = {
    username: 'atorvia12@gmail.com',
    password: 'Atorvia@123',
    server: 'smtp.gmail.com',
    port: 465
  };

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':'
  + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':'
  + smtp.port;

  Accounts.emailTemplates.resetPassword.html = function(user, url) {
    let myToken = user.services.password.reset.token;
    let url2 = `${process.env.ROOT_URL}/reset-password/${myToken}`;
    return `<h3>Change Password Request.</h3><br/>
      <p>To reset your password click the link below.
      <p><a href="${url2}">${url2}</a></p>
      <p>Team Atorvia</p>`;
  };

  Accounts.emailTemplates.verifyEmail.html = function(user, url) {
    let myToken = user.services.email.verificationTokens[0].token;
    let url2 = `${process.env.ROOT_URL}/verify-email/${myToken}`;
    return `<h3>Thank you for your registration.</h3><br/>
      <p>To verify your email click the link below.
      <p><a href="${url2}">${url2}</a></p>
      <p>Team Atorvia</p>`;
  };

});
