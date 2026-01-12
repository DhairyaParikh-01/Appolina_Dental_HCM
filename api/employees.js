const express = require('express');
const { default: Employee } = require('../Models/Employee_Model');
const Employees = require('../Models/Employee_Model');
const verifyUserRole = require('../Middleware/VerifyUserRole');
const authenticateUser = require('../Middleware/authenticateUser');
const router = express.Router();



// ROUTE 1: To fetch an employee using http GET operation in "api/employees/employee:id". ==> TESTED OK

router.get('/employee/:id', async(req,res) => {
    try{
        const employee = await Employees.findById(req.params.id);
        res.json(employee);
    }
    catch(error){
        res.status(500).send("Internal server Error" + error);
        console.log("Internal server error: "+ error);
    }
});

// ROUTE 2: To fetch all the employees using http GET operation in "api/employees/fetchallemployees". ==> TESTED OK

router.get('/fetchallemployees', async(req,res) => {
    try{
        const employees = await Employees.find({ deleted: false });
        res.json(employees);
    }
    catch(error){
        res.status(500).send("Internal server Error" + error);
        console.log("Internal server error: "+ error);
    }
});


// ROUTE 3: To create/Hire a new employee using http POST operation in "api/employees/createemployee". ==> TESTED OK

router.post('/createemployee', authenticateUser, verifyUserRole("admin"), async(req,res) => {
    try{
        const {firstName, lastName, dateOfBirth, contact, jobTitle, department, salary} = req.body;
        const newEmployee = new Employees({
            firstName,
            lastName,
            dateOfBirth,
            contact,
            jobTitle,
            department,
            salary
        })
        const savedEmployee = await newEmployee.save();
        res.json(savedEmployee);
    }
    catch(error){
        res.status(500).send("Internal server Error" + error);
        console.log("Internal server error: "+ error);
    }
});


// ROUTE 4: To update the existing employee using the http PUT operation in "api/employees/updateemployee". ==> TESTED OK

router.put('/updateemployee/:id', authenticateUser, verifyUserRole("admin"), async(req,res) =>{
    try{
        const {firstName, lastName, dateOfBirth, contact, jobTitle, department, salary} = req.body;
        let employeeToBeUpdated = await Employees.findById(req.params.id);
        const newEmployee = {};
        if(firstName){
            newEmployee.firstName = firstName;
        }
        if(lastName){
            newEmployee.lastName = lastName;
        }
        if(dateOfBirth){
            newEmployee.dateOfBirth = dateOfBirth;
        }
        if(contact){
            newEmployee.contact = contact;
        }
        if(jobTitle){
            newEmployee.jobTitle = jobTitle;
        }
        if(department){
            newEmployee.department = department;
        }
        if(salary){
            newEmployee.salary = salary;
        }


        // Updating the employee using mongoose ORM model.FindByIdAndUpdate() method where, 
        // "{$set: newEmployee}" tells the database to replace the values of the fields present in the newEmployee object with the new values provided.
        // "{new:true}" telling Mongoose to return the updated document after the modifications have been made, as it findByIdAndUpdate returns the old document by default.
        employeeToBeUpdated = await Employees.findByIdAndUpdate(req.params.id, {$set: newEmployee}, {new:true}); 

        res.json({employeeToBeUpdated});
    }
    catch(error){
        res.status(500).send("Internal server Error" + error);
        console.log("Internal server error: "+ error);
    }
});

// Route 5: To Terminate employee without purge(Employee still retained in MongoDB as terminated) using http POST operation in "api/employees/terminateemployee" ==> TESTED OK

router.post('/terminateemployee/:id', authenticateUser, verifyUserRole("admin"), async (req,res) => {
    try{
        let employeeToBeTerminated = await Employees.findById(req.params.id);
        if(!employeeToBeTerminated) {
            return res.status(404).send("Employee does not exist!");
        }
        
        const terminatedEmployee = await Employees.findByIdAndUpdate(req.params.id, {$set: {"deleted": true}}, {new: true});
        res.json(terminatedEmployee);
    }
    catch(error){
        res.status(500).send("Internal server Error" + error);
        console.log("Internal server error: "+ error);
    }
});
    
// ROUTE 6: To permanently delete(Purge) the employee record from MongoDB using http DELETE operation in "api/employees/purgeemployee" ==> TESTED OK

router.delete('/purgeemployee/:id', authenticateUser, verifyUserRole("admin"), async (req,res) => {
    try{ 
        // Finding the employee to be deleted:
        let deletedEmployee = await Employees.findByIdAndDelete(req.params.id);
        if(!deletedEmployee){
         return res.status(404).send("Employee id does not exist!");
        }
        res.json({
            "Success": "Employee has been purged permanently", 
            " employee": deletedEmployee
            });
    }
    catch(error){
        res.status(500).send("Internal server Error" + error);
        console.log("Internal server error: "+ error);
    }
})



// Route 7: To rehire the employee when the terminated record already exists in MongoDB using http POST operation in "api/employees/rehireemployee" ==> TESTED OK

router.post('/rehireemployee/:id', authenticateUser, verifyUserRole("admin"), async (req, res) => {
    try{
        const {firstName, lastName, dateOfBirth, contact, jobTitle, department, salary} = req.body;
        let employeeToBeRehired = await Employees.findByIdAndUpdate(req.params.id, {$set: {firstName, lastName, dateOfBirth, contact, jobTitle, department, salary, "deleted": false, "hireDate": Date.now()}}, {new: true});;

        // To check if the employeeToBeRehired exists in MongoDB
        if(!employeeToBeRehired){
            return  res.status(404).send("Employee cannot be rehired as the record for this employee does not exists");
        }


        //Updating the "deleted" flag to false and update the employee record as per the new employee received
        // employeeToBeRehired = await Employees.findByIdAndUpdate(req.params.id, {$set: {firstName, lastName, dateOfBirth, contact, jobTitle, department, salary, "deleted": false}}, {new: true});
        res.json(employeeToBeRehired);             
    }
    catch(error){
        res.status(500).send("Internal server Error" + error);
        console.log("Internal server error: "+ error);
    }
})


module.exports = router;