
export function renderCards(data, selector, templatePath = '../templates/card.hbs') {
  fetch(templatePath)
    .then(res => res.text())
    .then(templateText => {
      const template = Handlebars.compile(templateText);
      const html = template({ items: data });
      const container = document.querySelector(selector);
      if (container) container.innerHTML = html;
    })
    .catch(err => console.error('Error cargando la plantilla:', err));
}
