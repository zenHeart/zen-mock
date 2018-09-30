#!/usr/bin/env node

const path = require('path');
const projectRoot = process.cwd();
const defaultDir = 'mock';
const mockServer = require('../src/server');
const mockDir = path.resolve(projectRoot,defaultDir);
console.log(mockDir);
mockServer(mockDir).listen(8081);