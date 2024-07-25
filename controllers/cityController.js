const City = require('../models/city');

// Adding a new city
exports.addCity = async (req, res) => {
    try {
        console.log('Received request to add city:', req.body);
        const { name, lat, lng, openingHours, closingHours } = req.body;
        if (!name || lat === undefined || lng === undefined || !openingHours || !closingHours) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const newCity = new City({ name, lat, lng, openingHours, closingHours });
        await newCity.save();
        console.log('New city added:', newCity);
        res.status(201).json({ message: 'City added successfully', city: newCity });
    } catch (error) {
        console.error("Failed to add city:", error);
        res.status(500).json({ error: 'Failed to add city', details: error.message });
    }
};

// Fetching all cities
exports.getAllCities = async (req, res) => {
    try {
        const cities = await City.find({});
        console.log('Cities found:', cities);  // לוג חדש

        const currentTime = new Date();
        console.log('Current time:', currentTime);  // לוג חדש

        const cityData = cities.map(city => {

            if (!city || !city.openingHours || !city.closingHours) {
                console.error('Invalid city data:', city);
                return null;
            }

            const [openingHour, openingPeriod] = (city.openingHours || '').split(' ');
            const [closingHour, closingPeriod] = (city.closingHours || '').split(' ');

            // Ensure all parts are present

            if (!openingHour || !openingPeriod || !closingHour || !closingPeriod) {
                console.error('Invalid opening/closing hours for city:', city.name);
                return {
                    ...city._doc,
                    isOpen: false

                };
            }

            const openingTime = new Date(currentTime);
            const closingTime = new Date(currentTime);

            openingTime.setHours(parseInt(openingHour) + (openingPeriod.toLowerCase() === 'pm' && openingHour !== '12' ? 12 : 0), 0, 0, 0);
            closingTime.setHours(parseInt(closingHour) + (closingPeriod.toLowerCase() === 'pm' && closingHour !== '12' ? 12 : 0), 0, 0, 0);

            const isOpen = currentTime >= openingTime && currentTime <= closingTime;

            console.log(`City: ${city.name}, Opening: ${openingTime}, Closing: ${closingTime}, Is Open: ${isOpen}`);  // לוג חדש

            return {
                ...city._doc,
                isOpen
            };

        }).filter(city => city !== null);

        console.log('Processed city data:', cityData);  // לוג חדש


        res.status(200).json(cityData);
    } catch (error) {
        console.error('Error in getAllCities:', error);
        res.status(500).json({ error: 'Failed to fetch cities', details: error.message });
    }
};


// Updating city details
exports.updateCity = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedCity = await City.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        
        if (!updatedCity) {
            return res.status(404).json({ message: "עיר לא נמצאה" });
        }
        
        res.status(200).json({ message: "העיר עודכנה בהצלחה", updatedCity: updatedCity });
    } catch (error) {
        console.error('שגיאה בעדכון העיר:', error);
        res.status(400).json({ message: error.message });
    }
};


// Get a single city by ID
exports.getCityById = async (req, res) => {
    try {
        const city = await City.findById(req.params.id);
        if (!city) {
            return res.status(404).json({ message: 'City not found' });
        }
        res.json(city);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Deleting a city
exports.deleteCity = async (req, res) => {
    try {
        const { id } = req.params;
        const city = await City.findByIdAndDelete(id);

        if (!city) {
            return res.status(404).json({ message: "עיר לא נמצאה" });
        }

        res.status(200).json({ message: "העיר נמחקה בהצלחה" });
    } catch (error) {
        console.error('שגיאה במחיקת העיר:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.searchCities = async (req, res) => {
    const query = req.query.query;
    try {
        const cities = await City.find({ name: new RegExp(query, 'i') }).select('name').limit(10);
        res.status(200).json(cities);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search cities', details: error.message });
    }
};