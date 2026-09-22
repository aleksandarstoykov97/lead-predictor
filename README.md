# LeadPredictor

A responsive campaign forecasting calculator inspired by the supplied dashboard reference.

Enter campaign revenue and average order value, then adjust response rates to see projected prospects, leads, customers and the month-by-month forecast update instantly.

## Forecast formula

The calculator rounds up each required total: `Customers = revenue / average order value`, `Leads = customers / lead response rate`, and `Prospects = leads / prospect response rate`.

## Run locally

Open `index.html` in a browser, or serve the folder with any static-file server.

## Deployment

The project is configured as a dependency-free static site and can be deployed directly to Netlify.
