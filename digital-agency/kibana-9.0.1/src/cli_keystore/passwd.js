"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.passwd = passwd;
exports.passwdCli = passwdCli;
var _logger = require("../cli/logger");
var _utils = require("../cli/keystore/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

async function passwd(keystore, options = {}) {
  const logger = new _logger.Logger(options);
  await keystore.load();
  if (!keystore.exists()) {
    return logger.error("ERROR: Kibana keystore not found. Use 'create' command to create one.");
  }
  const password = (await (0, _utils.question)('Enter new password for the kibana keystore (empty for no password)', {
    mask: '*'
  })) || '';
  keystore.setPassword(password);
  keystore.save();
}
function passwdCli(program, keystore) {
  program.command('passwd').description('Changes the password of a keystore').option('-s, --silent', 'prevent all logging').action(passwd.bind(null, keystore));
}