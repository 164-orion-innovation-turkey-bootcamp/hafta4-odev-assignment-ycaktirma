# Yarkin's Coffee Store
This is a web application which you can create an account and order coffee.You can also see other users comments on products!

## Important note
Application has no real database connection, all the user data is stored on json-server and it is public and passwords are NOT hashed. Please consider that everyone CAN see your password! Use random password (like 123qwe) instead of passwords that can contain personal information.

# [LIVE](https://yarkinscoffeestore.herokuapp.com/)

Don't forget to add your comments on products :)

## Or run the project on your local machine:

1. First download the code
``git clone https://github.com/164-orion-innovation-turkey-bootcamp/hafta4-odev-assignment-ycaktirma.git``

2. Navigate to project directory 
``cd hafta-4-odev-assignment-ycaktirma``
3. Run 
``npm install``
4. Start the application using `npm run dev-start` (Shorthand for `json-server --watch database.json & ng serve`)

## NOTES
* When you install the project and run it manually, it uses local json-server but live version uses this [this](https://yarkinscoffeestore-server.herokuapp.com) one.
* You can see purchase logs [here](https://yarkinscoffeestore-server.herokuapp.com/logs).