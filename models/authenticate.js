const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const JwtStrategy=require('passport-jwt').Strategy;
const ExtractJWT=require('passport-jwt').ExtractJwt;
const jwt=require('jsonwebtoken');
const User=require('./user');
const FacebookTokenStrategy = require('passport-facebook-token');
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
exports.local=passport.use(new LocalStrategy(User.authenticate()))
const config=require('../cofig');
exports.getToken=(user)=>
{
    return jwt.sign(user,config.secretKey,{
        expiresIn : 3600
    })
}
exports.jwtPassport=passport.use(new JwtStrategy(
    {
        jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey:config.secretKey
    },
    (payload,done)=>
    {
        console.log("JwtPayload",payload);
        User.findOne({_id:payload._id})
        .then((user)=>{
            done(null,user);
        })
        .catch((err)=>{
            done(err,false);
        })
    }
))
exports.verrifyAdmin=((req,res)=>{
    if(req.user.admin  == false)
    {
               res.statusCode=403;
    }
    else
    {
        next();
    }
})
exports.verifyUser=passport.authenticate('jwt',{session:false});
exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({facebookID: profile.id})
          .then((user)=>{
            if ( user !== null) {
                return done(null, user);
            }
            else {
                user = new User({ username: profile.displayName });
                user.facebookID = profile.id;
                user.firstName = profile.name.givenName;
                user.lastName  = profile.name.familyName;
                user.save()
                .then((user)=>{
                    return done(null,user);
                })
                .catch((err)=>{
                    return done(err,user);
                })
                }
          })
          .catch((err)=>{
            return done(err,false);
          })
        
        }
)
)
