const City = require('../models/city');

// Add a new city
exports.addCity = async (req, res) => {
    try {
        // Destructure the required fields from the request body
        const { name, lat, lng, openingHours, closingHours } = req.body; 
        // Ensure all required fields are provided
        if (!name || lat === undefined || lng === undefined || !openingHours) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Create a new city instance with the provided data
        const newCity = new City({ name, lat, lng, openingHours, closingHours });
        // Save the new city to the database
        await newCity.save();
        // Respond with the created city
        res.status(201).json(newCity);
    } catch (error) {
        // Log the error and respond with a 500 status
        console.error("Failed to add city:", error);
        res.status(500).json({ error: 'Failed to add city', details: error.message });
    }
};

// Retrieve all cities
exports.getAllCities = async (req, res) => {
    try {
        // Fetch all cities from the database
        const cities = await City.find({});
        const currentTime = new Date();
        // Map through the cities and check if they are open based on the current time
        const cityData = cities.map(city => {
            // Ensure the city and its required fields are valid
            if (!city || !city.openingHours || !city.closingHours) {
                console.error('Invalid city data:', city);
                return null; // Return null for invalid city data
            }

            const [openingHour, openingPeriod] = (city.openingHours || '').split(' ');
            const [closingHour, closingPeriod] = (city.closingHours || '').split(' ');

            // Ensure all parts of the opening and closing hours are valid
            if (!openingHour || !openingPeriod || !closingHour || !closingPeriod) {
                console.error('Invalid opening/closing hours for city:', city.name);
                return {
                    ...city._doc,
                    isOpen: false // Default value for isOpen
                };
            }

            // Calculate the opening and closing times based on the current date
            const openingTime = new Date(currentTime);
            const closingTime = new Date(currentTime);
            
            openingTime.setHours(parseInt(openingHour) + (openingPeriod.toLowerCase() === 'pm' && openingHour !== '12' ? 12 : 0));
            closingTime.setHours(parseInt(closingHour) + (closingPeriod.toLowerCase() === 'pm' && closingHour !== '12' ? 12 : 0));
            
            // Check if the city is currently open
            const isOpen = currentTime >= openingTime && currentTime <= closingTime;

            return {
                ...city._doc,
                isOpen
            };
        }).filter(city => city !== null); // Filter out null values

        // Respond with the city data
        res.status(200).json(cityData);
    } catch (error) {
        // Log the error and respond with a 500 status
        console.error('Error in getAllCities:', error);
        res.status(500).json({ error: 'Failed to fetch cities', details: error.message });
    }
};

// Delete a city by ID
exports.deleteCity = async (req, res) => {
    try {
        const { id } = req.params;
        // Find the city by ID and delete it
        await City.findByIdAndDelete(id);
        // Respond with a success message
        res.status(200).json({ message: 'City deleted successfully' });
    } catch (error) {
        // Respond with a 500 status if deletion fails
        res.status(500).json({ error: 'Failed to delete city' });
    }
};
