
<h1 align="center">  🛒 &nbsp; ShopFront -> One Stop solutions for shops  🛒 </h1>

> Built with MERN stack (MongoDB, Express, React and Node).

> Developed a full-featured eCommerce platform using the MERN stack (MongoDB, Express, React, Node), 
integrated with Razorpay for secure payment processing. 
This app allows customers to browse, manage carts, place orders, and track their order status through a 
seamless and responsive interface.

## 📜 &nbsp; Table of contents

- [Main Features](#--main-features)
- [Technologies](#--technologies)
- [Key Concepts](#--key-concepts)
- [Microservices-diagram](#--microservices-diagram)
- [UML Diagram](#--uml-diagram)
- [ENV](#--ENV)

## 🚩 &nbsp; Main Features

> This App was made to track the order state since the customer place it
> once it's shipped the admin mark it as shipped, and then the Admin mark it as delivered.

#### Project methodology

- **Register and signin system**
  - Everyone is registered as a customer.
  - One Admin is already registered which controls the functioning of the webApp
  - Admin only created by the Admin.
  - Authenticated roles

- **Product life cycle**
  - A Admin can add a product.
  - A customer order some products, number in stock decreases.
  - The customer tracks the order's state since it's placed. 
  - The shipper pick the product, the seller mark it as shipped.
  - The shipper deliver the order, and mark it as delivered.
  - The customer may want to turn it back.
  - Razorpay Integration.

- **Other facilities**
  - Users can edit their account info. 
  - Users can track their order's state. 
  - Users can change password. 
  - Users can have a wishlist with any amount of products. 

#### Users roles - 

- **Customer**
  - Sign up & login.
  - Purchase order of any amount of products.
  - Choose different category/ratings/amt to search the product.
  - Add Reviews and Ratings to the product.
  - Tracking order state. 
  - Return order (To do).
- **Admin** -> all above plus
  - Add, Edit and Delete categories.
  - Add, Edit and Delete any products.
  - CRUD operations for products, users, orders, reviews
  - Filtering/sorting of products/users/orders/reviews.
  

## 💹 &nbsp; Technologies

> Project is created with:
#### Backend

- Express
- Mongoose
- Json Web Token (For authentication)
- bcryptjs (for data encryption)

#### Frontend

- React JS
- Redux (Manage app state)
- React-router (To handle routing)
- Axios (For http requests)
- React-toastify (To handle success and error message)
  
## 💡 &nbsp; Key Concepts

- MVC (Model-View-Controller)
- CRUD operations
- Authentication system
- Encrypting passwords
- Images handling using cloudinary
- OOP (Object Oriented Programming)

## 📈 &nbsp; UML Diagram

![shopfront  UML diagram](https://github.com/user-attachments/assets/ac22fb80-4f4e-4393-a43a-54d6eb9eebe6)

## 🌫 &nbsp; Microservices Diagram

>![Detailed API, Redux and Services Architecture](https://user-images.githubusercontent.com/93027256/225910377-3f8c5df7-bbf6-4148-84ce-81681990bce7.PNG)

## &nbsp; ENV
```
- DATABASE=
- PORT=
- REACT_APP_API_URL=
- RAZORPAY_KEY_ID=
- RAZORPAY_SECRET=
