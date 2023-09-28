document.addEventListener('DOMContentLoaded', function() {
    console.log('furniture.js loaded');
    const element=document.getElementById('cart_button');
    element.onclick=function(){
        const fss= document.getElementById('cards');
        fss.style.display='none';
        const ess = document.getElementById('options');
        ess.style.display='none';
        if (element.innerHTML==='Add to cart'){
            const divi=document.createElement('div')
            divi.innerHTML=`<div class="card" style="width: 18rem;">
            <div class="form-group">
            <label for="input_quantity">Quantity:</label>
            <input type="number" class="form-control" name="quantity" id="input_quantity" placeholder="Enter quantity">
            </div>
            <button id="add_quantity" class="btn btn-primary">Add to cart</button>
                </div>`
            document.querySelector('#show_cards').append(divi);
            console.log('cart button clicked');
            const elemental=document.getElementById('add_quantity');
            elemental.onclick=function(){
                divi.style.display='none';
                console.log('add quantity button clicked');
                fetch('/Cart', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken") 
                },
                body: JSON.stringify({
                    id: element.dataset.id,
                    quantity: document.querySelector('#input_quantity').value
                })
            }).then(response => response.json()).then(result => {
                console.log(result);
                alert(result.message);
                if (result.message === 'Added to cart') {
                    element.innerHTML='Remove from cart';
                } else {
                    element.innerHTML='Add to cart';
                }
                window.location.reload();
            }).catch(error => {
                console.log('Error:', error);
            });

            };
        }
        else{
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
            alert(result.message);
            element.innerHTML='Add to cart';
            window.location.reload();
        }).catch(error => {
            console.log('Error:', error);
        });
        };
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


