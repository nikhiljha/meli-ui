#!/usr/bin/env node

const fs = require('fs');
const { join, resolve } = require('path');

const prefix = process.env.APP_ENV_PREFIX || 'MELI_';
const envDirectory = process.env.APP_ENV_DIRECTORY || '/www/';

const env = {};

Object.entries(process.env)
  .filter(([varName]) => varName.startsWith(prefix))
  .forEach(([varName, value]) => {
    env[varName] = value;
  });

fs.writeFileSync(resolve(join(envDirectory, 'env.json')), JSON.stringify(env, null, 2), { encoding: 'utf-8' });
