import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from 'apollo-angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../model/Employee';

@Component({
  selector: 'app-employee',
  standalone: true,
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  imports: [CommonModule, FormsModule]
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];
  showAddEmployeeForm: boolean = false;
  showViewEmployeeForm: boolean = false;  // To control view mode
  newEmployee: Employee = new Employee();  // Create an instance of Employee with default values
  selectedEmployee: Employee | null = null; // For tracking the employee being updated or viewed
  employeeForm: Employee = new Employee(); // Initialize employeeForm with a default Employee instance

  // Define the GraphQL query to get all employees
  GET_ALL_EMPLOYEES_QUERY = gql`
    query {
      getAllEmployees {
        _id
        first_name
        last_name
        email
        gender
        designation
        salary
        date_of_joining
        department
        employee_photo
        created_at
        updated_at
      }
    }
  `;

  // Define the GraphQL mutation to add a new employee
  ADD_EMPLOYEE_MUTATION = gql`
    mutation AddEmployee($first_name: String!, $last_name: String!, $email: String!) {
      addEmployee(
        first_name: $first_name,
        last_name: $last_name,
        email: $email,
        gender: "Male",
        designation: "Software Engineer",
        salary: 5000.0,
        date_of_joining: "2024-02-06",
        department: "IT",
        employee_photo: "john_doe.jpg"
      ) {
        _id
        first_name
        last_name
        email
        gender
        designation
        salary
        date_of_joining
        department
        employee_photo
        created_at
        updated_at
      }
    }
  `;

  // Define the GraphQL mutation to delete an employee
  DELETE_EMPLOYEE_MUTATION = gql`
    mutation DeleteEmployee($eid: String!) {
      deleteEmployee(eid: $eid)
    }
  `;

  // Define the GraphQL mutation to update an employee
  UPDATE_EMPLOYEE_MUTATION = gql`
    mutation UpdateEmployee(
      $eid: String!,
      $first_name: String!,
      $last_name: String!,
      $email: String!,
      $gender: String!,
      $designation: String!,
      $salary: Float!,
      $date_of_joining: String!,
      $department: String!,
      $employee_photo: String!
    ) {
      updateEmployee(
        eid: $eid,
        first_name: $first_name,
        last_name: $last_name,
        email: $email,
        gender: $gender,
        designation: $designation,
        salary: $salary,
        date_of_joining: $date_of_joining,
        department: $department,
        employee_photo: $employee_photo
      ) {
        _id
        first_name
        last_name
        email
        gender
        designation
        salary
        date_of_joining
        department
        employee_photo
        created_at
        updated_at
      }
    }
  `;

  constructor(private apollo: Apollo, private router: Router) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  // Fetch employee data from GraphQL API
  fetchEmployees(): void {
    this.apollo
      .watchQuery({
        query: this.GET_ALL_EMPLOYEES_QUERY,
        fetchPolicy: 'no-cache'
      })
      .valueChanges.subscribe({
        next: (response: any) => {
          this.employees = response?.data?.getAllEmployees || [];
        },
        error: (error) => {
          console.error('Error fetching employees:', error);
        }
      });
  }

  // Show the "Add Employee" form
  addEmployee(): void {
    this.selectedEmployee = null;
    this.employeeForm = new Employee(); // Reset form to default values
    this.showAddEmployeeForm = true;
    this.showViewEmployeeForm = false;
  }

  // Show the "Update Employee" form
  updateEmployee(id: string): void {
    const employeeToUpdate = this.employees.find(emp => emp._id === id);
    if (employeeToUpdate) {
      this.selectedEmployee = new Employee(
        employeeToUpdate._id,
        employeeToUpdate.first_name,
        employeeToUpdate.last_name,
        employeeToUpdate.email,
        employeeToUpdate.gender,
        employeeToUpdate.designation,
        employeeToUpdate.salary,
        employeeToUpdate.date_of_joining,
        employeeToUpdate.department,
        employeeToUpdate.employee_photo,
        employeeToUpdate.created_at,
        employeeToUpdate.updated_at
      );
      this.employeeForm = { ...this.selectedEmployee };
      this.showAddEmployeeForm = true;
      this.showViewEmployeeForm = false;
    }
  }

  // Show the "View Employee" details
  viewEmployee(id: string): void {
    const employeeToView = this.employees.find(emp => emp._id === id);
    if (employeeToView) {
      this.selectedEmployee = new Employee(
        employeeToView._id,
        employeeToView.first_name,
        employeeToView.last_name,
        employeeToView.email,
        employeeToView.gender,
        employeeToView.designation,
        employeeToView.salary,
        employeeToView.date_of_joining,
        employeeToView.department,
        employeeToView.employee_photo,
        employeeToView.created_at,
        employeeToView.updated_at
      );
      this.employeeForm = { ...this.selectedEmployee };
      this.showAddEmployeeForm = false;
      this.showViewEmployeeForm = true;
    }
  }

  // Method to update an existing employee
  submitEmployee(): void {
    if (this.selectedEmployee) {
      const { _id, first_name, last_name, email, gender, designation, salary, date_of_joining, department, employee_photo } = this.employeeForm;

      this.apollo
        .mutate({
          mutation: this.UPDATE_EMPLOYEE_MUTATION,
          variables: {
            eid: _id,
            first_name,
            last_name,
            email,
            gender,
            designation,
            salary: salary,
            date_of_joining,
            department,
            employee_photo
          }
        })
        .subscribe({
          next: (response: any) => {
            console.log('Employee updated:', response.data.updatedEmployee);
            this.fetchEmployees();
            this.showAddEmployeeForm = false;
            this.selectedEmployee = null;
          },
          error: (error) => {
            console.error('Error updating employee:', error);
            alert('Error updating employee');
          }
        });
    }
  }

  // Method to add a new employee
  submitNewEmployee(): void {
    const { first_name, last_name, email } = this.employeeForm;

    this.apollo
      .mutate({
        mutation: this.ADD_EMPLOYEE_MUTATION,
        variables: { first_name, last_name, email }
      })
      .subscribe({
        next: (response: any) => {
          console.log('Employee added:', response.data.addEmployee);
          this.fetchEmployees();
          this.showAddEmployeeForm = false;
          this.resetForm();
        },
        error: (error) => {
          console.error('Error adding employee:', error);
          alert('Error adding employee');
        }
      });
  }

  // Reset form fields
  resetForm(): void {
    this.newEmployee = new Employee();
    this.employeeForm = { ...this.newEmployee };
  }

  // Method to delete an employee
  deleteEmployee(eid: string): void {
    const isValidObjectId = /^[a-fA-F0-9]{24}$/.test(eid);

    if (!isValidObjectId) {
      alert('Invalid employee ID.');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this employee?');
    if (confirmDelete) {
      console.log('Deleting employee with ID:', eid);

      this.apollo
        .mutate({
          mutation: this.DELETE_EMPLOYEE_MUTATION,
          variables: { eid }
        })
        .subscribe({
          next: (response: any) => {
            console.log('Employee deleted:', response.data.deleteEmployee);
            this.fetchEmployees();
          },
          error: (error) => {
            console.error('Error deleting employee:', error);
            alert(`Error deleting employee: ${error.message}`);
          }
        });
    }
  }
}
