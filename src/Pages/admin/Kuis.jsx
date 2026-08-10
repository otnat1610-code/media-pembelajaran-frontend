import { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import { toast } from "sonner";

import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  BookOpen,
  Eye,
  ImagePlus,
} from "lucide-react";

import PageHeader from "../../Components/admin/PageHeader.jsx";
import Button from "../../Components/admin/Button.jsx";
import PengaturanNilai from "./PengaturanNilai";

export default function Kuis() {
  // =====================================================
  // DATA
  // =====================================================

  const [dataKuis, setDataKuis] = useState([]);

  const [showTambahModal, setShowTambahModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showDetailModal, setShowDetailModal] =
    useState(false);

  const [showPengaturan, setShowPengaturan] =
    useState(false);

  const [detailKuis, setDetailKuis] =
    useState(null);

  // =====================================================
  // FORM TAMBAH
  // =====================================================

  const [form, setForm] = useState({
    judul: "",
    deskripsi: "",
    status: "aktif",
  });

  // =====================================================
  // FORM EDIT
  // =====================================================

  const [editForm, setEditForm] = useState({
    id_kuis: null,
    judul: "",
    deskripsi: "",
    status: "aktif",
  });

  // =====================================================
  // DEFAULT SOAL
  // =====================================================

  const createDefaultSoal = () => ({
    id_detail_kuis: null,

    pertanyaan: "",

    gambar_pertanyaan: null,

    pilihan: {
      A: "",
      B: "",
      C: "",
      D: "",
    },

    gambar_pilihan: {
      A: null,
      B: null,
      C: null,
      D: null,
    },

    jawaban: "A",

    hapus_gambar_pertanyaan: false,

    hapus_gambar_pilihan: {
      A: false,
      B: false,
      C: false,
      D: false,
    },
  });

  // =====================================================
  // SOAL TAMBAH
  // =====================================================

  const [soalList, setSoalList] = useState(
    Array.from(
      { length: 5 },
      () => createDefaultSoal()
    )
  );

  // =====================================================
  // SOAL EDIT
  // =====================================================

  const [editSoalList, setEditSoalList] =
    useState([]);

  // =====================================================
  // FETCH
  // =====================================================

  useEffect(() => {
    fetchKuis();
  }, []);

  const fetchKuis = async () => {
    try {
      const response =
        await axiosInstance.get(
          "/admin/kuis"
        );

      setDataKuis(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Gagal mengambil data kuis."
      );
    }
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleFormChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =====================================================
  // SOAL TAMBAH
  // =====================================================

  const handleSoalChange = (
    index,
    field,
    value
  ) => {
    setSoalList((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });
  };

  const handlePilihanChange = (
    index,
    option,
    value
  ) => {
    setSoalList((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],

        pilihan: {
          ...updated[index].pilihan,
          [option]: value,
        },
      };

      return updated;
    });
  };

  // =====================================================
  // VALIDASI FILE
  // =====================================================

  const validateImage = (file) => {
    if (!file) {
      return false;
    }

    if (!file.type.startsWith("image/")) {
      toast.error(
        "File harus berupa gambar."
      );

      return false;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Format gambar harus JPG, JPEG, PNG, atau WEBP."
      );

      return false;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      toast.error(
        "Ukuran gambar maksimal 5 MB."
      );

      return false;
    }

    return true;
  };

  // =====================================================
  // GAMBAR PERTANYAAN
  // =====================================================

  const handleGambarPertanyaanChange = (
    index,
    file
  ) => {
    if (!validateImage(file)) {
      return;
    }

    setSoalList((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],

        gambar_pertanyaan: file,

        hapus_gambar_pertanyaan:
          false,
      };

      return updated;
    });
  };

  // =====================================================
  // GAMBAR PILIHAN
  // =====================================================

  const handleGambarPilihanChange = (
    index,
    option,
    file
  ) => {
    if (!validateImage(file)) {
      return;
    }

    setSoalList((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],

        gambar_pilihan: {
          ...updated[index].gambar_pilihan,

          [option]: file,
        },

        hapus_gambar_pilihan: {
          ...updated[index]
            .hapus_gambar_pilihan,

          [option]: false,
        },
      };

      return updated;
    });
  };

  // =====================================================
  // HAPUS GAMBAR TAMBAH
  // =====================================================

  const hapusGambarPertanyaan = (
    index
  ) => {
    setSoalList((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],

        gambar_pertanyaan: null,
      };

      return updated;
    });
  };

  const hapusGambarPilihan = (
    index,
    option
  ) => {
    setSoalList((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],

        gambar_pilihan: {
          ...updated[index].gambar_pilihan,

          [option]: null,
        },
      };

      return updated;
    });
  };

  // =====================================================
  // EDIT SOAL
  // =====================================================

  const handleEditSoalChange = (
    index,
    field,
    value
  ) => {
    setEditSoalList((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });
  };

  const handleEditPilihanChange = (
    index,
    option,
    value
  ) => {
    setEditSoalList((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],

        pilihan: {
          ...updated[index].pilihan,

          [option]: value,
        },
      };

      return updated;
    });
  };

  // =====================================================
  // EDIT GAMBAR PERTANYAAN
  // =====================================================

  const handleEditGambarPertanyaanChange = (
    index,
    file
  ) => {
    if (!validateImage(file)) {
      return;
    }

    setEditSoalList((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],

        gambar_pertanyaan: file,

        hapus_gambar_pertanyaan:
          false,
      };

      return updated;
    });
  };

  // =====================================================
  // EDIT GAMBAR PILIHAN
  // =====================================================

  const handleEditGambarPilihanChange = (
    index,
    option,
    file
  ) => {
    if (!validateImage(file)) {
      return;
    }

    setEditSoalList((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],

        gambar_pilihan: {
          ...updated[index].gambar_pilihan,

          [option]: file,
        },

        hapus_gambar_pilihan: {
          ...updated[index]
            .hapus_gambar_pilihan,

          [option]: false,
        },
      };

      return updated;
    });
  };

  // =====================================================
  // HAPUS GAMBAR EDIT
  // =====================================================

  const hapusEditGambarPertanyaan = (
    index
  ) => {
    setEditSoalList((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],

        gambar_pertanyaan: null,

        hapus_gambar_pertanyaan:
          true,
      };

      return updated;
    });
  };

  const hapusEditGambarPilihan = (
    index,
    option
  ) => {
    setEditSoalList((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],

        gambar_pilihan: {
          ...updated[index].gambar_pilihan,

          [option]: null,
        },

        hapus_gambar_pilihan: {
          ...updated[index]
            .hapus_gambar_pilihan,

          [option]: true,
        },
      };

      return updated;
    });
  };

  // =====================================================
  // TAMBAH SOAL
  // =====================================================

  const tambahSoal = () => {
    setSoalList((prev) => [
      ...prev,
      createDefaultSoal(),
    ]);
  };

  const tambahEditSoal = () => {
    setEditSoalList((prev) => [
      ...prev,
      createDefaultSoal(),
    ]);
  };

  // =====================================================
  // HAPUS SOAL
  // =====================================================

  const hapusSoal = (index) => {
    if (soalList.length <= 5) {
      toast.error(
        "Minimal harus terdapat 5 soal."
      );

      return;
    }

    setSoalList((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const hapusEditSoal = (index) => {
    if (editSoalList.length <= 5) {
      toast.error(
        "Minimal harus terdapat 5 soal."
      );

      return;
    }

    setEditSoalList((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =====================================================
  // CEK SOAL
  // =====================================================

  const isQuestionValid = (soal) => {
    const pertanyaan =
      String(
        soal.pertanyaan || ""
      ).trim();

    const hasQuestionImage =
      soal.gambar_pertanyaan instanceof
        File ||
      typeof soal.gambar_pertanyaan ===
        "string";

    if (
      !pertanyaan &&
      !hasQuestionImage
    ) {
      return false;
    }

    for (const option of [
      "A",
      "B",
      "C",
      "D",
    ]) {
      const text =
        String(
          soal.pilihan?.[option] ||
            ""
        ).trim();

      const image =
        soal.gambar_pilihan?.[
          option
        ];

      const hasImage =
        image instanceof File ||
        typeof image === "string";

      if (!text && !hasImage) {
        return false;
      }
    }

    return true;
  };

  // =====================================================
  // FORMDATA
  // =====================================================

  const createKuisFormData = (
    kuisForm,
    listSoal
  ) => {
    const formData =
      new FormData();

    formData.append(
      "judul",
      kuisForm.judul || ""
    );

    formData.append(
      "deskripsi",
      kuisForm.deskripsi || ""
    );

    formData.append(
      "status",
      kuisForm.status || "aktif"
    );

    formData.append(
      "total_soal",
      String(listSoal.length)
    );

    listSoal.forEach(
      (soal, index) => {
        const prefix =
          `soal[${index}]`;

        formData.append(
          `${prefix}[pertanyaan]`,
          soal.pertanyaan || ""
        );

        formData.append(
          `${prefix}[jawaban]`,
          soal.jawaban || "A"
        );

        ["A", "B", "C", "D"].forEach(
          (option) => {
            formData.append(
              `${prefix}[pilihan][${option}]`,
              soal.pilihan?.[
                option
              ] || ""
            );
          }
        );

        // =================================================
        // GAMBAR PERTANYAAN
        // =================================================

        if (
          soal.gambar_pertanyaan instanceof
          File
        ) {
          formData.append(
            `${prefix}[gambar_pertanyaan]`,
            soal.gambar_pertanyaan
          );
        }

        // =================================================
        // GAMBAR PILIHAN
        // =================================================

        ["A", "B", "C", "D"].forEach(
          (option) => {
            const image =
              soal.gambar_pilihan?.[
                option
              ];

            if (
              image instanceof File
            ) {
              formData.append(
                `${prefix}[gambar_pilihan][${option}]`,
                image
              );
            }
          }
        );

        // =================================================
        // ID DETAIL EDIT
        // =================================================

        if (
          soal.id_detail_kuis
        ) {
          formData.append(
            `${prefix}[id_detail_kuis]`,
            String(
              soal.id_detail_kuis
            )
          );
        }

        // =================================================
        // HAPUS GAMBAR PERTANYAAN
        // =================================================

        if (
          soal.hapus_gambar_pertanyaan
        ) {
          formData.append(
            `${prefix}[hapus_gambar_pertanyaan]`,
            "1"
          );
        }

        // =================================================
        // HAPUS GAMBAR PILIHAN
        // =================================================

        ["A", "B", "C", "D"].forEach(
          (option) => {
            if (
              soal
                .hapus_gambar_pilihan?.[
                option
              ]
            ) {
              formData.append(
                `${prefix}[hapus_gambar_pilihan][${option}]`,
                "1"
              );
            }
          }
        );
      }
    );

    return formData;
  };

  // =====================================================
  // TAMBAH KUIS
  // =====================================================

  const handleTambah = async (e) => {
    e.preventDefault();

    if (!form.judul.trim()) {
      toast.error(
        "Judul kuis tidak boleh kosong."
      );

      return;
    }

    if (soalList.length < 5) {
      toast.error(
        "Minimal harus terdapat 5 soal."
      );

      return;
    }

    const invalidIndex =
      soalList.findIndex(
        (soal) =>
          !isQuestionValid(soal)
      );

    if (invalidIndex !== -1) {
      toast.error(
        `Soal ${
          invalidIndex + 1
        } belum lengkap. Setiap pertanyaan dan pilihan harus memiliki teks atau gambar.`
      );

      return;
    }

    try {
      const formData =
        createKuisFormData(
          form,
          soalList
        );

      await axiosInstance.post(
        "/kuis",
        formData
      );

      await fetchKuis();

      setForm({
        judul: "",
        deskripsi: "",
        status: "aktif",
      });

      setSoalList(
        Array.from(
          { length: 5 },
          () => createDefaultSoal()
        )
      );

      setShowTambahModal(false);

      toast.success(
        "Kuis berhasil ditambahkan."
      );
    } catch (error) {
      console.error(
        "ERROR TAMBAH KUIS:",
        error
      );

      console.error(
        error.response?.data
      );

      const validationErrors =
        error.response?.data?.errors;

      if (validationErrors) {
        const firstError =
          Object.values(
            validationErrors
          )[0]?.[0];

        toast.error(
          firstError ||
            "Terdapat kesalahan validasi."
        );

        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Gagal menambahkan kuis."
      );
    }
  };

  // =====================================================
  // OPEN EDIT
  // =====================================================

  const handleOpenEdit = (kuis) => {
    setEditForm({
      id_kuis:
        kuis.id_kuis,

      judul:
        kuis.judul || "",

      deskripsi:
        kuis.deskripsi || "",

      status:
        kuis.status || "aktif",
    });

    const formatted =
      (kuis.detail_kuis || []).map(
        (item) => ({
          id_detail_kuis:
            item.id_detail_kuis,

          pertanyaan:
            item.pertanyaan || "",

          gambar_pertanyaan:
            item.gambar_pertanyaan ||
            null,

          pilihan: {
            A:
              item.pilihan_a ||
              "",
            B:
              item.pilihan_b ||
              "",
            C:
              item.pilihan_c ||
              "",
            D:
              item.pilihan_d ||
              "",
          },

          gambar_pilihan: {
            A:
              item.gambar_pilihan_a ||
              null,
            B:
              item.gambar_pilihan_b ||
              null,
            C:
              item.gambar_pilihan_c ||
              null,
            D:
              item.gambar_pilihan_d ||
              null,
          },

          jawaban:
            item.jawaban || "A",

          hapus_gambar_pertanyaan:
            false,

          hapus_gambar_pilihan: {
            A: false,
            B: false,
            C: false,
            D: false,
          },
        })
      );

    setEditSoalList(
      formatted
    );

    setShowEditModal(true);
  };

  // =====================================================
  // UPDATE KUIS
  // =====================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editForm.judul.trim()) {
      toast.error(
        "Judul kuis tidak boleh kosong."
      );

      return;
    }

    if (
      editSoalList.length < 5
    ) {
      toast.error(
        "Minimal harus terdapat 5 soal."
      );

      return;
    }

    const invalidIndex =
      editSoalList.findIndex(
        (soal) =>
          !isQuestionValid(soal)
      );

    if (invalidIndex !== -1) {
      toast.error(
        `Soal ${
          invalidIndex + 1
        } belum lengkap. Setiap pertanyaan dan pilihan harus memiliki teks atau gambar.`
      );

      return;
    }

    try {
      const formData =
        createKuisFormData(
          editForm,
          editSoalList
        );

      // =================================================
      // PENTING
      // Laravel multipart PUT
      // gunakan POST + _method
      // =================================================

      formData.append(
        "_method",
        "PUT"
      );

      // Jangan beri headers Content-Type manual.
      // Axios/browser akan membuat boundary multipart
      // secara otomatis.

      await axiosInstance.post(
        `/kuis/${editForm.id_kuis}`,
        formData
      );

      await fetchKuis();

      setShowEditModal(false);

      toast.success(
        "Kuis berhasil diperbarui."
      );
    } catch (error) {
      console.error(
        "ERROR UPDATE KUIS:",
        error
      );

      console.error(
        error.response?.data
      );

      const validationErrors =
        error.response?.data?.errors;

      if (validationErrors) {
        const firstError =
          Object.values(
            validationErrors
          )[0]?.[0];

        toast.error(
          firstError ||
            "Terdapat kesalahan validasi."
        );

        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Gagal memperbarui kuis."
      );
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const yakin =
      window.confirm(
        "Apakah Anda yakin ingin menghapus kuis ini?"
      );

    if (!yakin) {
      return;
    }

    try {
      await axiosInstance.delete(
        `/kuis/${id}`
      );

      await fetchKuis();

      toast.success(
        "Kuis berhasil dihapus."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Gagal menghapus kuis."
      );
    }
  };

  // =====================================================
  // DETAIL
  // =====================================================

  const handleOpenDetail = (
    kuis
  ) => {
    setDetailKuis(kuis);

    setShowDetailModal(true);
  };

  // =====================================================
  // IMAGE INPUT
  // =====================================================

  const ImageInput = ({
    label,
    value,
    onChange,
    onRemove,
  }) => {
    let preview = null;

    if (
      value instanceof File
    ) {
      preview =
        URL.createObjectURL(
          value
        );
    } else if (
      typeof value === "string"
    ) {
      preview = value;
    }

    return (
      <div className="mt-3">
        <div className="mb-2 text-sm font-medium text-slate-700">
          {label}
          <span className="ml-1 font-normal text-slate-400">
            (Opsional)
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100">
            <ImagePlus className="h-4 w-4" />

            Pilih Gambar

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file =
                  e.target.files?.[0] ||
                  null;

                onChange(file);

                e.target.value = "";
              }}
            />
          </label>

          {value && (
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
            >
              <X className="h-4 w-4" />

              Hapus Gambar
            </button>
          )}
        </div>

        {preview && (
          <div className="mt-3 w-fit">
            <img
              src={preview}
              alt={label}
              className="max-h-48 max-w-xs rounded-xl border border-slate-200 object-contain shadow-sm"
              onError={(e) => {
                e.currentTarget.style.display =
                  "none";
              }}
            />
          </div>
        )}

        <p className="mt-1 text-xs text-slate-400">
          JPG, JPEG, PNG atau WEBP.
          Maksimal 5 MB.
        </p>
      </div>
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-6">
      {/* =================================================
          HEADER
      ================================================= */}

      <PageHeader
        title="Manajemen Kuis"
        description="Daftar kuis pembelajaran."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                setShowPengaturan(
                  true
                )
              }
              className="bg-slate-500 text-white hover:bg-slate-600"
            >
              Pengaturan Jumlah Soal
            </Button>

            <Button
              onClick={() =>
                setShowTambahModal(
                  true
                )
              }
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />

              Tambah Kuis
            </Button>
          </div>
        }
      />

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left">
                Judul
              </th>

              <th className="px-5 py-3 text-left">
                Deskripsi
              </th>

              <th className="px-5 py-3 text-left">
                Total Soal
              </th>

              <th className="px-5 py-3 text-left">
                Status
              </th>

              <th className="px-5 py-3 text-left">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {dataKuis.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-5 py-10 text-center text-slate-400"
                >
                  Belum ada data kuis.
                </td>
              </tr>
            ) : (
              dataKuis.map(
                (kuis) => (
                  <tr
                    key={
                      kuis.id_kuis
                    }
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-5 py-3 font-medium">
                      {kuis.judul}
                    </td>

                    <td className="px-5 py-3 text-slate-600">
                      {kuis.deskripsi ||
                        "-"}
                    </td>

                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        <BookOpen className="h-4 w-4" />

                        {
                          kuis.total_soal
                        }{" "}
                        Soal
                      </span>
                    </td>

                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          kuis.status ===
                          "aktif"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {kuis.status ===
                        "aktif"
                          ? "Aktif"
                          : "Draft"}
                      </span>
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleOpenEdit(
                              kuis
                            )
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() =>
                            handleOpenDetail(
                              kuis
                            )
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() =>
                            handleDelete(
                              kuis.id_kuis
                            )
                          }
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {/* =================================================
          MODAL TAMBAH
      ================================================= */}

      {showTambahModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4">
          <div className="mx-auto w-full max-w-6xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Tambah Kuis
                </h2>

                <p className="text-sm text-slate-500">
                  Pertanyaan dan pilihan dapat berupa teks, gambar, atau keduanya.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowTambahModal(
                    false
                  )
                }
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={
                handleTambah
              }
              className="max-h-[85vh] overflow-y-auto p-6"
            >
              {/* INFO KUIS */}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Judul Kuis
                  </label>

                  <input
                    type="text"
                    name="judul"
                    value={
                      form.judul
                    }
                    onChange={
                      handleFormChange
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    placeholder="Masukkan judul kuis"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      form.status
                    }
                    onChange={
                      handleFormChange
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
                  >
                    <option value="aktif">
                      Aktif
                    </option>

                    <option value="draft">
                      Draft
                    </option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold">
                  Deskripsi
                </label>

                <textarea
                  name="deskripsi"
                  value={
                    form.deskripsi
                  }
                  onChange={
                    handleFormChange
                  }
                  rows="3"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Deskripsi kuis"
                />
              </div>

              {/* SOAL */}

              <div className="mt-8 space-y-6">
                {soalList.map(
                  (soal, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="mb-5 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800">
                          Soal{" "}
                          {index +
                            1}
                        </h3>

                        {soalList.length >
                          5 && (
                          <button
                            type="button"
                            onClick={() =>
                              hapusSoal(
                                index
                              )
                            }
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>

                      {/* PERTANYAAN */}

                      <textarea
                        value={
                          soal.pertanyaan
                        }
                        onChange={(e) =>
                          handleSoalChange(
                            index,
                            "pertanyaan",
                            e.target.value
                          )
                        }
                        rows="3"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                        placeholder="Tulis pertanyaan. Boleh dikosongkan jika menggunakan gambar."
                      />

                      <ImageInput
                        label="Gambar Pertanyaan"
                        value={
                          soal.gambar_pertanyaan
                        }
                        onChange={(
                          file
                        ) =>
                          handleGambarPertanyaanChange(
                            index,
                            file
                          )
                        }
                        onRemove={() =>
                          hapusGambarPertanyaan(
                            index
                          )
                        }
                      />

                      {/* PILIHAN */}

                      <div className="mt-6 grid gap-5 md:grid-cols-2">
                        {[
                          "A",
                          "B",
                          "C",
                          "D",
                        ].map(
                          (
                            option
                          ) => (
                            <div
                              key={
                                option
                              }
                              className="rounded-xl border border-slate-200 bg-white p-4"
                            >
                              <label className="mb-2 block font-bold">
                                Pilihan{" "}
                                {
                                  option
                                }
                              </label>

                              <input
                                type="text"
                                value={
                                  soal
                                    .pilihan[
                                    option
                                  ]
                                }
                                onChange={(
                                  e
                                ) =>
                                  handlePilihanChange(
                                    index,
                                    option,
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                                placeholder={`Teks pilihan ${option}. Boleh dikosongkan jika menggunakan gambar.`}
                              />

                              <ImageInput
                                label={`Gambar Pilihan ${option}`}
                                value={
                                  soal
                                    .gambar_pilihan[
                                    option
                                  ]
                                }
                                onChange={(
                                  file
                                ) =>
                                  handleGambarPilihanChange(
                                    index,
                                    option,
                                    file
                                  )
                                }
                                onRemove={() =>
                                  hapusGambarPilihan(
                                    index,
                                    option
                                  )
                                }
                              />
                            </div>
                          )
                        )}
                      </div>

                      {/* JAWABAN */}

                      <div className="mt-5">
                        <label className="mb-2 block text-sm font-semibold">
                          Jawaban Benar
                        </label>

                        <select
                          value={
                            soal.jawaban
                          }
                          onChange={(e) =>
                            handleSoalChange(
                              index,
                              "jawaban",
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 md:w-1/2"
                        >
                          <option value="A">
                            Pilihan A
                          </option>

                          <option value="B">
                            Pilihan B
                          </option>

                          <option value="C">
                            Pilihan C
                          </option>

                          <option value="D">
                            Pilihan D
                          </option>
                        </select>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* BUTTON */}

              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={
                    tambahSoal
                  }
                  className="flex items-center gap-2 rounded-xl bg-blue-100 px-5 py-3 font-semibold text-blue-700 hover:bg-blue-200"
                >
                  <Plus className="h-5 w-5" />

                  Tambah Soal
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  <Save className="h-5 w-5" />

                  Simpan Kuis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================
          MODAL EDIT
      ================================================= */}

      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4">
          <div className="mx-auto w-full max-w-6xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Edit Kuis
                </h2>

                <p className="text-sm text-slate-500">
                  Edit teks dan gambar soal.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowEditModal(
                    false
                  )
                }
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={
                handleUpdate
              }
              className="max-h-[85vh] overflow-y-auto p-6"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Judul Kuis
                  </label>

                  <input
                    type="text"
                    name="judul"
                    value={
                      editForm.judul
                    }
                    onChange={
                      handleEditChange
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      editForm.status
                    }
                    onChange={
                      handleEditChange
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  >
                    <option value="aktif">
                      Aktif
                    </option>

                    <option value="draft">
                      Draft
                    </option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold">
                  Deskripsi
                </label>

                <textarea
                  name="deskripsi"
                  value={
                    editForm.deskripsi
                  }
                  onChange={
                    handleEditChange
                  }
                  rows="3"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div className="mt-8 space-y-6">
                {editSoalList.map(
                  (
                    soal,
                    index
                  ) => (
                    <div
                      key={
                        soal.id_detail_kuis ||
                        index
                      }
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="mb-5 flex items-center justify-between">
                        <h3 className="text-lg font-bold">
                          Soal{" "}
                          {index +
                            1}
                        </h3>

                        {editSoalList.length >
                          5 && (
                          <button
                            type="button"
                            onClick={() =>
                              hapusEditSoal(
                                index
                              )
                            }
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>

                      <textarea
                        value={
                          soal.pertanyaan
                        }
                        onChange={(e) =>
                          handleEditSoalChange(
                            index,
                            "pertanyaan",
                            e.target.value
                          )
                        }
                        rows="3"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                        placeholder="Tulis pertanyaan. Boleh kosong jika menggunakan gambar."
                      />

                      <ImageInput
                        label="Gambar Pertanyaan"
                        value={
                          soal.gambar_pertanyaan
                        }
                        onChange={(
                          file
                        ) =>
                          handleEditGambarPertanyaanChange(
                            index,
                            file
                          )
                        }
                        onRemove={() =>
                          hapusEditGambarPertanyaan(
                            index
                          )
                        }
                      />

                      <div className="mt-6 grid gap-5 md:grid-cols-2">
                        {[
                          "A",
                          "B",
                          "C",
                          "D",
                        ].map(
                          (
                            option
                          ) => (
                            <div
                              key={
                                option
                              }
                              className="rounded-xl border border-slate-200 bg-white p-4"
                            >
                              <label className="mb-2 block font-bold">
                                Pilihan{" "}
                                {
                                  option
                                }
                              </label>

                              <input
                                type="text"
                                value={
                                  soal
                                    .pilihan[
                                    option
                                  ]
                                }
                                onChange={(
                                  e
                                ) =>
                                  handleEditPilihanChange(
                                    index,
                                    option,
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                                placeholder={`Teks pilihan ${option}. Boleh kosong jika gambar.`}
                              />

                              <ImageInput
                                label={`Gambar Pilihan ${option}`}
                                value={
                                  soal
                                    .gambar_pilihan[
                                    option
                                  ]
                                }
                                onChange={(
                                  file
                                ) =>
                                  handleEditGambarPilihanChange(
                                    index,
                                    option,
                                    file
                                  )
                                }
                                onRemove={() =>
                                  hapusEditGambarPilihan(
                                    index,
                                    option
                                  )
                                }
                              />
                            </div>
                          )
                        )}
                      </div>

                      <div className="mt-5">
                        <label className="mb-2 block text-sm font-semibold">
                          Jawaban Benar
                        </label>

                        <select
                          value={
                            soal.jawaban
                          }
                          onChange={(e) =>
                            handleEditSoalChange(
                              index,
                              "jawaban",
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 md:w-1/2"
                        >
                          <option value="A">
                            Pilihan A
                          </option>

                          <option value="B">
                            Pilihan B
                          </option>

                          <option value="C">
                            Pilihan C
                          </option>

                          <option value="D">
                            Pilihan D
                          </option>
                        </select>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={
                    tambahEditSoal
                  }
                  className="flex items-center gap-2 rounded-xl bg-blue-100 px-5 py-3 font-semibold text-blue-700 hover:bg-blue-200"
                >
                  <Plus className="h-5 w-5" />

                  Tambah Soal
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-yellow-500 px-5 py-3 font-semibold text-white hover:bg-yellow-600"
                >
                  Update Kuis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================
          MODAL DETAIL / PREVIEW
      ================================================= */}

      {showDetailModal &&
        detailKuis && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4">
            <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b px-6 py-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Detail Kuis
                  </h2>

                  <p className="text-sm text-slate-500">
                    Preview data yang sudah tersimpan di database.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowDetailModal(
                      false
                    )
                  }
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[85vh] overflow-y-auto p-6">
                <div className="rounded-2xl border bg-slate-50 p-5">
                  <h3 className="text-xl font-bold">
                    {
                      detailKuis.judul
                    }
                  </h3>

                  <p className="mt-2 text-slate-600">
                    {
                      detailKuis.deskripsi ||
                      "-"
                    }
                  </p>
                </div>

                <div className="mt-6 space-y-5">
                  {(
                    detailKuis.detail_kuis ||
                    []
                  ).map(
                    (
                      soal,
                      index
                    ) => (
                      <div
                        key={
                          soal.id_detail_kuis ||
                          index
                        }
                        className="rounded-2xl border border-slate-200 p-5"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-lg font-bold">
                            Soal{" "}
                            {index +
                              1}
                          </h3>

                          <span className="font-semibold text-green-600">
                            Jawaban:{" "}
                            {
                              soal.jawaban
                            }
                          </span>
                        </div>

                        {/* PERTANYAAN */}

                        {soal.pertanyaan && (
                          <p className="leading-relaxed text-slate-700">
                            {
                              soal.pertanyaan
                            }
                          </p>
                        )}

                        {soal.gambar_pertanyaan && (
                          <div className="mt-4">
                            <img
                              src={
                                soal.gambar_pertanyaan
                              }
                              alt={`Gambar soal ${index + 1}`}
                              className="max-h-72 max-w-full rounded-xl border border-slate-200 object-contain"
                            />
                          </div>
                        )}

                        {/* PILIHAN */}

                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                          {[
                            "A",
                            "B",
                            "C",
                            "D",
                          ].map(
                            (
                              option
                            ) => {
                              const text =
                                soal[
                                  `pilihan_${option.toLowerCase()}`
                                ];

                              const image =
                                soal[
                                  `gambar_pilihan_${option.toLowerCase()}`
                                ];

                              return (
                                <div
                                  key={
                                    option
                                  }
                                  className={`rounded-xl border p-4 ${
                                    soal.jawaban ===
                                    option
                                      ? "border-green-500 bg-green-50"
                                      : "border-slate-200"
                                  }`}
                                >
                                  <div className="font-bold">
                                    {
                                      option
                                    }
                                    .
                                  </div>

                                  {text && (
                                    <p className="mt-1 text-slate-700">
                                      {
                                        text
                                      }
                                    </p>
                                  )}

                                  {image && (
                                    <img
                                      src={
                                        image
                                      }
                                      alt={`Pilihan ${option}`}
                                      className="mt-3 max-h-48 max-w-full rounded-lg object-contain"
                                    />
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      {/* =================================================
          PENGATURAN
      ================================================= */}

      {showPengaturan && (
        <PengaturanNilai
          onClose={() =>
            setShowPengaturan(
              false
            )
          }
        />
      )}
    </div>
  );
}
