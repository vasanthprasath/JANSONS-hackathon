# JanSeva - Public Grievance Portal

A mobile-first web application for tracking, measuring, and resolving public grievances. Built for hackathon demonstration.

## Features

- **Citizen Dashboard**: Report issues, track status, and view city stats.
- **Complaint Tracking**: Real-time status updates with timeline view.
- **Resolution Quality**: Rate the quality of resolution and provide feedback.
- **Analytics Dashboard**: (Authority View) Monitor average resolution time and department performance.
- **Mobile-First UI**: Designed to look and feel like a native Android app.

## Project Structure

- `app/`: Next.js App Router pages
- `components/ui/`: Reusable UI components (Buttons, Cards, Inputs)
- `lib/`: Utilities and Context providers (Auth)

## Tech Stack

- **Framework**: Next.js 14+ 
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.
   > **Tip**: Open Developer Tools (F12) and toggle "Device Toolbar" (Ctrl+Shift+M) to view it as a mobile app. 

## Hackathon Demo Flow

1. **Login**: Use any email (e.g., `user@test.com`) to login as a Citizen.
2. **Report**: Click "+" to report a new issue (e.g., Pothole).
3. **Track**: View the status in the "Activity" tab.
4. **Authority View**: Go to "Profile" -> "View Analytics Dashboard" to see the admin side.
