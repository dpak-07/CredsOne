import { Routes, Route, Link } from "react-router-dom";
import Profile from "./Profile";
import Wallet from "./Wallet";
import Analytics from "./Analytics";
import History from "./History";

export default function LearnerDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Learner Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <Link to="profile" className="text-blue-600 hover:underline">Profile</Link>
          </li>
          <li>
            <Link to="wallet" className="text-blue-600 hover:underline">Wallet</Link>
          </li>
          <li>
            <Link to="analytics" className="text-blue-600 hover:underline">Analytics</Link>
          </li>
          <li>
            <Link to="history" className="text-blue-600 hover:underline">History</Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Routes>
          <Route path="profile" element={<Profile />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="history" element={<History />} />
          <Route path="" element={<Profile />} /> {/ Default to Profile */}
        </Routes>
      </main>
    </div>
  );
}