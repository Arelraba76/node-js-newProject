$(document).ready(function() {
    console.log('Document ready');

    // Default last page is the current page
    let lastPage = window.location.pathname;

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

    // Function to load shoes by category
    function loadShoesByCategory(category) {
        lastPage = window.location.pathname; // Save the current page before loading new content
        $.ajax({
            url: `/shoes/category/${category}`,
            method: 'GET',
            success: function(data) {
                $('#content-wrap').html(data);
                history.pushState({ page: `/shoes/${category}` }, '', `/shoes/${category}`);
            },
            error: function(err) {
                console.error('Error loading shoes for category:', category, err);
            }
        });
    }

    // Function to load product details via AJAX
    function loadProduct(productId) {
        lastPage = window.location.pathname; // Save the current page before loading new content
        $.ajax({
            url: `/shoes/${productId}`,
            method: 'GET',
            success: function(response) {
                $('main').html(response);
                history.pushState({ page: `/product/${productId}` }, '', `/product/${productId}`);
            },
            error: function(err) {
                console.error('Error loading the product details:', err);
            }
        });
    }

    // Function to load the last visited page or default to last page
    function loadLastVisitedPage() {
        const lastVisitedPage = history.state ? history.state.page : lastPage;
        window.location.href = lastVisitedPage;
    }

    // Event handler for product clicks
    $(document).on('click', '.product', function(e) {
        e.preventDefault(); // Prevent default link behavior
        const productId = $(this).data('id');
        loadProduct(productId);
    });

    // Call setAuthHeader when document is ready
    setAuthHeader();

    // Bind category links
    $('#menLink').click(function(event) {
        event.preventDefault();
        loadShoesByCategory('Men');
    });

    $('#womenLink').click(function(event) {
        event.preventDefault();
        loadShoesByCategory('Women');
    });

    $('#kidsLink').click(function(event) {
        event.preventDefault();
        loadShoesByCategory('Kids');
    });

    // Load shoes based on category if present in URL
    const currentPath = window.location.pathname;
    if (currentPath.includes('/shoes/')) {
        const category = currentPath.split('/').pop();
        loadShoesByCategory(category);
    } else if (currentPath.includes('/product/')) {
        const productId = currentPath.split('/').pop();
        loadProduct(productId);
    }

    // Handle browser back/forward button events
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.page) {
            if (event.state.page.includes('/shoes/')) {
                const category = event.state.page.split('/').pop();
                loadShoesByCategory(category);
            } else if (event.state.page.includes('/product/')) {
                const productId = event.state.page.split('/').pop();
                loadProduct(productId);
            } else {
                loadLastVisitedPage(); // Load the last visited page or default to home
            }
        } else {
            loadLastVisitedPage(); // Load the last visited page or default to home
        }
    });
});
