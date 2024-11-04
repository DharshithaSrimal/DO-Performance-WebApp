# Screener-Performance-Report-App

Screener Performance Report App

The **Screener Performance Report** is a custom DHIS2 web application designed to display aggregated results of screenings conducted by screeners. This app provides insights into the performance and outcomes of screening activities.

## Getting Started

### Prerequsits

1. Log into DHIS2, then add 'DO Performance View' and 'View Orgunit Group With Users' as queries.
2. Follow the instructions in Interoperability Layer Repo.

### Running Locally

1. First, update the `.env` file by providing the correct DHIS2 credentials.
2. To run the app locally, execute the following command:

```bash
yarn start
```

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Installing to DHIS2

1. First, update the `.env` file by providing the correct DHIS2 credentials.
2. Generate the build by running the following command.

```bash
yarn build
```

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
A deployable `.zip` file can be found in `build/bundle`!

3. Log in to your DHIS2 instance.
4. Navigate to App Management -> Manual Install.
5. Upload the generated build file from the yarn build command.
