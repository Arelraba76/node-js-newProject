let allStores = [];

async function loadStores() {
    try {
        const response = await fetch('/api/cities');
        if (response.ok) {
            const result = await response.json();
            allStores = result;
            updateStoreTable(allStores);
        } else {
            console.error('Failed to load stores:', response.statusText);
            alert('Failed to load stores. Check console for details.');
        }
    } catch (error) {
        console.error('Error loading stores:', error);
        alert('Error: ' + error.message);
    }
}

function updateStoreTable(stores) {
    const storeTableBody = document.getElementById('store-table-body');
    storeTableBody.innerHTML = '';
    stores.forEach(store => {
        storeTableBody.innerHTML += `
            <tr>
                <td>${store.name}</td>
                <td>${store.lat}</td>
                <td>${store.lng}</td>
                <td>${store.openingHours}</td>
                <td>${store.closingHours}</td>
                <td>
<<<<<<< HEAD
                    <button class="edit-btn" onclick="editStore('${store._id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteStore('${store._id}')">Delete</button>
=======
<<<<<<< HEAD
                    <button class="edit-btn" onclick="editStore('${store._id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteStore('${store._id}')">Delete</button>
=======
                    <button onclick="editStore('${store._id}')">Edit</button>
                    <button onclick="deleteStore('${store._id}')">Delete</button>
>>>>>>> 8a0e8997697cab5ffdc8f003708ec5bba2dddc23
>>>>>>> 7ea09dfec61bb79bd13813af00e6d5cd139f0de0
                </td>
            </tr>
        `;
    });
}

async function editStore(id) {
    try {
        const response = await fetch(`/api/cities/${id}`);
        if (response.ok) {
            const store = await response.json();
            document.getElementById('edit-store-id').value = store._id;
            document.getElementById('edit-store-name').value = store.name;
            document.getElementById('edit-store-lat').value = store.lat;
            document.getElementById('edit-store-lng').value = store.lng;
            document.getElementById('edit-store-opening').value = store.openingHours;
            document.getElementById('edit-store-closing').value = store.closingHours;

            document.getElementById('edit-store').style.display = 'block';
            document.getElementById('add-store').style.display = 'none';
        } else {
            throw new Error('Failed to fetch store details');
        }
    } catch (error) {
        console.error('Error fetching store details:', error);
        alert('Error fetching store details: ' + error.message);
    }
}

function cancelEditStore() {
    document.getElementById('edit-store').style.display = 'none';
    document.getElementById('add-store').style.display = 'block';
}

async function deleteStore(id) {
    if (confirm('Are you sure you want to delete this store?')) {
        try {
            const response = await fetch(`/api/cities/${id}`, { method: 'DELETE' });
            if (response.ok) {
                alert('Store deleted successfully');
                loadStores(); // Reload stores after deletion
            } else {
                throw new Error('Failed to delete store');
            }
        } catch (error) {
            console.error('Error deleting store:', error);
            alert('Error: ' + error.message);
        }
    }
}

document.getElementById('add-store-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    try {
        const response = await fetch('/api/cities', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            alert('Store added successfully');
            this.reset();
            loadStores();
        } else {
            throw new Error('Failed to add store');
        }
    } catch (error) {
        console.error('Error adding store:', error);
        alert('Error: ' + error.message);
    }
});

document.getElementById('edit-store-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const id = document.getElementById('edit-store-id').value;
    try {
        const response = await fetch(`/api/cities/${id}`, {
            method: 'PUT',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            alert('Store updated successfully');
            cancelEditStore();
            loadStores(); // Reload stores after updating
        } else {
            throw new Error('Failed to update store');
        }
    } catch (error) {
        console.error('Error updating store:', error);
        alert('Error: ' + error.message);
    }
});

// Store search functionality
const storeSearchInput = document.getElementById('store-search-input');
const storeSearchResults = document.getElementById('store-search-results');

storeSearchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    if (searchTerm.length > 0) {
        const matchingStores = allStores.filter(store => 
            store.name.toLowerCase().includes(searchTerm)
        );
        displayStoreSearchResults(matchingStores);
    } else {
        storeSearchResults.style.display = 'none';
        updateStoreTable(allStores); // Show all stores when search is empty
    }
});

function displayStoreSearchResults(stores) {
    storeSearchResults.innerHTML = '';
    stores.forEach(store => {
        const div = document.createElement('div');
        div.textContent = store.name;
        div.onclick = function() {
            storeSearchInput.value = store.name;
            storeSearchResults.style.display = 'none';
            updateStoreTable([store]);
        };
        storeSearchResults.appendChild(div);
    });
    storeSearchResults.style.display = 'block';
}

// Close search results when clicking outside
document.addEventListener('click', function(event) {
    if (event.target !== storeSearchInput && event.target !== storeSearchResults) {
        storeSearchResults.style.display = 'none';
    }
});

<<<<<<< HEAD

document.addEventListener('DOMContentLoaded', loadStores);
loadStores();
=======
<<<<<<< HEAD

document.addEventListener('DOMContentLoaded', loadStores);
loadStores();
=======
loadStores();
document.addEventListener('DOMContentLoaded', loadStores);
>>>>>>> 8a0e8997697cab5ffdc8f003708ec5bba2dddc23
>>>>>>> 7ea09dfec61bb79bd13813af00e6d5cd139f0de0
