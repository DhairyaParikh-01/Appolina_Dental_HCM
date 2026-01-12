const express = require('express');
const { default: Department, findByIdAndDelete, findById } = require('../Models/Employee_Model');
const Departments = require('../Models/Department_Model');
const verifyUserRole = require('../Middleware/VerifyUserRole');
const authenticateUser = require('../Middleware/authenticateUser');
const router = express.Router();

// ROUTE 1: To create a new department using http POST operation in "api/departments/createdeptarment" ==> TESTED OK

router.post('/createdeptarment',authenticateUser, verifyUserRole("admin"), async(req,res) => {
    try{
        const {DepartmentCode, DeparmentName, location} = req.body;
        const dept = new Departments({
            DepartmentCode,
            DeparmentName,
            location
        });

        const createdDepatment = await dept.save();
        res.json(createdDepatment);
    }
    catch(error){
        res.status(500).send("Internal server Error" + error);
        console.log("Internal server error: "+ error);
    }
})

// ROUTE 2: To update the existing depatment using the http PUT operation in "api/depatments/updatedepartment" ==> TESTED OK

router.put('/updatedepatment/:id', authenticateUser, verifyUserRole("admin"), async(req,res) => {
    try{
        const {DepartmentCode, DeparmentName, location} = req.body;
        let depatmentToBeUpdated = await Departments.findById(req.params.id);

        const newDepartment = {};
        if(DepartmentCode){
            newDepartment.DepartmentCode = DepartmentCode;
        }
        if(DeparmentName){
            newDepartment.DeparmentName = DeparmentName;
        }
        if(location){
            newDepartment.location = location; 
        }

        depatmentToBeUpdated = await Departments.findByIdAndUpdate(req.params.id, {$set: newDepartment}, {new:true});
        res.json(depatmentToBeUpdated);
    }
    catch(error){
        res.status(500).send("Internal server Error" + error);
        console.log("Internal server error:" + error);
    }
});

// ROUTE 3: To fetch all the departments using http GET operation in "api/departments/fetchalldepartments/" ==> TESTED OK

router.get('/fetchalldepartments', async(req,res) => {
    try{
        const departments = await Departments.find();
        res.json(departments);
    }
    catch(error){
        res.status(500).send("Internal server Error" + error);
        console.log("Internal server error:" + error);
    }
});

// ROUTE 4: To fetch a particular department using http GET operation in "api/depatments/department/:id" ==> TESTED OK

router.get('/department/:id', async(req,res) => {
    try{
        const departmentFetched = await Departments.findById(req.params.id);
        if(!departmentFetched){
            res.status(404).send("Sorry! No Department exists for the given ID");
        }
        res.json(departmentFetched);
    }
    catch(error){
        res.status(500).send("Internal server Error" + error);
        console.log("Internal server error:" + error);
    }
});

// ROUTE 5: To delete the department permanantly using the http DELETE operation in "api/departments/deletedepartment" ==> TESTED OK

router.delete('/deletedepartment/:id', authenticateUser, verifyUserRole("admin"), async(req,res) => {
    try{
        const deletedDepartment = await Departments.findByIdAndDelete(req.params.id);
        if(!deletedDepartment){
            res.status(404).send("Department not found in the database!");
        }

        res.json(deletedDepartment);
    }
    catch(error){
        res.status(500).send("Internal Server Error: " + error);
        console.log("Internal Server Error: "+ error);
    }
});

module.exports = router;