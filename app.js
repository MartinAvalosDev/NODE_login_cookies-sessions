const express = require('express');
const session = require('express-session');
// const FileStore = require('session-file-store');
const User = require('./models/User');

// const Store = FileStore(session);

const app = express();
const server = app.listen(8080, ()=> console.log("Server up"))

// app.use(session({
//     store: new Store({
//         path: './sessions',
//         ttl: 60,

//     }),
//     secret: 'coder',
//     resave: true,
//     saveUninitialized: true,
//     cookie: {maxAge: 60000}
// }));

// app.get('/', (req, res) => {
//     req.session.user = {
//         username: "martin",
//         role: "admin",
//     }
//     res.send ({message: "ok"});
    
// })

// app.get('/currentUser', (req, res) => {
//     res.send(req.session.user)
// })

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use(session({
    key: 'user_sid',
    secret: 'c0d3r',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 600000}
}))

const sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid){
        res.redirect('/dashboard');
    } else {
        next();
    }
}

app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');

})

app.route('/login').get(sessionChecker, (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
})

app.route('/signup').get(sessionChecker, (req, res) => {
    res.sendFile(__dirname + '/public/signup.html');
}).post((req, res) => {
    let user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    user.save((err,docs)=>{
        if (err) {
            res.redirect('/signup');
        } else {
            req.session.user = docs;
            res.redirect('/dashboard')
        }
    });
})

app.get('/dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_sid){
        res.sendFile(__dirname + '/public/dashboard');
    }
})