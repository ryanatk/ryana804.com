var bbfl = window.bbfl || {};

(function () {
  bbfl.templates = {};
  bbfl.addHeader = addHeader;


  (function importTemplates() {
    var addTemplate = function (template) {
      var key = template.id;
      if (key)
        bbfl.templates[key] = document.importNode(template.content, true);
    };
    var links = document.querySelectorAll('link[rel="import"]');
    var len = links.length;

    while (len--) {
      // Clone the <template> in the import.
      addTemplate(links[len].import.querySelector('template'));
    }
  })();

  function appendTemplate(element, templateId) {
    element.appendChild(bbfl.templates[templateId]);
  };

  function setActiveLink(wrapper, tagName) {
    var elTagName = tagName || 'a';
    var addClass = function (el) {
      if (el.tagName === elTagName.toUpperCase()) {
        el.classList.add('active');
      } else {
        addClass(el.parentNode);
      }
    };
    var links = wrapper.querySelectorAll('a');
    var len = links.length;

    while (len--) {
      if (~links[len].href.indexOf(document.location.pathname))
        addClass(links[len]);
    }
  }

  function addHeader() {
    var header = document.querySelector('header');

    appendTemplate(header, 'header-template');
    setActiveLink(header, 'li')
  }
})();
