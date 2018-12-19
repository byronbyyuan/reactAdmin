import { CLOSECOMMENTS,OPENCOMMENTS } from '../type'

const close = data => {
    return {
        type:CLOSECOMMENTS,
        data
    }
}

const open = data => {
    return {
        type:OPENCOMMENTS,
        data
    }    
}