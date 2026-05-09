const express = require('express');
   require('dotenv').config();

   const app = express();
   // This tells the app to use the port from your .env file, or default to 5000
   const PORT = process.env.PORT || 5000;

   // A simple test route so we can verify the server is breathing
   app.get('/', (req, res) => {
       res.send('Supershop Backend is alive!');
   });

   // This actually starts the server
   app.listen(PORT, () => {
       console.log(`Server is running on port ${PORT}`);
   });