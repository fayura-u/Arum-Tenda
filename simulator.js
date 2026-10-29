const preview = document.querySelector('#tent-preview-scene');
const typeOptions = [...document.querySelectorAll('.tent-type-option')];
const typeBadge = document.querySelector('#preview-type-badge');
const primaryColor = document.querySelector('#tent-primary-color');
const secondaryColor = document.querySelector('#tent-secondary-color');
const primaryValue = document.querySelector('#tent-primary-value');
const secondaryValue = document.querySelector('#tent-secondary-value');

const typeLabels = {
  transparan: 'TRANSPARAN',
  kerut: 'KERUT',
  blukat: 'BLUKAT',
  piramid: 'PYRAMID',
};

function updateColor(input, property, output) {
  if (!input || !preview) return;
  const color = input.value.toUpperCase();
  preview.style.setProperty(property, color);
  if (output) output.value = color;
}

for (const option of typeOptions) {
  option.addEventListener('click', () => {
    if (!preview) return;
    const type = option.dataset.tentType;
    preview.dataset.tentType = type;
    if (typeBadge) typeBadge.textContent = typeLabels[type] || type.toUpperCase();
    typeOptions.forEach(item => {
      const selected = item === option;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
  });
}

primaryColor?.addEventListener('input', () => updateColor(primaryColor, '--fabric-primary', primaryValue));
secondaryColor?.addEventListener('input', () => updateColor(secondaryColor, '--fabric-secondary', secondaryValue));
updateColor(primaryColor, '--fabric-primary', primaryValue);
updateColor(secondaryColor, '--fabric-secondary', secondaryValue);