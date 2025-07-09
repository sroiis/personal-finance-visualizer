# Personal Finance Visualizer

A Next.js app to track and visualize your personal finance transactions: showing monthly spending, top categories, recent transactions, and monthly breakdowns.

## Features

- Display total spending for the current month
- Show top spending category this month
- List 3 most recent transactions
- MongoDB for transaction data storage
- Toggleable monthly spending breakdown
- Clean UI with cards and buttons using Tailwind CSS and shadcn/ui components
- Fetches transaction data from a backend API (`/api/transactions`)

## Tech Stack

- Next.js 15 (app router)
- TypeScript
- Tailwind CSS + shadcn/ui components
- date-fns for date formatting
- Fetch API for backend integration

## Getting Started

1. Clone the repo:

```bash
git clone https://github.com/sroiis/personal-finance-visualizer.git
cd personal-finance-visualizer
```

2. Install dependencies:

```bash
npm install
# or
yarn
```
3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open http://localhost:3000 in your browser.

## Project Structure
components/ : Reusable UI components like cards and buttons

lib/constants/ : Static data like transaction categories

pages/api/transactions.ts : Backend API to fetch transactions

app/ : Next.js app directory containing main pages and layouts

## MongoDB Setup

This project uses MongoDB to store transaction data. To run the app locally, you need to:

1. **Set up a MongoDB database**

- You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud DB) or install MongoDB locally.

2. **Create a `.env.local` file** in the root of the project with your MongoDB connection string:

```env
MONGODB_URI=your_mongodb_connection_string_here
```

3. The backend API (/api/transactions) will use this env variable to connect and fetch data.

4. Make sure your database has a transactions collection with the expected schema (or seed it with sample data).

## Contributing
Feel free to open issues or submit pull requests. Suggestions and improvements are welcome!

## License
MIT License © 2025 sroiis
