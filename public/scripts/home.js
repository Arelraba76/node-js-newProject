$(document).ready(function() {
    $('#sign-in-btn').click(function(event) {
        event.preventDefault();
        $.ajax({
            url: '/sign-in-form',
            method: 'GET',
            success: function(data) {
                $('main').html(data);
                bindFormLinks();
            },
            error: function(err) {
                console.error('Error loading the sign-in form:', err);
            }
        });
    });

    function bindFormLinks() {
        $('#registerLink').click(function(event) {
            event.preventDefault();
            $.ajax({
                url: '/register-form',
                method: 'GET',
                success: function(data) {
                    $('main').html(data);
                    bindFormLinks();
                },
                error: function(err) {
                    console.error('Error loading the register form:', err);
                }
            });
        });

        $('#loginLink').click(function(event) {
            event.preventDefault();
            $.ajax({
                url: '/sign-in-form',
                method: 'GET',
                success: function(data) {
                    $('main').html(data);
                    bindFormLinks();
                },
                error: function(err) {
                    console.error('Error loading the sign-in form:', err);
                }
            });
        });
    }
});
