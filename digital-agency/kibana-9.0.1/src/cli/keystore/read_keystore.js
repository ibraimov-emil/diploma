"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readKeystore = readKeystore;
var _saferLodashSet = require("@kbn/safer-lodash-set");
var _ = require(".");
var _get_keystore = require("./get_keystore");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

async function readKeystore(keystorePath = (0, _get_keystore.getKeystore)()) {
  const keystore = await _.Keystore.initialize(keystorePath);
  const keys = Object.keys(keystore.data);
  const data = {};
  keys.forEach(key => {
    (0, _saferLodashSet.set)(data, key, keystore.data[key]);
  });
  return data;
}