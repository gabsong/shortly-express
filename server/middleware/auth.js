const models = require('../models');
const Promise = require('bluebird');
const _ = require('lodash');

module.exports.createSession = (req, res, next) => {
  Promise.resolve(req.cookies)
    .then((cookies) => {
      if (_.isEmpty(cookies)) {
        // Case 1: Has NO cookies (i.e. fresh user login)
        throw cookies;
      }
      // Case 2: Has cookies
      const { shortlyid } = cookies; // shortlyid === cookie key in tests
      return models.Sessions.get({ hash: shortlyid });
    })
    .then((session) => {
      if (!session) {
        // Case 3: Has NO session
        throw session;
      }

      // Case 4: Has session (i.e. returning user login)
      // PLACEHOLDER: verify session is still valid
      // compare cookie.hash (client) with session.hash (server-db)
      return session;
    })
    .catch(() => {
      // create and return a new session
      return models.Sessions.create()
        .then((result) => models.Sessions.get({ id: result.insertId }))
        .then((session) => {
          res.cookie('shortlyid', session.hash);
          return session;
        })
        .catch((error) => console.log(error));
    })
    .then((session) => {
      // Case 5: We have a session, existing or NEW
      req.session = session;
      next();
    });
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.verifySession = (req, res, next) => {
  if (!models.Sessions.isLoggedIn(req.session)) {
    res.redirect('/login');
  } else {
    next();
  }
};