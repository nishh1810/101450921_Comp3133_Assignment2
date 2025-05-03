# 👩‍💼 Employee Management App (Angular + Apollo GraphQL)

The **Employee Management App** is a full-featured web application developed using **Angular** and **Apollo GraphQL**. It allows users to manage employee records with an intuitive UI and robust data-handling capabilities. Users can perform CRUD operations and filter employees using a smart, unified search bar.

---

## 🚀 Features

- 🧑‍💼 **Employee Management**
  - Create, view, update, and delete employee records.
  - Form validation for inputs like name, email, department, and designation.

- 🔍 **Unified Search**
  - Single search textbox to filter employees by **department** or **designation**.

- ⚡ **GraphQL Integration**
  - Uses Apollo Client for Angular to interact with a GraphQL API.
  - Real-time UI updates using reactive queries and mutations.

- 🖥️ **Responsive UI**
  - Built with Angular Material or Bootstrap (depending on your setup).
  - Responsive across devices and screen sizes.

- ✅ **Form Validation**
  - Reactive forms with error handling and input validation.

---

## 🛠️ Tech Stack

| Layer        | Technology                     |
|--------------|---------------------------------|
| Frontend     | Angular                         |
| GraphQL Client | Apollo Angular                 |
| Backend API  | GraphQL (Apollo Server or any GraphQL backend) |
| Styling      | Angular Material / Bootstrap    |
| Language     | TypeScript                      |

---

## 📁 Project Structure

src/ ├── app/ │ ├── components/ # Reusable components (employee list, form, etc.) │ ├── graphql/ # GraphQL queries and mutations │ ├── models/ # TypeScript interfaces │ ├── services/ # Employee data service using Apollo │ └── app.module.ts # Root Angular module## 🔧 Getting Started

### 1. Clone the repository
git clone https://github.com/nishh1810/EmployeeManagementApp_Angular.git
cd employee-management-app
### 2. Install the dependencies
npm install
### 3. Run the development server
ng serve
### Go to Browser and Run
http://localhost:4200/
