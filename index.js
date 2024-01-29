const express = require('express');
const app = express();
const cors = require('cors');
const loginRouter = require('./routes/login')
const registerRouter = require('./routes/register')
const logoutRouter = require('./routes/logout')
const countriesRouter = require('./routes/countries')
const productsRouter = require('./routes/products')
const messageRouter = require('./routes/message')
require('dotenv').config()
const {v4: uuid} = require('uuid')
const logger = require('morgan');
const passport = require("passport");
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const knex = require('knex')(require('./knexfile'))
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session)
const PORT = process.env.PORT || 5000;
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(express.static('./public'))

const corsOptions= {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    "optionsSuccessStatus": 204
}

app.use(cors(corsOptions));
app.use(express.json());
const store = new KnexSessionStore({knex});


passport.use(new LocalStrategy({usernameField: "email", passwordField: "password"}, async function verify(email, password, cb){
    try{
        const users = await knex("user")
            .where("email", "=", email);
        if(!users || users.length === 0){
            return cb(null, false, {message: "Incorrect username or password."});
        }
        let user = users[0]
        crypto.pbkdf2(password, user.salt, 31000, 32, "sha256", function(error, hashedPassword){
            if(error) return cb(error);
            if(!crypto.timingSafeEqual(user.hashed_password, hashedPassword)){
                return cb(null, false, {message: "Incorrect username or password."})
            }
            return cb(null, user);
        })
    }catch(error){
        return cb(error)
    }
    
}))


passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        console.log("Serialized user");
      return cb(null, { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, country_id: user.country_id });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    console.log(`deserialized user: ${user.first_name}`)
    process.nextTick(function() {
      return cb(null, user);
    });
  });

io.on("connection", (client)=>{
    client.on("data", async function(user){
        try{
        client.data.user = user;
        const userRooms = await knex("message_master").where(function(){
            this.where("message_master.user_one", "=", user.user_id )
            .orWhere("message_master.user_two", "=", user.user_id  )
        })
        userRooms.forEach(room => {
            client.join(room.room_id)
        })
    }catch(error){
        console.log("Failed to put client in room");
    }
    })
})

app.use(session({
    secret: "keyboard cat",
    cookie: {maxAge: 3600000, secure:false},
    store
}))
app.use(passport.session())

app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter)
app.use('/api/register', registerRouter);
app.use('/api/countries', countriesRouter);
app.use('/api/products', productsRouter);

app.use(function(req, res, next){
    console.log(req.user);
    if(!req.user || !req.user.id){
        res.status(404).send("User not logged in.")
    }else{
    req.io = io;
    next();
    }
})
app.use('/api/message', messageRouter);
app.get("/api/test", (req, res, next) => {
   res.send(req.user);
})



server.listen(PORT, ()=>{
    console.log(`Listening to port ${PORT}`)
})