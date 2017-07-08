var bbfl = window.bbfl || {};

(function () {
  var templates = importTemplates();

  bbfl.addHeader = addHeader;


  function importTemplates() {
    var addTemplate = function (template) {
      var key = template.id;
      if (key)
        bbfl.templates[key] = document.importNode(template.content, true);
    };
    var templates = {};
    var links = document.querySelectorAll('link[rel="import"]');
    var len = links.length;

    while (len--) {
      // Clone the <template> in the import.
      addTemplate(links[len].import.querySelector('template'));
    }
  }

  function appendTemplate(element, templateId) {
    var template = templates[templateId];

    element.appendChild(clone);
  };

  function setActiveLink(element, optionalSelector) {
    var parent = optionalSelector || 'a';
    var links = element.querySelectorAll('a');
    var len = links.length;

    while (len--) {
      if (~links[len].href.indexOf(document.location.pathname))
        links[len].classList.add('active');
    }
  }

  function addHeader(selector) {
    var header = document.querySelector(selector);
    appendTemplate(header, 'header-template');
    setActiveLink(header, 'li')
  }
})();
