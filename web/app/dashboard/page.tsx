import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list" })
      });
      const json = await res.json();
      setRows(json.rows || []);
    })();
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard — Recent Study Packs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rows.map((r: any) => (
          <Link key={r._id} href={`/video/${r._id}`}>
            <a className="block border rounded p-4 hover:shadow">
              <div className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleString()}</div>
              <div className="font-medium mt-2">{r.url || "Uploaded video"}</div>
              <div className="text-sm mt-2 line-clamp-3">{(r.notes || "").slice(0, 180)}...</div>
            </a>
          </Link>
        ))}
      </div>
    </main>
  );
}
