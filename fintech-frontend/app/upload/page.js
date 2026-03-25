"use client";
import { useState } from "react";
import { uploadCSV, uploadImage } from "@/lib/api";

export default function UploadPage() {
  const [csvFile, setCsvFile] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [csvMsg, setCsvMsg] = useState("");
  const [imgMsg, setImgMsg] = useState("");
  const [csvLoading, setCsvLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  const handleCSV = async () => {
    if (!csvFile) return;
    setCsvLoading(true); setCsvMsg("");
    try {
      const res = await uploadCSV(csvFile);
      setCsvMsg(`✅ ${res.data.message}`);
    } catch (e) {
      setCsvMsg(`❌ ${e?.response?.data?.detail || "Upload failed"}`);
    } finally { setCsvLoading(false); }
  };

  const handleImage = async () => {
    if (!imgFile) return;
    setImgLoading(true); setImgMsg("");
    try {
      const res = await uploadImage(imgFile);
      setImgMsg(`✅ OCR done! Amount: ₹${res.data.extracted?.amount}, Category: ${res.data.extracted?.category}`);
    } catch (e) {
      setImgMsg(`❌ ${e?.response?.data?.detail || "Upload failed"}`);
    } finally { setImgLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Upload Financial Data</h1>
      <p className="text-gray-400 mb-8">Import bank statements via CSV or scan receipts with OCR.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CSV Upload */}
        <div className="glass p-6">
          <div className="text-3xl mb-3">📄</div>
          <h2 className="text-white font-bold text-lg mb-1">Bank Statement (CSV)</h2>
          <p className="text-gray-500 text-sm mb-4">Columns required: <code className="text-indigo-400">amount, date, type, category</code></p>

          <label className="block cursor-pointer">
            <div className={`border-2 border-dashed border-white/10 hover:border-indigo-500/50 rounded-xl p-6 text-center transition ${csvFile ? "border-indigo-500/50" : ""}`}>
              <p className="text-gray-400 text-sm">{csvFile ? csvFile.name : "Click or drop CSV file"}</p>
            </div>
            <input type="file" accept=".csv" className="hidden"
              onChange={(e) => { setCsvFile(e.target.files[0]); setCsvMsg(""); }} />
          </label>

          <button onClick={handleCSV} disabled={!csvFile || csvLoading} className="btn-primary w-full mt-4">
            {csvLoading ? "Uploading..." : "Upload CSV"}
          </button>
          {csvMsg && <p className={`mt-3 text-sm ${csvMsg.startsWith("✅") ? "text-green-400" : "text-red-400"}`}>{csvMsg}</p>}
        </div>

        {/* Image Upload */}
        <div className="glass p-6">
          <div className="text-3xl mb-3">🧾</div>
          <h2 className="text-white font-bold text-lg mb-1">Receipt / Invoice (OCR)</h2>
          <p className="text-gray-500 text-sm mb-4">Upload a photo — we extract amount, date & category automatically.</p>

          <label className="block cursor-pointer">
            <div className={`border-2 border-dashed border-white/10 hover:border-purple-500/50 rounded-xl p-6 text-center transition ${imgFile ? "border-purple-500/50" : ""}`}>
              <p className="text-gray-400 text-sm">{imgFile ? imgFile.name : "Click or drop image (JPG/PNG)"}</p>
            </div>
            <input type="file" accept=".jpg,.jpeg,.png,.bmp,.tiff" className="hidden"
              onChange={(e) => { setImgFile(e.target.files[0]); setImgMsg(""); }} />
          </label>

          <button onClick={handleImage} disabled={!imgFile || imgLoading} className="btn-primary w-full mt-4" style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
            {imgLoading ? "Processing OCR..." : "Scan Receipt"}
          </button>
          {imgMsg && <p className={`mt-3 text-sm ${imgMsg.startsWith("✅") ? "text-green-400" : "text-red-400"}`}>{imgMsg}</p>}
        </div>
      </div>

      {/* CSV format hint */}
      <div className="glass p-5 mt-6">
        <h3 className="text-white font-semibold mb-2 text-sm">📋 Sample CSV Format</h3>
        <pre className="text-xs text-gray-400 overflow-x-auto">{`amount,type,category,date,description
30000,expense,salary,2026-04-01,Staff salaries
200000,income,client,2026-04-05,Client A milestone
15000,expense,rent,2026-04-05,Office rent`}</pre>
      </div>
    </div>
  );
}
