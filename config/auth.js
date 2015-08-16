// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : 'your-secret-clientID-here', // your App ID
        'clientSecret'  : 'your-client-secret-here', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '956662685780-cqqi91bjf4r21222qcplmj941g1jocfu.apps.googleusercontent.com',
        'clientSecret'  : 'cZXHX9ahBHYIkP_aXwMojZbI',
        'callbackURL'   : 'http://127.0.0.1/auth/google/callback'
    }

};