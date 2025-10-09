import React, { useState } from 'react';
import { Building2, Wallet, Search, TrendingUp, Users, Award, CheckCircle, FileText, User, Star, Briefcase, UserCheck, Shield, Download, Eye, Filter } from 'lucide-react';

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [walletConnected, setWalletConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const employerProfile = {
    name: "TechCorp Solutions",
    id: "EMP-2024-001",
    industry: "Information Technology",
    established: "2015",
    employees: "500-1000",
    location: "San Francisco, CA",
    website: "www.techcorp.com"
  };

  const analytics = {
    totalVerified: 342,
    creditsTransferred: 1250,
    recruiterLinks: 87,
    potentialIssuances: 156,
    savedCandidates: 64,
    activeRecruiters: 12
  };

  const certificateTypes = {
    diploma: { count: 145, color: 'from-blue-500 to-blue-600' },
    sacred: { count: 89, color: 'from-purple-500 to-purple-600' },
    institution: { count: 78, color: 'from-green-500 to-green-600' },
    professional: { count: 30, color: 'from-orange-500 to-orange-600' }
  };

  const verificationHistory = [
    { id: 'VER001', learnerName: 'John Smith', learnerId: 'LRN2024001', certType: 'Diploma', course: 'Web Development', date: '2024-03-15', status: 'Verified', score: '4.8/5', hash: '0x7a9b...3c2d' },
    { id: 'VER002', learnerName: 'Sarah Johnson', learnerId: 'LRN2024002', certType: 'Sacred', course: 'Data Science', date: '2024-03-14', status: 'Verified', score: '4.9/5', hash: '0x8f3a...4b1e' },
    { id: 'VER003', learnerName: 'Mike Chen', learnerId: 'LRN2024003', certType: 'Institution', course: 'UI/UX Design', date: '2024-03-13', status: 'Pending Review', score: '4.6/5', hash: '0x2d4f...9a7c' },
    { id: 'VER004', learnerName: 'Emma Wilson', learnerId: 'LRN2024004', certType: 'Professional', course: 'Cloud Computing', date: '2024-03-12', status: 'Verified', score: '4.7/5', hash: '0x5e8b...1f3d' },
  ];

  const savedCandidates = [
    { id: 'LRN2024005', name: 'Alex Turner', skills: ['React', 'Node.js', 'AWS'], certificates: 5, score: '4.8/5' },
    { id: 'LRN2024006', name: 'Jessica Lee', skills: ['Python', 'ML', 'TensorFlow'], certificates: 7, score: '4.9/5' },
    { id: 'LRN2024007', name: 'David Park', skills: ['Java', 'Spring', 'Docker'], certificates: 6, score: '4.7/5' },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowSearchResults(true);
    }
  };

  const handleVerifyCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setTimeout(() => setSelectedCandidate(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl z-50">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Employer</h2>
              <p className="text-slate-400 text-xs">Portal</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {[
            { id: 'overview', icon: TrendingUp, label: 'Overview' },
            { id: 'search', icon: Search, label: 'Search Learners' },
            { id: 'analytics', icon: Award, label: 'Analytics' },
            { id: 'verifications', icon: CheckCircle, label: 'Verifications' },
            { id: 'candidates', icon: Users, label: 'Saved Candidates' },
            { id: 'certificates', icon: FileText, label: 'Certificates' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg transform scale-105' 
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-cyan-600 bg-clip-text text-transparent">
              Employer Dashboard
            </h1>
            <p className="text-slate-600 mt-1">Verify credentials and manage talent recruitment</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <Download className="w-5 h-5 inline mr-2" />
            Export Report
          </button>
        </div>

        {/* Employer Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="w-14 h-14 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">{employerProfile.name}</h2>
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    ID: {employerProfile.id}
                  </span>
                  <span>• {employerProfile.industry}</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                    {employerProfile.employees} Employees
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-slate-500 mt-2">
                  <span>📍 {employerProfile.location}</span>
                  <span>🌐 {employerProfile.website}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setWalletConnected(!walletConnected)}
              className={`px-6 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 ${
                walletConnected
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
              }`}
            >
              <Wallet className="w-5 h-5 inline mr-2" />
              {walletConnected ? 'Wallet Connected' : 'Connect Wallet'}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-6 mt-8">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-xl border border-cyan-200 hover:shadow-lg transition-shadow duration-300">
              <CheckCircle className="w-8 h-8 text-cyan-600 mb-2" />
              <p className="text-2xl font-bold text-slate-800">{analytics.totalVerified}</p>
              <p className="text-sm text-slate-600">Total Verified</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200 hover:shadow-lg transition-shadow duration-300">
              <Award className="w-8 h-8 text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-slate-800">{analytics.creditsTransferred}</p>
              <p className="text-sm text-slate-600">Credits Transferred</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 hover:shadow-lg transition-shadow duration-300">
              <UserCheck className="w-8 h-8 text-green-600 mb-2" />
              <p className="text-2xl font-bold text-slate-800">{analytics.recruiterLinks}</p>
              <p className="text-sm text-slate-600">Recruiter Links</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-xl border border-orange-200 hover:shadow-lg transition-shadow duration-300">
              <Users className="w-8 h-8 text-orange-600 mb-2" />
              <p className="text-2xl font-bold text-slate-800">{analytics.savedCandidates}</p>
              <p className="text-sm text-slate-600">Saved Candidates</p>
            </div>
          </div>
        </div>

        {/* Search Learner Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <Search className="w-6 h-6 mr-2 text-cyan-600" />
            Search & Verify Learner
          </h3>
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Learner ID (e.g., LRN2024001)"
                className="w-full px-6 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 pl-12"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
            </div>
            <button
              onClick={handleSearch}
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Search
            </button>
          </div>

          {showSearchResults && (
            <div className="mt-6 p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 animate-fadeIn">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">John Smith</h4>
                    <p className="text-sm text-slate-600">ID: {searchQuery || 'LRN2024001'}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">5 Certificates</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Score: 4.8/5</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-200">
                    <Eye className="w-5 h-5 text-slate-600" />
                  </button>
                  <button
                    onClick={() => handleVerifyCandidate({ name: 'John Smith' })}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Verify Credentials
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-cyan-600" />
              Employer Analytics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-cyan-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Total Verifications</p>
                    <p className="text-xs text-slate-500">This month</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-cyan-600">{analytics.totalVerified}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center space-x-3">
                  <Award className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Credits Transferred</p>
                    <p className="text-xs text-slate-500">Total credits</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-purple-600">{analytics.creditsTransferred}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center space-x-3">
                  <UserCheck className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Potential Issuances</p>
                    <p className="text-xs text-slate-500">Pending review</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600">{analytics.potentialIssuances}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Active Recruiters</p>
                    <p className="text-xs text-slate-500">Team members</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-orange-600">{analytics.activeRecruiters}</span>
              </div>
            </div>
          </div>

          {/* Certificate Types */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-blue-600" />
              Certificate Types Verified
            </h3>
            <div className="space-y-4">
              {Object.entries(certificateTypes).map(([type, data]) => (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-700 capitalize">{type} Certificate</span>
                    <span className="text-lg font-bold text-slate-800">{data.count}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${data.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${(data.count / 342) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-700">Total Verified</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  {Object.values(certificateTypes).reduce((sum, cert) => sum + cert.count, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification History */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-cyan-600" />
              Verification Transaction History
            </h3>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors duration-200 flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-cyan-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Verification ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Learner</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Certificate Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Course</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Score</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Hash</th>
                </tr>
              </thead>
              <tbody>
                {verificationHistory.map((record) => (
                  <tr key={record.id} className="border-t border-slate-200 hover:bg-cyan-50 transition-colors duration-200">
                    <td className="px-4 py-4 text-sm font-medium text-slate-800">{record.id}</td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{record.learnerName}</p>
                        <p className="text-xs text-slate-500">{record.learnerId}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {record.certType}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{record.course}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-slate-800">{record.score}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">{record.date}</td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        record.status === 'Verified' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {record.status === 'Verified' ? <CheckCircle className="w-3 h-3 inline mr-1" /> : null}
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded text-cyan-600 font-mono">{record.hash}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Saved Candidates */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-600" />
            Saved Candidates
          </h3>
          <div className="grid grid-cols-3 gap-6">
            {savedCandidates.map((candidate) => (
              <div key={candidate.id} className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{candidate.name}</h4>
                    <p className="text-xs text-slate-600">{candidate.id}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-white text-cyan-700 rounded-md text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-slate-600">{candidate.certificates} Certs</span>
                    <span className="flex items-center text-xs">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
                      {candidate.score}
                    </span>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg text-xs font-semibold hover:shadow-lg transition-all duration-300">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Notification */}
        {selectedCandidate && (
          <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-bounce z-50">
            <CheckCircle className="w-6 h-6" />
            <span className="font-semibold">Credentials verified for {selectedCandidate.name}!</span>
          </div>
        )}
      </div>
    </div>
  );
}
