# Learn-ify: 
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/oaawad/Learnify/node.js.yml) ![Website](https://img.shields.io/website?down_message=offline&up_message=online&url=https%3A%2F%2Flearn-ify.live)

Our project is a Website implemented using MERN stack that helps education be more accessible online and through it, an instructor create a course from one end and the user is able to search and view the available courses to enroll in his/her desirable courses from the other end.

## Motivation

Our project aims to create a smooth experience for both the insturctor and the client of the learning process, online learning have become very essential and important. Hence, to accomplish our Advanced Computer Lab project, we followed the proposed requirements to produce this final product.

## Table of Content

1. [Key Functionalities](#key-functionalities)
2. [Backend Structure](#backend-structure)
3. [Screenshots](#screenshots)
4. [Build Status](#build-status)
5. [Extra Feature](#extra-feature)
6. [Installations](#installations)
7. [Credits](#credits)
8. [License](#license)

## Key Functionalities

On our platform we deal with 4 different user's roles each with unique functionalities.

#### 1. Guest User Point of View

- Guest user has access to the Home page which has the most popular courses and top rated courses
- Guest user can access and search all courses and view their prices according to his/her local prices
- Guest user can filter and sort the results
- Guest user can view the course's details
- Guest user can view Instroctur's profile
- Guest user can sign up for an account

#### 2. Individual User Point of View

- The Signed in User has all functionalities as the Guest user, except the Sign up/Sign in option is replaced with User Icon and a log out option
- Through the User Icon, the Registered User can view and edit all their details, including changing their password.
- The Signed in user could enroll to a course
- The Signed in user could enter his/her card info to pay for the course
- The signed in user could report a problem
- The signed in user could ask for a refund if he/she has not completed 50% of the course
- The signed in user could see his/her progress in the course
- The signed in user could download a certificate after the course completion
- The signed in user could take course exercise
- The signed in user could view Video from the course
- the signed in user could view his/her grade on the exercise

#### 3. Corporate User Point of View

- The Corporate User has all functionalities as the Guest user, except he/she cannot signup they can only be invited by the Administrator
- Through the User Icon, the Registered User can view and edit all their details, including changing their password.
- The Signed in user could request access to a course
- The signed in user could report a problem
- The signed in user could see his/her progress in the course
- The signed in user could download a certificate after the course completion
- The signed in user could take course exercise
- The signed in user could view Video from the course
- the signed in user could view his/her grade on the exercise

#### 4. Admin Point of View

- One signed in Admin has access to the Admin's Dashboard
- Admin Home Page displays the analytics of the corprates registered in the system.
- The Admin has access to a list of all users registered in the system.
- The Admin can Create Promotions for a specific course or all courses.
- The Admin can create new admin, invite an insturctor or a corporate trainee.
- The Admin is able to view and handle all problems submitted by the users
- The Admin is able to accept or reject a refund request from the user
- The Admin is able to grant or decline an access to specific course for trainee corps
- The Admin is able to view all requests to access courses

## Backend Structure

Before we dive into the detailed functionalities and how to navigate through our project, let's take a look on our database schema and api routes.

#### Collections in our Database:

1. User Schema (includes individual users, instructors and administrators)
2. Payment Schema
3. Corporate Schema
4. Corporate Student Schema
5. Subject Schema
6. Course Schema
7. Promotion Schema
8. Review Schema
9. Ticket Schema
10. Course Request Schema

#### API Routes

1. User Routes:

   ![User Routes](/frontend/public/readme/snippets/user.png 'User Routes')

2. Corporate Routes:

   ![Corporate Routes](/frontend/public/readme/snippets/corporate.png 'Corporate Routes')

3. Course Routes:

   ![Course Routes](/frontend/public/readme/snippets/course.png 'Course Routes')

4. Instructor Routes:

   ![Instructor Routes](/frontend/public/readme/snippets/course.png 'Instructor Routes')

5. Payment Routes:

   ![Payment Routes](/frontend/public/readme/snippets/payment.png 'Payment Routes')

6. Review Routes:

   ![Review Routes](/frontend/public/readme/snippets/review.png 'Review Routes')

7. Ticket Routes:

   ![Ticket Routes](/frontend/public/readme/snippets/ticket.png 'Ticket Routes')

## Screenshots

Now that we explored how our backend works, in the following section, we will present some screenshots form our website for different user stories.

### 1. Guest User Point of View

- Home

  ![Home](/frontend/public/readme/screenshots/home.png 'Home')

- Login

  ![Login](/frontend/public/readme/screenshots/login.png 'Login')

- Register

  ![Register](/frontend/public/readme/screenshots/register.png 'Register')

- View all courses
  ![View all courses](/frontend/public/readme/screenshots/courses.png 'View all courses')
- View course details

  ![View course details](/frontend/public/readme/screenshots/courseDetails.png 'View course details')

### 2. Instructor Point of View

- View profile

  ![View profile](/frontend/public/readme/screenshots/profile.png 'View profile')

- Create Course

  ![Create Course Basic Information](/frontend/public/readme/screenshots/basic.png 'Create Course Basic Information')
  ![Create Course Curriculum](/frontend/public/readme/screenshots/curr.png 'Create Course Curriculum')
  ![Create Course Preview](/frontend/public/readme/screenshots/preview.png 'Create Course Preview')
  ![Create Course Submit](/frontend/public/readme/screenshots/submit.png 'Create Course Submit')

### 3. Admin Point of View

Our Admins have a dashboard wher they can control everything, here some examples:

- View all users and some analytics.

  ![Users](/frontend/public/readme/screenshots/users.png 'Users')

- View active promotions and/or create one.

  ![Promotions](/frontend/public/readme/screenshots/promotions.png 'Promotions')

- View and add corporates, Invite corporate students.

  ![Corporates](/frontend/public/readme/screenshots/corporates.png 'Corporates')

- View and handle refund requests.

  ![Refund Requests](/frontend/public/readme/screenshots/refund.png 'Refund Requests')

## Build Status
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/oaawad/Learnify/node.js.yml) ![Website](https://img.shields.io/website?down_message=offline&up_message=online&url=https%3A%2F%2Flearn-ify.live)

The website is currently deployed on a DigitalOcean Droplet linked to the domain [learn-ify.live](https://learn-ify.live) where load balancing is done using [Nginx](https://www.nginx.com), We implemented all the functional requirements in our project but we integrated some dummy data to make the website look more professional and aesthetically pleasing, like the courses and the offers and the Frequently asked questions in the Support page, and the analytics in the Admin Page. It would be more useful to make those features functional in the near future.

## Extra Feature

We implemented an extra feature in our project which is the Instructor Draft. Instructors have two options when they are creating a course, they can either save it as a draft and edit it later, or make it public so students can start enrolling.

## Installations

Use the package manager [npm](https://www.npmjs.com/) to install the required dependences, they can be found in two locations inside package.json files in the root directory and in the frontend folder, you'll have to run the command in each destination

```bash
cd Infrno
npm install
```

```bash
cd Infrno/frontend
npm install
```

also create a .env file at the root of the repo containing values for the following keys (PORT,ENV,CLIENT_URL,MongoDB_URL,JWT_SECRET,Youtube_API_KEY,STRIPE_KEY,STRIPE_WEBHOOK_SECRET,Mail,Pass)

to run the website locally simply run

```bash
cd Infrno
npm run dev
```

## Credits

[Udemy Course: The Web Development Bootcamp](https://www.udemy.com/course/the-web-developer-bootcamp/)

[FrontendMasters Course: Complete Intro To React](https://frontendmasters.com/courses/complete-react-v7)

[React Documentation](https://reactjs.org/)

[MongoDB Schema Design Best Practices](https://www.mongodb.com/developer/article/mongodb-schema-design-best-practices/)

[MUI React Library](https://mui.com/)

[MERN Stack Authentication Tutorial](https://dev.to/salarc123/mern-stack-authentication-tutorial-part-1-the-backend-1c57)

## License

[MIT](https://choosealicense.com/licenses/mit/)
