const express = require('express')
const router = express.Router()
const { getAllItems,getItems,createItems,updateItems,removeItems,logicJS,stylesCSS,vanillaTilt } = require('../controllers/controllers.js') //multiple import

router.route("/task/section/:section").get(getAllItems).post(createItems)
router.route("/task/:id").get(getItems).patch(updateItems).delete(removeItems)
router.route("/logic.js").get(logicJS)
router.route("/styles.css").get(stylesCSS)

module.exports = router