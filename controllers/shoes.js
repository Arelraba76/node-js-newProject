const Shoes = require("../models/shoes.js");

// Fetch all shoes from the database
async function getAllshoes(req, res) {
    try {
        const shoes = await Shoes.find();
        res.status(200).json({message: "shoes fetched successfully", shoes: shoes});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

// Fetch a shoe by its ID
async function getShoeById(req, res) {
    try {
        
        const shoe = await Shoes.findById(req.params.id);
        if (!shoe) {
            return res.status(404).json({message: "Shoe not found"});
        }
        res.status(200).json(shoe);
    } catch (error) {
        console.error('Error in getShoeById:', error);
        res.status(500).json({message: error.message});
    }
}

async function getShoeByIdAjax(req, res) {
    try {
        const shoe = await Shoes.findById(req.params.id);
        if (!shoe) {
            return res.status(404).send("Shoe not found");
        }
        res.render("shoe-details", { shoe: shoe, layout: false });
    } catch (error) {
        console.error('Error in getShoeById:', error);
        res.status(500).send(error.message);
    }
}

async function createNewShoe(req, res) {
    const newShoe = {...req.body};
    const shoeEntity = new Shoes(newShoe);
    try {
        const newDocument = await shoeEntity.save();
        res.status(201).json({message: "new shoe created successfully", newShoe: newDocument});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

// Delete a shoe by its ID
async function deleteShoeById(req, res) {
    const {id} = req.params;
    try {
        const deleted = await Shoes.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({message: "shoe not found"});
        res.status(200).json({message: `shoe with id ${id} has been deleted`, deletedShoe: deleted});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

// Filter shoes by category
async function filterShoesByCategory(req, res) {
    const category = req.query.category;
    console.log(`Filtering for category: ${category}`); // Log the category being searched
    try {
        const filteredShoes = await Shoes.find({category: category});
        console.log(`Found ${filteredShoes.length} shoes for category ${category}`); // Log the number of shoes found
        res.status(200).json({message: `shoes with category ${category} received successfully`, filteredShoes: filteredShoes});
    } catch (error) {
        console.error(`Error fetching shoes for category ${category}:`, error.message); // Log any errors
        res.status(400).json({message: error.message});
    }
}

async function updateShoe(req, res) {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedShoe = await Shoes.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        
        if (!updatedShoe) {
            return res.status(404).json({ message: "נעל לא נמצאה" });
        }
        
        res.status(200).json({ message: "הנעל עודכנה בהצלחה", updatedShoe: updatedShoe });
    } catch (error) {
        console.error('שגיאה בעדכון הנעל:', error);
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getAllshoes,
    createNewShoe,
    deleteShoeById,
    filterShoesByCategory,
    getShoeById,
    updateShoe,
    getShoeByIdAjax
}
