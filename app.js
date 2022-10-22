require('dotenv').config()
const express = require('express')
const routes = require('./routes/api.js')
const bodyparser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const flash = require('connect-flash');
const session = require('express-session');
const { connectDB } = require('./controllers/database.js')

app = express()
app.use(express.json())
// Set view engine as EJS
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, ''));
app.use(cookieParser())
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true
}))
app.use(bodyparser.urlencoded({ extended: false }));
app.use(flash())
app.use('/images', express.static('images'))
app.use("/api/v1", routes)


async function checkAuthBegin(req, res, next) {
    //Token validation
    let cookie = req.headers.cookie
    if (!cookie) {
        return res.redirect('/api/v1/login')
    }
    let token = cookie
    token = token.substring(token.search("%7B") + 3, token.search("%7D"))
    try {
        let info = jwt.verify(token, process.env.SECRET)
        req.flash("name",info.name)
    } catch (error) {
        return res.redirect('/api/v1/login')
    }
    next()
}

app.get('/', checkAuthBegin, (req, res) => {
    var name = req.flash('name')
    res.status(200).render('views/index',{ name })
})

app.post('/', checkAuthBegin, (req, res) => {
    res.status(200).render('views/index')
})

app.use((req, res, next) => {
    res.status(404).send(
        "<h1>Page not found on the server</h1>")
})

const start = async () => {
    try {
        await connectDB()
        const port = process.env.PORT || 3000
        app.listen(port, () => console.log("Server listening in port " + port))
    } catch (error) {
        console.log(error);
    }
}

start()