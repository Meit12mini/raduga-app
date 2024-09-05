window.addEventListener("load", function () {
  var swiperElement = document.querySelector(".swiper-container");
  var swiper = new Swiper(swiperElement, {
    // Optional parameters
    direction: "horizontal",
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,

    // If we need pagination
    pagination: {
      el: ".swiper-pagination",
    },

    // Navigation arrows

    //   breakpoints: {
    //     900: {
    //       slidesPerView: 1,
    //     },
    //   },
  });
});
