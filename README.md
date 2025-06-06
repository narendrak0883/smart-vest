# SmartVest Investment Journey Game

A Vue 3 application with TypeScript and Pinia that simulates an investment journey game where users can track their portfolio progress over time, see buy/sell transactions, and compare performance against the NIFTY index.

## Features

- Interactive timeline with day-by-day progression
- Portfolio tracking with start and final states
- Transaction events (buy/sell) with bot advisor comments
- Performance comparison against NIFTY index
- Dynamic chart visualization
- Time travel-themed game interface
- Mobile-responsive design

## Tech Stack

- **Vue 3**: Using the Composition API
- **TypeScript**: For type safety and better development experience
- **Pinia**: For state management
- **Vue Router**: For navigation
- **CSS**: Custom styling with variables for theming

## Project Structure

```
/src
  /assets
    /images         - Holds icons, backgrounds, and UI elements
    /styles         - Global CSS styles
  /components
    /common         - Reusable UI components (buttons, cards, etc.)
    /game           - Game-specific components (timeline, portfolio cards)
  /layouts          - Page layouts and containers
  /router           - Vue Router configuration
  /stores           - Pinia stores for state management
  /views            - Main application views/pages
  /types            - TypeScript interfaces and types
  App.vue           - Root component
  main.ts           - Application entry point
  shims-vue.d.ts    - TypeScript declarations for Vue files
```

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/smartvest.git
cd smartvest
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Build for production
```bash
npm run build
# or
yarn build
```

## Game Flow

1. **Setup Phase**: User selects a starting date, investment amount, and timeline length
2. **Journey Phase**: User explores their investment journey day by day
3. **Review Phase**: User can see the final portfolio and performance compared to NIFTY

## Customization

- Theme colors can be modified in `src/assets/styles/main.css`
- Game parameters like initial stocks and journey days can be adjusted in the Pinia store

## Future Enhancements

- Actual API integration for real-time stock data
- User authentication and saving of multiple journeys
- More advanced bot advisor with AI-powered recommendations
- Additional transaction types (dividends, splits, etc.)
- Social sharing of investment results

## License

MIT License - See LICENSE file for details