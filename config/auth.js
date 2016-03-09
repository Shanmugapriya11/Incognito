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
        'clientID'      : '630899487461-0fhguscp20sfs7ctkmlmqr84lihkl5ah.apps.googleusercontent.com',
        'clientSecret'  : 'p2v6IapAjSxxqwROak0RatNB',
        'callbackURL'   : 'http://incognito.freshtoken.com/auth/google/callback'
    }

};