const City = require('../models/city');

// הוספת עיר חדשה
exports.addCity = async (req, res) => {
    try {
        const { name, lat, lng, openingHours, closingHours } = req.body; // Include openingHours in the destructured assignment
        // Ensure all required fields are provided
        if (!name || lat === undefined || lng === undefined || !openingHours) { // Check for openingHours as well
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const newCity = new City({ name, lat, lng, openingHours, closingHours }); // Include openingHours when creating a new city
        await newCity.save();
        res.status(201).json(newCity);
    } catch (error) {
        console.error("Failed to add city:", error); // Enhanced error logging
        res.status(500).json({ error: 'Failed to add city', details: error.message });
    }
};

// שליפת כל הערים
exports.getAllCities = async (req, res) => {
    try {
        const cities = await City.find({});
        const currentTime = new Date();
        const cityData = cities.map(city => {
            // בדיקה שה-city קיים ושיש לו את כל השדות הנדרשים
            if (!city || !city.openingHours || !city.closingHours) {
                console.error('Invalid city data:', city);
                return null; // או אובייקט ברירת מחדל
            }

            const [openingHour, openingPeriod] = (city.openingHours || '').split(' ');
            const [closingHour, closingPeriod] = (city.closingHours || '').split(' ');

            // בדיקה שכל החלקים קיימים
            if (!openingHour || !openingPeriod || !closingHour || !closingPeriod) {
                console.error('Invalid opening/closing hours for city:', city.name);
                return {
                    ...city._doc,
                    isOpen: false // או ערך ברירת מחדל אחר
                };
            }

            const openingTime = new Date(currentTime);
            const closingTime = new Date(currentTime);
            
            openingTime.setHours(parseInt(openingHour) + (openingPeriod.toLowerCase() === 'pm' && openingHour !== '12' ? 12 : 0));
            closingTime.setHours(parseInt(closingHour) + (closingPeriod.toLowerCase() === 'pm' && closingHour !== '12' ? 12 : 0));
            
            const isOpen = currentTime >= openingTime && currentTime <= closingTime;

            return {
                ...city._doc,
                isOpen
            };
        }).filter(city => city !== null); // סינון של ערכי null

        res.status(200).json(cityData);
    } catch (error) {
        console.error('Error in getAllCities:', error);
        res.status(500).json({ error: 'Failed to fetch cities', details: error.message });
    }
};

// מחיקת עיר לפי ID
exports.deleteCity = async (req, res) => {
    try {
        const { id } = req.params;
        await City.findByIdAndDelete(id);
        res.status(200).json({ message: 'City deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete city' });
    }
};