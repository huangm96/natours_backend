# Natours Backend

This is a tour booking application backend built with Nodejs

basic url : [https://natoursbe.herokuapp.com/](https://natoursbe.herokuapp.com/)

github: [https://github.com/huangm96/natours_backend](https://github.com/huangm96/natours_backend)

# Project Description

This project is part of the online course I've taken at Udemy. [https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/). Jonas Schmedtmann used PHP to build the web pages in his course. I used React to rebuild the frontend part. I also added some new features based on his UX/UI. Here is my frontend demo website: [https://natours-mh.netlify.app/](https://natours-mh.netlify.app/)

### Build With

---

- [NodeJS](https://nodejs.org/en/)
- [Express](http://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Pug](https://pugjs.org/api/getting-started.html)
- [JSON Web Token](https://jwt.io/)
- [Stripe](https://stripe.com/)
- [Postman](https://www.getpostman.com/)
- [Mailtrap](https://mailtrap.io/) & [nodemailer](https://nodemailer.com/about/)
- [Heroku](https://www.heroku.com/)

### Features

---

- Authentication and Authorization
  - Register/Login/logout (admin/lead-guide/guide/user)
  - Require authentication to access some data
  - ForgetPassword/reset password/update password
- Tour
  - Find all tours/ find a tour
  - Create/update/delete a tour (admin/lead-guide only)
  - get monthly plan (admin/lead-guide/guide)
  - get top-5-cheap tours
  - get tour status
  - get tours within radius
- User
  - Find/update/delete your data (Authentication required)
  - Find all users/update/delete a user (admin only)
- Review
  - Find all reviews by tour
  - Find/create/update/delete your reviews (Authentication required)
- booking
  - Find all bookings by tour
  - Find your booking (Authentication required)
  - Create booking while payment completed (Authentication required)
- Payment
  - Use the 3rd party library to send payment - scripts
  - Direct to payment success page, if received payment
  - Direct to payment fail page, if didn't receive payment
  - ```
    scripts Test Mode:
    use this credit card to book a tour
    credit card: 4242 4242 4242
    expird date: MM/YY - any date will work
    cvv: 000 - any numbers will work
    ```

### API

---

Check Natours API Documentation for more info.

### To-do

---

- confirm user email
- two-factor authentication
- google/facebook login

# Contact Me

Feel free to email me at [minh.huang96@gmail.com](https://github.com/huangm96/natours_frontend/blob/main/minh.huang96@gmail.com) if you have any issues, questions or ideas. Thank you! 🙂
