$(document).ready(function() {
    // Hide all sections initially
    $('#content > div').hide();
    $('#store-stats').show();

    $('#store-stats').click(function(event) {
        event.preventDefault();
        $('#content > div').hide();
        $('#content').html('<h2>Store Statistics</h2><p>Here will be the store statistics.</p>');
    });

    $('#add-shoe').click(function(event) {
        event.preventDefault();
        loadForm('dashboard/add-shoe', '#content', loadShoes);
    });

    $('#shoe-actions').click(function(event) {
        event.preventDefault();
        loadForm('dashboard/manage-shoes', '#content', loadShoes);
    });

    $('#store-management').click(function(event) {
        event.preventDefault();
        loadForm('dashboard/store-management', '#content', loadStores);
    });

    $('#add-user').click(function(event) {
        event.preventDefault();
        loadForm('dashboard/add-user', '#content', loadUsers);
    });

    $('#user-management').click(function(event) {
        event.preventDefault();
        loadForm('dashboard/user-management', '#content', loadUsers);
    });
});

function loadForm(url, target, callback) {
    $.ajax({
        url: url,
        method: 'GET',
        success: function(response) {
            $(target).html(response);
            if (callback) {
                callback();
            }
            initializeFormListeners(); // Initialize form listeners after loading
        },
        error: function(err) {
            console.error('Error loading the form:', err);
        }
    });
}

function initializeFormListeners() {
    const addShoeForm = document.getElementById('add-shoe-form');
    if (addShoeForm) {
        addShoeForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            try {
                const response = await fetch('/shoes', {
                    method: 'POST',
                    body: JSON.stringify(Object.fromEntries(formData)),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                    loadShoes(); // Reload shoes after adding a new one
                } else {
                    alert(result.message);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }

    const editShoeForm = document.getElementById('edit-shoe-form');
    if (editShoeForm) {
        editShoeForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const id = document.getElementById('edit-shoe-id').value;
            try {
                const response = await fetch(`/shoes/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(Object.fromEntries(formData)),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                    cancelEdit();
                    loadShoes(); // Reload shoes after updating
                } else {
                    alert(result.message);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }
}

async function loadShoes() {
    try {
        const response = await fetch('/shoes');
        const result = await response.json();
        if (response.ok) {
            const shoeTableBody = document.getElementById('shoe-table-body');
            shoeTableBody.innerHTML = '';
            result.shoes.forEach(shoe => {
                shoeTableBody.innerHTML += `
                    <tr>
                        <td>${shoe.title}</td>
                        <td>${shoe.price}</td>
                        <td>${shoe.category}</td>
                        <td>
                            <button onclick="editShoe('${shoe._id}')">Edit</button>
                            <button onclick="deleteShoe('${shoe._id}')">Delete</button>
                            <button onclick="viewShoe('${shoe._id}')">View</button>
                        </td>
                    </tr>
                `;
            });
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function editShoe(id) {
    // Add code to open the edit form
}

async function deleteShoe(id) {
    if (confirm('Are you sure you want to delete this shoe?')) {
        try {
            const response = await fetch(`/shoes/${id}`, { method: 'DELETE' });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                loadShoes(); // Reload shoes after deletion
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

async function viewShoe(id) {
    // Add code to view the shoe details in a modal or a section on the same page
}

document.addEventListener('DOMContentLoaded', function() {
    // Load the different sections
    loadShoes();
    loadStores();
    loadUsers();
});
