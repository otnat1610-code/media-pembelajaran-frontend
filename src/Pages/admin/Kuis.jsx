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
  // DATA KUIS
  // =====================================================
  const [dataKuis, setDataKuis] = useState([]);

  // =====================================================
  // MODAL
  // =====================================================
  const [showTambahModal, setShowTambahModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showDetailModal, setShowDetailModal] =
    useState(false);

  const [detailKuis, setDetailKuis] =
    useState(null);

  const [showPengaturan, setShowPengaturan] =
    useState(false);

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
  const defaultSoal = {
    id_detail_kuis: null,

    pertanyaan: "",

    gambar_pertanyaan: null,

    gambar_pertanyaan_path: null,

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

    gambar_pilihan_path: {
      A: null,
      B: null,
      C: null,
      D: null,
    },

    jawaban: "A",

    hapus_gambar_pertanyaan: false,

    hapus_gambar_pilihan: {},
  };

  // =====================================================
  // SOAL TAMBAH
  // =====================================================
  const [soalList, setSoalList] =
    useState(
      Array.from(
        { length: 5 },
        () => createEmptySoal()
      )
    );


  // =====================================================
  // SOAL EDIT
  // =====================================================
  const [editSoalList, setEditSoalList] =
    useState([]);


  // =====================================================
  // HELPER SOAL KOSONG
  // =====================================================
  function createEmptySoal() {
    return {
      id_detail_kuis: null,

      pertanyaan: "",

      gambar_pertanyaan: null,

      gambar_pertanyaan_path: null,

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

      gambar_pilihan_path: {
        A: null,
        B: null,
        C: null,
        D: null,
      },

      jawaban: "A",

      hapus_gambar_pertanyaan: false,

      hapus_gambar_pilihan: {},
    };
  }


  // =====================================================
  // FETCH DATA
  // =====================================================
  useEffect(() => {
    fetchKuis();
  }, []);


  // =====================================================
  // FETCH KUIS
  // =====================================================
  const fetchKuis = async () => {
    try {

      const response =
        await axiosInstance.get(
          "/admin/kuis"
        );

      setDataKuis(
        response.data
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Gagal mengambil data kuis."
      );
    }
  };


  // =====================================================
  // FORM CHANGE
  // =====================================================
  const handleFormChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };


  // =====================================================
  // EDIT FORM CHANGE
  // =====================================================
  const handleEditChange = (e) => {

    setEditForm({
      ...editForm,
      [e.target.name]:
        e.target.value,
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

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {

      toast.error(
        "Ukuran gambar maksimal 5 MB."
      );

      return false;
    }

    return true;
  };


  // =====================================================
  // HANDLE SOAL TAMBAH
  // =====================================================
  const handleSoalChange = (
    index,
    field,
    value
  ) => {

    const updated = [
      ...soalList,
    ];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setSoalList(updated);
  };


  // =====================================================
  // HANDLE PILIHAN TAMBAH
  // =====================================================
  const handlePilihanChange = (
    index,
    option,
    value
  ) => {

    const updated = [
      ...soalList,
    ];

    updated[index] = {
      ...updated[index],

      pilihan: {
        ...updated[index]
          .pilihan,

        [option]: value,
      },
    };

    setSoalList(updated);
  };


  // =====================================================
  // GAMBAR PERTANYAAN TAMBAH
  // =====================================================
  const handleGambarPertanyaanChange =
    (index, file) => {

      if (!validateImage(file)) {
        return;
      }

      const updated = [
        ...soalList,
      ];

      updated[index] = {
        ...updated[index],

        gambar_pertanyaan:
          file,
      };

      setSoalList(updated);
    };


  // =====================================================
  // GAMBAR PILIHAN TAMBAH
  // =====================================================
  const handleGambarPilihanChange =
    (
      index,
      option,
      file
    ) => {

      if (!validateImage(file)) {
        return;
      }

      const updated = [
        ...soalList,
      ];

      updated[index] = {
        ...updated[index],

        gambar_pilihan: {
          ...updated[index]
            .gambar_pilihan,

          [option]: file,
        },
      };

      setSoalList(updated);
    };


  // =====================================================
  // HAPUS GAMBAR PERTANYAAN TAMBAH
  // =====================================================
  const hapusGambarPertanyaan =
    (index) => {

      const updated = [
        ...soalList,
      ];

      updated[index] = {
        ...updated[index],

        gambar_pertanyaan:
          null,
      };

      setSoalList(updated);
    };


  // =====================================================
  // HAPUS GAMBAR PILIHAN TAMBAH
  // =====================================================
  const hapusGambarPilihan =
    (
      index,
      option
    ) => {

      const updated = [
        ...soalList,
      ];

      updated[index] = {
        ...updated[index],

        gambar_pilihan: {
          ...updated[index]
            .gambar_pilihan,

          [option]: null,
        },
      };

      setSoalList(updated);
    };


  // =====================================================
  // EDIT SOAL CHANGE
  // =====================================================
  const handleEditSoalChange =
    (
      index,
      field,
      value
    ) => {

      const updated = [
        ...editSoalList,
      ];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      setEditSoalList(
        updated
      );
    };


  // =====================================================
  // EDIT PILIHAN CHANGE
  // =====================================================
  const handleEditPilihanChange =
    (
      index,
      option,
      value
    ) => {

      const updated = [
        ...editSoalList,
      ];

      updated[index] = {
        ...updated[index],

        pilihan: {
          ...updated[index]
            .pilihan,

          [option]: value,
        },
      };

      setEditSoalList(
        updated
      );
    };


  // =====================================================
  // EDIT GAMBAR PERTANYAAN
  // =====================================================
  const handleEditGambarPertanyaanChange =
    (
      index,
      file
    ) => {

      if (!validateImage(file)) {
        return;
      }

      const updated = [
        ...editSoalList,
      ];

      updated[index] = {
        ...updated[index],

        gambar_pertanyaan:
          file,

        hapus_gambar_pertanyaan:
          false,
      };

      setEditSoalList(
        updated
      );
    };


  // =====================================================
  // EDIT GAMBAR PILIHAN
  // =====================================================
  const handleEditGambarPilihanChange =
    (
      index,
      option,
      file
    ) => {

      if (!validateImage(file)) {
        return;
      }

      const updated = [
        ...editSoalList,
      ];

      updated[index] = {
        ...updated[index],

        gambar_pilihan: {
          ...updated[index]
            .gambar_pilihan,

          [option]: file,
        },

        hapus_gambar_pilihan: {
          ...(
            updated[index]
              .hapus_gambar_pilihan
            || {}
          ),

          [option]: false,
        },
      };

      setEditSoalList(
        updated
      );
    };


  // =====================================================
  // HAPUS GAMBAR PERTANYAAN EDIT
  // =====================================================
  const hapusEditGambarPertanyaan =
    (index) => {

      const updated = [
        ...editSoalList,
      ];

      updated[index] = {
        ...updated[index],

        gambar_pertanyaan:
          null,

        hapus_gambar_pertanyaan:
          true,
      };

      setEditSoalList(
        updated
      );
    };


  // =====================================================
  // HAPUS GAMBAR PILIHAN EDIT
  // =====================================================
  const hapusEditGambarPilihan =
    (
      index,
      option
    ) => {

      const updated = [
        ...editSoalList,
      ];

      updated[index] = {
        ...updated[index],

        gambar_pilihan: {
          ...updated[index]
            .gambar_pilihan,

          [option]: null,
        },

        hapus_gambar_pilihan: {
          ...(
            updated[index]
              .hapus_gambar_pilihan
            || {}
          ),

          [option]: true,
        },
      };

      setEditSoalList(
        updated
      );
    };


  // =====================================================
  // TAMBAH SOAL
  // =====================================================
  const tambahSoal = () => {

    setSoalList([
      ...soalList,
      createEmptySoal(),
    ]);
  };


  // =====================================================
  // TAMBAH SOAL EDIT
  // =====================================================
  const tambahEditSoal = () => {

    setEditSoalList([
      ...editSoalList,
      createEmptySoal(),
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

    setSoalList(
      soalList.filter(
        (_, i) =>
          i !== index
      )
    );
  };


  // =====================================================
  // HAPUS SOAL EDIT
  // =====================================================
  const hapusEditSoal = (
    index
  ) => {

    if (
      editSoalList.length <= 5
    ) {

      toast.error(
        "Minimal harus terdapat 5 soal."
      );

      return;
    }

    setEditSoalList(
      editSoalList.filter(
        (_, i) =>
          i !== index
      )
    );
  };


  // =====================================================
  // OPEN DETAIL
  // =====================================================
  const handleOpenDetail = (
    kuis
  ) => {

    setDetailKuis(
      kuis
    );

    setShowDetailModal(
      true
    );
  };


  // =====================================================
  // OPEN EDIT
  // =====================================================
  const handleOpenEdit = (
    kuis
  ) => {

    setEditForm({
      id_kuis:
        kuis.id_kuis,

      judul:
        kuis.judul,

      deskripsi:
        kuis.deskripsi || "",

      status:
        kuis.status,
    });


    const formattedSoal =
      (
        kuis.detail_kuis
        || []
      ).map(
        (item) => ({

          id_detail_kuis:
            item.id_detail_kuis,

          pertanyaan:
            item.pertanyaan
            || "",

          // URL gambar
          gambar_pertanyaan:
            item.gambar_pertanyaan
            || null,

          // PATH ASLI
          gambar_pertanyaan_path:
            item.gambar_pertanyaan_path
            || null,

          pilihan: {
            A:
              item.pilihan_a
              || "",

            B:
              item.pilihan_b
              || "",

            C:
              item.pilihan_c
              || "",

            D:
              item.pilihan_d
              || "",
          },

          gambar_pilihan: {
            A:
              item.gambar_pilihan_a
              || null,

            B:
              item.gambar_pilihan_b
              || null,

            C:
              item.gambar_pilihan_c
              || null,

            D:
              item.gambar_pilihan_d
              || null,
          },

          gambar_pilihan_path: {
            A:
              item.gambar_pilihan_a_path
              || null,

            B:
              item.gambar_pilihan_b_path
              || null,

            C:
              item.gambar_pilihan_c_path
              || null,

            D:
              item.gambar_pilihan_d_path
              || null,
          },

          jawaban:
            item.jawaban
            || "A",

          hapus_gambar_pertanyaan:
            false,

          hapus_gambar_pilihan:
            {},
        })
      );


    setEditSoalList(
      formattedSoal
    );

    setShowEditModal(
      true
    );
  };


  // =====================================================
  // CREATE FORM DATA
  // =====================================================
  const createKuisFormData = (
    kuisForm,
    listSoal
  ) => {

    const formData =
      new FormData();


    formData.append(
      "judul",
      kuisForm.judul
    );

    formData.append(
      "deskripsi",
      kuisForm.deskripsi
      || ""
    );

    formData.append(
      "status",
      kuisForm.status
    );

    formData.append(
      "total_soal",
      listSoal.length
    );


    listSoal.forEach(
      (
        soal,
        index
      ) => {

        // ID DETAIL
        if (
          soal.id_detail_kuis
        ) {

          formData.append(
            `soal[${index}][id_detail_kuis]`,
            soal.id_detail_kuis
          );
        }


        // PERTANYAAN
        formData.append(
          `soal[${index}][pertanyaan]`,
          soal.pertanyaan
          || ""
        );


        // JAWABAN
        formData.append(
          `soal[${index}][jawaban]`,
          soal.jawaban
        );


        // PILIHAN
        ["A", "B", "C", "D"]
          .forEach(
            (option) => {

              formData.append(
                `soal[${index}][pilihan][${option}]`,
                soal.pilihan[
                  option
                ] || ""
              );
            }
          );


        // =================================================
        // GAMBAR PERTANYAAN BARU
        // =================================================
        if (
          soal.gambar_pertanyaan
          instanceof File
        ) {

          formData.append(
            `soal[${index}][gambar_pertanyaan]`,
            soal.gambar_pertanyaan
          );
        }


        // =================================================
        // GAMBAR PERTANYAAN LAMA
        // =================================================
        if (
          soal.gambar_pertanyaan_path
        ) {

          formData.append(
            `soal[${index}][gambar_pertanyaan_path]`,
            soal.gambar_pertanyaan_path
          );
        }


        // =================================================
        // GAMBAR PILIHAN
        // =================================================
        ["A", "B", "C", "D"]
          .forEach(
            (option) => {

              const image =
                soal.gambar_pilihan?.[
                  option
                ];

              const oldPath =
                soal.gambar_pilihan_path?.[
                  option
                ];


              // GAMBAR BARU
              if (
                image instanceof File
              ) {

                formData.append(
                  `soal[${index}][gambar_pilihan][${option}]`,
                  image
                );
              }


              // PATH LAMA
              if (oldPath) {

                formData.append(
                  `soal[${index}][gambar_pilihan_path][${option}]`,
                  oldPath
                );
              }
            }
          );


        // =================================================
        // HAPUS GAMBAR PERTANYAAN
        // =================================================
        if (
          soal.hapus_gambar_pertanyaan
        ) {

          formData.append(
            `soal[${index}][hapus_gambar_pertanyaan]`,
            "1"
          );
        }


        // =================================================
        // HAPUS GAMBAR PILIHAN
        // =================================================
        if (
          soal.hapus_gambar_pilihan
        ) {

          ["A", "B", "C", "D"]
            .forEach(
              (option) => {

                if (
                  soal
                    .hapus_gambar_pilihan[
                      option
                    ]
                ) {

                  formData.append(
                    `soal[${index}][hapus_gambar_pilihan][${option}]`,
                    "1"
                  );
                }
              }
            );
        }
      }
    );


    return formData;
  };


  // =====================================================
  // VALIDASI FRONTEND
  // =====================================================
  const validateSoalList = (
    list
  ) => {

    for (
      let index = 0;
      index < list.length;
      index++
    ) {

      const soal =
        list[index];


      // ---------------------------------------------
      // PERTANYAAN
      // ---------------------------------------------
      const hasText =
        soal.pertanyaan
          ?.trim() !== "";

      const hasImage =
        soal.gambar_pertanyaan
        instanceof File ||
        Boolean(
          soal.gambar_pertanyaan
        );


      const imageDeleted =
        soal.hapus_gambar_pertanyaan
        === true;


      if (
        !hasText &&
        (!hasImage ||
          imageDeleted)
      ) {

        toast.error(
          `Soal ${
            index + 1
          }: pertanyaan harus diisi atau memiliki gambar.`
        );

        return false;
      }


      // ---------------------------------------------
      // PILIHAN
      // ---------------------------------------------
      for (
        const option of [
          "A",
          "B",
          "C",
          "D",
        ]
      ) {

        const text =
          soal.pilihan?.[
            option
          ]
            ?.trim() !== "";

        const image =
          soal.gambar_pilihan?.[
            option
          ];

        const hasImage =
          image instanceof File ||
          Boolean(image);


        const deleted =
          soal
            .hapus_gambar_pilihan
            ?.[
              option
            ] === true;


        if (
          !text &&
          (!hasImage ||
            deleted)
        ) {

          toast.error(
            `Soal ${
              index + 1
            }: pilihan ${option} harus diisi atau memiliki gambar.`
          );

          return false;
        }
      }
    }

    return true;
  };


  // =====================================================
  // TAMBAH KUIS
  // =====================================================
  const handleTambah = async (
    e
  ) => {

    e.preventDefault();


    if (
      soalList.length < 5
    ) {

      toast.error(
        "Jumlah soal minimal 5."
      );

      return;
    }


    if (
      !form.judul.trim()
    ) {

      toast.error(
        "Judul kuis tidak boleh kosong."
      );

      return;
    }


    if (
      !validateSoalList(
        soalList
      )
    ) {
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
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
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
          () =>
            createEmptySoal()
        )
      );


      setShowTambahModal(
        false
      );


      toast.success(
        "Kuis berhasil ditambahkan."
      );

    } catch (error) {

      console.log(error);
      console.log(
        error.response?.data
      );


      toast.error(
        error.response?.data
          ?.message
          ||
          "Gagal menambahkan kuis."
      );
    }
  };


  // =====================================================
  // UPDATE KUIS
  // =====================================================
  const handleUpdate = async (
    e
  ) => {

    e.preventDefault();


    if (
      editSoalList.length < 5
    ) {

      toast.error(
        "Jumlah soal minimal 5."
      );

      return;
    }


    if (
      !editForm.judul.trim()
    ) {

      toast.error(
        "Judul kuis tidak boleh kosong."
      );

      return;
    }


    if (
      !validateSoalList(
        editSoalList
      )
    ) {
      return;
    }


    try {

      const formData =
        createKuisFormData(
          editForm,
          editSoalList
        );


      // Laravel multipart + PUT
      formData.append(
        "_method",
        "PUT"
      );


      await axiosInstance.post(
        `/kuis/${editForm.id_kuis}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );


      await fetchKuis();


      setShowEditModal(
        false
      );


      toast.success(
        "Kuis berhasil diperbarui."
      );

    } catch (error) {

      console.log(error);
      console.log(
        error.response?.data
      );


      if (
        error.response?.data
          ?.errors
      ) {

        const firstError =
          Object.values(
            error.response
              .data
              .errors
          )[0]?.[0];


        toast.error(
          firstError
          ||
          "Terdapat kesalahan validasi."
        );

        return;
      }


      toast.error(
        error.response?.data
          ?.message
          ||
          "Gagal update kuis."
      );
    }
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

    const [preview, setPreview] =
      useState(null);


    useEffect(() => {

      if (
        value instanceof File
      ) {

        const url =
          URL.createObjectURL(
            value
          );

        setPreview(url);


        return () => {
          URL.revokeObjectURL(
            url
          );
        };
      }


      setPreview(
        value || null
      );

    }, [value]);


    return (
      <div className="mt-3">

        <label className="block mb-2 text-sm font-medium text-slate-700">
          {label}{" "}
          <span className="text-slate-400 font-normal">
            (Opsional)
          </span>
        </label>


        <div className="flex flex-wrap items-start gap-3">

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100">

            <ImagePlus className="h-4 w-4" />

            {value
              ? "Ganti Gambar"
              : "Pilih Gambar"}


            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
              onChange={(e) => {

                const file =
                  e.target.files?.[0]
                  || null;

                onChange(file);

                e.target.value =
                  "";
              }}
            />

          </label>


          {value && (

            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100"
            >

              <X className="h-4 w-4" />

              Hapus Gambar

            </button>
          )}

        </div>


        {preview && (

          <div className="relative mt-3 w-fit">

            <img
              src={preview}
              alt="Preview"
              onError={(e) => {
                e.currentTarget.style.display =
                  "none";
              }}
              className="max-h-48 max-w-xs rounded-xl border border-slate-200 object-contain shadow-sm"
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
    <div>

      {/* =====================================================
          HEADER
      ===================================================== */}
      <PageHeader
        title="Manajemen Kuis"
        description="Daftar kuis pembelajaran."
        actions={

          <div className="flex gap-2">

            <Button
              onClick={() =>
                setShowPengaturan(
                  true
                )
              }
              className="bg-slate-500 hover:bg-slate-600 text-white"
            >
              Pengaturan Jumlah Soal
            </Button>


            <Button
              onClick={() =>
                setShowTambahModal(
                  true
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >

              <Plus className="h-4 w-4" />

              Tambah Kuis

            </Button>

          </div>
        }
      />


      {/* =====================================================
          TABLE
      ===================================================== */}
      <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-slate-50 text-slate-600">

            <tr>

              <th className="px-5 py-3 text-left font-semibold">
                Judul
              </th>

              <th className="px-5 py-3 text-left font-semibold">
                Deskripsi
              </th>

              <th className="px-5 py-3 text-left font-semibold">
                Total Soal
              </th>

              <th className="px-5 py-3 text-left font-semibold">
                Status
              </th>

              <th className="px-5 py-3 text-left font-semibold">
                Aksi
              </th>

            </tr>

          </thead>


          <tbody>

            {dataKuis.map(
              (k) => (

                <tr
                  key={
                    k.id_kuis
                  }
                  className="border-t border-slate-100 hover:bg-slate-50"
                >

                  <td className="px-5 py-3 font-medium">
                    {k.judul}
                  </td>


                  <td className="px-5 py-3 text-slate-600">
                    {k.deskripsi}
                  </td>


                  <td className="px-5 py-3">

                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs font-semibold">

                      <BookOpen className="h-4 w-4" />

                      {k.total_soal}
                      {" "}
                      Soal

                    </div>

                  </td>


                  <td className="px-5 py-3">

                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                        k.status ===
                        "aktif"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >

                      {k.status ===
                      "aktif"
                        ? "Aktif"
                        : "Draft"}

                    </div>

                  </td>


                  <td className="px-5 py-3 flex gap-2">

                    <Button
                      variant="outline"
                      onClick={() =>
                        handleOpenEdit(
                          k
                        )
                      }
                    >

                      <Pencil className="h-4 w-4" />

                    </Button>


                    <Button
                      variant="outline"
                      onClick={() =>
                        handleOpenDetail(
                          k
                        )
                      }
                    >

                      <Eye className="h-4 w-4" />

                    </Button>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>


      {/* =====================================================
          MODAL TAMBAH
      ===================================================== */}
      {showTambahModal && (

        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4">

          <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white shadow-xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b px-6 py-4">

              <div>

                <h2 className="text-xl font-bold text-slate-800">
                  Tambah Kuis
                </h2>

                <p className="text-sm text-slate-500">
                  Tambahkan kuis beserta soal.
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

                <X className="h-5 w-5 text-slate-500" />

              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={
                handleTambah
              }
              className="space-y-8 p-6"
            >

              {/* DATA KUIS */}

              <div className="space-y-4">

                <div>

                  <label className="block mb-1 text-sm font-medium">
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
                    placeholder="Masukkan judul kuis"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>


                <div>

                  <label className="block mb-1 text-sm font-medium">
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
                    placeholder="Masukkan deskripsi kuis"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>


                <div>

                  <label className="block mb-1 text-sm font-medium">
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
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
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


              {/* LIST SOAL */}

              <div className="space-y-5">

                {soalList.map(
                  (
                    soal,
                    index
                  ) => (

                    <div
                      key={index}
                      className="border border-slate-200 rounded-2xl p-5 bg-slate-50"
                    >

                      <div className="flex items-center justify-between mb-4">

                        <h2 className="font-bold text-lg">
                          Soal{" "}
                          {index + 1}
                        </h2>


                        {soalList.length >
                          5 && (

                          <button
                            type="button"
                            onClick={() =>
                              hapusSoal(
                                index
                              )
                            }
                            className="text-red-500 hover:text-red-700"
                          >

                            <Trash2 className="h-5 w-5" />

                          </button>
                        )}

                      </div>


                      {/* PERTANYAAN */}

                      <div className="mb-4">

                        <label className="block mb-1 text-sm font-medium">

                          Pertanyaan

                          <span className="text-slate-400 font-normal">
                            {" "}
                            (Teks atau gambar)
                          </span>

                        </label>


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
                          placeholder="Masukkan pertanyaan jika menggunakan teks"
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />


                        <ImageInput
                          label="Gambar Pertanyaan"
                          value={
                            soal.gambar_pertanyaan
                          }
                          onChange={(file) =>
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

                      </div>


                      {/* PILIHAN */}

                      <div className="grid md:grid-cols-2 gap-4">

                        {[
                          "A",
                          "B",
                          "C",
                          "D",
                        ].map(
                          (option) => (

                            <div
                              key={option}
                              className="rounded-xl border border-slate-200 bg-white p-4"
                            >

                              <label className="block mb-1 text-sm font-medium">

                                Pilihan{" "}
                                {option}

                                <span className="text-slate-400 font-normal">
                                  {" "}
                                  (Teks atau gambar)
                                </span>

                              </label>


                              <input
                                type="text"
                                value={
                                  soal
                                    .pilihan[
                                      option
                                    ]
                                }
                                onChange={(e) =>
                                  handlePilihanChange(
                                    index,
                                    option,
                                    e.target.value
                                  )
                                }
                                placeholder={`Masukkan pilihan ${option} jika menggunakan teks`}
                                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                              />


                              <ImageInput
                                label={`Gambar Pilihan ${option}`}
                                value={
                                  soal
                                    .gambar_pilihan[
                                      option
                                    ]
                                }
                                onChange={(file) =>
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

                      <div className="mt-4">

                        <label className="block mb-1 text-sm font-medium">
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
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
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

              <div className="flex flex-wrap gap-3">

                <button
                  type="button"
                  onClick={
                    tambahSoal
                  }
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200"
                >

                  <Plus className="h-5 w-5" />

                  Tambah Soal

                </button>


                <button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700"
                >

                  <Save className="h-5 w-5" />

                  Simpan Kuis

                </button>

              </div>

            </form>

          </div>

        </div>
      )}


      {/* =====================================================
          MODAL EDIT
      ===================================================== */}
      {showEditModal && (

        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4">

          <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white shadow-xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b px-6 py-4">

              <div>

                <h2 className="text-lg font-bold text-slate-800">
                  Edit Kuis
                </h2>

                <p className="text-sm text-slate-500">
                  Ubah data kuis.
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

                <X className="h-5 w-5 text-slate-500" />

              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={
                handleUpdate
              }
              className="space-y-6 p-6"
            >

              {/* JUDUL */}

              <div>

                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Judul
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
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* DESKRIPSI */}

              <div>

                <label className="mb-1 block text-sm font-medium text-slate-700">
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
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* STATUS */}

              <div>

                <label className="mb-1 block text-sm font-medium text-slate-700">
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
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >

                  <option value="aktif">
                    Aktif
                  </option>

                  <option value="draft">
                    Draft
                  </option>

                </select>

              </div>


              {/* SOAL */}

              <div className="space-y-5">

                {editSoalList.map(
                  (
                    soal,
                    index
                  ) => (

                    <div
                      key={
                        soal.id_detail_kuis
                        ||
                        `new-${index}`
                      }
                      className="border border-slate-200 rounded-2xl p-5 bg-slate-50"
                    >

                      <div className="flex items-center justify-between mb-4">

                        <h2 className="font-bold text-lg">
                          Soal{" "}
                          {index + 1}
                        </h2>


                        {editSoalList.length >
                          5 && (

                          <button
                            type="button"
                            onClick={() =>
                              hapusEditSoal(
                                index
                              )
                            }
                            className="text-red-500 hover:text-red-700"
                          >

                            <Trash2 className="h-5 w-5" />

                          </button>
                        )}

                      </div>


                      {/* PERTANYAAN */}

                      <div className="mb-4">

                        <label className="block mb-1 text-sm font-medium">

                          Pertanyaan

                          <span className="text-slate-400 font-normal">
                            {" "}
                            (Teks atau gambar)
                          </span>

                        </label>


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
                          placeholder="Masukkan pertanyaan jika menggunakan teks"
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />


                        <ImageInput
                          label="Gambar Pertanyaan"
                          value={
                            soal.gambar_pertanyaan
                          }
                          onChange={(file) =>
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

                      </div>


                      {/* PILIHAN */}

                      <div className="grid md:grid-cols-2 gap-4">

                        {[
                          "A",
                          "B",
                          "C",
                          "D",
                        ].map(
                          (option) => (

                            <div
                              key={option}
                              className="rounded-xl border border-slate-200 bg-white p-4"
                            >

                              <label className="block mb-1 text-sm font-medium">

                                Pilihan{" "}
                                {option}

                                <span className="text-slate-400 font-normal">
                                  {" "}
                                  (Teks atau gambar)
                                </span>

                              </label>


                              <input
                                type="text"
                                value={
                                  soal
                                    .pilihan[
                                      option
                                    ]
                                }
                                onChange={(e) =>
                                  handleEditPilihanChange(
                                    index,
                                    option,
                                    e.target.value
                                  )
                                }
                                placeholder={`Masukkan pilihan ${option} jika menggunakan teks`}
                                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                              />


                              <ImageInput
                                label={`Gambar Pilihan ${option}`}
                                value={
                                  soal
                                    .gambar_pilihan[
                                      option
                                    ]
                                }
                                onChange={(file) =>
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


                      {/* JAWABAN */}

                      <div className="mt-4">

                        <label className="block mb-1 text-sm font-medium">
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
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
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


                <button
                  type="button"
                  onClick={
                    tambahEditSoal
                  }
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200"
                >

                  <Plus className="h-5 w-5" />

                  Tambah Soal

                </button>

              </div>


              {/* BUTTON */}

              <div className="flex justify-end gap-3 pt-2">

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setShowEditModal(
                      false
                    )
                  }
                >
                  Batal
                </Button>


                <Button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Update
                </Button>

              </div>

            </form>

          </div>

        </div>
      )}


      {/* =====================================================
          MODAL DETAIL / PREVIEW
      ===================================================== */}
      {showDetailModal &&
        detailKuis && (

          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4">

            <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white shadow-xl">

              {/* HEADER */}

              <div className="flex items-center justify-between border-b px-6 py-4">

                <div>

                  <h2 className="text-2xl font-bold text-slate-800">
                    Detail Kuis
                  </h2>

                  <p className="text-sm text-slate-500">
                    Preview soal kuis pembelajaran
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

                  <X className="h-5 w-5 text-slate-500" />

                </button>

              </div>


              {/* CONTENT */}

              <div className="p-6 space-y-6">

                {/* INFO KUIS */}

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">

                  <h3 className="text-xl font-bold text-slate-800">
                    {detailKuis.judul}
                  </h3>

                  {detailKuis.deskripsi && (

                    <p className="mt-2 text-slate-600">
                      {detailKuis.deskripsi}
                    </p>

                  )}

                </div>


                {/* LIST SOAL */}

                <div className="space-y-5">

                  {detailKuis.detail_kuis?.map(
                    (
                      soal,
                      index
                    ) => (

                      <div
                        key={
                          soal.id_detail_kuis
                          ||
                          index
                        }
                        className="rounded-2xl border border-slate-200 p-5"
                      >

                        <div className="flex items-center justify-between mb-4">

                          <h3 className="text-lg font-bold text-slate-800">
                            Soal{" "}
                            {index + 1}
                          </h3>

                          <div className="text-sm font-semibold text-blue-600">
                            Jawaban:{" "}
                            {soal.jawaban}
                          </div>

                        </div>


                        {/* PERTANYAAN */}

                        <div className="mb-5">

                          {soal.pertanyaan && (

                            <p className="text-slate-700 leading-relaxed">
                              {soal.pertanyaan}
                            </p>

                          )}


                          {soal.gambar_pertanyaan && (

                            <div className="mt-4">

                              <img
                                src={
                                  soal.gambar_pertanyaan
                                }
                                alt={`Gambar soal ${
                                  index + 1
                                }`}
                                className="max-h-72 max-w-full rounded-xl border border-slate-200 object-contain"
                              />

                            </div>

                          )}

                        </div>


                        {/* PILIHAN */}

                        <div className="grid md:grid-cols-2 gap-4">

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

                                  {text && (

                                    <div>

                                      <span className="font-bold">
                                        {option}.
                                      </span>{" "}

                                      {text}

                                    </div>

                                  )}


                                  {!text &&
                                    image && (

                                      <div className="font-bold mb-2">
                                        {option}.
                                      </div>

                                  )}


                                  {image && (

                                    <img
                                      src={
                                        image
                                      }
                                      alt={`Pilihan ${option}`}
                                      className="mt-3 max-h-40 max-w-full rounded-lg object-contain"
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


      {/* =====================================================
          PENGATURAN JUMLAH SOAL
      ===================================================== */}
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
