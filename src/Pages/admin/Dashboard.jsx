import { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";

import StatCard from "../../Components/admin/StatCard.jsx";
import PageHeader from "../../Components/admin/PageHeader.jsx";

import {
  Video,
  ClipboardList,
  Users,
  GraduationCap,
  Activity,
  BookOpen,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_video: 0,
    video_aktif: 0,
    total_kuis: 0,
    total_siswa: 0,
    total_hasil: 0,
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const namaGuru = user?.nama || "Guru";

  useEffect(() => {
    fetchStatistik();
  }, []);

  const fetchStatistik = async () => {
    try {
      const response = await axiosInstance.get(
        "/dashboard/statistik"
      );

      setStats(response.data);
    } catch (error) {
      console.error("Gagal mengambil statistik:", error);
    }
  };

  // Membuka file petunjuk
  const bukaPetunjuk = () => {
    window.open("/petunjuk.pdf", "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      {/* =========================
          HEADER DASHBOARD
      ========================== */}
      <div className="flex items-start justify-between gap-6 mb-8">
        {/* BAGIAN KIRI */}
        <div className="flex-1">
          <PageHeader
            title="Dashboard"
            description={`Selamat datang kembali, ${namaGuru}. Berikut ringkasan aktivitas hari ini.`}
          />
        </div>

        {/* =========================
            TOMBOL PETUNJUK
        ========================== */}
        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={bukaPetunjuk}
            className="
              flex
              items-center
              gap-2
              px-5
              py-3
              mt-2
              rounded-xl
              bg-white
              border
              border-gray-200
              text-gray-700
              font-medium
              shadow-sm
              hover:bg-gray-50
              hover:text-blue-600
              hover:border-blue-200
              hover:shadow-md
              active:scale-95
              transition-all
              duration-200
              whitespace-nowrap
            "
            title="Buka Petunjuk Penggunaan"
          >
            <BookOpen size={20} strokeWidth={2} />

            <span>
              Petunjuk
            </span>
          </button>
        </div>
      </div>

      {/* =========================
          STATISTIK DASHBOARD
      ========================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">

        {/* TOTAL VIDEO */}
        <StatCard
          title="Total Video"
          value={stats.total_video}
          icon={Video}
          gradient="bg-gradient-primary"
        />

        {/* VIDEO AKTIF */}
        <StatCard
          title="Video Aktif"
          value={stats.video_aktif}
          icon={Activity}
          gradient="bg-gradient-success"
        />

        {/* TOTAL KUIS */}
        <StatCard
          title="Total Kuis"
          value={stats.total_kuis}
          icon={ClipboardList}
          gradient="bg-gradient-warning"
        />

        {/* TOTAL SISWA */}
        <StatCard
          title="Total Siswa"
          value={stats.total_siswa}
          icon={Users}
          gradient="bg-gradient-info"
        />

        {/* HASIL PENILAIAN */}
        <StatCard
          title="Hasil Penilaian"
          value={stats.total_hasil}
          icon={GraduationCap}
          gradient="bg-gradient-danger"
        />

      </div>
    </div>
  );
}
