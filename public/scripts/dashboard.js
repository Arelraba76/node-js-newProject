$(document).ready(function() {
    // Hide all sections except store statistics initially


    $('#store-stats-btn').click(function(event) {
        event.preventDefault();
        hideAllSections();
        $('#store-stats').show();
        createTopShoesChart(); // קורא ליצירת הגרף
        createGenderSalesChart(); // קריאה לפונקציה החדשה
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