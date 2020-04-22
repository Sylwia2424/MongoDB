const Employee = require('../employees.model');
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
      const testEmpOne = new Employee({ firstName: 'Employee #1', lastName: 'Employee #2', department: 'Employee #3'  });
      await testEmpOne.save();
  
      const testEmpTwo = new Employee({ firstName: 'Employee #1', lastName: 'Employee #2', department: 'Employee #3' });
      await testEmpTwo.save();

    });
    
    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find({ firstName: 'Employee #1', lastName: 'Employee #2', department: 'Employee #3' });
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);    
    });
  
  
    /*it('should return a proper document by "firsName", "lastName", "department" with "findOne" method', async () => {
      const Employee = await Employee.findOne({ firstName: 'Employee #1', lastName: 'Employee #1', department: 'Employee #1'});
      const expectedfirstName = 'Employee #1';
      const expectedlastName = 'Employee #1';
      const expecteddepartment = 'Employee #1';
      expect(Employee.firstName, Employee.lastName, Employee.department).to.be.equal('Employee #1');
    });*/
  
    after(async () => {
    await Employee.deleteMany();
    });
  
  });

  
  after(() => {
    mongoose.models = {};
  });

});