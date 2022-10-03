const { model } = require('./database.js')
const path = require('path')

const getAllItems = async (req, res) => {
    try {
        const task = await model.find({ section: req.params.section })
        res.status(200).send({ tasks: task, size: task.length })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

const getItems = async (req, res) => {
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


const createItems = async (req, res) => {
    try {
        const task = await model.create(req.body)
        res.status(201).json(task)
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}


async function removeItems(req, res, next) {
    try {
        await model.deleteOne({ _id: req.params.id })
        res.status(202).send('From controller removeItem')
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}


const updateItems = async (req, res) => {
    try {
        const task = await model.findOneAndUpdate({ _id: req.params.id }, req.body)
        res.status(200).send('From controller updateItem\n' + task)
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

const logicJS = (req, res) => {
    res.status(200).sendFile(path.resolve('templets/logic.js'));
}

const stylesCSS = (req, res) => {
    res.status(200).sendFile(path.resolve('templets/styles.css'));
}

module.exports = {
    getAllItems,
    getItems,
    createItems,
    removeItems,
    updateItems,
    logicJS,
    stylesCSS,
}