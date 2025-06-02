"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
exports.createCli = createCli;
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

async function create(keystore, options = {}) {
  const logger = new _logger.Logger(options);
  if (keystore.exists()) {
    const overwrite = await (0, _utils.confirm)('A Kibana keystore already exists. Overwrite?');
    if (!overwrite) {
      return logger.log('Exiting without modifying keystore.');
    }
  }
  keystore.reset();
  if (options.password) {
    const password = await (0, _utils.question)('Enter new password for the kibana keystore (empty for no password)', {
      mask: '*'
    });
    if (password) keystore.setPassword(password);
  }
  keystore.save();
  logger.log(`Created Kibana keystore in ${keystore.path}`);
}
function createCli(program, keystore) {
  program.command('create').description('Creates a new Kibana keystore').option('-p, --password', 'Prompt for password to encrypt the keystore').option('-s, --silent', 'Show minimal output').action(create.bind(null, keystore));
}