'use strict';

module.exports = {
    extensions: ['ts', 'js'],
    ignore: ['node_modules'],
    recursive: true,
    require: ['ts-node/register'],
    spec: ["test/**/*.spec.*"]
};