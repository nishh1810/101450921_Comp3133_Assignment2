import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from 'apollo-angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Employee } from '../../model/Employee';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';  

@Component({
  selector: 'app-employee',
  standalone: true,
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  imports: [CommonModule, FormsModule,ReactiveFormsModule]
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];
  showAddEmployeeForm: boolean = false;
  showViewEmployeeForm: boolean = false;
  selectedEmployee: Employee | null = null;
  employeeForm: FormGroup;  // Reactive form for validation
  searchTerm: string = '';
  selectedFile: File | null = null;

  constructor(private apollo: Apollo, private router: Router, private fb: FormBuilder) {
    // Initialize the form with validation rules
    this.employeeForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(3)]],
      last_name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['Male', [Validators.required]],
      designation: ['', [Validators.required]],
      salary: ['', [Validators.required, Validators.min(0)]],
      department: ['', [Validators.required]],
      employee_photo: ['']  // This is the file input, not needed for validation
    });
  }

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
    mutation AddEmployee($first_name: String!, $last_name: String!, $email: String!, $gender: String!, $designation: String!, 
            $salary: Float!,
            $department: String!) {
      addEmployee(
        first_name: $first_name,
        last_name: $last_name,
        email: $email,
        gender: $gender,
        designation: $designation,
        salary: $salary,
        date_of_joining: "2024-02-06",
        department: $department,
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

  SEARCH_EMPLOYEES_QUERY = gql`
  query SearchEmployee($designation: String, $department: String) {
    searchEmployeeByDesignationOrDepartment(designation: $designation, department: $department) {
      _id
      first_name
      last_name
      email
      gender
      designation
      department
      salary
      date_of_joining
    }
  }
`;

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
    this.employeeForm.reset();  // Reset form values
    this.showAddEmployeeForm = true;
    this.showViewEmployeeForm = false;

    this.employeeForm.enable();
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
      this.employeeForm.patchValue({
        first_name: employeeToUpdate.first_name,
        last_name: employeeToUpdate.last_name,
        email: employeeToUpdate.email,
        gender: employeeToUpdate.gender,
        designation: employeeToUpdate.designation,
        salary: employeeToUpdate.salary,
        department: employeeToUpdate.department
      });
      this.showAddEmployeeForm = true;
      this.showViewEmployeeForm = false;
    }
    this.employeeForm.enable();
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
      this.employeeForm.patchValue({
        first_name: employeeToView.first_name,
        last_name: employeeToView.last_name,
        email: employeeToView.email,
        gender: employeeToView.gender,
        designation: employeeToView.designation,
        salary: employeeToView.salary,
        department: employeeToView.department
      });
      this.showAddEmployeeForm = false;
      this.showViewEmployeeForm = true;

       // Disable all form controls for view mode
      this.employeeForm.disable();
    }
  }

  // Submit form to update employee
  submitEmployee(): void {
    if (this.employeeForm.invalid) {
      alert('Please fill all required fields correctly!');
      return;
    }

    const { first_name, last_name, email, gender, designation, salary, department } = this.employeeForm.value;

    const numericvalue = Number(salary);

    this.apollo
      .mutate({
        mutation: gql`
          mutation UpdateEmployee(
            $eid: ID!,
            $first_name: String!,
            $last_name: String!,
            $email: String!,
            $gender: String!,
            $designation: String!,
            $salary: Float!,
            $department: String!
          ) {
            updateEmployee(
              eid: $eid,
              first_name: $first_name,
              last_name: $last_name,
              email: $email,
              gender: $gender,
              designation: $designation,
              salary: $salary,
              department: $department
            ) {
              _id
              first_name
              last_name
              email
              designation
              salary
              updated_at
            }
          }
        `,
        variables: {
          eid: this.selectedEmployee?._id?.trim(),
          first_name, 
          last_name, 
          email, 
          gender, 
          designation, 
          salary: numericvalue, 
          department
        }
      })
      .subscribe({
        next: (response: any) => {
          console.log('Employee updated:', response.data.updateEmployee);
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

  // Submit form to add new employee
  submitNewEmployee(): void {
    if (this.employeeForm.invalid) {
      alert('Please fill all required fields correctly!');
      return;
    }

    const { first_name, last_name, email, gender, designation, salary, department } = this.employeeForm.value;

    this.apollo
      .mutate({
        mutation: this.ADD_EMPLOYEE_MUTATION,
        variables: { first_name, last_name, email, gender, designation, salary, department }
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

  // Reset form
  resetForm(): void {
    this.employeeForm.reset();
    this.selectedFile = null;
  }

  // Delete employee
  deleteEmployee(eid: string): void {
    const isValidObjectId = /^[a-fA-F0-9]{24}$/.test(eid);

    if (!isValidObjectId) {
      alert('Invalid employee ID.');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this employee?');
    if (confirmDelete) {
      this.apollo
        .mutate({
          mutation: gql`
          mutation DeleteEmployee($eid: ID!) {
            deleteEmployee(eid: $eid)
          }
        `,
        variables: { eid }
        })
        .subscribe({
          next: (response: any) => {
            if (response.data.deleteEmployee) {
              this.fetchEmployees();
            } else {
              alert('Delete failed');
            }
          },
          error: (error) => {
            alert(`Error deleting employee: ${error.message}`);
          }
        });
    }
  }

  // Handle file selection for employee photo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        this.selectedFile = file;
      } else {
        alert('Only PNG and JPEG files are allowed!');
      }
    }
  }

  // Search employees
  searchEmployees(): void {
    const value = this.searchTerm.trim();
    
    if (!value) {
      this.fetchEmployees();
      return;
    }

    this.apollo.query({
      query: this.SEARCH_EMPLOYEES_QUERY,
      variables: {
        designation: value || null,
        department: value || null
      },
      fetchPolicy: 'no-cache'
    }).subscribe({
      next: (response: any) => {
        this.employees = response.data.searchEmployeeByDesignationOrDepartment || [];
      },
      error: (error) => {
        alert('Search failed');
      }
    });
  }

  // Getter to hide employee photo during update
  get isUpdateMode(): boolean {
    return this.selectedEmployee !== null;
  }
}
