// Function to set the authorization header with the token from local storage
function setAuthHeader() {
    const token = localStorage.getItem('token');
    console.log('Setting auth header with token:', token);  // Added for debugging
    if (token) {
        $.ajaxSetup({
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                console.log('Authorization header set:', 'Bearer ' + token); // Additional debugging
            }
        });
    }
}

$(document).ready(function() {
    setAuthHeader(); // Call this function at the start of the code
    checkLoginStatus(); // Check login status on document ready

    let lastPage = window.location.pathname; // Default last page is the current page

    // Function to load the last visited page or default to home
    function loadLastVisitedPage() {
        const lastVisitedPage = history.state ? history.state.page : lastPage;
        window.location.href = lastVisitedPage;
    }

    // Handle click event for sign-in button
    $('#sign-in-btn').click(function(event) {
        event.preventDefault();
        loadSignInForm();
    });

    // Handle click event for logout link
    $('#logoutLink').click(function(event) {
        event.preventDefault();
        logout();
    });

    bindFormLinks(); // Ensure this function is called after setting the header

    // Function to load the sign-in form via AJAX
    function loadSignInForm() {
        $.ajax({
            url: '/sign-in-form',
            method: 'GET',
            success: function(data) {
                $('main').html(data);
                bindFormLinks();
                history.pushState({ page: '/sign-in' }, '', '/sign-in');
            },
            error: function(err) {
                console.error('Error loading the sign-in form:', err);
            }
        });
    }

    // Function to load the register form via AJAX
    function loadRegisterForm() {
        $.ajax({
            url: '/register-form',
            method: 'GET',
            success: function(data) {
                $('main').html(data);
                bindFormLinks();
                history.pushState({ page: '/register' }, '', '/register');
            },
            error: function(err) {
                console.error('Error loading the register form:', err);
            }
        });
    }

    // Bind form links for login and register actions
    function bindFormLinks() {
        $('#registerLink').click(function(event) {
            event.preventDefault();
            loadRegisterForm();
        });

        $('#loginLink').click(function(event) {
            event.preventDefault();
            loadSignInForm();
        });

        // Handle login form submission
        $('#loginForm').submit(function(event) {
            event.preventDefault();
            $.ajax({
                url: '/api/users/login',
                method: 'POST',
                data: $(this).serialize(),
                success: function(response) {
                    console.log('Login response:', response);
                    if (response.success) {
                        localStorage.setItem('isLoggedIn', 'true');
                        localStorage.setItem('isAdmin', response.isAdmin);
                        localStorage.setItem('token', response.token);
                        setAuthHeader();
                        updateUIAfterLogin(response.isAdmin);
                        console.log('Login successful, redirecting to home');
                        window.location.href = '/home';
                    } else {
                        alert('Login failed: ' + response.message);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Login error:', xhr.responseText);
                    alert('An error occurred during login: ' + xhr.responseText);
                }
            });
        });
    }

    // Update UI based on login status and admin role
    function updateUIAfterLogin(isAdmin) {
        console.log('Updating UI, isAdmin:', isAdmin);
        $('#sign-in-btn').hide();
        $('#logoutLink').show();
        if (isAdmin === true || isAdmin === 'true') {
            console.log('User is admin, adding dashboard link');
            if ($('#dashboardLink').length === 0) {
                $('nav ul').append('<li><a href="/dashboard" id="dashboardLink">Dashboard</a></li>');
            }
        } else {
            console.log('User is not admin');
        }
    }

    // Check login status from local storage and update UI accordingly
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        console.log('Checking login status. isLoggedIn:', isLoggedIn, 'isAdmin:', isAdmin);
        if (isLoggedIn) {
            updateUIAfterLogin(isAdmin);
        }
    }

    // Logout function to clear local storage and update UI
    function logout() {
        $.ajax({
            url: '/api/users/logout',
            method: 'POST',
            success: function(response) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('isAdmin');
                localStorage.removeItem('token'); // Remove the token
                $('#sign-in-btn').show();
                $('#logoutLink').hide();
                $('#dashboardLink').remove();
                window.location.href = '/home';
            },
            error: function(xhr, status, error) {
                console.error('Logout error:', xhr.responseText);
            }
        });
    }
});

window.addEventListener('popstate', function(event) {
    if (event.state && event.state.page) {
        if (event.state.page === '/sign-in') {
            loadSignInForm(); // Load the sign-in form from history state
        } else if (event.state.page === '/register') {
            loadRegisterForm(); // Load the register form from history state
        } else {
                loadLastVisitedPage(); // Load the last visited page or default to home
            }
        } else {
            loadLastVisitedPage(); // Load the last visited page or default to home
        }
});

// Debugging: log request headers
$(document).ajaxSend(function(event, jqxhr, settings) {
    console.log('Request Headers:', jqxhr.getAllResponseHeaders());
});

// Handle dashboard link click and load the dashboard
$(document).on('click', '#dashboardLink', function(event) {
    event.preventDefault();
    console.log('Dashboard link clicked');
    loadDashboard();
});

// Function to load the dashboard via AJAX
function loadDashboard() {
    console.log('Loading dashboard');
    $.ajax({
        url: '/dashboard',
        method: 'GET',
        success: function(data) {
            console.log('Dashboard loaded successfully');
            $('main').html(data);
        },
        error: function(xhr, status, error) {
            console.error('Dashboard error:', xhr.responseText);
            alert('Error loading dashboard: ' + xhr.responseText);
        }
    });
}