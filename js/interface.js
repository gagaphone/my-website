(function($) {
  'use strict';
  
  /* Window Load */
  $(window).on('load', function() {
    $('.loader').fadeOut(200);
  });

  /* Parallax */
  $('.jarallax').jarallax({
    speed: 0.75
  });

  /* Navbar Fixed */
  var navbarDesctop = $('.navbar-desctop');
  if (navbarDesctop.length) {
    var origOffsetY = navbarDesctop.offset().top;

    $(window).on('scroll', function() {
      if ($(window).scrollTop() > origOffsetY) {
        navbarDesctop.addClass('fixed');
      } else {
        navbarDesctop.removeClass('fixed');
      }
    });
  }

  /* Navbar scroll */
  $('body:not(.fullpage) .navbar ul li a').on('click', function() {
    var target = $(this.hash);
    if (target.length) {
      $('html,body').animate({
        scrollTop: target.offset().top
      }, 1000);
      return false;
    }
  });

  /* Full page scroll */
  if ($('#pagepiling').length > 0) {
    $('#pagepiling').pagepiling({
      scrollingSpeed: 280,
      menu: '.navbar-nav',
      anchors: [
        'home', 'about', 'video', 'experience',
        'specialization', 'projects', 'partners', 'news'
      ],
      afterRender: function(anchorLink, index) {
        NavbarColor();
      },
      afterLoad: function(anchorLink, index) {
        $('.pp-section .intro').removeClass('animate');
        $('.active .intro').addClass('animate');
        NavbarColor();
      }
    });

    $(".pp-scrollable .intro").wrapInner("<div class='scroll-wrap'>");

    function NavbarColor() {
      if ($('.pp-section.active').hasClass('navbar-is-white')) {
        $('.navbar-desctop').addClass('navbar-white');
        $('#pp-nav').addClass('pp-nav-white');
      } else {
        $('.navbar-desctop').removeClass('navbar-white');
        $('#pp-nav').removeClass('pp-nav-white');
      }
    }
  }

})(jQuery);
