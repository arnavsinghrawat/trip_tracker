# Travel Tracker 🌎

An interactive web application that allows family members to track and visualize countries they've visited on a world map.

## Features
- Multi-user profiles with unique colors
- Interactive SVG world map visualization
- Real-time country highlighting
- Fuzzy country name search
- Persistent data storage with PostgreSQL

## Technologies Used
- Node.js
- Express
- PostgreSQL
- EJS templating
- SVG manipulation
- CSS

## Database Schema
### Tables
1. `countries`
   - country_code (PK)
   - country_name

2. `user_table`
   - user_id (PK)
   - user_name
   - user_color

3. `visited_countries`
   - country_code (FK)
   - user_id (FK)

## Setup
1. Clone the repository
git clone <your-repo-url> #bash

2. Install dependencies
npm install

3. Set up PostgreSQL database
look at sql queries file

4. Configure database connection in index.js

javascript
const db = new pg.Client({
user: "your_username",
host: "localhost", 
database: "world",
password: "your_password",
port: 5432,
});

5. Start the server
nodemon index.js #bash