import { INCREMENT_COUNTER,DECREMENT_COUNTER } from '../type'

const increment  = data => {
    return {
        type:INCREMENT_COUNTER,
        data
    }
}

const decrement  = data => {
    return {
        type:DECREMENT_COUNTER,
        data
    }
}

module.exports = {
    increment,
    decrement
}