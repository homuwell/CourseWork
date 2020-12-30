const router = require('express').Router();
const {catchErrors} = require('../handlers/errorHandlers');
const chatroomController = require('../controllers/chatroomContoroller');
const auth = require('../middlewares/auth');

router.get('/', auth, catchErrors(chatroomController.getAllChatRooms));
router.post('/', auth, catchErrors(chatroomController.createChatroom));
router.post('/room', auth, catchErrors(chatroomController.getMessages));
router.post('/users',auth, catchErrors(chatroomController.getUsers));

module.exports = router;