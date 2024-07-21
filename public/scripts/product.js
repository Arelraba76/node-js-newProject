$(document).ready(function() {
    console.log('Document ready'); // Log when the document is ready

    // Click event handler for elements with class 'product'
    $('.product').click(function(e) {
        e.preventDefault(); // Prevent default link behavior
        const productId = $(this).data('id'); // Get product ID from data attribute

        // AJAX request to get product details
        $.ajax({
            url: `/shoes/${productId}`, // URL for product details
            method: 'GET',
            success: function(response) {
                $('main').html(response); // Load response into the main element
            },
            error: function(err) {
                console.error('Error loading the product details:', err); // Log error if request fails
            }
        });
    });
});
