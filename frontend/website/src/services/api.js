// This is a mock/stub version for development without a backend

export async function login(credentials) {
  // Simulate a successful login response
  return {
    user: { name: "Test User", role: "Learner", did: "did:test:1234" },
    token: "mock-token-123"
  };
}

// Add other mock functions as needed
export async function getVC(vcId) {
  return {
    vc: {
      id: vcId,
      credentialSubject: { title: "Sample Credential" },
      issuer: { name: "Test Issuer" },
      issuanceDate: new Date().toISOString(),
      evidence: { mock: true }
    }
  };
}

export async function downloadVC(vcId) {
  // Simulate download: just show a message
  return { url: "https://example.com/mock.pdf" };
}

export async function exportToDigilocker(vcId) {
  return { message: "Exported to Digilocker (mock)", status: "success" };
}

export async function verifyFileHash(hashOrId) {
  return { valid: true, hash: hashOrId };
}

export async function manualVerify(file, notes) {
  return { status: "verified", notes };
}

export async function issueCredential(file, fields) {
  return { txId: "mockTxId", vcId: "mockVcId", signedVC: { ...fields } };
}

export async function getWallet(learnerDid) {
  return { vcs: [{ id: "vc1" }, { id: "vc2" }] };
}

export async function getAuditLogs(filters = {}) {
  return [{ id: 1, action: "login" }];
}

export async function searchVerifications(query) {
  return [{ id: 1, query }];
}

const api = {}; // Empty for now
export default api;