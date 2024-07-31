let allUsers = []; // Array to hold all users

// Load users when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
});

// Fetch users from the server and update the table
async function loadUsers() {
    try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (!token) {
            console.error('No token found'); // Log error if token is not found
            return;
        }
        const response = await fetch('/api/users', {
            headers: {
                'Authorization': `Bearer ${token}` // Set authorization header
            }
        });
        console.log('Response status:', response.status); // Log response status
        const result = await response.json(); // Parse JSON response
        console.log('Users data:', result); // Log users data
        if (response.ok && Array.isArray(result.users)) {
            allUsers = result.users; // Store users in the array
            updateUserTable(allUsers); // Update the user table with the fetched users
        } else {
            console.error('Failed to load users:', result.message); // Log error if response is not ok
            alert('Failed to load users: ' + result.message); // Alert user of failure
        }
    } catch (error) {
        console.error('Error loading users:', error); // Log any network errors
        alert('Error: ' + error.message); // Alert user of error
    }
}

// Update the user table with given users
function updateUserTable(users) {
    console.log('Updating user table with:', users); // Log users being updated
    const userTableBody = document.getElementById('user-table-body'); // Get table body element
    if (!userTableBody) {
        console.error('Cannot find element with id "user-table-body"'); // Log error if element is not found
        return;
    }
    userTableBody.innerHTML = ''; // Clear the table body
    users.forEach(user => {
        userTableBody.innerHTML += `
            <tr>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.isAdmin ? 'Yes' : 'No'}</td>
                <td>
                    <button class="edit-btn" onclick="editUser('${user._id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteUser('${user._id}')">Delete</button>
                    <button class="view-btn" onclick="viewUserPurchases('${user._id}')">View Purchases</button>
                </td>
            </tr>
        `; // Add a row for each user
    });
}

// View user purchases
async function viewUserPurchases(userId) {
    try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        const response = await fetch(`/api/users/${userId}/purchases`, {
            headers: {
                'Authorization': `Bearer ${token}` // Set authorization header
            }
        });
        const result = await response.json(); // Parse JSON response
        if (response.ok) {
            displayPurchases(result.purchases); // Display purchases if response is ok
        } else {
            alert('Failed to load purchases: ' + result.message); // Alert user of failure
        }
    } catch (error) {
        console.error('Error loading purchases:', error); // Log any network errors
        alert('Error: ' + error.message); // Alert user of error
    }
}

// Display user purchases in a modal
function displayPurchases(purchases) {
    const purchasesList = document.getElementById('purchasesList'); // Get purchases list element
    purchasesList.innerHTML = purchases.map(purchase => `
        <li>
            Shoe: ${purchase.title}
            <br>Shoe ID: ${purchase.shoeId}
            <br>Size: ${purchase.size}
            <br>Price: $${purchase.price}
            <br>Date: ${new Date(purchase.purchaseDate).toLocaleDateString()}
        </li>
    `).join(''); // Create list items for each purchase

    document.getElementById('purchaseModal').style.display = 'block'; // Show the modal
}

// Close purchases modal
function closePurchasesOverlay() {
    document.getElementById('purchaseModal').style.display = 'none'; // Hide the modal
}

// Delete a user
async function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) { // Confirm deletion
        try {
            const token = localStorage.getItem('token'); // Get token from localStorage
            const response = await fetch(`/api/users/${id}`, { 
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}` // Set authorization header
                }
            });
            const result = await response.json(); // Parse JSON response
            if (response.ok) {
                alert(result.message); // Alert success message
                loadUsers(); // Reload users after deletion
            } else {
                alert(result.message); // Alert failure message
            }
        } catch (error) {
            console.error('Error deleting user:', error); // Log any network errors
            alert('Error: ' + error.message); // Alert user of error
        }
    }
}

// Add a new user
document.getElementById('add-user-form').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent default form submission
    const formData = new FormData(this); // Get form data
    const userData = Object.fromEntries(formData.entries()); // Convert form data to object
    userData.isAdmin = formData.get('isAdmin') === 'on'; // Convert checkbox to boolean

    try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set content type to JSON
                'Authorization': `Bearer ${token}` // Set authorization header
            },
            body: JSON.stringify(userData), // Send form data as JSON
        });
        const result = await response.json(); // Parse JSON response
        console.log('Add user response:', result); // Log add user response
        if (response.ok) {
            alert(result.message); // Alert success message
            this.reset(); // Reset form
            loadUsers(); // Reload users after adding a new one
        } else {
            alert(result.message); // Alert failure message
        }
    } catch (error) {
        console.error('Error adding user:', error); // Log any network errors
        alert('Error: ' + error.message); // Alert user of error
    }
});

// Edit a user
async function editUser(id) {
    try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        const response = await fetch(`/api/users/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Set authorization header
            }
        });
        if (response.ok) {
            const user = await response.json(); // Parse JSON response
            document.getElementById('edit-user-id').value = id; // Set user ID in form
            document.getElementById('edit-firstName').value = user.firstName; // Set first name
            document.getElementById('edit-lastName').value = user.lastName; // Set last name
            document.getElementById('edit-email').value = user.email; // Set email
            document.getElementById('edit-password').value = ''; // Clear password field
            document.getElementById('edit-isAdmin').checked = user.isAdmin; // Set admin status

            document.getElementById('edit-user-section').style.display = 'block'; // Show edit section
            document.getElementById('add-user').style.display = 'none'; // Hide add form
            document.getElementById('user-management').style.display = 'none'; // Hide user management section
        } else {
            throw new Error('Failed to fetch user details'); // Throw error if response is not ok
        }
    } catch (error) {
        console.error('Error fetching user details:', error); // Log any network errors
        alert('Error fetching user details: ' + error.message); // Alert user of error
    }
}

// Update an existing user
document.getElementById('edit-user-form').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent default form submission
    const formData = new FormData(this); // Get form data
    const id = document.getElementById('edit-user-id').value; // Get user ID from hidden input
    
    if (!id) {
        alert('User ID is missing. Cannot update user.'); // Alert if user ID is missing
        return;
    }

    const userData = Object.fromEntries(formData.entries()); // Convert form data to object
    userData.isAdmin = formData.get('isAdmin') === 'on'; // Convert checkbox to boolean

    if (!userData.password) {
        delete userData.password; // Delete password field if empty
    }

    try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        
        const updateResponse = await fetch(`/api/users/${id}`, { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Set content type to JSON
                'Authorization': `Bearer ${token}` // Set authorization header
            },
            body: JSON.stringify(userData), // Send form data as JSON
        });
        
        const updateResult = await updateResponse.json(); // Parse JSON response
        if (updateResponse.ok) {
            alert('User updated successfully'); // Alert success message
            cancelEditUser(); // Cancel edit mode
            loadUsers(); // Reload users after updating
        } else {
            throw new Error(updateResult.message); // Throw error if response is not ok
        }
    } catch (error) {
        console.error('Error updating user:', error); // Log any network errors
        alert('Error: ' + error.message); // Alert user of error
    }
});

// Cancel editing a user
function cancelEditUser() {
    document.getElementById('edit-user-section').style.display = 'none'; // Hide edit section
    document.getElementById('add-user').style.display = 'block'; // Show add form
    document.getElementById('user-management').style.display = 'block'; // Show user management section
}

// User search functionality
const userSearchInput = document.getElementById('user-search-input');
const userSearchResults = document.getElementById('user-search-results');

userSearchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase(); // Get search term in lowercase
    if (searchTerm.length > 0) {
        const matchingUsers = allUsers.filter(user => 
            user.firstName.toLowerCase().includes(searchTerm) ||
            user.lastName.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        ); // Filter users based on search term
        displayUserSearchResults(matchingUsers); // Display matching users
    } else {
        userSearchResults.style.display = 'none'; // Hide search results
        updateUserTable(allUsers); // Show all users when search is empty
    }
});

// Display user search results
function displayUserSearchResults(users) {
    userSearchResults.innerHTML = ''; // Clear search results
    users.forEach(user => {
        const div = document.createElement('div'); // Create a div for each matching user
        div.textContent = `${user.firstName} ${user.lastName} (${user.email})`; // Set div text to user name and email
        div.onclick = function() {
            userSearchInput.value = user.email; // Set input value to user email
            userSearchResults.style.display = 'none'; // Hide search results
            updateUserTable([user]); // Show only the selected user
        };
        userSearchResults.appendChild(div); // Append div to search results
    });
    userSearchResults.style.display = 'block'; // Show search results
}

// Close search results when clicking outside
document.addEventListener('click', function(event) {
    if (event.target !== userSearchInput && event.target !== userSearchResults) {
        userSearchResults.style.display = 'none'; // Hide search results if clicking outside
    }
});

loadUsers(); // Initial call to load users
