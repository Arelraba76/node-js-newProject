// הוסף פונקציה זו בתחילת הקובץ
function setAuthHeader() {
    const token = localStorage.getItem('token');
    console.log('Setting auth header with token:', token);  // הוסף את זה לדיבוג
    if (token) {
        $.ajaxSetup({
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                console.log('Authorization header set:', 'Bearer ' + token); // דיבוג נוסף
            }
        });
    }
}

$(document).ready(function() {
    setAuthHeader(); // קרא לפונקציה זו בתחילת הקוד
    checkLoginStatus();

    $('#sign-in-btn').click(function(event) {
        event.preventDefault();
        loadSignInForm();
    });

    $('#logoutLink').click(function(event) {
        event.preventDefault();
        logout();
    });

    bindFormLinks(); // ודא שהפונקציה הזו נקראת לאחר הגדרת הכותרת

    function loadSignInForm() {
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
    }

    function loadRegisterForm() {
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
    }

    function bindFormLinks() {
        $('#registerLink').click(function(event) {
            event.preventDefault();
            loadRegisterForm();
        });

        $('#loginLink').click(function(event) {
            event.preventDefault();
            loadSignInForm();
        });

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

    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        console.log('Checking login status. isLoggedIn:', isLoggedIn, 'isAdmin:', isAdmin);
        if (isLoggedIn) {
            updateUIAfterLogin(isAdmin);
        }
    }

    function logout() {
        $.ajax({
            url: '/api/users/logout',
            method: 'POST',
            success: function(response) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('isAdmin');
                localStorage.removeItem('token'); // הסרת הטוקן
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

$(document).ajaxSend(function(event, jqxhr, settings) {
    console.log('Request Headers:', jqxhr.getAllResponseHeaders());
});


$(document).on('click', '#dashboardLink', function(event) {
    event.preventDefault();
    console.log('Dashboard link clicked');
    loadDashboard();
});

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