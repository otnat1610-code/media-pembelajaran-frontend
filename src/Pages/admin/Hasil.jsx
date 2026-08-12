import { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";

import {
  FileSpreadsheet,
  FileText,
  Search,
  Filter,
} from "lucide-react";

import { toast } from "sonner";

import PageHeader from "../../Components/admin/PageHeader.jsx";
import Button from "../../Components/admin/Button.jsx";

export default function Hasil() {

  // =========================
  // STATE
  // =========================
  const [hasil, setHasil] = useState([]);

  // Pencarian nama siswa
  const [q, setQ] = useState("");

  // Filter status KKM
  const [statusFilter, setStatusFilter] = useState("semua");

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    fetchHasil();
  }, []);

  async function fetchHasil() {
    try {
      const response = await axiosInstance.get("/hasil");

      setHasil(response.data);

    } catch (error) {
      console.error(error);

      toast.error("Gagal mengambil data hasil");
    }
  }

  // =========================
  // FILTER DATA
  // =========================
  const data = hasil.filter((h) => {

    // =========================
    // FILTER NAMA
    // =========================
    const cocokNama = (h.siswa || "")
      .toLowerCase()
      .includes(q.toLowerCase());

    // =========================
    // FILTER STATUS KKM
    // =========================
    const status = (h.status || "")
      .toLowerCase()
      .trim();

    const cocokStatus =
      statusFilter === "semua" ||
      status === statusFilter;

    return cocokNama && cocokStatus;
  });

  // =========================
  // EXPORT
  // =========================
  const exp = async (type) => {

    try {

      const endpoint =
        type === "Excel"
          ? "/hasil/export/excel"
          : "/hasil/export/pdf";

      const response = await axiosInstance.get(endpoint, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);

      const link = document.createElement("a");

      link.href = window.URL.createObjectURL(blob);

      link.download =
        type === "Excel"
          ? "hasil_penilaian.xlsx"
          : "hasil_penilaian.pdf";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      toast.success(`Export ${type} berhasil`);

    } catch (error) {

      console.error(error);

      toast.error(`Export ${type} gagal`);
    }
  };

  return (
    <div>

      {/* =========================
          HEADER
      ========================= */}
      <PageHeader
        title="Hasil Penilaian"
        description="Pantau nilai kuis siswa dan ekspor laporan."
        actions={
          <>
            {/* EXPORT EXCEL */}
            <Button
              variant="outline"
              onClick={() => exp("Excel")}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </Button>

            {/* EXPORT PDF */}
            <Button
              variant="outline"
              onClick={() => exp("PDF")}
            >
              <FileText className="h-4 w-4" />
              PDF
            </Button>
          </>
        }
      />

      {/* =========================
          CARD
      ========================= */}
      <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden">

        {/* =========================
            FILTER
        ========================= */}
        <div className="p-4 border-b border-slate-100">

          <div className="flex flex-col sm:flex-row gap-3">

            {/* =========================
                SEARCH NAMA
            ========================= */}
            <div className="relative max-w-sm flex-1">

              <Search
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  h-4
                  w-4
                  text-slate-400
                "
              />

              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari nama siswa..."
                className="
                  w-full
                  pl-9
                  pr-3
                  h-10
                  bg-slate-100
                  rounded-lg
                  text-sm
                  outline-none
                  focus:ring-2
                  focus:ring-brand-500
                "
              />

            </div>

            {/* =========================
                FILTER KKM
            ========================= */}
            <div className="relative">

              <Filter
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  h-4
                  w-4
                  text-slate-400
                  pointer-events-none
                "
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="
                  h-10
                  pl-9
                  pr-8
                  bg-slate-100
                  rounded-lg
                  text-sm
                  outline-none
                  cursor-pointer
                  focus:ring-2
                  focus:ring-brand-500
                "
              >

                <option value="semua">
                  Semua Status
                </option>

                <option value="memenuhi kkm">
                  Memenuhi KKM
                </option>

                <option value="tidak memenuhi kkm">
                  Tidak Memenuhi KKM
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* =========================
            TABLE
        ========================= */}
        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            {/* =========================
                TABLE HEADER
            ========================= */}
            <thead className="bg-slate-50 text-slate-600">

              <tr>

                {[
                  "Siswa",
                  "Kuis",
                  "Nilai",
                  "Tanggal",
                  "Status",
                ].map((h) => (

                  <th
                    key={h}
                    className="text-left font-semibold px-5 py-3"
                  >
                    {h}
                  </th>

                ))}

              </tr>

            </thead>

            {/* =========================
                TABLE BODY
            ========================= */}
            <tbody>

              {data.length > 0 ? (

                data.map((h) => {

                  const status = (h.status || "")
                    .toLowerCase()
                    .trim();

                  const memenuhiKKM =
                    status === "memenuhi kkm";

                  return (

                    <tr
                      key={h.id}
                      className="border-t border-slate-100"
                    >

                      {/* SISWA */}
                      <td className="px-5 py-3 font-medium">
                        {h.siswa}
                      </td>

                      {/* KUIS */}
                      <td className="px-5 py-3">
                        {h.kuis}
                      </td>

                      {/* NILAI */}
                      <td className="px-5 py-3">
                        <span className="font-bold">
                          {h.nilai}
                        </span>
                      </td>

                      {/* TANGGAL */}
                      <td className="px-5 py-3 text-slate-500">
                        {h.tanggal}
                      </td>

                      {/* STATUS KKM */}
                      <td className="px-5 py-3">

                        <span
                          className={`
                            text-[10px]
                            uppercase
                            font-bold
                            px-2
                            py-0.5
                            rounded

                            ${
                              memenuhiKKM
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }
                          `}
                        >
                          {memenuhiKKM
                            ? "Memenuhi KKM"
                            : "Tidak Memenuhi KKM"}
                        </span>

                      </td>

                    </tr>

                  );
                })

              ) : (

                /* =========================
                   DATA KOSONG
                ========================= */
                <tr>

                  <td
                    colSpan="5"
                    className="
                      px-5
                      py-10
                      text-center
                      text-slate-400
                    "
                  >
                    Tidak ada data yang sesuai
                    dengan filter.

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}
