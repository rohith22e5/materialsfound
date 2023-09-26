document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.categories').forEach(function(categories) {
        categories.onclick = function() {
            const fss = document.getElementById('cards');
            fss.style.display='none';
            console.log(categories.dataset.category);
            fetch(`/categories/${categories.dataset.category }`).then(response => response.json()).then(result => {
                //console.log(result);
                result.forEach(function(furniture) {
                    const card=document.createElement('div');
                    card.className='card';
                    card.innerHTML=`<div class="card-body">
                    <h3>${ furniture.name }</h3>
                      <span>
                          <img src="${furniture.image}" alt="${ furniture.name }">
                      </span>
                      <p>Price: ₹ ${furniture.price }/-</p>
                      <p>Rating: ${ furniture.rating }</p>
                      <p>Created by: ${ furniture.user }</p>
                      <a href="furniture/${ furniture.id }" class="btn btn-primary" >View</a>
                  </div>

                    </div>`;
                    document.querySelector('#show_cards').append(card);
                });
                console.log(result);

            })
        }
    });
});
