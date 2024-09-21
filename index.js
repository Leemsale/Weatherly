// 1. Importing node packages
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { getName } from "country-list";

// 2. Creating an express app and setting the port number
const app = express();
const port = 3000;

// 3. Use the public folder for static files and setting up middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// 4. Home route
app.get('/', (req, res) => {
    res.render("index.ejs");
});

// 6. Weather route
app.post('/weather', async (req, res) => {
    const city = req.body.city;
    console.log("City:", city); // Debugging statement

    // Ensure city is not empty
    if (!city) {
        return req.render('error', { error: 'Please enter city name' });
    }

    const apiKey = 'ce03fc80946cddd46ac344905a570f45';
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    console.log("URL:", url); // Debugging statement

    try {
        // Make a get request to the OpenWeatherMap API
        const result = await axios.get(url);
        const forecastData = result.data;

        console.log("Forecast Data:", forecastData) // Debugging statement

        // Convert country code to full country name
        forecastData.countryName = getName(forecastData.sys.country);

        res.render('weather.ejs', { forecast: forecastData});
    } catch (error) {
        console.error("Error:", error); // Debugging statement

        // Render the error.ejs file if there's an error
        res.render('error.ejs', { error: 'City not found' });
    }
});
app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
});