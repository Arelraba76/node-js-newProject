let allShoes = []; // Array to hold all shoes

// Load shoes from the server
async function loadShoes() {
    try {
        const response = await fetch('/shoes'); // Fetch shoes from the server
        const result = await response.json(); // Parse JSON response
        if (response.ok) {
            allShoes = result.shoes; // Store shoes in the array
            updateShoeTable(allShoes); // Update the shoe table with the fetched shoes
        } else {
            alert(result.message); // Alert if there is an error
        }
    } catch (error) {
        alert('Error: ' + error.message); // Alert if there is a network error
    }
}

// Update the shoe table with given shoes
function updateShoeTable(shoes) {
    const shoeTableBody = document.getElementById('shoe-table-body'); // Get table body element
    shoeTableBody.innerHTML = ''; // Clear the table body
    shoes.forEach(shoe => {
        shoeTableBody.innerHTML += `
            <tr>
                <td>${shoe.title}</td>
                <td>${shoe.price}</td>
                <td>${shoe.category}</td>
                <td>${shoe.stock}</td>
                <td>
                    <button class="edit-btn" onclick="editShoe('${shoe._id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteShoe('${shoe._id}')">Delete</button>
                </td>
            </tr>
        `; // Add a row for each shoe
    });
}

// Edit a shoe
async function editShoe(id) {
    try {
        const response = await fetch(`/shoes/${id}`); // Fetch shoe details by ID
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`); // Throw error if response is not ok
        }
        const shoe = await response.json(); // Parse JSON response
        document.getElementById('edit-shoe-id').value = shoe._id; // Fill form with shoe details
        document.getElementById('edit-title').value = shoe.title;
        document.getElementById('edit-price').value = shoe.price;
        document.getElementById('edit-image').value = shoe.image;
        document.getElementById('edit-category').value = shoe.category;
        document.getElementById('edit-description').value = shoe.description;
        document.getElementById('edit-stock').value = shoe.stock;
        
        document.getElementById('edit-shoe-section').style.display = 'block'; // Show edit section
        document.getElementById('add-shoe-form-inline').style.display = 'none'; // Hide add form
        document.getElementById('shoe-actions').style.display = 'none'; // Hide shoe actions
    } catch (error) {
        console.error('Error:', error); // Log error
        alert('Error fetching shoe details: ' + error.message); // Alert error
    }
}

// Cancel editing a shoe
function cancelEdit() {
    document.getElementById('edit-shoe-section').style.display = 'none'; // Hide edit section
    document.getElementById('add-shoe-form-inline').style.display = 'block'; // Show add form
    document.getElementById('shoe-actions').style.display = 'block'; // Show shoe actions
}

// Delete a shoe
async function deleteShoe(id) {
    if (confirm('Are you sure you want to delete this shoe?')) { // Confirm deletion
        try {
            const response = await fetch(`/shoes/${id}`, { method: 'DELETE' }); // Delete shoe by ID
            const result = await response.json(); // Parse JSON response
            if (response.ok) {
                alert(result.message); // Alert success message
                loadShoes(); // Reload shoes after deletion
            } else {
                alert(result.message); // Alert error message
            }
        } catch (error) {
            alert('Error: ' + error.message); // Alert if there is a network error
        }
    }
}

// Add a new shoe
document.getElementById('add-shoe-form-inline').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent default form submission
    const formData = new FormData(this); // Get form data
    const formDataObj = Object.fromEntries(formData); // Convert form data to object
    try {
        const response = await fetch('/shoes', {
            method: 'POST',
            body: JSON.stringify(formDataObj), // Send form data as JSON
            headers: {
                'Content-Type': 'application/json' // Set content type to JSON
            }
        });
        const result = await response.json(); // Parse JSON response
        if (response.ok) {
            alert(result.message); // Alert success message
            this.reset(); // Reset form
            loadShoes(); // Reload shoes after adding a new one
        } else {
            alert(result.message); // Alert error message
        }
    } catch (error) {
        alert('Error: ' + error.message); // Alert if there is a network error
    }
});

// Update an existing shoe
document.getElementById('edit-shoe-form').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent default form submission
    const formData = new FormData(this); // Get form data
    const formDataObj = Object.fromEntries(formData); // Convert form data to object
    const id = document.getElementById('edit-shoe-id').value; // Get shoe ID from hidden input
    
    try {
        const response = await fetch(`/shoes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(formDataObj), // Send form data as JSON
            headers: {
                'Content-Type': 'application/json' // Set content type to JSON
            }
        });
        const result = await response.json(); // Parse JSON response
        if (response.ok) {
            alert(result.message); // Alert success message
            cancelEdit(); // Cancel edit mode
            loadShoes(); // Reload shoes after updating
        } else {
            alert(result.message); // Alert error message
        }
    } catch (error) {
        alert('Error: ' + error.message); // Alert if there is a network error
    }
});

// Shoe search functionality
const shoeSearchInput = document.getElementById('shoes-search-input');
const shoeSearchResults = document.getElementById('shoes-search-results');

shoeSearchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase(); // Get search term in lowercase
    if (searchTerm.length > 0) {
        const matchingShoes = allShoes.filter(shoe => 
            shoe.title.toLowerCase().includes(searchTerm)
        ); // Filter shoes based on search term
        displayShoeSearchResults(matchingShoes); // Display matching shoes
    } else {
        shoeSearchResults.style.display = 'none'; // Hide search results
        updateShoeTable(allShoes); // Show all shoes when search is empty
    }
});

// Display shoe search results
function displayShoeSearchResults(shoes) {
    shoeSearchResults.innerHTML = ''; // Clear search results
    shoes.forEach(shoe => {
        const div = document.createElement('div'); // Create a div for each matching shoe
        div.textContent = shoe.title; // Set div text to shoe title
        div.onclick = function() {
            shoeSearchInput.value = shoe.title; // Set input value to shoe title
            shoeSearchResults.style.display = 'none'; // Hide search results
            updateShoeTable([shoe]); // Show only the selected shoe
        };
        shoeSearchResults.appendChild(div); // Append div to search results
    });
    shoeSearchResults.style.display = 'block'; // Show search results
}

// Close search results when clicking outside
document.addEventListener('click', function(event) {
    if (event.target !== shoeSearchInput && event.target !== shoeSearchResults) {
        shoeSearchResults.style.display = 'none'; // Hide search results if clicking outside
    }
});

// Load shoes when the page loads
document.addEventListener('DOMContentLoaded', loadShoes); // Load shoes on page load
loadShoes(); // Load shoes immediately
