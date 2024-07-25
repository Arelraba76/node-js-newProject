$(document).ready(function() {
    // Hide all sections except store statistics initially
    hideAllSections();
    $('#store-stats').show();

    // Attach click event handlers for each button
    $('#store-stats-btn').click(function(event) {
        event.preventDefault();
        hideAllSections();
        $('#store-stats').show();
    });

    $('#add-shoe-btn').click(function(event) {
        event.preventDefault();
        hideAllSections();
        $('#add-shoe').show();
    });

    $('#shoe-actions-btn').click(function(event) {
        event.preventDefault();
        hideAllSections();
        $('#shoe-actions').show();
    });

    $('#store-management-btn').click(function(event) {
        event.preventDefault();
        hideAllSections();
        $('#store-management').show();
    });

    $('#user-management-btn').click(function(event) {
        event.preventDefault();
        hideAllSections();
        $('#user-management').show();
    });
});

function hideAllSections() {
    // Hide all sections
    $('main section').hide();
}