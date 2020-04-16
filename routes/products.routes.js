const express = require('express');
const router = express.Router();

const EmployeeController = require('../controllers/products.controller');

router.get('/products', EmployeeController.getAll);
router.get('/products/random', EmployeeController.getRandom);
router.get('/products/:id', EmployeeController.getOne);
router.post('/products', EmployeeController.postOne);
router.put('/products/:id', EmployeeController.putOne);
router.delete('/products/:id', EmployeeController.deleteOne);

module.exports = router;
