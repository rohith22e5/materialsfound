document.addEventListener('DOMContentLoaded', function() {
    console.log('furniture.js loaded');
    const element=document.getElementById('cart_button');
    element.onclick=function(){
        console.log('cart button clicked');
        fetch('/Cart', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken") 
            },
            body: JSON.stringify({
                id: element.dataset.id,
                quantity: 1
            })
        }).then(response => response.json()).then(result => {
            console.log(result);
            if (result.message === 'Added to cart') {
                element.innerHTML='Remove from cart';
            } else {
                element.innerHTML='Add to cart';
            }
        }).catch(error => {
            console.log('Error:', error);
        });
    }
});


// Get the CSRF token from the cookie
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Search for the CSRF cookie name
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


