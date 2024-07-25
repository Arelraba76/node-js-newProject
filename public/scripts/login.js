// Function to set authorization header using token from localStorage
function setAuthHeader() {
    const token = localStorage.getItem('token');
    console.log('Setting auth header with token:', token);  // Debugging: log token
    if (token) {
        $.ajaxSetup({
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                console.log('Authorization header set:', 'Bearer ' + token); // Debugging: log header
            }
        });
    }
}

$(document).ready(function() {
    setAuthHeader(); // Call this function at the beginning
    checkLoginStatus(); // Check the login status on page load

<<<<<<< HEAD
    $('.sign-in-btn').click(function(event) {
=======
    $('#sign-in-btn').click(function(event) {
>>>>>>> 8a0e8997697cab5ffdc8f003708ec5bba2dddc23
        event.preventDefault(); // Prevent default form submission
        loadSignInForm(); // Load the sign-in form
    });

<<<<<<< HEAD
    $('.logoutLink').click(function(event) {
=======
    $('#logoutLink').click(function(event) {
>>>>>>> 8a0e8997697cab5ffdc8f003708ec5bba2dddc23
        event.preventDefault(); // Prevent default link behavior
        logout(); // Call the logout function
    });

    bindFormLinks(); // Bind the form links after setting the auth header

    // Function to load sign-in form via AJAX
    function loadSignInForm() {
        $.ajax({
            url: 'login/sign-in-form', // URL to load the sign-in form
            method: 'GET',
            success: function(data) {
                $('main').html(data); // Load the form into the main element
                bindFormLinks(); // Re-bind form links
            },
            error: function(err) {
                console.error('Error loading the sign-in form:', err); // Log error if form load fails
            }
        });
    }

    // Function to load register form via AJAX
    function loadRegisterForm() {
        $.ajax({
            url: 'login/register-form', // URL to load the register form
            method: 'GET',
            success: function(data) {
                $('main').html(data); // Load the form into the main element
                bindFormLinks(); // Re-bind form links
            },
            error: function(err) {
                console.error('Error loading the register form:', err); // Log error if form load fails
            }
        });
    }

    // Function to bind form links for register and login forms
    function bindFormLinks() {
        $('#registerLink').click(function(event) {
            event.preventDefault(); // Prevent default link behavior
            loadRegisterForm(); // Load the register form
        });

        $('#loginLink').click(function(event) {
            event.preventDefault(); // Prevent default link behavior
            loadSignInForm(); // Load the sign-in form
        });

        $('#loginForm').submit(function(event) {
            event.preventDefault(); // Prevent default form submission
            $.ajax({
                url: '/api/users/login', // URL for login API
                method: 'POST',
                data: $(this).serialize(), // Serialize form data
                success: function(response) {
                    console.log('Login response:', response); // Log the response
                    if (response.success) {
                        localStorage.setItem('isLoggedIn', 'true');
                        localStorage.setItem('isAdmin', response.isAdmin);
                        localStorage.setItem('token', response.token);
                        setAuthHeader(); // Set the auth header after login
                        updateUIAfterLogin(response.isAdmin); // Update UI based on admin status
                        console.log('Login successful, redirecting to home');
                        window.location.href = '/home'; // Redirect to home page
                    } else {
                        alert('Login failed: ' + response.message); // Show alert if login fails
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Login error:', xhr.responseText); // Log error if login fails
                    alert('An error occurred during login: ' + xhr.responseText); // Show alert on error
                }
            });
        });
    }

    // Function to update UI after login based on admin status
    function updateUIAfterLogin(isAdmin) {
        console.log('Updating UI, isAdmin:', isAdmin); // Log admin status
<<<<<<< HEAD
        $('.sign-in-btn').hide(); // Hide sign-in button
        $('.logoutLink').show(); // Show logout link
=======
        $('#sign-in-btn').hide(); // Hide sign-in button
        $('#logoutLink').show(); // Show logout link
>>>>>>> 8a0e8997697cab5ffdc8f003708ec5bba2dddc23
        if (isAdmin === true || isAdmin === 'true') {
            console.log('User is admin, adding dashboard link');
            if ($('#dashboardLink').length === 0) {
                $('nav ul').append('<li><a href="/dashboard" id="dashboardLink">Dashboard</a></li>');
<<<<<<< HEAD
                $('aside ul').append('<li><a href="/dashboard" id="dashboardLink">Dashboard</a></li>');
=======
>>>>>>> 8a0e8997697cab5ffdc8f003708ec5bba2dddc23
            }
        } else {
            console.log('User is not admin');
        }
    }

    // Function to check login status from localStorage
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        console.log('Checking login status. isLoggedIn:', isLoggedIn, 'isAdmin:', isAdmin); // Log login status
        if (isLoggedIn) {
            updateUIAfterLogin(isAdmin); // Update UI if logged in
        }
    }

    // Function to log out the user
    function logout() {
        $.ajax({
            url: '/api/users/logout', // URL for logout API
            method: 'POST',
            success: function(response) {
                localStorage.removeItem('isLoggedIn'); // Remove login status
                localStorage.removeItem('isAdmin'); // Remove admin status
                localStorage.removeItem('token'); // Remove token
<<<<<<< HEAD
                $('.sign-in-btn').show(); // Show sign-in button
                $('.logoutLink').hide(); // Hide logout link
=======
                $('#sign-in-btn').show(); // Show sign-in button
                $('#logoutLink').hide(); // Hide logout link
>>>>>>> 8a0e8997697cab5ffdc8f003708ec5bba2dddc23
                $('#dashboardLink').remove(); // Remove dashboard link
                window.location.href = '/home'; // Redirect to home page
            },
            error: function(xhr, status, error) {
                console.error('Logout error:', xhr.responseText); // Log error if logout fails
            }
        });
    }
});

// Log request headers on AJAX send event
$(document).ajaxSend(function(event, jqxhr, settings) {
    console.log('Request Headers:', jqxhr.getAllResponseHeaders()); // Log all request headers
});

// Load dashboard on clicking dashboard link
$(document).on('click', '#dashboardLink', function(event) {
    event.preventDefault(); // Prevent default link behavior
    console.log('Dashboard link clicked'); // Log dashboard link click
    loadDashboard(); // Load the dashboard
});

// Function to load dashboard via AJAX
function loadDashboard() {
<<<<<<< HEAD
    console.log('טוען את הדשבורד');
    
    // טוען את ה-CSS של הדשבורד אם הוא עדיין לא נטען
    if (!$('link[href="/css/dashboard.css"]').length) {
        $('<link>')
            .appendTo('head')
            .attr({type : 'text/css', rel : 'stylesheet'})
            .attr('href', '/css/dashboard.css');
    }
    
    $.ajax({
        url: 'login/dashboard',
        method: 'GET',
        success: function(data) {
            console.log('הדשבורד נטען בהצלחה');
            // עוטף את התוכן ב-div עם ה-ID המתאים
            $('main').html('<div id="dashboard-container">' + data + '</div>');
        },
        error: function(xhr, status, error) {
            console.error('שגיאה בטעינת הדשבורד:', xhr.responseText);
            alert('שגיאה בטעינת הדשבורד: ' + xhr.responseText);
        }
    });
}
=======
    console.log('Loading dashboard'); // Log dashboard loading
    $.ajax({
        url: 'login/dashboard', // URL for dashboard
        method: 'GET',
        success: function(data) {
            console.log('Dashboard loaded successfully'); // Log success
            $('main').html(data); // Load the dashboard data into the main element
        },
        error: function(xhr, status, error) {
            console.error('Dashboard error:', xhr.responseText); // Log error if dashboard load fails
            alert('Error loading dashboard: ' + xhr.responseText); // Show alert on error
        }
    });
}
>>>>>>> 8a0e8997697cab5ffdc8f003708ec5bba2dddc23
