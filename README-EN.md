**[Spanish Version | Versión en Español](./README.md)**

# Technical Challenge: Currency Exchange Dashboard (Next.js)
This web application implements a currency converter and exchange rates dashboard using Next.js 14 (App Router), TypeScript, Tailwind CSS, and the public Frankfurter API.

The architecture focused on performance and user experience, performing a single API call on the server and handling all subsequent conversions client-side. The design is focused on visual appeal and ease of use, including the flags of the currency entities.

## Installation

1. **Clone the repository:**
```bash
git clone [https://github.com/paulh789/currency-exchange-dashboard.git](https://github.com/paulh789/currency-exchange-dashboard.git)
cd currency-exchange-dashboard
```

2. **Install dependencies:**
```Bash
npm install
```

3. **Run the project in development mode:**
```Bash
npm run dev
```

4. Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in the browser.

## Bonus Feature: Transfer Cost Simulator
This function allows the user to simulate the impact of a percentage commission or a fixed charge applied to the amount of money to be transferred, which is common in companies that transfer money abroad, thus maintaining the focus on the user by offering transparency and trust.

## Use of Artificial Intelligence
As this is my first project using the required technologies, AI was used as a programming assistant, asking about the functioning of React components and generating initial code templates, which were then iterated on and manually modified according to my vision for the project. This allowed me to write quality code that meets the sought-after functional and style standards.

## Trade-Offs
The main trade-off of the project is performance vs. rate accuracy, since a single API call is made with USD as the base, and if another currency is required as the base for conversion, the calculations are done client-side. This ensures better performance, as the calculations are simply basic rules of three, but it entails that the rates are not real-time, but are updated every hour.

The other important trade-off is the prioritization of visual design over currency completeness, since due to time constraints only the 13 most important currencies are used instead of all those available in the Frankfurter API.

## Possible Improvements
If I had more time to continue developing the project, the remaining currencies from the API and other currencies like the Chilean Peso could be added, and the format of the numerical values could also be improved by adding a thousands separator (e.g. 1,000,000) to facilitate reading. Furthermore, although I am satisfied with the design of the application, I would like to try to organize the components so that they are all visible at the same time without having to scroll, like a true dashboard.