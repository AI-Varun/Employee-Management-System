const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const employeeController = require('../Controllers/employee');
const multer = require('multer');

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

const validateCreateUser = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string')
        .matches(/^[A-Za-z\s]+$/).withMessage('Name must contain only letters and spaces'),
    body('email').notEmpty()
        .withMessage('Email is required').isEmail().withMessage('Email must be valid'),
    body('mobileNo')
        .notEmpty().withMessage('Mobile number is required')
        .isNumeric().withMessage('Mobile number must be numeric')
        .isLength({ min: 10, max: 10 }).withMessage('Mobile number must be 10 digits long'),
    body('designation')
        .notEmpty().withMessage('Designation is required')
        .isString().withMessage('Designation must be a string'),
    body('gender').notEmpty().withMessage('Gender is required').isIn(['Male', 'Female']).withMessage('Gender must be Male or Female'),
    body('course').notEmpty().withMessage('Course is required').isString().withMessage('Course must be a string'),
];

const validateUpdateUser = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string')
        .matches(/^[A-Za-z\s]+$/).withMessage('Name must contain only letters and spaces'),
    body('email').notEmpty()
        .withMessage('Email is required').isEmail().withMessage('Email must be valid'),
    body('mobileNo')
        .notEmpty().withMessage('Mobile number is required')
        .isNumeric().withMessage('Mobile number must be numeric')
        .isLength({ min: 10, max: 10 }).withMessage('Mobile number must be 10 digits long'),
    body('designation').optional().isString().withMessage('Designation must be a string'),
    body('gender').optional().isIn(['Male', 'Female']).withMessage('Gender must be Male or Female'),
    body('course').optional().isString().withMessage('Course must be a string'),
];


var upload = multer({ storage: storage });

router.get('/users', (req, res) => {
    employeeController.getUsers(req, res);
});

// router.post('/create', validateCreateUser, (req, res) => {
//     employeeController.createUser(req, res);
// });
router.post('/create', upload.single('image'), validateCreateUser, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if (req.file) {
        req.body.image = req.file.buffer.toString('base64'); // Convert the image to Base64
    }
    next();
}, (req, res) => {
    employeeController.createUser(req, res);
});


router.post('/users/:id', upload.single('image'), validateUpdateUser, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if (req.file) {
        req.body.image = req.file.buffer.toString('base64'); // Convert the image to Base64
    }
    next();
}, (req, res) => {
    employeeController.updateUser(req, res);
});


router.delete('/users/:id', (req, res) => {
    employeeController.deleteUser(req, res);
});

module.exports = router;
