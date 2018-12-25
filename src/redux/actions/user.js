import { SETUSER,DELUSER,USERDATA } from '../type'

const setUser = data => {
    return {
        type:SETUSER,
        data
    }
}

const delUser = data => {
    return {
        type:DELUSER,
        data
    }
}

const userData = data => {
    return {
        type:USERDATA,
        data
    }
}
module.exports = {
    setUser,
    delUser,
    userData
}