const { model, model_section } = require('./database.js')
const path = require('path')
const users = require('./dbUsers')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const getAllItems = async (req, res, next) => {
    var data = await checkAuth(req, res, next)
    if (data.msg === 'redirect')
        return res.redirect('/api/v1/login')
    try {
        const task = await model.find({ section: req.params.section })
        res.status(200).send({ tasks: task, size: task.length })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

const getItems = async (req, res, next) => {
    var data = await checkAuth(req, res, next)
    if (data.msg === 'redirect')
        return res.redirect('/api/v1/login')
    try {
        const item = await model.findOne({ _id: req.params.id })
        res.status(200).send({
            task: `<section class="content-input">
            <div class="content-space-input">
                <select type="text" id="section" placeholder="Section">
                        <option value="${item.section}">#${item.section}</option>
                </select>     
                <input type="text" id="description" placeholder="Description" value="${item.description}"> 
                <textarea id="code" placeholder="Code">${item.code}</textarea>
                <button id="submit" onclick="update()">Edit</button>
            </div>
            <button class="floating-bnt" onclick="change()"><</button>
        </section>`})
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}


const createItems = async (req, res, next) => {
    var data = await checkAuth(req, res, next)
    if (data.msg === 'redirect')
        return res.redirect('/api/v1/login')
    try {
        const task = await model.create(req.body)
        res.status(201).json(task)
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}


async function removeItems(req, res, next) {
    var data = await checkAuth(req, res, next)
    if (data.msg === 'redirect')
        return res.redirect('/api/v1/login')
    try {
        await model.deleteOne({ _id: req.params.id })
        res.status(202).send('From controller removeItem')
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}


const updateItems = async (req, res, next) => {
    var data = await checkAuth(req, res, next)
    if (data.msg === 'redirect')
        return res.redirect('/api/v1/login')
    try {
        const task = await model.findOneAndUpdate({ _id: req.params.id }, req.body)
        res.status(200).send('From controller updateItem\n' + task)
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

const logicJS = (req, res) => {
    res.status(200).sendFile(path.resolve('views/logic.js'));
}

const stylesCSS = (req, res) => {
    res.status(200).sendFile(path.resolve('views/styles.css'));
}

const authCheckLogin = async (req, res) => {
    let email = req.body.email
    let user = users.find((user) => user.email == email)
    let pass = req.body.pass
    if (!user) {
        req.flash('err', "Invalid credentials")
        return res.redirect('/api/v1/login')
    }
    let check = await bcrypt.compare(pass, user.pass);
    let token = jwt.sign({ email: user.email, name: user.name }, process.env.SECRET, {
        expiresIn: "1h" // Time limit for Token
    },)
    token = `{${token}}`
    if (check)
        res.cookie('ACCESS_TOKEN', token).redirect('/')
    else {
        req.flash('err', "Invalid credentials")
        res.redirect('/api/v1/login')
    }
}

const authLogin = (req, res) => {
    const err = req.flash('err')
    res.render('views/interface', { err });
}

const authLogout = (req, res) => {
    res.cookie('ACCESS_TOKEN', "Expired")
    res.send({ msg: "Logout" })
}

//edit user section
const listSection = async (req, res, next) => {
    var data = await checkAuth(req, res, next)
    if (data.msg === 'redirect')
        return res.redirect('/api/v1/login')
    try {
        const section = await model_section.find()
        res.status(200).send({ section: section, size: section.length })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

const addSection = async (req, res, next) => {
    var data = await checkAuth(req, res, next)
    if (data.msg === 'redirect')
        return res.redirect('/api/v1/login')
    try {
        let result = req.body.section
        result = result[0].toUpperCase() + result.substring(1, result.length).toLowerCase()
        let sec = await model_section.findOne({ section: result })
        if (sec) {
            res.status(200).json({ msg: "Section already in use" })
            return
        }
        try {
            const createSection = await model_section.create({ section: result })
            res.status(201).json(createSection)
        } catch (error) {
            res.status(500).json({ msg: error })
        }
    } catch (error) {
        res.status(500).json({ msg: error })
    }

}

const removeSection = async (req, res, next) => {
    var data = await checkAuth(req, res, next)
    if (data.msg === 'redirect')
        return res.redirect('/api/v1/login')
    try {
        let data = req.params.id
        id = data.substring(0,data.search(" "))
        let sec_data = data.substring(data.search(" ")+1,data.length)
        await model.deleteMany({ section: sec_data })
        await model_section.deleteOne({ _id: id })
        res.status(202).send('Section Deleted')
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}
//

async function checkAuth(req, res, next) {
    // Token validation
    let cookie = req.headers.cookie
    if (!cookie)
        return { msg: 'redirect' }
    let token = cookie
    token = token.substring(token.search("%7B") + 3, token.search("%7D"))
    try {
        jwt.verify(token, process.env.SECRET)
    } catch (error) {
        return { msg: 'redirect' }
    }
    return { msg: 'succcess' }
}

module.exports = {
    getAllItems,
    getItems,
    createItems,
    removeItems,
    updateItems,
    logicJS,
    stylesCSS,
    authCheckLogin,
    authLogin,
    authLogout,
    checkAuth,
    listSection,
    addSection,
    removeSection
}