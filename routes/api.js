const express = require('express')
const router = express.Router()
const { getAllItems, getItems, createItems, updateItems, removeItems, logicJS, stylesCSS, authLogin, authCheckLogin, authLogout, listSection, addSection, removeSection } = require('../controllers/controllers.js') //multiple import


router.route("/task/section/:section").get(getAllItems).post(createItems)
router.route("/task/:id").get(getItems).patch(updateItems).delete(removeItems)
router.route("/logic.js").get(logicJS)
router.route("/styles.css").get(stylesCSS)
router.route("/login").get(authLogin).post(authCheckLogin)
router.route("/logout").delete(authLogout)
router.route("/section").get(listSection).post(addSection)
router.route("/section/:id").delete(removeSection)

module.exports = router