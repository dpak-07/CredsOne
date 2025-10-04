// Add inside src/services/api.js
export async function verifyFileHash(hashOrId) {
  const res = await api.get(`/verify/${encodeURIComponent(hashOrId)}`);
  return res.data;
}

export async function manualVerify(file, notes) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("notes", notes);

  const res = await api.post("/manual/verify", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
// add in src/services/api.js

export async function issueCredential(file, fields) {
  const formData = new FormData();
  formData.append("file", file);
  Object.keys(fields).forEach((k) => formData.append(k, fields[k]));

  const res = await api.post("/manual/issue", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data; // expect { txId, vcId, signedVC }
}
