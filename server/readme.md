# Oclock Memory Server

This is a server for the oclock memory test

## Installation

1. Install node dependancies  
`npm install`

2. Setup your databases informations in `config/config.json`

3. Migrate your database  
`npx sequelize-cli db:migrate`

4. Edit your desired running port in `config.js`

5. Setup your NODE_ENV variable to desired environment

6. Run using `node index.js`