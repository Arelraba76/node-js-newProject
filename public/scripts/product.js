//product.js
$(document).ready(function() {
    console.log('Document ready');

    $('.product').click(function(e) {
        e.preventDefault();
        const productId = $(this).data('id');

        $.ajax({
            url: `/shoes/${productId}/ajax`, // Update this URL to use the new route
            method: 'GET',
            success: function(response) {
                $('main').html(response);
            },
            error: function(err) {
                console.error('Error loading the product details:', err);
            }
        });
    });
});