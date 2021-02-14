"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var userController_1 = __importDefault(require("../controllers/userController"));
var router = express_1.default.Router();
router.post('/signup', userController_1.default.signup);
router.post('/login', userController_1.default.signin);
router.get('/user/:userId', userController_1.default.allowIfLoggedIn, userController_1.default.getUser);
router.get('/users', userController_1.default.allowIfLoggedIn, userController_1.default.grantAccess('readAny', 'profile'), userController_1.default.getUsers);
router.put('/user/:userId', userController_1.default.allowIfLoggedIn, userController_1.default.grantAccess('updateAny', 'profile'), userController_1.default.updateUser);
router.delete('/user/:userId', userController_1.default.allowIfLoggedIn, userController_1.default.grantAccess('deleteAny', 'profile'), userController_1.default.deleteUser);
exports.default = router;
