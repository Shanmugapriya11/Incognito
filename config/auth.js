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
        'clientID'      : '956662685780-6oobsh1t33k297gfeakeus3gvdjmnbfl.apps.googleusercontent.com',
        'clientSecret'  : 'WOBd_4OsB-CtglID7f5cZEIQ',
        'callbackURL'   : 'http://incognito.freshtoken.com/auth/google/callback'
    }

};