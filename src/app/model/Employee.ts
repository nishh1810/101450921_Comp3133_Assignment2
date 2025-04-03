export class Employee {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    gender: string = 'Male';  // Default value
    designation: string = 'Software Engineer';  // Default value
    salary: number = 5000;  // Default value
    date_of_joining: string;
    department: string = 'IT';  // Default value
    employee_photo: string = 'default_photo.jpg';  // Default value
    created_at: string;
    updated_at: string;
  
    constructor(
      _id: string = '',
      first_name: string = '',
      last_name: string = '',
      email: string = '',
      gender: string = 'Male',  
      designation: string = 'Software Engineer',  
      salary: number = 5000, 
      date_of_joining: string = '',
      department: string = 'IT',  
      employee_photo: string = 'default_photo.jpg',  
      created_at: string = '',
      updated_at: string = ''
    ) {
      this._id = _id;
      this.first_name = first_name;
      this.last_name = last_name;
      this.email = email;
      this.gender = gender;
      this.designation = designation;
      this.salary = salary;
      this.date_of_joining = date_of_joining;
      this.department = department;
      this.employee_photo = employee_photo;
      this.created_at = created_at;
      this.updated_at = updated_at;
    }
  }
  