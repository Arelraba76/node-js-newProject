$(document).ready(function() {
    // Hide all sections except store statistics initially
    hideAllSections();
    $('#store-stats').show();

    // Event handler for the store statistics button
    $('#store-stats-btn').click(function(event) {
        event.preventDefault(); // Prevent default button behavior
        hideAllSections(); // Hide all sections
        $('#store-stats').show(); // Show the store statistics section
        createTopShoesChart(); // Call the function to create the top shoes chart
        createGenderSalesChart(); // Call the function to create the gender sales chart
    });

    // Event handler for the shoe actions button
    $('#shoe-actions-btn').click(function(event) {
        event.preventDefault(); // Prevent default button behavior
        hideAllSections(); // Hide all sections
        $('#shoe-actions').show(); // Show the shoe actions section
    });

    // Event handler for the store management button
    $('#store-management-btn').click(function(event) {
        event.preventDefault(); // Prevent default button behavior
        hideAllSections(); // Hide all sections
        $('#store-management').show(); // Show the store management section
    });

    // Event handler for the user management button
    $('#user-management-btn').click(function(event) {
        event.preventDefault(); // Prevent default button behavior
        hideAllSections(); // Hide all sections
        $('#user-management').show(); // Show the user management section
    });
});

function hideAllSections() {
    // Hide all sections
    $('main section').hide();
}
