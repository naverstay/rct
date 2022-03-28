import $ from 'jquery';
import 'waypoints/lib/noframework.waypoints.min.js';
import AWN from 'awesome-notifications/dist';

// Set global options
let globalOptions = {
  durations: {
    global: 100000
  }
}
// Initialize instance of AWN
let notifier = new AWN(globalOptions)

function getScrollTop() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

let updateNav = (id, prev) => {
  let activeLink = $('.nav-link[href="#' + id + '"]')

  if (activeLink.length) {
    let parent = activeLink.parent();

    if (prev) {
      parent = parent.prev()
    }

    parent.addClass('__active').siblings().removeClass('__active')
  }
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

        $('#hero-discuss').on('submit', (e) => {
          e.preventDefault()

          // Set custom options for next call if needed, it will override globals
          let nextCallOptions = {
            durations: {
              success: 0
            },
            labels: {
              success: "Отправлено"
            }
          };
          // Call one of available functions
          notifier.success('Заявка была успешно отправлена. Мы ответим вам на указанный Email адрес в течение одного рабочего дня.', nextCallOptions)

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
