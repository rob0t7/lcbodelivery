# lcbodelivery

This is the simple API lecture we did at lighthouse Labs to show the usage of 3rd party APIs.

It allows you to fetch an item from the LCBO. It then displayes the results in a table with a **buy** button.

When you buy the product it then brings you to a payment credit card form. If you fill this form out *successfully*
it then fetches a stripe token and creates a charge via your server. It then displays an alert box on success.

## How to Run

  1. Checkout project
  2. run "npm install"
  3. run the app "npm start"
  4. open your browser to "http://localhost:3000"
  
## Debugging

In order to debug the node application you'll need to install node-inspect Once installed run "node-debug bin/www"
