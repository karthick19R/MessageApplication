const router = require("express").Router();
const userController = require("../controllers/usercontroller");
const  auth  = require("../middlewares/Authenticator");
const { validate } = require("../middlewares/validate");

router.post("/login", userController.login);

router.post("/signup", validate, userController.signup);

router.put("/update", auth, userController.updateUser);

router.delete("/delete", auth, userController.deleteUser);

router.get('/alluser',auth,userController.viewAllUsers)

module.exports = router;
