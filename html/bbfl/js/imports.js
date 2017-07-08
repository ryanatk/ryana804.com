var importTemplates = function () {
  var templates = {};
  var template, key;
  var links = document.querySelectorAll('link[rel="import"]');
  var len = links.length;

  while (len--) {
    // Clone the <template> in the import.
    template = links[len].import.querySelector('template');
    key = template.id;
    if (key)
      templates[key] = template;
  }

  return templates;
};

var templates = importTemplates();

var addImport = function (selector, templateId) {
  var template = templates[templateId];
  var clone = document.importNode(template.content, true);

  document.querySelector(selector).appendChild(clone);
};
