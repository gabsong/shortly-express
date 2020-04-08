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
      .then((data) => {
        // cookie is valid, store existing hash in session
        if (data.hash === shortlyid) {
          req.session.hash = data.hash;
        } else {
          // cookie is NOT valid, remove cookie & logout
          req.cookies = {};
          res.redirect('/login');
        }
        return;
      })
      .then(() => next())
      .catch((error) => console.log(error));
  } else {
    // generate a session w/ unique hash -> store in DB
    models.Sessions.create()
      .then((data) => data.insertId)
      .then((id) => models.Sessions.get({ id }))
      .then((data) => {
        req.session.hash = data.hash;
        res.cookie('shortlyid', data.hash);
      })
      .then(() => next())
      .catch((error) => console.log(error));
  }
  // look up user data related to this session
  // assign an object to req.session with some information
    // what information about the user would you want to keep in this session object?
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

