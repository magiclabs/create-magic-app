const { Magic } = require('@magic-sdk/admin');

exports.magic = new Magic(process.env.MAGIC_SECRET_KEY);
