"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ac = void 0;
var accesscontrol_1 = require("accesscontrol");
var ac = new accesscontrol_1.AccessControl();
exports.ac = ac;
ac.grant("basic")
    .readOwn("profile")
    .updateOwn("profile");
ac.grant("supervisor")
    .extend("basic")
    .readAny("profile");
ac.grant("admin")
    .extend("basic")
    .extend("supervisor")
    .updateAny("profile")
    .deleteAny("profile");
