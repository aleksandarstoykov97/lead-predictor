const elements = {
  form: document.querySelector('#forecast-form'),
  currency: document.querySelector('#currency'),
  revenue: document.querySelector('#revenue'),
  orderValue: document.querySelector('#order-value'),
  leadRate: document.querySelector('#lead-rate'),
  prospectRate: document.querySelector('#prospect-rate'),
  chart: document.querySelector('#bar-chart'),
  prospects: document.querySelector('#prospects'), leads: document.querySelector('#leads'), customers: document.querySelector('#customers'),
  prospectPercent: document.querySelector('#prospect-percent'), leadPercent: document.querySelector('#lead-percent'), customerPercent: document.querySelector('#customer-percent'),
  leadRateValue: document.querySelector('#lead-rate-value'), prospectRateValue: document.querySelector('#prospect-rate-value'),
  startDate: document.querySelector('#start-date'), endDate: document.querySelector('#end-date'), campaignLength: document.querySelector('#campaign-length'),
};
const currencySigns = { USD: '$', EUR: '€', BGN: 'лв.' };
const currencyLocales = { USD: 'en-US', EUR: 'de-DE', BGN: 'bg-BG' };

function forecast() {
  const revenue = Math.max(0, Number(elements.revenue.value) || 0);
  const orderValue = Math.max(1, Number(elements.orderValue.value) || 1);
  const leadRate = Number(elements.leadRate.value) / 100;
  const prospectRate = Number(elements.prospectRate.value) / 100;
  const customers = Math.round(revenue / orderValue);
  const leads = Math.max(customers, Math.round(customers / prospectRate));
  const prospects = Math.max(leads, Math.round(leads / leadRate));
  const values = [0.16, 0.34, 0.46, 0.67, 0.85, 1].map((share, index) => Math.max(1, Math.round(prospects * share)));
  const max = Math.max(...values);

  elements.prospects.value = prospects.toLocaleString(); elements.leads.value = leads.toLocaleString(); elements.customers.value = customers.toLocaleString();
  elements.prospectPercent.textContent = '100%'; elements.leadPercent.textContent = `${Math.round(leadRate * 100)}%`; elements.customerPercent.textContent = `${Math.round(prospectRate * 100)}%`;
  document.querySelector('#prospects-progress').style.width = '100%'; document.querySelector('#leads-progress').style.width = `${leadRate * 100}%`; document.querySelector('#customers-progress').style.width = `${prospectRate * 100}%`;
  elements.leadRateValue.value = `${(leadRate * 100).toFixed(2)}%`; elements.prospectRateValue.value = `${(prospectRate * 100).toFixed(2)}%`;
  updateRangeFill(elements.leadRate); updateRangeFill(elements.prospectRate);
  elements.chart.innerHTML = values.map((value, index) => {
    const monthlyLeads = Math.round(value * leadRate);
    const monthlyCustomers = Math.round(monthlyLeads * prospectRate);
    return `<div class="bar-row"><span class="month">${index + 1}</span><div class="bar" tabindex="0" style="width:${(value / max) * 100}%"><span class="bar-tooltip"><strong>Month #${index + 1}</strong><span>Prospects: ${value.toLocaleString()}</span><span>Leads: ${monthlyLeads.toLocaleString()}</span><span>Customers: ${monthlyCustomers.toLocaleString()}</span></span></div></div>`;
  }).join('');
}
function updateRangeFill(range) {
  const fill = (Number(range.value) / Number(range.max)) * 100;
  range.style.background = `linear-gradient(to right, #d9e0ec 0%, #d9e0ec ${fill}%, #526177 ${fill}%, #526177 100%)`;
}
function updateCurrency() {
  const sign = currencySigns[elements.currency.value];
  document.querySelectorAll('.currency-sign').forEach((node) => { node.textContent = sign; });
  [elements.revenue, elements.orderValue].forEach((input) => { input.setAttribute('aria-label', `${input.previousElementSibling.textContent} in ${elements.currency.options[elements.currency.selectedIndex].text.trim()}`); });
  document.documentElement.lang = currencyLocales[elements.currency.value] === 'bg-BG' ? 'bg' : 'en';
}
function updateCampaignLength() {
  const days = Math.max(0, Math.round((new Date(elements.endDate.value) - new Date(elements.startDate.value)) / 86400000));
  elements.campaignLength.textContent = `Campaign duration: ${days} day${days === 1 ? '' : 's'}`;
}
elements.form.addEventListener('input', () => { forecast(); updateCampaignLength(); });
elements.leadRate.addEventListener('input', forecast); elements.prospectRate.addEventListener('input', forecast); elements.currency.addEventListener('change', updateCurrency);
updateCurrency(); updateCampaignLength(); forecast();
