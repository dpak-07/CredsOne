import React, { useState, useRef } from 'react';
import { Home, Award, Wallet, Upload, Share2, QrCode, Check, X, FileText, File, Download, Bell, Settings, LogOut, TrendingUp, Calendar, Eye } from 'lucide-react';

export default function LearnerDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showQR, setShowQR] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const fileInputRef = useRef(null);

  const learnerData = {
    name: "Sarah Mitchell",
    email: "sarah.mitchell@example.com",
    id: "LRN-2024-001",
    joinDate: "January 2024",
    avatar: "SM",
    totalCredits: 450,
    verifiedCerts: 12,
    pendingCerts: 3
  };

  const certificates = [
    { id: 1, name: "Web Development Bootcamp", issuer: "Tech Academy", date: "2024-03-15", status: "verified", credits: 50, validity: "2027-03-15" },
    { id: 2, name: "Data Science Fundamentals", issuer: "Data Institute", date: "2024-02-20", status: "verified", credits: 45, validity: "2027-02-20" },
    { id: 3, name: "UI/UX Design Professional", issuer: "Design School", date: "2024-01-10", status: "verified", credits: 40, validity: "2027-01-10" },
    { id: 4, name: "Cloud Computing Basics", issuer: "Cloud Academy", date: "2024-04-05", status: "pending", credits: 35, validity: "2027-04-05" }
  ];

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.type,
      uploadDate: new Date().toLocaleDateString()
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
    setShowUpload(false);
  };

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return <FileText className="w-6 h-6 text-red-500" />;
    if (type.includes('image')) return <File className="w-6 h-6 text-blue-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const generateQRCode = (cert) => {
    setSelectedCert(cert);
    setShowQR(true);
  };

  const shareCertificate = (cert) => {
    setSelectedCert(cert);
    setShowShareModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-lg bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">CredsOne</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {learnerData.avatar}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-900">{learnerData.name}</p>
                  <p className="text-xs text-gray-500">{learnerData.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] p-6">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'profile' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'analytics' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'wallet' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Wallet className="w-5 h-5" />
              <span className="font-medium">Wallet</span>
            </button>
          </nav>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all mt-8">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </aside>

        <main className="flex-1 p-8">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <button
                  onClick={() => setShowUpload(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Certificate</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {learnerData.avatar}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">{learnerData.name}</h2>
                    <p className="text-gray-500 mt-1">{learnerData.email}</p>
                    <div className="flex items-center space-x-4 mt-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {learnerData.joinDate}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="font-mono bg-gray-100 px-3 py-1 rounded-lg">{learnerData.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <div className="text-center bg-blue-50 px-6 py-4 rounded-xl">
                      <p className="text-3xl font-bold text-blue-600">{learnerData.totalCredits}</p>
                      <p className="text-sm text-gray-600 mt-1">Total Credits</p>
                    </div>
                    <div className="text-center bg-green-50 px-6 py-4 rounded-xl">
                      <p className="text-3xl font-bold text-green-600">{learnerData.verifiedCerts}</p>
                      <p className="text-sm text-gray-600 mt-1">Verified</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">My Certificates</h3>
                <div className="space-y-4">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <Award className={`w-6 h-6 ${cert.status === 'verified' ? 'text-green-500' : 'text-yellow-500'}`  } />
                            <div>
                              <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                              <p className="text-sm text-gray-500">{cert.issuer} • {cert.date}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            cert.status === 'verified' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {cert.status === 'verified' ? (
                              <span className="flex items-center space-x-1">
                                <Check className="w-4 h-4" />
                                <span>Verified</span>
                              </span>
                            ) : (
                              <span>Pending</span>
                            )}
                          </span>
                          <button
                            onClick={() => generateQRCode(cert)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Generate QR Code"
                          >
                            <QrCode className="w-5 h-5 text-gray-600" />
                          </button>
                          <button
                            onClick={() => shareCertificate(cert)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Share Certificate"
                          >
                            <Share2 className="w-5 h-5 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View Certificate">
                            <Eye className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Credits</p>
                      <p className="text-4xl font-bold mt-2">{learnerData.totalCredits}</p>
                    </div>
                    <Award className="w-12 h-12 text-blue-200" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Verified</p>
                      <p className="text-4xl font-bold mt-2">{learnerData.verifiedCerts}</p>
                    </div>
                    <Check className="w-12 h-12 text-green-200" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm">Pending</p>
                      <p className="text-4xl font-bold mt-2">{learnerData.pendingCerts}</p>
                    </div>
                    <FileText className="w-12 h-12 text-yellow-200" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Completion</p>
                      <p className="text-4xl font-bold mt-2">85%</p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-purple-200" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Credits by Category</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Web Development', credits: 150, percent: 100 },
                      { name: 'Data Science', credits: 120, percent: 80 },
                      { name: 'Design', credits: 100, percent: 67 },
                      { name: 'Cloud Computing', credits: 80, percent: 53 }
                    ].map((cat, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                          <span className="text-sm font-bold text-gray-900">{cat.credits}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${cat.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {[
                      { action: 'Certificate Verified', cert: 'Web Development Bootcamp', time: '2 hours ago' },
                      { action: 'Certificate Uploaded', cert: 'Cloud Computing Basics', time: '1 day ago' },
                      { action: 'Certificate Shared', cert: 'Data Science Fundamentals', time: '3 days ago' }
                    ].map((activity, idx) => (
                      <div key={idx} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Check className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-500">{activity.cert}</p>
                        </div>
                        <span className="text-xs text-gray-400">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">Credential Wallet</h1>

              <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-blue-100 text-sm mb-2">Total Credits</p>
                    <p className="text-5xl font-bold">{learnerData.totalCredits}</p>
                    <p className="text-blue-100 mt-4">Verified Credentials: {learnerData.verifiedCerts}</p>
                  </div>
                  <Wallet className="w-16 h-16 text-blue-200" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Verified Certificates</h3>
                <div className="space-y-4">
                  {certificates.filter(c => c.status === 'verified').map((cert) => (
                    <div key={cert.id} className="border-l-4 border-green-500 bg-green-50 rounded-lg p-6 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <Award className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{cert.name}</h4>
                              <p className="text-sm text-gray-600">{cert.issuer}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                              <p className="text-xs text-gray-500">Issue Date</p>
                              <p className="font-semibold text-gray-900">{cert.date}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Valid Until</p>
                              <p className="font-semibold text-gray-900">{cert.validity}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Credits</p>
                              <p className="font-semibold text-green-600">{cert.credits}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => generateQRCode(cert)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                          >
                            <QrCode className="w-4 h-4" />
                            <span className="text-sm">QR Code</span>
                          </button>
                          <button
                            onClick={() => shareCertificate(cert)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                          >
                            <Share2 className="w-4 h-4" />
                            <span className="text-sm">Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Uploaded Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                        <div className="flex items-center space-x-4">
                          {getFileIcon(file.type)}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-sm text-gray-500">{file.size} • {file.uploadDate}</p>
                          </div>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Download className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Upload Certificate</h3>
              <button onClick={() => setShowUpload(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
            >
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-700 font-medium mb-2">Click to upload certificate</p>
              <p className="text-sm text-gray-500">Supports PDF, Images, Word, PPT, and more</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
      )}

      {showQR && selectedCert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Credential QR Code</h3>
              <button onClick={() => setShowQR(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
              <div className="w-64 h-64 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <QrCode className="w-48 h-48 text-gray-800 mx-auto" />
                </div>
              </div>
              <p className="font-semibold text-gray-900 mb-2">{selectedCert.name}</p>
              <p className="text-sm text-gray-600">{selectedCert.issuer}</p>
              <p className="text-xs text-gray-500 mt-2">Scan to verify credential</p>
            </div>
            <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Download QR Code</span>
            </button>
          </div>
        </div>
      )}

      {showShareModal && selectedCert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Share Certificate</h3>
              <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-semibold text-gray-900 mb-1">{selectedCert.name}</p>
                <p className="text-sm text-gray-600">{selectedCert.issuer} • {selectedCert.date}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Share Link</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://credsone.com/verify/${selectedCert.id}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Copy
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                  LinkedIn
                </button>
                <button className="px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium">
                  Twitter
                </button>
                <button className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
                  Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
