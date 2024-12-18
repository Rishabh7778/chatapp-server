const { register, login, setAvatar, getAllUsers } = require("../Controllers/userController");
const router = require("express").Router();

router.post('/register', register);
router.post('/login', login);
router.post('/setAvatar/:id', setAvatar)
router.get('/allUser/:id', getAllUsers)

module.exports = router;
