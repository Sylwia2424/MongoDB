const Employee = require('../employees.model');
const Department = require('../department.model.js');

const expect = require('chai').expect;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongoose = require('mongoose');

describe('Employee', () => {

  before(async () => {

    try {
      const fakeDB = new MongoMemoryServer();
  
      const uri = await fakeDB.getConnectionString();
  
      mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
    } catch(err) {
      console.log(err);
    }
  
  });
  describe('Reading data', () => {
    before(async () => {
      const dep = new Department({ name: 'Department #1'});
      await dep.save();

      const testEmpOne = new Employee({ firstName: 'Employee #1', lastName: 'lastName', department: 'id'  });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'Employee #2', lastName: 'lastName2', department: 'id2'  });
      await testEmpTwo.save();
    });
    
    it('should return all the data with "find" method', async () => {
      //const dep = new Department({ name: 'Department #1'});
      //await dep.save();
      const employees = await Employee.find();
      const expectedLength = 1;
      expect(employees.length).to.be.equal(expectedLength);

    });      
      
    it('should return a proper document by "firsName", "lastName", "department" with "findOne" method', async () => {
      const employees = await Employee.findOne({ firstName: 'Employee #2', lastName: 'lastName2', department: 'id2'});
      const expectedFirstName = 'Employee #2';
      const expectedlastName = 'lastName2';
      const expecteddepartment = 'id2';
      expect(employees.firstName, employees.lastName, employees.department).to.be.equal( 'Employee #2', 'lastName2', 'id2');
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Creating data', () => {

    it('should insert new document with "insertOne" method', async () => {
      const employees = new Employee({ firstName: 'Employee #1', lastName: 'lastName', department: 'id' });
      await employees.save();
      expect(employees.isNew).to.be.false;
    });
  
    after(async () => {
      await Employee.deleteMany();
    }); 
    
  });

  describe('Updating data', () => {
    beforeEach(async () => {
      const dep = new Department({ name: 'Department #1'});
      await dep.save();

      const testEmpOne = new Employee({ firstName: 'Employee #1', lastName: 'lastName', department: 'id' });
      await testEmpOne.save();
    
      const testEmpTwo = new Employee({ firstName: 'Employee #2', lastName: 'lastName2', department: 'id2' });
      await testEmpTwo.save();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'Employee #1', lastName: 'lastName', department: 'id' }, 
      { $set: { firstName: 'Employee #1', lastName: 'lastName', department: 'id' }});
      const updatedEmployee = await Employee.findOne({ firstName: 'Employee #1', lastName: 'lastName', department: 'id' });
      expect(updatedEmployee).to.not.be.null;
    });
  
    it('should properly update one document with "save" method', async () => {
      const dep = new Department({ name: 'Department #1'});
      await dep.save();
      const employee = await Employee.findOne({ firstName: 'Employee #1', lastName: 'lastName', department: 'id' });
      employee.firstName = '=Employee #1=';
      employee.lastName = '=lastName=';
      employee.department = '=id=';

      await employee.save();
    
      const updatedEmployee = await Employee.findOne({ firstName: 'Employee #1', lastName: 'lastName', department: 'id' });
      expect(updatedEmployee).to.not.be.null;
    });
  
    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { firstName: 'Updated!', lastName: 'Updated!', department: 'Updated!' }});
      const employees = await Employee.find();
      expect(employees[0].firstName).to.be.equal('Updated!');
      expect(employees[1].firstName).to.be.equal('Updated!');
      expect(employees[0].lastName).to.be.equal('Updated!');
      expect(employees[1].lastName).to.be.equal('Updated!');
      expect(employees[0].department).to.be.equal('Updated!');
      expect(employees[1].department).to.be.equal('Updated!');

    });

    after(async () => {
      await Employee.deleteMany();
    }); 

  });  
  describe('Removing data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'Employee #1', lastName: 'lastName', department: 'id' });
      await testEmpOne.save();
    
      const testEmpTwo = new Employee({ firstName: 'Employee #2', lastName: 'lastName2', department: 'id2'});
      await testEmpTwo.save();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'Employee #1', lastName: 'lastName', department: 'id' });
      const removeEmployee = await Employee.findOne({ firstName: '=Employee #1=', lastName: '=lastName=', department: '=id=' });
      expect(removeEmployee).to.be.null;
    });
  
    it('should properly remove one document with "remove" method', async () => {
      //const employee = await Employee.findOne({firstName: 'Employee #1'});
      await Employee.remove({firstName: 'Employee #1', lastName: 'lastName', department: 'id' });
      const removedEmployee = await Employee.findOne({firstName: '=Employee #1=', lastName: '=lastName=', department: '=id='});
      expect(removedEmployee).to.be.null;
    });
  
    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });

    after(async () => {
      await Employee.deleteMany();
    });

  });
  
  after(() => {
    mongoose.models = {};
  });

});