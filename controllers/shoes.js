// controllers\shoes.js
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
            return res.status(404).json({ message: "Shoe not found" });
        }
        
        res.status(200).json({ message: "Shoe updated successfully", updatedShoe: updatedShoe });
    } catch (error) {
        console.error('Error updating shoe:', error);
        res.status(400).json({ message: error.message });
    }
}

async function filterShoes(req, res) {
    try {
        const { category, minPrice, maxPrice } = req.query;
        let query = { category: category, stock: { $gt: 0 } };
        
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        const filteredShoes = await Shoes.find(query).sort({ price: 1 });
        
        // Render the appropriate category page with filtered shoes
        res.render(`${category.toLowerCase()}-shoes`, { 
            shoes: filteredShoes, 
            filters: { category, minPrice, maxPrice }
        });
    } catch (error) {
        console.error(`Error filtering shoes:`, error.message);
        res.status(400).render('error', { message: error.message });
    }
}

async function searchShoes(req, res) {
    try {
        const query = req.query.q;
        const regex = new RegExp(query, 'i');
        const shoes = await Shoes.find({
            $or: [
                { title: regex },
                { description: regex },
                { category: regex }
            ]
        }).limit(5);
        
        res.json(shoes);
    } catch (error) {
        console.error('Error searching shoes:', error);
        res.status(500).json({ message: 'Error searching shoes' });
    }
}


module.exports = {
    getAllshoes,
    createNewShoe,
    deleteShoeById,
    filterShoesByCategory,
    getShoeById,
    updateShoe,
    getShoeByIdAjax,
    filterShoes,
    searchShoes

}