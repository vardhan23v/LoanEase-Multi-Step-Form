# LoanEase - Multi-Step Loan Application Form

**Live Demo:** [https://pro1-pied.vercel.app](https://pro1-pied.vercel.app)

## About the Project

LoanEase is a production-grade, 8+ step multi-step loan application platform built as part of a Web Development Internship at Zetheta Algorithms Private Limited. It is designed to replace tedious, static application forms with a dynamic, highly interactive, and fault-tolerant user experience. By guiding the user through bite-sized, logical steps, the system reduces cognitive load and application abandonment rates. 

The system dynamically adapts its questions based on user input, ensuring that business owners see different fields than salaried employees, and home loan applicants provide different details than personal loan seekers.

## Key Features

- **Dynamic Form Wizard:** An 8-step flow (Loan Type, Personal Info, Address, Employment, Co-Applicant, Identity, Documents, Review).
- **Premium UI/UX:** "Liquid Glass" design system utilizing Tailwind CSS and smooth micro-animations powered by Framer Motion.
- **Auto-Save & Resume:** Utilizes `localStorage` and Zustand persistence to automatically save user progress, allowing them to drop off and resume exactly where they left off.
- **Real-Time Validation:** Immediate visual feedback on input errors using strict Zod schemas and React Hook Form.
- **Conditional Logic:** Automatically forces a co-applicant if the calculated EMI exceeds 40% of the user's declared monthly income.
- **Simulated Gateways:** Features mock interactive OTP gateways for PAN/Aadhaar verification.
- **Document Management:** Drag-and-drop file upload interface with visual upload statuses.
- **Pre-Approval Dashboard:** Generates a detailed pre-approval summary with interactive amortization charts upon completion.

## Tech Stack

- **Frontend:** React 18 (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Form Handling:** React Hook Form
- **Schema Validation:** Zod
- **Charts:** Recharts

## Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/vardhan23v/LoanEase-Multi-Step-Form.git
   cd LoanEase-Multi-Step-Form
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.
