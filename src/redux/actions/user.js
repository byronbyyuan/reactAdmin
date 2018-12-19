import { SETUSER,DELUSER } from '../type'

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

module.exports = {
    setUser,
    delUser
}