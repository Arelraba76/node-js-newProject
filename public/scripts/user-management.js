let allUsers = [];


document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
});

async function loadUsers() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }
        const response = await fetch('/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Users data:', result);
        if (response.ok && Array.isArray(result.users)) {
            allUsers = result.users;
            updateUserTable(allUsers);
        } else {
            console.error('Failed to load users:', result.message);
            alert('Failed to load users: ' + result.message);
        }
    } catch (error) {
        console.error('Error loading users:', error);
        alert('Error: ' + error.message);
    }
}

function updateUserTable(users) {
    console.log('Updating user table with:', users);
    const userTableBody = document.getElementById('user-table-body');
    if (!userTableBody) {
        console.error('Cannot find element with id "user-table-body"');
        return;
    }
    userTableBody.innerHTML = '';
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
                    <button class="View-btn" onclick="viewUserPurchases('${user._id}')">View Purchases</button>
                </td>
            </tr>
        `;
    });
}

async function viewUserPurchases(userId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/users/${userId}/purchases`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const result = await response.json();
        if (response.ok) {
            displayPurchases(result.purchases);
        } else {
            alert('Failed to load purchases: ' + result.message);
        }
    } catch (error) {
        console.error('Error loading purchases:', error);
        alert('Error: ' + error.message);
    }
}



function displayPurchases(purchases) {
    const purchasesList = document.getElementById('purchasesList');
    purchasesList.innerHTML = purchases.map(purchase => `
        <li>
            Shoe: ${purchase.title}
            <br>Shoe ID: ${purchase.shoeId}
            <br>Size: ${purchase.size}
            <br>Price: $${purchase.price}
            <br>Date: ${new Date(purchase.purchaseDate).toLocaleDateString()}
        </li>
    `).join('');

    document.getElementById('purchaseModal').style.display = 'block';
}

function closePurchasesOverlay() {
    document.getElementById('purchaseModal').style.display = 'none';
}


async function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/users/${id}`, { 
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                loadUsers();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error: ' + error.message);
        }
    }
}

document.getElementById('add-user-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const userData = Object.fromEntries(formData.entries());
    userData.isAdmin = formData.get('isAdmin') === 'on';  // Convert checkbox to boolean

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData),
        });
        const result = await response.json();
        console.log('Add user response:', result);
        if (response.ok) {
            alert(result.message);
            this.reset();
            loadUsers();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error adding user:', error);
        alert('Error: ' + error.message);
    }
});

async function editUser(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/users/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const user = await response.json();
            // שים לב שאנחנו משתמשים ב-id שהועבר לפונקציה, לא ב-user._id
            document.getElementById('edit-user-id').value = id;
            document.getElementById('edit-firstName').value = '';
            document.getElementById('edit-lastName').value = '';
            document.getElementById('edit-email').value = '';
            document.getElementById('edit-password').value = ''; // Clear password field
            document.getElementById('edit-isAdmin').checked = user.isAdmin;

            document.getElementById('edit-user-section').style.display = 'block';
            document.getElementById('add-user').style.display = 'none';
            document.getElementById('user-management').style.display = 'none';
        } else {
            throw new Error('Failed to fetch user details');
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        alert('Error fetching user details: ' + error.message);
    }
}

document.getElementById('edit-user-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const id = document.getElementById('edit-user-id').value;
    
    if (!id) {
        alert('User ID is missing. Cannot update user.');
        return;
    }

    const userData = Object.fromEntries(formData.entries());
    userData.isAdmin = formData.get('isAdmin') === 'on';

    if (!userData.password) {
        delete userData.password;
    }

    try {
        const token = localStorage.getItem('token');
        
        // First, delete the existing user
        const deleteResponse = await fetch(`/api/users/${id}`, { 
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!deleteResponse.ok) {
            const deleteResult = await deleteResponse.json();
            throw new Error('Failed to update user: ' + deleteResult.message);
        }

        // Then, create a new user with the updated data
        const createResponse = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData),
        });
        
        const createResult = await createResponse.json();
        if (createResponse.ok) {
            alert('User updated successfully');
            cancelEditUser();
            loadUsers();
        } else {
            throw new Error(createResult.message);
        }
    } catch (error) {
        console.error('Error updating user:', error);
        alert('Error: ' + error.message);
        
        // If an error occurred, try to recreate the original user
        try {
            await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({...userData, _id: id}),
            });
        } catch (recreateError) {
            console.error('Failed to recreate original user:', recreateError);
        }
    }
});

function cancelEditUser() {
    document.getElementById('edit-user-section').style.display = 'none';
    document.getElementById('add-user').style.display = 'block';
    document.getElementById('user-management').style.display = 'block';
}

// User search functionality
const userSearchInput = document.getElementById('user-search-input');
const userSearchResults = document.getElementById('user-search-results');

userSearchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    if (searchTerm.length > 0) {
        const matchingUsers = allUsers.filter(user => 
            user.firstName.toLowerCase().includes(searchTerm) ||
            user.lastName.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
        displayUserSearchResults(matchingUsers);
    } else {
        userSearchResults.style.display = 'none';
        updateUserTable(allUsers);
    }
});

function displayUserSearchResults(users) {
    userSearchResults.innerHTML = '';
    users.forEach(user => {
        const div = document.createElement('div');
        div.textContent = `${user.firstName} ${user.lastName} (${user.email})`;
        div.onclick = function() {
            userSearchInput.value = user.email;
            userSearchResults.style.display = 'none';
            updateUserTable([user]);
        };
        userSearchResults.appendChild(div);
    });
    userSearchResults.style.display = 'block';
}

// Close search results when clicking outside
document.addEventListener('click', function(event) {
    if (event.target !== userSearchInput && event.target !== userSearchResults) {
        userSearchResults.style.display = 'none';
    }
});

loadUsers();