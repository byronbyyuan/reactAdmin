const util = require('../util')
const data = require('./data')
const faker = require('faker')
module.exports = {
    getPetList: (req, res,next) => {
        // util.success(res,data.pets.petList)
        next()
    },
    createPet:(req,res,next)=>{
        // util.success(res,faker.random.number())
        next()
    },
    updatePet:(req,res,next)=>{
        // util.success(res,1)
        next()
    },
    deletePet:(req,res,next)=>{
        // util.success(res,1)
        next()
    },
    getCategoryList:(req, res,next) => {
        // util.success(res,data.pets.categoryList)
        next()
    },
    updateCategory:(req,res,next)=>{
        //util.success(res,1)
        next()
    },
    deleteCategory:(req,res,next)=>{
        //util.success(res,1)
        next()
    },
    createCategory:(req,res,next)=>{
        //util.success(res,faker.random.number())
        next()
    }
}