/**
 * Configure google oauth passport's.
 * Config parameters:
 * - appID: the application ID
 * - appSecret: the applicatin secrete
 * - authorizedEmails: a comma separated listed of patterns
 *   each pattern can be '*': anything,
 *                       '*@domain': any email in the domain
 *                       'an@email': a specific email.
 * When no appID, no oauth config takes place.
 */
exports.configureOAuth = function(express, app, config) {
  if (!config.appID) {
    console.log('not setup of google oauth');
    return;
  }

  var validateUser = function(passportProfile) {
    var validEmail;
    passportProfile.emails.some(function(email) {
      email = email.value;
      config.authorizedEmails.some(function(patt) {
        if (patt === email) {
          validEmail = email;
          return true;
        }
        if (patt === '*') {
          validEmail = email;
          return true;
        }
        if ('*' + email.slice(email.indexOf('@')) === patt) {
          validEmail = email;
          return true;
        }
      });
      if (validEmail) {
        return true;
      }
    });
    return validEmail;
  };

  var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
  var passport = require('passport');
  var scope = config.scope || [ 'https://www.googleapis.com/auth/userinfo.email' ];

  var passportIsSet = false;

  var lazySetupPassport = function(req) {
    passportIsSet = true;

    var protocol = (req.connection.encrypted || req.headers['x-forwarded-proto'] == "https" ) ? "https" : "http";

  //not doing anything with this:
  //it will try to serialize the users in the session.
    passport.serializeUser(function(user, done) {
      done(null, user);
    });
    passport.deserializeUser(function(obj, done) {
      done(null, obj);
    });

    var callbackUrl = protocol + "://" + req.headers.host + "/auth/google/callback";
    passport.use(new GoogleStrategy({
      clientID: config.appID, clientSecret: config.appSecret, callbackURL: callbackUrl
    }, function(accessToken, refreshToken, profile, done) {
      var validEmail = validateUser(profile);
      if (!validEmail) {
        done(null, false, { message: 'not an authorized email ' + profile.emails[0] });
      } else {
        done(null, profile);
      }
    }));

    app.get('/auth/google', passport.authenticate('google'
    , { scope: scope, 'approvalPrompt': 'force'/*, 'accessType': 'offline'*/ })
    , function(req, res) {
      // The request will be redirected to Google for authentication, so
      // this function will not be called.
    });

    app.get('/auth/google/callback', passport.authenticate('google'
    , { failureRedirect: req.session.beforeLoginURL || '/' })
    , function(req, res) {
      // Successful authentication, redirect home.
      req.session.authenticated = true;
      res.redirect(req.session.beforeLoginURL || '/');
    });

  };

  app.use(express.bodyParser());
  app.use(require('connect-restreamer')());
  app.use(express.cookieParser());
  //replacement for bodyParser that is compatible with htt-proxy if we must have one (but we don't)
  app.use(express.session({ secret: 'dccUrr11d$#≈cdabsc' }));
  app.use(function(req, res, next) {
    if (req.isAuthenticated() || req.url.indexOf('/auth/google') === 0 ||
      req.session.authenticated) {
      return next();
    }
    if (!passportIsSet) {
      lazySetupPassport(req);
    }

    req.session.beforeLoginURL = req.url;
    res.redirect('/auth/google');
  });
  app.use(passport.initialize());

};
