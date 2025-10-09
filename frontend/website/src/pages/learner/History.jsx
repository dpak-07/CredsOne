export default function History() {
  const historyData = [
    { id: 1, action: "Issued Certificate A", date: "2024-05-10" },
    { id: 2, action: "Verified Certificate B", date: "2024-06-15" },
    { id: 3, action: "Revoked Certificate C", date: "2024-07-20" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">History</h2>
      <div className="space-y-3">
        {historyData.map((item) => (
          <div key={item.id} className="p-3 border rounded-lg bg-gray-50">
            <p className="font-medium">{item.action}</p>
            <p className="text-sm text-gray-500">{item.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}