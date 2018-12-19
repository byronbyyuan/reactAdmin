const auth = require('./auth')
const staff = require('./staff')
const pet = require("./pet")

module.exports = {
    logon: auth.logon,
    login: auth.login,
    getStaff: staff.getStaff,
    getStaffRoles: staff.getStaffRoles,
    getPetList: pet.getPetList,
    createPet: pet.createPet,
    updatePet: pet.updatePet,
    deletePet: pet.deletePet,
    getCategoryList:pet.getCategoryList,
    updateCategory:pet.updateCategory,
    deleteCategory:pet.deleteCategory,
    createCategory:pet.createCategory
}