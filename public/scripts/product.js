$(document).ready(function() {
    console.log('Document ready');
    $('.product').click(function(e) {
        e.preventDefault(); // Prevent default link behavior
        const productId = $(this).data('id');

        $.ajax({
            url: `/shoes/${productId}`,
            method: 'GET',
            success: function(response) {
                $('#content-wrap').html(response);
                // Update URL without reloading the page
                history.pushState(null, '', `/product/${productId}`);
            },
            error: function(err) {
                console.error('Error loading the product details:', err);
            }
        });
    });
});