let allShoes = [];

async function loadShoes() {
    try {
        const response = await fetch('/shoes');
        const result = await response.json();
        if (response.ok) {
            allShoes = result.shoes;
            updateShoeTable(allShoes);
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function updateShoeTable(shoes) {
    const shoeTableBody = document.getElementById('shoe-table-body');
    shoeTableBody.innerHTML = '';
    shoes.forEach(shoe => {
        shoeTableBody.innerHTML += `
            <tr>
                <td>${shoe.title}</td>
                <td>${shoe.price}</td>
                <td>${shoe.category}</td>
                <td>${shoe.stock}</td>
                <td>
                    <button onclick="editShoe('${shoe._id}')">Edit</button>
                    <button onclick="deleteShoe('${shoe._id}')">Delete</button>
                </td>
            </tr>
        `;
    });
}

async function editShoe(id) {
    try {
        const response = await fetch(`/shoes/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const shoe = await response.json();
        document.getElementById('edit-shoe-id').value = shoe._id;
        document.getElementById('edit-title').value = shoe.title;
        document.getElementById('edit-price').value = shoe.price;
        document.getElementById('edit-image').value = shoe.image;
        document.getElementById('edit-category').value = shoe.category;
        document.getElementById('edit-description').value = shoe.description;
        document.getElementById('edit-stock').value = shoe.stock;
        
        document.getElementById('edit-shoe-section').style.display = 'block';
        document.getElementById('add-shoe').style.display = 'none';
        document.getElementById('shoe-actions').style.display = 'none';
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching shoe details: ' + error.message);
    }
}

function cancelEdit() {
    document.getElementById('edit-shoe-section').style.display = 'none';
    document.getElementById('add-shoe').style.display = 'block';
    document.getElementById('shoe-actions').style.display = 'block';
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

document.getElementById('add-shoe-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const formDataObj = Object.fromEntries(formData);
    try {
        const response = await fetch('/shoes', {
            method: 'POST',
            body: JSON.stringify(formDataObj),
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

document.getElementById('edit-shoe-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const formDataObj = Object.fromEntries(formData);
    const id = document.getElementById('edit-shoe-id').value;
    
    try {
        const response = await fetch(`/shoes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(formDataObj),
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

// Search functionality
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    if (searchTerm.length > 0) {
        const matchingShoes = allShoes.filter(shoe => 
            shoe.title.toLowerCase().includes(searchTerm)
        );
        displaySearchResults(matchingShoes);
    } else {
        searchResults.style.display = 'none';
        updateShoeTable(allShoes); // Show all shoes when search is empty
    }
});

function displaySearchResults(shoes) {
    searchResults.innerHTML = '';
    shoes.forEach(shoe => {
        const div = document.createElement('div');
        div.textContent = shoe.title;
        div.onclick = function() {
            searchInput.value = shoe.title;
            searchResults.style.display = 'none';
            updateShoeTable([shoe]);
        };
        searchResults.appendChild(div);
    });
    searchResults.style.display = 'block';
}

// Close search results when clicking outside
document.addEventListener('click', function(event) {
    if (event.target !== searchInput && event.target !== searchResults) {
        searchResults.style.display = 'none';
    }
});

// Load shoes when the page loads
loadShoes();
document.addEventListener('DOMContentLoaded', loadShoes);
