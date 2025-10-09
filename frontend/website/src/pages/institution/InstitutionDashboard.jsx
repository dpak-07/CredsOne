import React, { useState } from 'react';
import { Award, Wallet, TrendingUp, Users, FileText, Activity, Clock, CheckCircle, AlertCircle, Search, Download, Eye } from 'lucide-react';

export default function InstitutionDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [walletConnected, setWalletConnected] = useState(false);
  const [learnerID, setLearnerID] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const institutionProfile = {
    name: "Tech Institute of Excellence",
    id: "INST-2024-001",
    established: "2020",
    accreditation: "NAAC A+ Grade",
    totalStudents: 2453,
    activeCourses: 48,
    certificatesIssued: 1876
  };

  const analytics = {
    monthlyEnrollments: 234,
    completionRate: 87.5,
    avgRating: 4.6,
    activeInstructors: 34
  };

  const transactions = [
    { id: 'TXN001', learnerName: 'John Smith', learnerId: 'LRN2024001', course: 'Web Development', type: 'Certificate Issued', date: '2024-03-15', status: 'Verified', hash: '0x7a9b...3c2d' },
    { id: 'TXN002', learnerName: 'Sarah Johnson', learnerId: 'LRN2024002', course: 'Data Science', type: 'Certificate Issued', date: '2024-03-14', status: 'Verified', hash: '0x8f3a...4b1e' },
    { id: 'TXN003', learnerName: 'Mike Chen', learnerId: 'LRN2024003', course: 'UI/UX Design', type: 'Certificate Issued', date: '2024-03-13', status: 'Pending', hash: '0x2d4f...9a7c' },
    { id: 'TXN004', learnerName: 'Emma Wilson', learnerId: 'LRN2024004', course: 'Cloud Computing', type: 'Certificate Issued', date: '2024-03-12', status: 'Verified', hash: '0x5e8b...1f3d' },
  ];

  const verificationLogs = [
    { timestamp: '2024-03-15 14:30:22', action: 'Certificate Verified', entity: 'Employer Corp', learnerId: 'LRN2024001' },
    { timestamp: '2024-03-15 11:15:08', action: 'Certificate Issued', entity: 'Tech Institute', learnerId: 'LRN2024001' },
    { timestamp: '2024-03-14 16:45:33', action: 'Certificate Verified', entity: 'HR Solutions Ltd', learnerId: 'LRN2024002' },
  ];

  const handleIssueCertificate = () => {
    if (learnerID.trim()) {
      setShowCertificate(true);
      setTimeout(() => setShowCertificate(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Institution</h2>
              <p className="text-slate-400 text-xs">Portal</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {[
            { id: 'overview', icon: Activity, label: 'Overview' },
            { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
            { id: 'certificates', icon: Award, label: 'Certificates' },
            { id: 'transactions', icon: FileText, label: 'Transactions' },
            { id: 'students', icon: Users, label: 'Students' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent">
              Institution Dashboard
            </h1>
            <p className="text-slate-600 mt-1">Manage your institution and issue certificates</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <Download className="w-5 h-5 inline mr-2" />
            Export Report
          </button>
        </div>

        {/* Institution Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Award className="w-14 h-14 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">{institutionProfile.name}</h2>
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    ID: {institutionProfile.id}
                  </span>
                  <span>Est. {institutionProfile.established}</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                    {institutionProfile.accreditation}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setWalletConnected(!walletConnected)}
              className={`px-6 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 ${
                walletConnected
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
              }`}
            >
              <Wallet className="w-5 h-5 inline mr-2" />
              {walletConnected ? 'Wallet Connected' : 'Connect Wallet'}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-slate-800">{institutionProfile.totalStudents}</p>
              <p className="text-sm text-slate-600">Total Students</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
              <FileText className="w-8 h-8 text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-slate-800">{institutionProfile.activeCourses}</p>
              <p className="text-sm text-slate-600">Active Courses</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
              <Award className="w-8 h-8 text-green-600 mb-2" />
              <p className="text-2xl font-bold text-slate-800">{institutionProfile.certificatesIssued}</p>
              <p className="text-sm text-slate-600">Certificates Issued</p>
            </div>
          </div>
        </div>

        {/* Certificate Issuance Section */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <Award className="w-6 h-6 mr-2 text-indigo-600" />
              Issue Certificate
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Learner ID</label>
                <input
                  type="text"
                  value={learnerID}
                  onChange={(e) => setLearnerID(e.target.value)}
                  placeholder="Enter Learner ID (e.g., LRN2024001)"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Course Name</label>
                <select className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300">
                  <option>Web Development</option>
                  <option>Data Science</option>
                  <option>UI/UX Design</option>
                  <option>Cloud Computing</option>
                </select>
              </div>
              <button
                onClick={handleIssueCertificate}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Issue Certificate
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
              Analytics Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Monthly Enrollments</span>
                <span className="text-xl font-bold text-blue-600">{analytics.monthlyEnrollments}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Completion Rate</span>
                <span className="text-xl font-bold text-green-600">{analytics.completionRate}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Average Rating</span>
                <span className="text-xl font-bold text-orange-600">{analytics.avgRating}/5.0</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Active Instructors</span>
                <span className="text-xl font-bold text-purple-600">{analytics.activeInstructors}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 mb-8 hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-indigo-600" />
            Transaction History & Blockchain Logs
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-blue-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Transaction ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Learner</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Course</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Hash</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, idx) => (
                  <tr key={txn.id} className="border-t border-slate-200 hover:bg-blue-50 transition-colors duration-200">
                    <td className="px-4 py-4 text-sm font-medium text-slate-800">{txn.id}</td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{txn.learnerName}</p>
                        <p className="text-xs text-slate-500">{txn.learnerId}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{txn.course}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">{txn.type}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{txn.date}</td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        txn.status === 'Verified' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {txn.status === 'Verified' ? <CheckCircle className="w-3 h-3 inline mr-1" /> : <Clock className="w-3 h-3 inline mr-1" />}
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded text-indigo-600 font-mono">{txn.hash}</code>
                    </td>
                    <td className="px-4 py-4">
                      <button 
                        onClick={() => setSelectedTransaction(txn)}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification Logs */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-purple-600" />
            Verification Activity Logs
          </h3>
          <div className="space-y-3">
            {verificationLogs.map((log, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-lg border border-slate-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{log.action}</p>
                    <p className="text-xs text-slate-600">by {log.entity} • Learner: {log.learnerId}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-500 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Success Notification */}
        {showCertificate && (
          <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-bounce">
            <CheckCircle className="w-6 h-6" />
            <span className="font-semibold">Certificate issued successfully!</span>
          </div>
        )}

        {/* Transaction Detail Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800">Transaction Details</h3>
                <button onClick={() => setSelectedTransaction(null)} className="text-slate-400 hover:text-slate-600">
                  <AlertCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Transaction ID</p>
                    <p className="font-semibold text-slate-800">{selectedTransaction.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Learner Name</p>
                    <p className="font-semibold text-slate-800">{selectedTransaction.learnerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Course</p>
                    <p className="font-semibold text-slate-800">{selectedTransaction.course}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Status</p>
                    <p className="font-semibold text-green-600">{selectedTransaction.status}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600 mb-2">Blockchain Hash</p>
                  <code className="text-sm bg-white px-3 py-2 rounded border border-slate-200 block font-mono text-indigo-600">
                    {selectedTransaction.hash}
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
