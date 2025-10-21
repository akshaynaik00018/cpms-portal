const router = require('express').Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post(
  '/register',
  [body('email').isEmail(), body('password').isLength({ min: 6 }), body('name').notEmpty(), body('role').isIn(['student','company','tpo','admin'])],
  authController.register
);
router.post('/login', [body('email').isEmail(), body('password').notEmpty()], authController.login);
router.get('/me', auth(), authController.me);

module.exports = router;
