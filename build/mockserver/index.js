const express = require('express')
const auth = require("./middleware/auth")
const route = require('./route')

module.exports = app => {
    app.get('/logon', route.logon)
    app.post('/login', route.login)
    
    let api = express()
    app.use("/api", api)
    api.use(auth)
    api.post("/getStaff", route.getStaff)
    api.post("/getStaffRoles", route.getStaffRoles)
    api.get("/pet/getPetList", route.getPetList)
    api.post("/pet/createPet", route.createPet)
    api.post("/pet/updatePet", route.updatePet)
    api.post("/pet/deletePet", route.deletePet)
    api.get("/pet/getCategoryList", route.getCategoryList)
    api.post("/pet/updateCategory", route.updateCategory)
    api.post("/pet/deleteCategory", route.deleteCategory)
    api.post("/pet/createCategory", route.createCategory)
    
}
