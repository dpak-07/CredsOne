export default function Wallet() {
  const certificates = [
    { id: 1, name: "Certificate A", validTill: "2026-01-01" },
    { id: 2, name: "Certificate B", validTill: "2025-08-15" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Wallet</h2>
      <div className="space-y-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="flex justify-between items-center border p-4 rounded-lg"
          >
            <span className="font-medium">{cert.name}</span>
            <span className="text-gray-500 text-sm">
              Valid till: {cert.validTill}
            </span>
            <button className="bg-green-600 text-white px-3 py-1 rounded">
              Verify
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}