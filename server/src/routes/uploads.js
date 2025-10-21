const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { auth } = require('../middleware/auth');
const uploadController = require('../controllers/uploadController');

const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', '..', 'uploads', 'resumes')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', '..', 'uploads', 'logos')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const uploadResume = multer({ storage: resumeStorage });
const uploadLogo = multer({ storage: logoStorage });

router.post('/resume', auth(), uploadResume.single('file'), uploadController.uploadResume);
router.post('/logo', auth(), uploadLogo.single('file'), uploadController.uploadLogo);

module.exports = router;
