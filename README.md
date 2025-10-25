🩺 MediGuardChain
MediGuardChain is a full-stack healthcare and insurance management system built for patients, doctors, pharmacies, and insurers. It provides secure access to medical records, prescription workflows, claim submissions, and blockchain-based audit trails.

🚀 Tech Stack
| Layer      |  Technology                 | 
| Frontend   | React + TypeScript + Vite   | 
| Backend    | Express.js + TypeScript     | 
| Database   | Supabase (PostgreSQL)       | 
| Auth       | Supabase Auth + Context API | 
| State Mgmt | React Query                 | 
| Routing    | Wouter                      | 
| Styling    | Tailwind CSS / Custom CSS   | 



📦 Features
- 🔐 Role-based Dashboards for Patients, Doctors, Pharmacies, and Insurers
- 📄 Medical Records Access with granular permissions
- 💊 Prescription Management for doctors and pharmacies
- 🧾 Insurance Claims & Plan Management
- 🧠 Blockchain Audit Trail for medical data integrity
- 📈 Insights Dashboard for patients
- 🧰 Modular Routing with protected access
- 🌐 Supabase Integration for real-time data and auth

🧑‍💻 Getting Started
1. Clone the repo
git clone https://github.com/your-username/MediGuardChain.git
cd MediGuardChain


2. Install dependencies
npm install


3. Set up environment variables
Create a .env file in the root:
DATABASE_URL=your_supabase_postgres_url
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=5000


4. Run the development server
npm run dev



🧭 Project Structure
MediGuardChain/
├── client/              # React frontend
│   ├── pages/           # Role-based dashboard pages
│   ├── components/      # Reusable UI components
│   └── lib/             # Auth context, query client
├── server/              # Express backend
│   ├── routes/          # API endpoints
│   ├── db.ts            # Supabase DB connection
│   └── index.ts         # Server entry point
├── .env
├── package.json
└── README.md



🛡️ Roles & Routes
| Role       | Dashboard Path       | 
| Patient    | /dashboard/patient   | 
| Doctor     | /dashboard/doctor    | 
| Pharmacy   | /dashboard/pharmacy  | 
| Insurance  | /dashboard/insurance | 



📚 Future Enhancements
- ✅ Email notifications
- ✅ File uploads for prescriptions
- ✅ Admin panel for system-wide analytics
- ✅ Blockchain smart contract integration

🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

📄 License
MIT License © 2025 Vaibhav


