# Inventory Management Dashboard

A modern, real-time inventory management system built with Next.js and Supabase. This application helps businesses track inventory, manage sales, and monitor expenses with real-time updates and comprehensive reporting.

## Features

- **Real-time Updates**: All changes reflect instantly across the dashboard
- **Inventory Management**: 
  - Track stock levels
  - Set reorder points
  - Categorize items
  - Monitor unit prices
- **Sales Tracking**:
  - Record sales transactions
  - Real-time sales summaries
  - Daily, weekly, and monthly reports
- **Expense Management**:
  - Track business expenses
  - Categorize spending
  - Monitor cash flow
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **Real-time**: Supabase Realtime

## Getting Started

### Prerequisites

- Node.js 14.0 or later
- npm or yarn
- A Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/inventory-dashboard.git
cd inventory-dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Database Setup

The application requires the following Supabase tables:

- `inventory_items`
- `sales`
- `expenses`
- `daily_sales_summary`
- `weekly_sales_summary`
- `monthly_sales_summary`

Schema details and setup instructions can be found in the [database setup guide](./docs/database-setup.md).

## Deployment

This project is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel's project settings
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help with setup, please open an issue in the GitHub repository.

## Acknowledgments

- Next.js team for the amazing framework
- Supabase team for the backend infrastructure
- Vercel for hosting and deployment
- All contributors who have helped shape this project