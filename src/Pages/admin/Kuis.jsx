import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Plus,
    Pencil,
    Trash2,
    Eye,
    Settings,
    X,
    Upload,
    Image as ImageIcon,
} from "lucide-react";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const STORAGE_URL =
    import.meta.env.VITE_STORAGE_URL ||
    API_URL.replace("/api", "");

const getImageUrl = (path) => {
    if (!path) return null;

    if (
        path.startsWith("http://") ||
        path.startsWith("https://")
    ) {
        return path;
    }

    return `${STORAGE_URL}/storage/${String(path).replace(
        /^\/+/,
        ""
    )}`;
};

const emptySoal = () => ({
    id_detail_kuis: null,

    pertanyaan: "",
    gambar_pertanyaan: null,
    gambar_pertanyaan_path: null,
    hapus_gambar_pertanyaan: false,

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

    hapus_gambar_pilihan: {
        A: false,
        B: false,
        C: false,
        D: false,
    },

    jawaban: "A",
});

const createDefaultSoal = () =>
    Array.from({ length: 5 }, () => emptySoal());

export default function Kuis() {
    // =====================================================
    // STATE DATA
    // =====================================================

    const [dataKuis, setDataKuis] = useState([]);

    const [loading, setLoading] = useState(false);

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showPengaturan, setShowPengaturan] = useState(false);

    const [selectedKuis, setSelectedKuis] = useState(null);

    // =====================================================
    // FORM TAMBAH
    // =====================================================

    const [form, setForm] = useState({
        judul: "",
        deskripsi: "",
        status: "aktif",
    });

    const [soalList, setSoalList] =
        useState(createDefaultSoal());

    // =====================================================
    // FORM EDIT
    // =====================================================

    const [editForm, setEditForm] = useState({
        id_kuis: null,
        judul: "",
        deskripsi: "",
        status: "aktif",
    });

    const [editSoalList, setEditSoalList] =
        useState([]);

    // =====================================================
    // PENGATURAN JUMLAH SOAL
    // =====================================================

    const [jumlahSoal, setJumlahSoal] = useState(10);
    const [editJumlahSoal, setEditJumlahSoal] = useState(10);

    // =====================================================
    // FETCH DATA
    // =====================================================

    const fetchKuis = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${API_URL}/admin/kuis`
            );

            setDataKuis(response.data || []);
        } catch (error) {
            console.error("Gagal mengambil data kuis:", error);

            alert(
                error.response?.data?.message ||
                    "Gagal mengambil data kuis."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKuis();
    }, []);

    // =====================================================
    // HANDLE FORM UTAMA
    // =====================================================

    const handleFormChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;

        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =====================================================
    // HANDLE SOAL TAMBAH
    // =====================================================

    const updateSoal = (index, field, value) => {
        setSoalList((prev) => {
            const copy = [...prev];

            copy[index] = {
                ...copy[index],
                [field]: value,
            };

            return copy;
        });
    };

    const updatePilihan = (
        soalIndex,
        option,
        value
    ) => {
        setSoalList((prev) => {
            const copy = [...prev];

            copy[soalIndex] = {
                ...copy[soalIndex],

                pilihan: {
                    ...copy[soalIndex].pilihan,
                    [option]: value,
                },
            };

            return copy;
        });
    };

    // =====================================================
    // HANDLE GAMBAR SOAL TAMBAH
    // =====================================================

    const handleQuestionImageChange = (
        index,
        file
    ) => {
        if (!file) return;

        setSoalList((prev) => {
            const copy = [...prev];

            copy[index] = {
                ...copy[index],

                gambar_pertanyaan: file,

                hapus_gambar_pertanyaan: false,
            };

            return copy;
        });
    };

    const handleOptionImageChange = (
        soalIndex,
        option,
        file
    ) => {
        if (!file) return;

        setSoalList((prev) => {
            const copy = [...prev];

            copy[soalIndex] = {
                ...copy[soalIndex],

                gambar_pilihan: {
                    ...copy[soalIndex].gambar_pilihan,
                    [option]: file,
                },

                hapus_gambar_pilihan: {
                    ...copy[soalIndex]
                        .hapus_gambar_pilihan,
                    [option]: false,
                },
            };

            return copy;
        });
    };

    // =====================================================
    // HAPUS GAMBAR SOAL TAMBAH
    // =====================================================

    const removeQuestionImage = (index) => {
        setSoalList((prev) => {
            const copy = [...prev];

            copy[index] = {
                ...copy[index],
                gambar_pertanyaan: null,
            };

            return copy;
        });
    };

    const removeOptionImage = (
        soalIndex,
        option
    ) => {
        setSoalList((prev) => {
            const copy = [...prev];

            copy[soalIndex] = {
                ...copy[soalIndex],

                gambar_pilihan: {
                    ...copy[soalIndex].gambar_pilihan,
                    [option]: null,
                },
            };

            return copy;
        });
    };

    // =====================================================
    // TAMBAH SOAL
    // =====================================================

    const tambahSoal = () => {
        setSoalList((prev) => [
            ...prev,
            emptySoal(),
        ]);
    };

    // =====================================================
    // HAPUS SOAL
    // =====================================================

    const hapusSoal = (index) => {
        if (soalList.length <= 5) {
            alert(
                "Minimal harus terdapat 5 soal."
            );
            return;
        }

        setSoalList((prev) =>
            prev.filter(
                (_, i) => i !== index
            )
        );
    };

    // =====================================================
    // VALIDASI SOAL
    // =====================================================

    const validateSoal = (soalListData) => {
        for (
            let index = 0;
            index < soalListData.length;
            index++
        ) {
            const soal = soalListData[index];

            const hasQuestionText =
                soal.pertanyaan?.trim() !== "";

            const hasQuestionImage =
                soal.gambar_pertanyaan instanceof File ||
                !!soal.gambar_pertanyaan_path;

            if (
                !hasQuestionText &&
                !hasQuestionImage
            ) {
                alert(
                    `Soal nomor ${
                        index + 1
                    }: pertanyaan harus diisi atau diberikan gambar.`
                );

                return false;
            }

            for (
                const option of [
                    "A",
                    "B",
                    "C",
                    "D",
                ]
            ) {
                const hasText =
                    soal.pilihan?.[option]
                        ?.trim() !== "";

                const hasImage =
                    soal.gambar_pilihan?.[
                        option
                    ] instanceof File ||
                    !!soal.gambar_pilihan_path?.[
                        option
                    ];

                if (!hasText && !hasImage) {
                    alert(
                        `Soal nomor ${
                            index + 1
                        }: pilihan ${option} harus diisi atau diberikan gambar.`
                    );

                    return false;
                }
            }

            if (
                !["A", "B", "C", "D"].includes(
                    soal.jawaban
                )
            ) {
                alert(
                    `Soal nomor ${
                        index + 1
                    }: jawaban benar belum dipilih.`
                );

                return false;
            }
        }

        return true;
    };

    // =====================================================
    // FORM DATA
    // =====================================================

    const buildFormData = (
        formData,
        formDataSoal
    ) => {
        formData.append(
            "judul",
            formData.judul
        );

        formData.append(
            "deskripsi",
            formData.deskripsi || ""
        );

        formData.append(
            "status",
            formData.status
        );

        formDataSoal.forEach((soal, index) => {
            formData.append(
                `soal[${index}][pertanyaan]`,
                soal.pertanyaan || ""
            );

            formData.append(
                `soal[${index}][pilihan][A]`,
                soal.pilihan?.A || ""
            );

            formData.append(
                `soal[${index}][pilihan][B]`,
                soal.pilihan?.B || ""
            );

            formData.append(
                `soal[${index}][pilihan][C]`,
                soal.pilihan?.C || ""
            );

            formData.append(
                `soal[${index}][pilihan][D]`,
                soal.pilihan?.D || ""
            );

            formData.append(
                `soal[${index}][jawaban]`,
                soal.jawaban
            );

            // Gambar pertanyaan
            if (
                soal.gambar_pertanyaan instanceof File
            ) {
                formData.append(
                    `soal[${index}][gambar_pertanyaan]`,
                    soal.gambar_pertanyaan
                );
            }

            // Gambar pilihan
            ["A", "B", "C", "D"].forEach(
                (option) => {
                    const file =
                        soal.gambar_pilihan?.[
                            option
                        ];

                    if (file instanceof File) {
                        formData.append(
                            `soal[${index}][gambar_pilihan][${option}]`,
                            file
                        );
                    }
                }
            );
        });
    };

    // =====================================================
    // TAMBAH KUIS
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.judul.trim()) {
            alert("Judul kuis harus diisi.");
            return;
        }

        if (!validateSoal(soalList)) {
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            buildFormData(
                formData,
                soalList
            );

            await axios.post(
                `${API_URL}/kuis`,
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            alert(
                "Kuis berhasil ditambahkan."
            );

            closeTambahModal();

            await fetchKuis();
        } catch (error) {
            console.error(
                "Gagal menambahkan kuis:",
                error
            );

            const errors =
                error.response?.data?.errors;

            if (errors) {
                const firstError =
                    Object.values(errors)
                        .flat()[0];

                alert(firstError);
            } else {
                alert(
                    error.response?.data
                        ?.message ||
                        "Gagal menambahkan kuis."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // BUKA EDIT
    // =====================================================

    const openEditModal = (kuis) => {
        setSelectedKuis(kuis);

        setEditForm({
            id_kuis: kuis.id_kuis,

            judul: kuis.judul || "",

            deskripsi:
                kuis.deskripsi || "",

            status:
                kuis.status || "aktif",
        });

        const soal =
            kuis.detailKuis?.map(
                (detail) => ({
                    id_detail_kuis:
                        detail.id_detail_kuis,

                    pertanyaan:
                        detail.pertanyaan ||
                        "",

                    gambar_pertanyaan:
                        null,

                    gambar_pertanyaan_path:
                        detail.gambar_pertanyaan_path ||
                        detail.gambar_pertanyaan ||
                        null,

                    hapus_gambar_pertanyaan:
                        false,

                    pilihan: {
                        A:
                            detail.pilihan_a ||
                            "",

                        B:
                            detail.pilihan_b ||
                            "",

                        C:
                            detail.pilihan_c ||
                            "",

                        D:
                            detail.pilihan_d ||
                            "",
                    },

                    gambar_pilihan: {
                        A: null,
                        B: null,
                        C: null,
                        D: null,
                    },

                    gambar_pilihan_path: {
                        A:
                            detail.gambar_pilihan_a_path ||
                            detail.gambar_pilihan_a ||
                            null,

                        B:
                            detail.gambar_pilihan_b_path ||
                            detail.gambar_pilihan_b ||
                            null,

                        C:
                            detail.gambar_pilihan_c_path ||
                            detail.gambar_pilihan_c ||
                            null,

                        D:
                            detail.gambar_pilihan_d_path ||
                            detail.gambar_pilihan_d ||
                            null,
                    },

                    hapus_gambar_pilihan: {
                        A: false,
                        B: false,
                        C: false,
                        D: false,
                    },

                    jawaban:
                        detail.jawaban || "A",
                })
            ) || [];

        setEditSoalList(soal);

        setShowEditModal(true);
    };

    // =====================================================
    // UPDATE SOAL EDIT
    // =====================================================

    const updateEditSoal = (
        index,
        field,
        value
    ) => {
        setEditSoalList((prev) => {
            const copy = [...prev];

            copy[index] = {
                ...copy[index],
                [field]: value,
            };

            return copy;
        });
    };

    const updateEditPilihan = (
        soalIndex,
        option,
        value
    ) => {
        setEditSoalList((prev) => {
            const copy = [...prev];

            copy[soalIndex] = {
                ...copy[soalIndex],

                pilihan: {
                    ...copy[soalIndex].pilihan,
                    [option]: value,
                },
            };

            return copy;
        });
    };

    // =====================================================
    // GAMBAR EDIT
    // =====================================================

    const handleEditQuestionImageChange = (
        index,
        file
    ) => {
        if (!file) return;

        setEditSoalList((prev) => {
            const copy = [...prev];

            copy[index] = {
                ...copy[index],

                gambar_pertanyaan: file,

                hapus_gambar_pertanyaan:
                    false,
            };

            return copy;
        });
    };

    const handleEditOptionImageChange = (
        soalIndex,
        option,
        file
    ) => {
        if (!file) return;

        setEditSoalList((prev) => {
            const copy = [...prev];

            copy[soalIndex] = {
                ...copy[soalIndex],

                gambar_pilihan: {
                    ...copy[soalIndex]
                        .gambar_pilihan,
                    [option]: file,
                },

                hapus_gambar_pilihan: {
                    ...copy[soalIndex]
                        .hapus_gambar_pilihan,

                    [option]: false,
                },
            };

            return copy;
        });
    };

    // =====================================================
    // HAPUS GAMBAR EDIT
    // =====================================================

    const removeEditQuestionImage = (
        index
    ) => {
        setEditSoalList((prev) => {
            const copy = [...prev];

            copy[index] = {
                ...copy[index],

                gambar_pertanyaan: null,

                gambar_pertanyaan_path:
                    null,

                hapus_gambar_pertanyaan:
                    true,
            };

            return copy;
        });
    };

    const removeEditOptionImage = (
        soalIndex,
        option
    ) => {
        setEditSoalList((prev) => {
            const copy = [...prev];

            copy[soalIndex] = {
                ...copy[soalIndex],

                gambar_pilihan: {
                    ...copy[soalIndex]
                        .gambar_pilihan,
                    [option]: null,
                },

                gambar_pilihan_path: {
                    ...copy[soalIndex]
                        .gambar_pilihan_path,

                    [option]: null,
                },

                hapus_gambar_pilihan: {
                    ...copy[soalIndex]
                        .hapus_gambar_pilihan,

                    [option]: true,
                },
            };

            return copy;
        });
    };

    // =====================================================
    // TAMBAH SOAL SAAT EDIT
    // =====================================================

    const tambahEditSoal = () => {
        setEditSoalList((prev) => [
            ...prev,
            emptySoal(),
        ]);
    };

    // =====================================================
    // HAPUS SOAL SAAT EDIT
    // =====================================================

    const hapusEditSoal = (index) => {
        if (editSoalList.length <= 5) {
            alert(
                "Minimal harus terdapat 5 soal."
            );
            return;
        }

        setEditSoalList((prev) =>
            prev.filter(
                (_, i) => i !== index
            )
        );
    };

    // =====================================================
    // UPDATE KUIS
    // =====================================================

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!editForm.judul.trim()) {
            alert("Judul kuis harus diisi.");
            return;
        }

        if (
            !validateSoal(editSoalList)
        ) {
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append(
                "judul",
                editForm.judul
            );

            formData.append(
                "deskripsi",
                editForm.deskripsi || ""
            );

            formData.append(
                "status",
                editForm.status
            );

            editSoalList.forEach(
                (soal, index) => {
                    if (
                        soal.id_detail_kuis
                    ) {
                        formData.append(
                            `soal[${index}][id_detail_kuis]`,
                            soal.id_detail_kuis
                        );
                    }

                    formData.append(
                        `soal[${index}][pertanyaan]`,
                        soal.pertanyaan ||
                            ""
                    );

                    formData.append(
                        `soal[${index}][pilihan][A]`,
                        soal.pilihan
                            ?.A || ""
                    );

                    formData.append(
                        `soal[${index}][pilihan][B]`,
                        soal.pilihan
                            ?.B || ""
                    );

                    formData.append(
                        `soal[${index}][pilihan][C]`,
                        soal.pilihan
                            ?.C || ""
                    );

                    formData.append(
                        `soal[${index}][pilihan][D]`,
                        soal.pilihan
                            ?.D || ""
                    );

                    formData.append(
                        `soal[${index}][jawaban]`,
                        soal.jawaban
                    );

                    // =================================
                    // HAPUS GAMBAR PERTANYAAN
                    // =================================

                    if (
                        soal.hapus_gambar_pertanyaan
                    ) {
                        formData.append(
                            `soal[${index}][hapus_gambar_pertanyaan]`,
                            "1"
                        );
                    }

                    // =================================
                    // GAMBAR PERTANYAAN BARU
                    // =================================

                    if (
                        soal.gambar_pertanyaan instanceof
                        File
                    ) {
                        formData.append(
                            `soal[${index}][gambar_pertanyaan]`,
                            soal.gambar_pertanyaan
                        );
                    }

                    // =================================
                    // GAMBAR PILIHAN
                    // =================================

                    ["A", "B", "C", "D"].forEach(
                        (option) => {
                            const file =
                                soal
                                    .gambar_pilihan?.[
                                    option
                                ];

                            const hapus =
                                soal
                                    .hapus_gambar_pilihan?.[
                                    option
                                ];

                            if (hapus) {
                                formData.append(
                                    `soal[${index}][hapus_gambar_pilihan][${option}]`,
                                    "1"
                                );
                            }

                            if (
                                file instanceof
                                File
                            ) {
                                formData.append(
                                    `soal[${index}][gambar_pilihan][${option}]`,
                                    file
                                );
                            }
                        }
                    );
                }
            );

            // Laravel menerima PUT + multipart
            // lebih aman menggunakan _method POST
            formData.append(
                "_method",
                "PUT"
            );

            await axios.post(
                `${API_URL}/kuis/${editForm.id_kuis}`,
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            alert(
                "Kuis berhasil diperbarui."
            );

            closeEditModal();

            await fetchKuis();
        } catch (error) {
            console.error(
                "Gagal memperbarui kuis:",
                error
            );

            const errors =
                error.response?.data?.errors;

            if (errors) {
                const firstError =
                    Object.values(errors)
                        .flat()[0];

                alert(firstError);
            } else {
                alert(
                    error.response?.data
                        ?.message ||
                        "Gagal memperbarui kuis."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // DELETE KUIS
    // =====================================================

    const handleDelete = async (id) => {
        const yakin = window.confirm(
            "Apakah Anda yakin ingin menghapus kuis ini?"
        );

        if (!yakin) return;

        try {
            setLoading(true);

            await axios.delete(
                `${API_URL}/kuis/${id}`
            );

            alert(
                "Kuis berhasil dihapus."
            );

            await fetchKuis();
        } catch (error) {
            console.error(
                "Gagal menghapus kuis:",
                error
            );

            alert(
                error.response?.data
                    ?.message ||
                    "Gagal menghapus kuis."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // PENGATURAN JUMLAH SOAL
    // =====================================================

    const openPengaturan = (kuis) => {
        setSelectedKuis(kuis);

        setEditJumlahSoal(
            kuis.total_soal || 10
        );

        setJumlahSoal(
            kuis.total_soal || 10
        );

        setShowPengaturan(true);
    };

    const saveJumlahSoal = async () => {
        if (!selectedKuis) return;

        const total =
            selectedKuis.detailKuis
                ?.length || 0;

        if (
            editJumlahSoal < 1 ||
            editJumlahSoal > total
        ) {
            alert(
                `Jumlah soal harus antara 1 sampai ${total}.`
            );

            return;
        }

        try {
            setLoading(true);

            const response =
                await axios.put(
                    `${API_URL}/kuis/${selectedKuis.id_kuis}/jumlah-soal`,
                    {
                        jml_soal:
                            Number(
                                editJumlahSoal
                            ),
                    }
                );

            setJumlahSoal(
                response.data.jml_soal
            );

            alert(
                "Jumlah soal berhasil diperbarui."
            );

            setShowPengaturan(false);

            await fetchKuis();
        } catch (error) {
            console.error(
                "Gagal mengatur jumlah soal:",
                error
            );

            alert(
                error.response?.data
                    ?.message ||
                    "Gagal mengatur jumlah soal."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // DETAIL KUIS
    // =====================================================

    const openDetail = (kuis) => {
        setSelectedKuis(kuis);

        setShowDetailModal(true);
    };

    // =====================================================
    // RESET / CLOSE
    // =====================================================

    const closeTambahModal = () => {
        setShowModal(false);

        setForm({
            judul: "",
            deskripsi: "",
            status: "aktif",
        });

        setSoalList(
            createDefaultSoal()
        );
    };

    const closeEditModal = () => {
        setShowEditModal(false);

        setSelectedKuis(null);

        setEditForm({
            id_kuis: null,
            judul: "",
            deskripsi: "",
            status: "aktif",
        });

        setEditSoalList([]);
    };

    // =====================================================
    // KOMPONEN PREVIEW GAMBAR
    // =====================================================

    const ImagePreview = ({
        file,
        path,
        onRemove,
    }) => {
        let src = null;

        if (file instanceof File) {
            src =
                URL.createObjectURL(file);
        } else if (path) {
            src = getImageUrl(path);
        }

        if (!src) {
            return null;
        }

        return (
            <div className="relative mt-2 inline-block">
                <img
                    src={src}
                    alt="Preview"
                    className="w-32 h-24 object-contain border rounded-lg bg-gray-50"
                />

                {onRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>
        );
    };

    // =====================================================
    // INPUT GAMBAR
    // =====================================================

    const ImageUpload = ({
        label,
        file,
        path,
        onChange,
        onRemove,
    }) => {
        return (
            <div className="mt-2">
                <label className="flex items-center gap-2 cursor-pointer w-fit px-3 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                    <Upload size={16} />

                    {label}
                    
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="hidden"
                        onChange={(e) =>
                            onChange(
                                e.target.files?.[0] ||
                                    null
                            )
                        }
                    />
                </label>

                <ImagePreview
                    file={file}
                    path={path}
                    onRemove={onRemove}
                />
            </div>
        );
    };

    // =====================================================
    // RENDER FORM SOAL
    // =====================================================

    const renderSoalForm = (
        soal,
        index,
        isEdit = false
    ) => {
        const update =
            isEdit
                ? updateEditSoal
                : updateSoal;

        const updateOption =
            isEdit
                ? updateEditPilihan
                : updatePilihan;

        const questionImageChange =
            isEdit
                ? handleEditQuestionImageChange
                : handleQuestionImageChange;

        const optionImageChange =
            isEdit
                ? handleEditOptionImageChange
                : handleOptionImageChange;

        const removeQuestion =
            isEdit
                ? removeEditQuestionImage
                : removeQuestionImage;

        const removeOption =
            isEdit
                ? removeEditOptionImage
                : removeOptionImage;

        const currentQuestionFile =
            soal.gambar_pertanyaan;

        const currentQuestionPath =
            soal.gambar_pertanyaan_path;

        return (
            <div
                key={
                    soal.id_detail_kuis ||
                    `new-${index}`
                }
                className="border rounded-xl p-5 mb-5 bg-white shadow-sm"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">
                        Soal {index + 1}
                    </h3>

                    <button
                        type="button"
                        onClick={() =>
                            isEdit
                                ? hapusEditSoal(
                                      index
                                  )
                                : hapusSoal(
                                      index
                                  )
                        }
                        className="text-red-500 hover:text-red-700"
                        title="Hapus soal"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

                {/* ===================================== */}
                {/* PERTANYAAN */}
                {/* ===================================== */}

                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pertanyaan
                    </label>

                    <textarea
                        value={
                            soal.pertanyaan ||
                            ""
                        }
                        onChange={(e) =>
                            update(
                                index,
                                "pertanyaan",
                                e.target.value
                            )
                        }
                        rows={3}
                        placeholder="Tulis pertanyaan atau gunakan gambar saja..."
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <ImageUpload
                        label="Tambah gambar pertanyaan"
                        file={
                            currentQuestionFile
                        }
                        path={
                            currentQuestionPath
                        }
                        onChange={(file) =>
                            questionImageChange(
                                index,
                                file
                            )
                        }
                        onRemove={() =>
                            removeQuestion(
                                index
                            )
                        }
                    />

                    <p className="text-xs text-gray-500 mt-1">
                        Pertanyaan boleh berupa teks saja,
                        gambar saja, atau teks + gambar.
                    </p>
                </div>

                {/* ===================================== */}
                {/* PILIHAN */}
                {/* ===================================== */}

                <div className="space-y-5">
                    {[
                        "A",
                        "B",
                        "C",
                        "D",
                    ].map((option) => {
                        const file =
                            soal.gambar_pilihan?.[
                                option
                            ];

                        const path =
                            soal.gambar_pilihan_path?.[
                                option
                            ];

                        return (
                            <div
                                key={option}
                                className="border rounded-lg p-4 bg-gray-50"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-semibold text-gray-700">
                                        Pilihan{" "}
                                        {option}
                                    </span>

                                    <label className="flex items-center gap-1 text-sm text-green-600 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`jawaban-${
                                                isEdit
                                                    ? "edit"
                                                    : "tambah"
                                            }-${index}`}
                                            checked={
                                                soal.jawaban ===
                                                option
                                            }
                                            onChange={() =>
                                                update(
                                                    index,
                                                    "jawaban",
                                                    option
                                                )
                                            }
                                        />

                                        Jawaban benar
                                    </label>
                                </div>

                                <input
                                    type="text"
                                    value={
                                        soal
                                            .pilihan?.[
                                            option
                                        ] || ""
                                    }
                                    onChange={(e) =>
                                        updateOption(
                                            index,
                                            option,
                                            e.target
                                                .value
                                        )
                                    }
                                    placeholder={`Teks pilihan ${option} (boleh kosong jika menggunakan gambar)`}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <ImageUpload
                                    label={`Tambah gambar pilihan ${option}`}
                                    file={file}
                                    path={path}
                                    onChange={(file) =>
                                        optionImageChange(
                                            index,
                                            option,
                                            file
                                        )
                                    }
                                    onRemove={() =>
                                        removeOption(
                                            index,
                                            option
                                        )
                                    }
                                />

                                <p className="text-xs text-gray-500 mt-1">
                                    Pilihan boleh berupa teks saja,
                                    gambar saja, atau teks + gambar.
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="p-6">

            {/* ========================================= */}
            {/* HEADER */}
            {/* ========================================= */}

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Kuis
                    </h1>

                    <p className="text-gray-500 text-sm mt-1">
                        Kelola kuis dan soal pembelajaran.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setShowModal(true)
                    }
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus size={18} />

                    Tambah Kuis
                </button>
            </div>

            {/* ========================================= */}
            {/* TABLE */}
            {/* ========================================= */}

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                                    No
                                </th>

                                <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                                    Judul
                                </th>

                                <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                                    Jumlah Soal
                                </th>

                                <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                                    Status
                                </th>

                                <th className="px-5 py-3 text-center text-sm font-semibold text-gray-600">
                                    Aksi
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading &&
                            dataKuis.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-8 text-gray-500"
                                    >
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : dataKuis.length ===
                              0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-8 text-gray-500"
                                    >
                                        Belum ada kuis.
                                    </td>
                                </tr>
                            ) : (
                                dataKuis.map(
                                    (
                                        kuis,
                                        index
                                    ) => (
                                        <tr
                                            key={
                                                kuis.id_kuis
                                            }
                                            className="border-t hover:bg-gray-50"
                                        >
                                            <td className="px-5 py-4">
                                                {index +
                                                    1}
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="font-medium text-gray-800">
                                                    {
                                                        kuis.judul
                                                    }
                                                </div>

                                                {kuis.deskripsi && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {
                                                            kuis.deskripsi
                                                        }
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                {kuis.detailKuis
                                                    ?.length ||
                                                    0}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                        kuis.status ===
                                                        "aktif"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    {
                                                        kuis.status
                                                    }
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex justify-center items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openDetail(
                                                                kuis
                                                            )
                                                        }
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                        title="Detail"
                                                    >
                                                        <Eye
                                                            size={
                                                                18
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openPengaturan(
                                                                kuis
                                                            )
                                                        }
                                                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                                                        title="Pengaturan jumlah soal"
                                                    >
                                                        <Settings
                                                            size={
                                                                18
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditModal(
                                                                kuis
                                                            )
                                                        }
                                                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                                                        title="Edit"
                                                    >
                                                        <Pencil
                                                            size={
                                                                18
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                kuis.id_kuis
                                                            )
                                                        }
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                        title="Hapus"
                                                    >
                                                        <Trash2
                                                            size={
                                                                18
                                                            }
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ========================================= */}
            {/* MODAL TAMBAH */}
            {/* ========================================= */}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-5xl max-h-[95vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold">
                                Tambah Kuis
                            </h2>

                            <button
                                type="button"
                                onClick={
                                    closeTambahModal
                                }
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X />
                            </button>
                        </div>

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="p-6"
                        >
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
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
                                        className="w-full border rounded-lg px-3 py-2"
                                        placeholder="Masukkan judul kuis"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
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
                                        className="w-full border rounded-lg px-3 py-2"
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

                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">
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
                                    rows={3}
                                    className="w-full border rounded-lg px-3 py-2"
                                    placeholder="Deskripsi kuis (opsional)"
                                />
                            </div>

                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">
                                    Daftar Soal
                                </h3>

                                <button
                                    type="button"
                                    onClick={
                                        tambahSoal
                                    }
                                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    <Plus
                                        size={
                                            16
                                        }
                                    />

                                    Tambah Soal
                                </button>
                            </div>

                            {soalList.map(
                                (soal, index) =>
                                    renderSoalForm(
                                        soal,
                                        index,
                                        false
                                    )
                            )}

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={
                                        closeTambahModal
                                    }
                                    className="px-5 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        loading
                                    }
                                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading
                                        ? "Menyimpan..."
                                        : "Simpan Kuis"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================= */}
            {/* MODAL EDIT */}
            {/* ========================================= */}

            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-5xl max-h-[95vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold">
                                Edit Kuis
                            </h2>

                            <button
                                type="button"
                                onClick={
                                    closeEditModal
                                }
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X />
                            </button>
                        </div>

                        <form
                            onSubmit={
                                handleUpdate
                            }
                            className="p-6"
                        >
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Judul Kuis
                                    </label>

                                    <input
                                        type="text"
                                        name="judul"
                                        value={
                                            editForm.judul
                                        }
                                        onChange={
                                            handleEditFormChange
                                        }
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={
                                            editForm.status
                                        }
                                        onChange={
                                            handleEditFormChange
                                        }
                                        className="w-full border rounded-lg px-3 py-2"
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

                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">
                                    Deskripsi
                                </label>

                                <textarea
                                    name="deskripsi"
                                    value={
                                        editForm.deskripsi
                                    }
                                    onChange={
                                        handleEditFormChange
                                    }
                                    rows={3}
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>

                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">
                                    Daftar Soal
                                </h3>

                                <button
                                    type="button"
                                    onClick={
                                        tambahEditSoal
                                    }
                                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    <Plus
                                        size={
                                            16
                                        }
                                    />

                                    Tambah Soal
                                </button>
                            </div>

                            {editSoalList.map(
                                (soal, index) =>
                                    renderSoalForm(
                                        soal,
                                        index,
                                        true
                                    )
                            )}

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={
                                        closeEditModal
                                    }
                                    className="px-5 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        loading
                                    }
                                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading
                                        ? "Menyimpan..."
                                        : "Simpan Perubahan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================= */}
            {/* MODAL DETAIL */}
            {/* ========================================= */}

            {showDetailModal &&
                selectedKuis && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold">
                                        {
                                            selectedKuis.judul
                                        }
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        {selectedKuis
                                            .detailKuis
                                            ?.length ||
                                            0}{" "}
                                        soal
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowDetailModal(
                                            false
                                        )
                                    }
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {selectedKuis.detailKuis?.map(
                                    (
                                        soal,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                soal.id_detail_kuis
                                            }
                                            className="border rounded-xl p-5"
                                        >
                                            <div className="font-semibold mb-3">
                                                Soal{" "}
                                                {index +
                                                    1}
                                            </div>

                                            {soal.pertanyaan && (
                                                <p className="mb-3">
                                                    {
                                                        soal.pertanyaan
                                                    }
                                                </p>
                                            )}

                                            {soal.gambar_pertanyaan && (
                                                <img
                                                    src={getImageUrl(
                                                        soal.gambar_pertanyaan
                                                    )}
                                                    alt="Pertanyaan"
                                                    className="max-w-sm max-h-60 object-contain rounded-lg border mb-4"
                                                />
                                            )}

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
                                                                className={`border rounded-lg p-3 ${
                                                                    soal.jawaban ===
                                                                    option
                                                                        ? "border-green-500 bg-green-50"
                                                                        : ""
                                                                }`}
                                                            >
                                                                <div className="font-semibold mb-2">
                                                                    {
                                                                        option
                                                                    }
                                                                    .
                                                                </div>

                                                                {text && (
                                                                    <div className="mb-2">
                                                                        {
                                                                            text
                                                                        }
                                                                    </div>
                                                                )}

                                                                {image && (
                                                                    <img
                                                                        src={getImageUrl(
                                                                            image
                                                                        )}
                                                                        alt={`Pilihan ${option}`}
                                                                        className="max-w-full h-32 object-contain rounded-lg border"
                                                                    />
                                                                )}

                                                                {soal.jawaban ===
                                                                    option && (
                                                                    <div className="text-xs text-green-600 font-semibold mt-2">
                                                                        Jawaban benar
                                                                    </div>
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
                )}

            {/* ========================================= */}
            {/* MODAL PENGATURAN JUMLAH SOAL */}
            {/* ========================================= */}

            {showPengaturan &&
                selectedKuis && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl w-full max-w-md">
                            <div className="px-6 py-4 border-b flex justify-between items-center">
                                <h2 className="text-lg font-bold">
                                    Pengaturan Jumlah Soal
                                </h2>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPengaturan(
                                            false
                                        )
                                    }
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X />
                                </button>
                            </div>

                            <div className="p-6">
                                <p className="text-sm text-gray-600 mb-4">
                                    Kuis{" "}
                                    <strong>
                                        {
                                            selectedKuis.judul
                                        }
                                    </strong>{" "}
                                    memiliki{" "}
                                    <strong>
                                        {selectedKuis
                                            .detailKuis
                                            ?.length ||
                                            0}
                                    </strong>{" "}
                                    soal.
                                </p>

                                <label className="block text-sm font-medium mb-2">
                                    Jumlah soal yang diberikan kepada siswa
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    max={
                                        selectedKuis
                                            .detailKuis
                                            ?.length ||
                                        1
                                    }
                                    value={
                                        editJumlahSoal
                                    }
                                    onChange={(e) =>
                                        setEditJumlahSoal(
                                            Number(
                                                e
                                                    .target
                                                    .value
                                            )
                                        )
                                    }
                                    className="w-full border rounded-lg px-3 py-2"
                                />

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPengaturan(
                                                false
                                            )
                                        }
                                        className="px-4 py-2 border rounded-lg"
                                    >
                                        Batal
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            saveJumlahSoal
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        {loading
                                            ? "Menyimpan..."
                                            : "Simpan"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
}
