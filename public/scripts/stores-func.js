let allStores = []; // Array to hold all stores

// Load stores from the server
async function loadStores() {
    try {
        const response = await fetch('/api/cities'); // Fetch stores from the server
        if (response.ok) {
            const result = await response.json(); // Parse JSON response
            allStores = result; // Store the fetched stores in the array
            updateStoreTable(allStores); // Update the store table with the fetched stores
        } else {
            console.error('Failed to load stores:', response.statusText); // Log error if response is not ok
            alert('Failed to load stores. Check console for details.'); // Alert user of failure
        }
    } catch (error) {
        console.error('Error loading stores:', error); // Log any network errors
        alert('Error: ' + error.message); // Alert user of error
    }
}

// Update the store table with given stores
function updateStoreTable(stores) {
    const storeTableBody = document.getElementById('store-table-body'); // Get table body element
    storeTableBody.innerHTML = ''; // Clear the table body
    stores.forEach(store => {
        storeTableBody.innerHTML += `
            <tr>
                <td>${store.name}</td>
                <td>${store.lat}</td>
                <td>${store.lng}</td>
                <td>${store.openingHours}</td>
                <td>${store.closingHours}</td>
                <td>
                    <button class="edit-btn" onclick="editStore('${store._id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteStore('${store._id}')">Delete</button>
                </td>
            </tr>
        `; // Add a row for each store
    });
}

// Edit a store
async function editStore(id) {
    try {
        const response = await fetch(`/api/cities/${id}`); // Fetch store details by ID
        if (response.ok) {
            const store = await response.json(); // Parse JSON response
            document.getElementById('edit-store-id').value = store._id; // Fill form with store details
            document.getElementById('edit-store-name').value = store.name;
            document.getElementById('edit-store-lat').value = store.lat;
            document.getElementById('edit-store-lng').value = store.lng;
            document.getElementById('edit-store-opening').value = store.openingHours;
            document.getElementById('edit-store-closing').value = store.closingHours;

            document.getElementById('edit-store').style.display = 'block'; // Show edit section
            document.getElementById('add-store').style.display = 'none'; // Hide add form
        } else {
            throw new Error('Failed to fetch store details'); // Throw error if response is not ok
        }
    } catch (error) {
        console.error('Error fetching store details:', error); // Log error
        alert('Error fetching store details: ' + error.message); // Alert user of error
    }
}

// Cancel editing a store
function cancelEditStore() {
    document.getElementById('edit-store').style.display = 'none'; // Hide edit section
    document.getElementById('add-store').style.display = 'block'; // Show add form
}

// Delete a store
async function deleteStore(id) {
    if (confirm('Are you sure you want to delete this store?')) { // Confirm deletion
        try {
            const response = await fetch(`/api/cities/${id}`, { method: 'DELETE' }); // Delete store by ID
            if (response.ok) {
                alert('Store deleted successfully'); // Alert success message
                loadStores(); // Reload stores after deletion
            } else {
                throw new Error('Failed to delete store'); // Throw error if response is not ok
            }
        } catch (error) {
            console.error('Error deleting store:', error); // Log error
            alert('Error: ' + error.message); // Alert user of error
        }
    }
}

// Add a new store
document.getElementById('add-store-form').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent default form submission
    const formData = new FormData(this); // Get form data
    try {
        const response = await fetch('/api/cities', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)), // Send form data as JSON
            headers: {
                'Content-Type': 'application/json' // Set content type to JSON
            }
        });
        if (response.ok) {
            alert('Store added successfully'); // Alert success message
            this.reset(); // Reset form
            loadStores(); // Reload stores after adding a new one
        } else {
            throw new Error('Failed to add store'); // Throw error if response is not ok
        }
    } catch (error) {
        console.error('Error adding store:', error); // Log error
        alert('Error: ' + error.message); // Alert user of error
    }
});

// Update an existing store
document.getElementById('edit-store-form').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent default form submission
    const formData = new FormData(this); // Get form data
    const id = document.getElementById('edit-store-id').value; // Get store ID from hidden input
    try {
        const response = await fetch(`/api/cities/${id}`, {
            method: 'PUT',
            body: JSON.stringify(Object.fromEntries(formData)), // Send form data as JSON
            headers: {
                'Content-Type': 'application/json' // Set content type to JSON
            }
        });
        if (response.ok) {
            alert('Store updated successfully'); // Alert success message
            cancelEditStore(); // Cancel edit mode
            loadStores(); // Reload stores after updating
        } else {
            throw new Error('Failed to update store'); // Throw error if response is not ok
        }
    } catch (error) {
        console.error('Error updating store:', error); // Log error
        alert('Error: ' + error.message); // Alert user of error
    }
});

// Store search functionality
const storeSearchInput = document.getElementById('store-search-input');
const storeSearchResults = document.getElementById('store-search-results');

storeSearchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase(); // Get search term in lowercase
    if (searchTerm.length > 0) {
        const matchingStores = allStores.filter(store => 
            store.name.toLowerCase().includes(searchTerm)
        ); // Filter stores based on search term
        displayStoreSearchResults(matchingStores); // Display matching stores
    } else {
        storeSearchResults.style.display = 'none'; // Hide search results
        updateStoreTable(allStores); // Show all stores when search is empty
    }
});

// Display store search results
function displayStoreSearchResults(stores) {
    storeSearchResults.innerHTML = ''; // Clear search results
    stores.forEach(store => {
        const div = document.createElement('div'); // Create a div for each matching store
        div.textContent = store.name; // Set div text to store name
        div.onclick = function() {
            storeSearchInput.value = store.name; // Set input value to store name
            storeSearchResults.style.display = 'none'; // Hide search results
            updateStoreTable([store]); // Show only the selected store
        };
        storeSearchResults.appendChild(div); // Append div to search results
    });
    storeSearchResults.style.display = 'block'; // Show search results
}

// Close search results when clicking outside
document.addEventListener('click', function(event) {
    if (event.target !== storeSearchInput && event.target !== storeSearchResults) {
        storeSearchResults.style.display = 'none'; // Hide search results if clicking outside
    }
});

// Load stores when the page loads
document.addEventListener('DOMContentLoaded', loadStores); // Load stores on page load
loadStores(); // Load stores immediately
