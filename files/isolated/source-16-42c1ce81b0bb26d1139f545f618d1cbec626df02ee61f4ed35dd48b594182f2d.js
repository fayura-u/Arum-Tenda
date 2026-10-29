var totalSlides = 0;
var currentSlide = 0;
var endSlide = 0;

// Swiper
var swiper = new Swiper('.swiper-container', {
  pagination: '.swiper-pagination',
  paginationClickable: true, 
  nextButton: '.swiper-button-next',
  prevButton: '.swiper-button-prev',
  loop: false,
  speed: 500, 
  onSlideChangeEnd: function(slide) {
    genTheme(slide.activeIndex);
    currentSlide = slide.activeIndex;
  }, 
  onInit(slide) {
    genTheme(slide.activeIndex);
    totalSlides = slide.slides.length;
    endSlide = totalSlides - 1;
  }
});

$('.swiper-button-next').on('click', function(e) {
  var x = $(this)
  if ($(x).hasClass('swiper-button-disabled')) {
    if (currentSlide == endSlide) {
      swiper.slideTo(0);
    }
  }
});

$('.swiper-button-prev').on('click', function(e) {
  var x = $(this)
  if ($(x).hasClass('swiper-button-disabled')) {
    if (currentSlide == 0) {
      swiper.slideTo(totalSlides - 1);
    }
  }
});

$(window).on('resize load', function(){
    var win = $(this); //this = window
    if (win.width() <= 768) {
      $('.youtube-slide').css('display', 'none');
      $('.youtube-slide').removeClass('swiper-slide');
      $('.propsyoutube').removeClass('bannerProps');
      swiper.update();
    }

    if (win.width() > 768) {
      $('.youtube-slide').addClass('swiper-slide');
      $('.propsyoutube').addClass('bannerProps');
      $('.youtube-slide').css('display', 'block');
      swiper.update();
    }

    if(win.width > 980) {
      // Masonry
      // var elem = document.querySelector('.masonry');
      // var msnry = new Masonry( elem, {
      //   itemSelector: '.masonry-item',
      //   horizontalOrder: true
      // });

      // // Reinitialize Masonry on Card hover
      // var card = document.querySelectorAll('.masonry-item > .axioo-card');
      // for (var i = 0; i < card.length; i++) {
      //     card[i].onmouseover = function(){
      //         msnry.layout();
      //     };
      //     card[i].onmouseout = function(){
      //         msnry.layout();
      //     };
      // }
    }
});

function genTheme(slideIndex) {
  var arrIndex = slideIndex-1;
  var nav = document.querySelector('.main_nav');
  var banner = document.querySelectorAll('.banner__container')[slideIndex];
  var bannerProps = document.querySelectorAll('.bannerProps')[slideIndex];
  var bannerOv = document.querySelector('.banner__overlay');
  var bd = 'main_nav__desktop--' + bannerProps.getAttribute('navColorDesktop');
  var bm = 'main_nav__mobile--' + bannerProps.getAttribute('navColorMobile');
  var nd = 'banner__container__desktop--' + bannerProps.getAttribute('bannerColorDesktop');
  var nm = 'banner__container__mobile--' + bannerProps.getAttribute('bannerColorMobile');
  var bod = 'banner__overlay__desktop--' + bannerProps.getAttribute('navColorDesktop');
  var bom = 'banner__overlay__mobile--' + bannerProps.getAttribute('navColorMobile');

  // Navbar
  nav.classList.remove('main_nav__desktop--light');
  nav.classList.remove('main_nav__desktop--dark');
  nav.classList.remove('main_nav__mobile--light');
  nav.classList.remove('main_nav__mobile--dark');
  nav.classList.add(bd);
  nav.classList.add(bm);

  // Banner
  if (banner !== undefined) {
    banner.classList.remove('banner__container__desktop--light');
    banner.classList.remove('banner__container__desktop--dark');
    banner.classList.remove('banner__container__mobile--light');
    banner.classList.remove('banner__container__mobile--dark');
    banner.classList.add(nd);
    banner.classList.add(nm);
  }

  // Overlay
  bannerOv.classList.remove('banner__overlay__desktop--light');
  bannerOv.classList.remove('banner__overlay__mobile--light');
  bannerOv.classList.remove('banner__overlay__desktop--dark');
  bannerOv.classList.remove('banner__overlay__mobile--dark');
  bannerOv.classList.add(bod);
  bannerOv.classList.add(bom);
}

// Masonry
// var elem = document.querySelector('.masonry');
// var msnry = new Masonry( elem, {
//   itemSelector: '.masonry-item',
//   horizontalOrder: true
// });

// // Reinitialize Masonry on Card hover
// var card = document.querySelectorAll('.masonry-item > .axioo-card');
// for (var i = 0; i < card.length; i++) {
//     card[i].onmouseover = function(){
//         msnry.layout();
//     };
//     card[i].onmouseout = function(){
//         msnry.layout();
//     };
// }


