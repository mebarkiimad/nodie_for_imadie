"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var jsonwebtoken_1 = require("jsonwebtoken");
var bcrypt_1 = require("bcrypt");
var userModel_1 = require("./../models/userModel");
var roles_1 = require("../roles");
var token = 'AF301B046AC6BEB3C9B964B1D6A5EB197C191163C0D9453E84EB394705CC56D9';
var hashPassword = function (password) { return __awaiter(void 0, void 0, Promise, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, bcrypt_1["default"].hash(password, 10)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
var validatePassword = function (plainPassword, hashedPassword) { return __awaiter(void 0, void 0, Promise, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, bcrypt_1["default"].compare(plainPassword, hashedPassword)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
var signup = function (req, res, next) { return __awaiter(void 0, void 0, Promise, function () {
    var _a, email_1, password_1, role_1, hashedPassword, newUser, accessToken, error_1, _b, email, password, role;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, email_1 = _a.email, password_1 = _a.password, role_1 = _a.role;
                return [4 /*yield*/, hashPassword(password_1)];
            case 1:
                hashedPassword = _c.sent();
                newUser = new userModel_1["default"]({ email: email_1, password: hashedPassword, role: role_1 || "basic" });
                accessToken = jsonwebtoken_1["default"].sign({ userId: newUser._id }, token, {
                    expiresIn: "365d"
                });
                newUser.accessToken = accessToken;
                return [4 /*yield*/, newUser.save()];
            case 2:
                _c.sent();
                res.json({
                    data: newUser,
                    accessToken: accessToken
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _c.sent();
                next(error_1);
                return [3 /*break*/, 4];
            case 4:
                _b = req.body, email = _b.email, password = _b.password, role = _b.role;
                return [2 /*return*/];
        }
    });
}); };
var signin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, validPassword, accessToken, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, userModel_1["default"].findOne({ email: email })];
            case 1:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, next(new Error('Email does not exist'))];
                return [4 /*yield*/, validatePassword(password, user.password)];
            case 2:
                validPassword = _b.sent();
                if (!validPassword)
                    return [2 /*return*/, next(new Error('Password is not correct'))];
                accessToken = jsonwebtoken_1["default"].sign({ userId: user._id }, token, {
                    expiresIn: "1d"
                });
                return [4 /*yield*/, userModel_1["default"].findByIdAndUpdate(user._id, { accessToken: accessToken })];
            case 3:
                _b.sent();
                res.status(200).json({
                    id: user._id, email: user.email, role: user.role,
                    accessToken: accessToken
                });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                next(error_2);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
var getUsers = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, userModel_1["default"].find({})];
            case 1:
                users = _a.sent();
                res.status(200).json({
                    data: users
                });
                return [2 /*return*/];
        }
    });
}); };
var getUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.params.userId;
                return [4 /*yield*/, userModel_1["default"].findById(userId)];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, next(new Error('User does not exist'))];
                res.status(200).json({
                    data: user
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var updateUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var update, userId, user, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                update = req.body;
                userId = req.params.userId;
                return [4 /*yield*/, userModel_1["default"].findByIdAndUpdate(userId, update)];
            case 1:
                _a.sent();
                return [4 /*yield*/, userModel_1["default"].findById(userId)];
            case 2:
                user = _a.sent();
                res.status(200).json({
                    data: user,
                    message: 'User has been updated'
                });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                next(error_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var deleteUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.params.userId;
                return [4 /*yield*/, userModel_1["default"].findByIdAndDelete(userId)];
            case 1:
                _a.sent();
                res.status(200).json({
                    data: null,
                    message: 'User has been deleted'
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                next(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var grantAccess = function (action, resource) { return function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var role, permission;
    return __generator(this, function (_a) {
        try {
            role = req.currentUser.role;
            permission = roles_1.ac.can(role).readAny(resource);
            if (!permission.granted) {
                return [2 /*return*/, res.status(401).json({
                        error: "You don't have enough permission to perform this action"
                    })];
            }
            next();
        }
        catch (error) {
            next(error);
        }
        return [2 /*return*/];
    });
}); }; };
var allowIfLoggedIn = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _user;
    return __generator(this, function (_a) {
        try {
            _user = res.locals.loggedInUser;
            if (!_user)
                return [2 /*return*/, res.status(401).json({
                        error: "You need to be logged in to access this route"
                    })];
            req.currentUser = _user;
            next();
        }
        catch (error) {
            next(error);
        }
        return [2 /*return*/];
    });
}); };
exports["default"] = { signin: signin, signup: signup, getUsers: getUsers, getUser: getUser, updateUser: updateUser, deleteUser: deleteUser, grantAccess: grantAccess, allowIfLoggedIn: allowIfLoggedIn };
