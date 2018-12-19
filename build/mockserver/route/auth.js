const fs = require('fs')
const data = require('./data')
const path = require('path')
const Parse = require('co-body')
module.exports = {
    logon: (req, res) => { //登录页
        let readerStream = fs.createReadStream(path.join(__dirname, '../login.html'))
        readerStream.pipe(res)
    },
    login:async (req, res) => { //登录接口
        let body = await Parse.form(req);
        let staffname = body.staffname;
        if (staffname in data.staffs) {
            let staffid = data.staffs[staffname].StaffId
            res.setHeader('Set-Cookie', [`staffname=${staffname}`, `staffid=${staffid}`])
            res.redirect(301, '/')
            return
        } else {
            res.send('无此员工')
        }
    }
}