document.addEventListener('DOMContentLoaded', function() {
    const rating=document.querySelectorAll('.stars')
    rating.forEach(function (element) {
        const rate=element.dataset.rating;
        const stars = element.querySelectorAll('.star');
        for (let i = 0; i < rate; i++) {
            stars[i].classList.add('active');
        }
    });

});

