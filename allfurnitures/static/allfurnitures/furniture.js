document.addEventListener('DOMContentLoaded', function() {
     const butt= document.getElementById('comment_button')
     butt.disabled=true;
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
    document.getElementById('comments').onkeyup=function (){
        if (document.getElementById('comments').value.length>0){
            butt.disabled=false;
        }
        else{
            butt.disabled=true;
        }
        butt.onclick=function () {
            fetch('/Comment', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken") 
            },
            body: JSON.stringify({
                id: element.dataset.id,
                comment: document.getElementById('comments').value
            })
        }).then(response => response.json()).then(result => {
            console.log(result);
            alert(result.message);
            window.location.reload();
        }).catch(error => {
            console.log('Error:', error);
        });
        };
    };
    const wishlister=document.getElementById('wishlist');
    wishlister.addEventListener('click', function() {
        console.log('wishlist button clicked');

        fetch('/wishlist', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken") 
            },
            body: JSON.stringify({
                id: element.dataset.id,
            })
        }).then(response => response.json()).then(result => {
            console.log(result);
            alert(result.message);
            if (result.message === 'Added to wishlist') {
                document.getElementById('wishlist').style.fill='red';
            } else {
                document.getElementById('wishlist').style.fill='black';
            }
        }).catch(error => {
            console.log('Error:', error);
        });
    });
    const rating=document.getElementById('star_rating');
    const rate=rating.dataset.rating;
    // Select the star elements and add the "active" class to color the appropriate number of stars
    const stars = document.querySelectorAll('.star-rating .stars .star');

    for (let i = 0; i < rate; i++) {
    stars[i].classList.add('active');
    }

    const buy=document.getElementById('buy_button');
    buy.onclick=function(){
        console.log('buy button clicked');
        fetch('/orders',{
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken") 
            },
            body: JSON.stringify({
                id: buy.dataset.id,
                quantity: 1
            })
        }).then(response => response.json()).then(result => {
            console.log(result);
            alert(result.message);
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


