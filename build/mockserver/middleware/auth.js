const assert = require('assert')
const crypto = require('crypto')
const config = require("../config.json")
const util = require('../util')
module.exports = (req, res, next) => {
    const staffid = util.cookies(req, 'staffid')
    const staffname = util.cookies(req, 'staffname')
    if (staffid && staffname) {
        let timestamp = (new Date().getTime() / 1000).toFixed()
        let hash = crypto.createHash('sha256')
        hash.update(`${timestamp}${config['token']}${config['x-rio-seq']},${staffid},${staffname},${config['x-ext-data']}${timestamp}`)
        let signature = hash.digest('hex').toUpperCase()
        req.headers['staffid'] = staffid
        req.headers['staffname'] = staffname
        req.headers['signature'] = signature
        req.headers['timestamp'] = timestamp
        req.headers['x-rio-seq'] = config['x-rio-seq']
        req.headers['x-ext-data'] = config['x-ext-data']
        next();
        return;
    }
    util.notAuth(res);
}