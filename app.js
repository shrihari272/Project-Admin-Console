require('dotenv').config()
const express = require('express')
const routes = require('./routes/api.js')
const bodyparser = require('body-parser');
const path = require('path');
const { connectDB } = require('./controllers/database.js')

app = express()
app.use(express.json())
app.use(authentication)
app.use('/images', express.static('images'))
app.use("/api/v1", routes)
app.use(bodyparser.urlencoded({ extended: false }));

function authentication(req, res, next) {
    var authheader = req.headers.authorization;
    // console.log(req.headers);
    if (!authheader) {
        res.status(401)
            .set({ 'WWW-Authenticate': 'Basic realm="Confirm password"' })
            .end('Authentication required');
    }
    if(authheader === undefined)
        return
    var auth = new Buffer.from(authheader.split(' ')[1],
        'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];

    if (user === 'admin' && pass === process.env.SERVER_PASS) {
        next();
    } else {
        res.status(401)
            .set({ 'WWW-Authenticate': 'Basic realm="Confirm password"' })
            .end('Authentication required');
    }

}
app.use(express.static(path.join(__dirname, 'public')));

app.get(['/', 'index', 'index.html'], (req, res) => {
    res.status(200).sendFile(path.resolve('templets/index.html'))
})

app.get('/logout', (req, res) => {
    res.status(401)
        .set({ 'WWW-Authenticate': 'Basic realm="Confirm password"' })
        .end('You have successfully logged out');
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