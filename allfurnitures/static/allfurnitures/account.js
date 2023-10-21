document.addEventListener('DOMContentLoaded', () => {
   const element= document.querySelector('.expand-more svg');
   const show= document.querySelector('#show');
   show.style.display='none';
   element.addEventListener('click', () => {
    const page= document.querySelector('.page');
      page.style.display= 'none';
      show.style.display='block';
      fetch('/account' ,{
      method: 'GET',
      headers: {
         "Content-Type": "application/json",
      },
      }).then(response => response.json()).then(result => {
      const newpage=document.createElement('div');
      newpage.innerHTML=`<div class="user-info" id=user-info>
      <h1>Account Information</h1>.
      <img src="${ result.image }" alt="profile image">
      <label for="username">Username</label>
      <p>${ result.username }</p>
      <label for="email">Email</label>
      <p>${ result.email }</p>
      <label for="mobile">Mobile NO.</label>
      <p>${ result.mobile }</p>
      </div>`;
      show.append(newpage);
         
   });
   });
   const ordercontainer= document.getElementById('orders');
   ordercontainer.onclick=function(){
      const page= document.querySelector('.page');
      page.style.display= 'none';
      show.style.display='block';
      fetch('/orders').then(response => response.json()).then(result => {
         for(results of result){
            console.log(results);
            const newpage=document.createElement('div');
            newpage.innerHTML=`<div class="order-info">
            <h1>Order Information</h1>
            <label for="product-image">Product Image</label>
            <img src="${ results.image }" alt="product image">
            <label for="product-name">Product Name</label>
            <p>${ results.furniture }</p>
            <label for="product-price">Product Price</label>
            <p>${ results.price }</p>
            <label for="product-quantity">Product Quantity</label>
            <p>${ results.quantity }</p>
            <label for="order-date">Order Date</label>
            <p>${ results.date }</p>
            </div>`;
            show.append(newpage);
         }
      });
   }
});