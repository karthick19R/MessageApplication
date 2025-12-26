const router = require('express').Router();
const messagecontrol = require('../controllers/messagecontroller')
const auth = require('../middlewares/Authenticator')
router.post('/addmessage',auth,messagecontrol.addmessage);

router.get('/allmessage',auth,messagecontrol.getallmessage);

router.get('/messagebyid/:id',auth,messagecontrol.getmessagebyid);

router.get('/message/conversation',auth,messagecontrol.getconversation);

module.exports = router