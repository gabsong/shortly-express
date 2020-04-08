const models = require('../models');
const Promise = require('bluebird');
const _ = require('lodash');

module.exports.createSession = (req, res, next) => {
  req.session = {};
  const { cookies } = req;

  if (!_.isEmpty(cookies)) {
    const { shortlyid } = cookies;

    // verify that the cookie is valid (stored in db)
    models.Sessions.get({ hash: shortlyid })
      .then((session) => {
        if (session && session.hash === shortlyid) {
          // cookie is valid, store existing hash in session
          req.session.hash = session.hash;
        } else {
          // session does not exist or cookie is NOT valid
          res.clearCookie('shortlyid');

          // res.redirect('/login'); // does not work
          // Error [ERR_HTTP_HEADERS_SENT]:
          // Cannot set headers after they are sent to the client
        }
        return;
      })
      .then(() => next())
      .catch((error) => console.log(error));
  } else {
    // generate a session w/ unique hash -> store in DB
    // console.log('QQQQQQQQQ', req);
    // console.log('SSSSSSSSS', res);
    models.Sessions.create()
      .then((data) => data.insertId)
      .then((id) => models.Sessions.get({ id }))
      .then((session) => {
        req.session.hash = session.hash;
        res.cookie('shortlyid', session.hash);
      })
      .then(() => next())
      .catch((error) => console.log(error));
  }
  // look up username and userId related to this session
  // update the session object
  // update the session in the database record
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

