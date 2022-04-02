import $ from 'jquery';
import JustValidate from 'just-validate';
import 'waypoints/lib/noframework.waypoints.min.js';
import Swiper, {Navigation, Pagination} from 'swiper';

import lottie from 'lottie-web';
import AWN from 'awesome-notifications/dist';

let serviceSwiper;
let teamSwiper;

const isMobile = function () {
  return getComputedStyle(document.body, ':before').getPropertyValue('content') === '\"mobile\"';
}

const isDesktop = function () {
  return getComputedStyle(document.body, ':before').getPropertyValue('content') === '\"desktop\"';
}

// Set global options
let globalOptions = {
  durations: {
    global: 5000
  }
}
// Initialize instance of AWN
let notifier = new AWN(globalOptions)

function getScrollTop() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

let updateNav = (id, prev) => {
  let activeLink = $('.header .nav-link[href="#' + id + '"]')

  if (activeLink.length) {
    let parent = activeLink.parent();

    if (prev) {
      parent = parent.prev()
    }

    parent.addClass('__active').siblings().removeClass('__active')
  }
}

let serviceSlider = () => {
  const breakpoint = window.matchMedia('(min-width:834px)');

  const breakpointChecker = function (mobile) {
    if (mobile) {
      serviceSwiper = new Swiper('.js-service-swiper', {
        // Optional parameters
        loop: true
      });
    } else {
      if (serviceSwiper) {
        serviceSwiper.destroy();
      }
    }

    return false;
  };

  breakpoint.addEventListener("change", (e) => {
    breakpointChecker(!e.matches);
  });

  breakpointChecker(isMobile());
}

let heroValidation = () => {
  const validation = new JustValidate('#hero-discuss', {
    errorFieldCssClass: 'is-invalid'
  });

  validation
    .addField('#hero-email', [
      {
        rule: 'required',
        errorMessage: 'Field is required'
      },
      {
        rule: 'email',
        errorMessage: 'Email is invalid!'
      }
    ]);
}

let footerValidation = () => {
  const validation = new JustValidate('#contacts-form', {
    errorFieldCssClass: 'is-invalid'
  });

  validation
    .addField('#contact-msg', [
      {
        rule: 'required',
        errorMessage: 'Field is required'
      }
    ])
    .addField('#contact-name', [
      {
        rule: 'required',
        errorMessage: 'Field is required'
      }
    ])
    .addField('#contact-email', [
      {
        rule: 'required',
        errorMessage: 'Field is required'
      },
      {
        rule: 'email',
        errorMessage: 'Email is invalid!'
      }
    ]);
}

let feedbackValidation = () => {
  const validation = new JustValidate('#feedback-form-modal', {
    errorFieldCssClass: 'is-invalid'
  });

  validation
    .addField('#feedback-msg', [
      {
        rule: 'required',
        errorMessage: 'Field is required'
      }
    ])
    .addField('#feedback-name', [
      {
        rule: 'required',
        errorMessage: 'Field is required'
      }
    ])
    .addField('#feedback-email', [
      {
        rule: 'required',
        errorMessage: 'Field is required'
      },
      {
        rule: 'email',
        errorMessage: 'Email is invalid!'
      }
    ]);
}

let teamSlider = () => {
  teamSwiper = new Swiper('.js-team-swiper', {
    // Optional parameters
    modules: [Navigation, Pagination],
    loop: true,
    spaceBetween: 16,
    on: {
      init: (swp) => {
        $('.js-team-member').on('click', function () {
          let target = $($(this).attr('data-member'));

          if (target.length) {
            let options = {};
            notifier.modal(
              target.html(),
              'team-modal',
              options
            )
          }

          return false;
        });
      }
    },
    navigation: {
      enabled: true,
      nextEl: '#team-next-btn',
      prevEl: '#team-prev-btn'
    },
    pagination: {
      enabled: true,
      clickable: true,
      el: '#team-pagination',
      type: 'bullets'
      //renderBullet: function (index, className) {
      //  return '<span class="' + className + '">' + (menu[index]) + '</span>';
      //}
    },
    slidesPerView: 1,
    breakpoints: {
      // when window width is >= 834px
      834: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      // when window width is >= 1230px
      1230: {
        slidesPerView: 4,
        spaceBetween: 30
      }
    }
  });
}

(function ($) {
  // Use this variable to set up the common and page specific functions. If you
  // rename this variable, you will also need to rename the namespace below.
  let Sage = {
    // All pages
    'common': {
      init: function () {
        let $body = $('body');

        function checkWindowScroll() {
          $body.toggleClass('__scroll', getScrollTop() > 0)
        }

        checkWindowScroll();

        window.onscroll = function () {
          checkWindowScroll()
        };

        $('.js-mobile-menu').on('click', function () {
          $body.toggleClass('__open-menu');

          return false;
        });

        $('.js-lang-open').on('click', function () {
          if (window.outerWidth < 1230) {
            let lang = $('.js-lang-modal');
            if (lang.length) {
              let options = {};
              notifier.modal(
                lang.html(),
                'lang-modal',
                options
              )
            }
          }

          return false;
        });

        $('.js-service-item').on('click', function () {
          let theme = $(this).attr('data-theme') || '';
          let feedback = $('.js-feedback-modal');

          if (feedback.length) {
            feedback.find('#feedback-theme').attr('value', theme);

            let options = {
              replacements: {
                modal: {
                  'feedback-form': 'feedback-form-modal'
                }
              }
            };
            notifier.modal(
              feedback.html(),
              'feedback-modal',
              options
            );

            feedbackValidation();
          }

          return false;
        });

        $('.nav-link').each(function (ind, el) {
          $(this).on('click', (e) => {
            e.preventDefault()
            let target = $($(e.target).attr('href'));

            if (target.length) {
              $([document.documentElement, document.body]).animate({
                scrollTop: target.offset().top - (ind ? 60 : 96)
              }, 1000);
            }

            return false
          });

        });

        heroValidation();

        footerValidation();

        $('#hero-discuss').on('submit', (e) => {
          e.preventDefault();

          let errors = $(e.target).find('.is-invalid');

          if (!errors.length) {
            // Set custom options for next call if needed, it will override globals
            let nextCallOptions = {
              //durations: {
              //  success: 0
              //},
              labels: {
                success: "Отправлено"
              }
            };
            // Call one of available functions
            notifier.success('Заявка была успешно отправлена. Мы ответим вам на указанный Email адрес в течение одного рабочего дня.', nextCallOptions);

            e.target.reset();
          }

          return false
        });

        $('.waypoint').each(function (ind, el) {
          let waypoint = new Waypoint({
            element: el,
            offset: 96,
            handler: function (dir) {
              updateNav(el.id, dir === 'up' && ind > 0)
            }
          })
        });

        serviceSlider();

        teamSlider();

        let heroAnimationElement = $('#hero_animation_element');

        if (heroAnimationElement.length) {
          const heroAnimation = lottie.loadAnimation({
            container: heroAnimationElement[0],
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '../lottie/hero.json'
          });

          heroAnimation.goToAndPlay(0, true);
        }
      },
      finalize: function () {
        $('html').removeClass('no-js');
      }
    }
  };

  // The routing fires all common scripts, followed by the page specific scripts.
  // Add additional events for more control over timing e.g. a finalize event
  let UTIL = {
    fire: function (func, funcname, args) {
      let fire;
      let namespace = Sage;
      funcname = (funcname === undefined) ? 'init' : funcname;
      fire = func !== '';
      fire = fire && namespace[func];
      fire = fire && typeof namespace[func][funcname] === 'function';

      if (fire) {
        namespace[func][funcname](args);
      }
    },
    loadEvents: function () {
      // Fire common init JS
      UTIL.fire('common');
      // Fire page-specific init JS, and then finalize JS
      $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function (i, classnm) {
        UTIL.fire(classnm);
        UTIL.fire(classnm, 'finalize');
      });

      // Fire common finalize JS
      UTIL.fire('common', 'finalize');
      //$(#sh);
    }
  };

  // Load Events
  $(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.
