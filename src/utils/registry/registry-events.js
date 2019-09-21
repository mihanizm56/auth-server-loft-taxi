const ee = require("@nauma/eventemitter");

// register events
global.CORE_EVENTS = new ee.EventEmitter("core");
global.DATABASE_EVENTS = new ee.EventEmitter("database");
global.VALIDATE_EVENTS = new ee.EventEmitter("validation");
