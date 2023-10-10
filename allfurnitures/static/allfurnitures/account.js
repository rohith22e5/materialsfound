document.addEventListener('DOMContentLoaded', () => {
   const element= document.querySelector('.expand-more svg');
   const show= document.querySelector('#show');
   show.style.display='none';
   element.addEventListener('click', () => {
    const page= document.querySelector('.page');
      page.style.display= 'none';
      show.style.display='block';
      const newpage=document.createElement('div');
      newpage.innerHTML=`<div class="user-info" id=user-info>
      <h1>Account Information</h1>.
      <img src="${ page.dataset.photo }" alt="profile image">
      <label for="username">Username</label>
      <p>${ page.dataset.username }</p>
      <label for="email">Email</label>
      <p>${ page.dataset.email }</p>
      </div>`;
      show.append(newpage);
   });
});