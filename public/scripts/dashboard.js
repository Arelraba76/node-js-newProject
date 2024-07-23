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

document.getElementById('add-shoe-form').addEventListener('submit', async function(e) {
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

// Load shoes when the page loads
document.addEventListener('DOMContentLoaded', loadShoes);
loadShoes();
