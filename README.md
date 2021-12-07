# Library Management System

Hello! Welcome to my repository. This project was built as part of [Frappe's Dev Hiring Test](https://frappe.io/dev-hiring-test). As outlined in their assignment, this is a Library Management System which supports:
- Basic [CRUD](https://developer.mozilla.org/en-US/docs/Glossary/CRUD) operations on Books and Members.
- Issuing books to members
- Returning books from members
- Charging rent on return.
- Ensuring the debt does not go above Rs. 500.

Additionally, a librarian is able to maintain:
- Books
- Members
- Transactions
- Reports on popular books and highest paying members

The application is compatible with Frappe's API, which is used for importing Books. 

## How to use?

- Install the dependencies:

```
npm install
```

- Install MongoDB and run it by following the instructions on their [docs](https://docs.mongodb.com/manual/administration/install-community/).

- Start the server:
```
npm run dev
```
- Open `localhost:5000` in your browser.

## Tech Stack:
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/Javascript-ffd700?style=for-the-badge&logo=Javascript&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-ffffff?style=for-the-badge&logo=Node.js&logoColor=fffff)
![Express](https://img.shields.io/badge/-Express-success?style=for-the-badge&logo=Express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

## Screenshots:

### Home Page:

<img src="screenshots/index.png" alt="Home Page" width=600 height=400>

### Manage Books:

<img src="screenshots/books.png" alt="Book List" width=600 height=300>

### Book Details:

<img src="screenshots/books_details.png" alt="Book Details" width=600 height=600>

### Edit a Book:

<img src="screenshots/books_edit.png" alt="Edit Book" width=600 height=300>

### Import Books:

<img src="screenshots/books_import.png" alt="Import Book" width=600 height=200>

### Manage Members:

<img src="screenshots/members.png" alt="Member List" width=600 height=200>

### Member Details:

<img src="screenshots/member_details.png" alt="Member Details" width=600 height=500>

### Issue Books:

<img src="screenshots/member_issue.png" alt="Issue Book" width=600 height=300>

### Issue Books(with debt exceeded):

<img src="screenshots/member_issue_with_debt_exceeded.png" alt="Issue Book with debt" width=600 height=300>

### Return Books:

<img src="screenshots/member_return_book.png" alt="Return Book" width=600 height=200>

### Updated Member with debt:

<img src="screenshots/member_update_with_debt.png" alt="Updated Member" width=600 height=500>

### Clearing Debt:

<img src="screenshots/member_update_with_no_debt.png" alt="Updated Member" width=600 height=450>


### Transaction Details:

<img src="screenshots/transactions.png" alt="Transaction Details" width=600 height=550>

### Reports:

<img src="screenshots/reports.png" alt="Reports" width=600 height=400>