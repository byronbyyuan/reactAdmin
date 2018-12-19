const util = require('../util')
const data = require('./data')

module.exports = {
    getStaff: (req, res,next) => {//是否登陆
        let staffname = util.cookies(req, 'staffname')
        if (!staffname) {
            util.notAuth(res);
            return
        }
        let staff = data.staffs[staffname]
        util.success(res,{
            StaffID: staff.StaffId,
            StaffName: staffname
        })
        // next()
    },
    getStaffRoles: (req, res,next) => {//权限
        let staffname = util.cookies(req, 'staffname')
        if (!staffname) {
            util.notAuth(res);
            return
        }
        let roleAuths = data.roleAuths[staffname]
        util.success(res,roleAuths.roles)
        // next()
        
    }
}