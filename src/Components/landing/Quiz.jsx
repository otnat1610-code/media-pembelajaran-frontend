import axiosInstance from "../../config/axios";
import { useState, useEffect, useRef } from "react";
import { Trophy, Clock } from "lucide-react";

const letters = ["A", "B", "C", "D"];

export default function QuizSection() {
  // =========================
  // STATE SISWA
  // =========================
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  const [nis, setNis] = useState("");
  const [nama, setNama] = useState("");

  // =========================
  // STATE SOAL
  // =========================
  const [questions, setQuestions] = useState([]);

  // =========================
  // STATE UI
  // =========================
  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // =========================
  // STATE KUIS
  // =========================
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [nilaiAkhir, setNilaiAkhir] = useState(0);

  // =========================
  // STATE LIST KUIS
  // =========================
  const [quizList, setQuizList] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [showQuizSelection, setShowQuizSelection] =
    useState(false);

  const [judulKuis, setJudulKuis] = useState("");

  // =========================
  // STATE TIMER
  // =========================
  const [durasiMenit, setDurasiMenit] = useState(0);
  const [waktuTersisa, setWaktuTersisa] = useState(0);

  const timerRef = useRef(null);

  // =========================
  // REF UNTUK MENCEGAH
  // DOUBLE SUBMIT
  // =========================
  const submitLockRef = useRef(false);

  // =========================
  // CURRENT QUESTION
  // =========================
  const current = questions[idx] || {};

  // =========================
  // GET DATA
  // =========================
  useEffect(() => {
    fetchStudents();
    fetchQuizList();
  }, []);

  // =========================
  // CLEANUP TIMER
  // =========================
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // =====================================================
  // FORMAT WAKTU
  // =====================================================
  function formatTime(totalSeconds) {
    const safeSeconds = Math.max(
      0,
      Number(totalSeconds) || 0
    );

    const minutes = Math.floor(
      safeSeconds / 60
    );

    const seconds =
      safeSeconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  // =====================================================
  // STOP TIMER
  // =====================================================
  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  // =========================
  // FETCH SISWA
  // =========================
  async function fetchStudents() {
    try {
      const res =
        await axiosInstance.get("/siswa");

      console.log("DEBUG SISWA:");
      console.log(res.data);

      setStudents(res.data);
    } catch (error) {
      console.log(
        "ERROR FETCH SISWA:",
        error
      );
    }
  }

  // =========================
  // FETCH LIST KUIS
  // =========================
  async function fetchQuizList() {
    try {
      const response =
        await axiosInstance.get(
          "/kuis/list"
        );

      const data =
        Array.isArray(response.data)
          ? response.data
          : [];

      console.log(
        "LIST KUIS:",
        data
      );

      setQuizList(data);

      if (data.length === 0) {
        setSelectedQuiz("");
        setShowQuizSelection(false);
      } else if (data.length === 1) {
        setSelectedQuiz(
          data[0].id_kuis
        );
        setShowQuizSelection(false);
      } else {
        setSelectedQuiz("");
        setShowQuizSelection(true);
      }
    } catch (error) {
      console.log(
        "ERROR FETCH LIST KUIS:",
        error
      );
    }
  }

  // =========================
  // FETCH SOAL
  // =========================
  async function fetchQuestions(idKuis) {
    try {
      setLoading(true);
      setError("");

      const response =
        await axiosInstance.get(
          `/kuis/${idKuis}/soal`
        );

      console.log(
        "================================="
      );

      console.log(
        "DATA SOAL DARI BACKEND:"
      );

      console.log(
        response.data
      );

      console.log(
        "================================="
      );

      setQuestions(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.log(
        "ERROR FETCH SOAL:",
        error
      );

      setError(
        "Gagal mengambil soal kuis."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // TOTAL POIN
  // =========================
  const totalPoin =
    questions.reduce(
      (sum, item) =>
        sum +
        Number(item.poin || 0),
      0
    );

  // =========================
  // PROGRESS
  // =========================
  const progress =
    questions.length > 0
      ? (
          (idx +
            (done ? 1 : 0)) /
          questions.length
        ) * 100
      : 0;

  // =====================================================
  // START TIMER
  // =====================================================
  function startTimer(durasi) {
    stopTimer();

    const durasiDalamMenit =
      Number(durasi) || 0;

    if (durasiDalamMenit <= 0) {
      setDurasiMenit(0);
      setWaktuTersisa(0);
      return;
    }

    const totalSeconds =
      Math.floor(
        durasiDalamMenit * 60
      );

    setDurasiMenit(
      durasiDalamMenit
    );

    setWaktuTersisa(
      totalSeconds
    );

    timerRef.current =
      setInterval(() => {
        setWaktuTersisa(
          (prev) => {
            if (prev <= 1) {
              clearInterval(
                timerRef.current
              );

              timerRef.current =
                null;

              return 0;
            }

            return prev - 1;
          }
        );
      }, 1000);
  }

  // =====================================================
  // OTOMATIS SUBMIT KETIKA
  // WAKTU HABIS
  // =====================================================
  useEffect(() => {
    if (
      !started ||
      done ||
      loading ||
      questions.length === 0
    ) {
      return;
    }

    if (
      durasiMenit > 0 &&
      waktuTersisa === 0
    ) {
      handleTimeUp();
    }
  }, [
    waktuTersisa,
    started,
    done,
    loading,
    questions.length,
    durasiMenit,
  ]);

  // =====================================================
  // SUBMIT KUIS
  // =====================================================
  async function submitQuiz(finalAnswers) {
    if (submitLockRef.current) {
      return;
    }

    submitLockRef.current = true;

    setSubmitting(true);

    stopTimer();

    try {
      const siswa =
        students.find(
          (item) =>
            item.nis ===
            selectedStudent
        );

      if (!siswa) {
        alert(
          "Data siswa tidak ditemukan."
        );

        submitLockRef.current = false;
        setSubmitting(false);

        return;
      }

      console.log(
        "DATA YANG DIKIRIM:",
        {
          id_siswa:
            siswa.id_siswa,

          id_kuis:
            selectedQuiz,

          jawaban:
            finalAnswers,
        }
      );

      const response =
        await axiosInstance.post(
          "/kuis/submit",
          {
            id_siswa:
              siswa.id_siswa,

            id_kuis:
              selectedQuiz,

            jawaban:
              finalAnswers,
          }
        );

      console.log(
        "HASIL SUBMIT:",
        response.data
      );

      setNilaiAkhir(
        response.data.nilai
      );

      setDone(true);
    } catch (error) {
      console.log(
        "ERROR SUBMIT:",
        error
      );

      submitLockRef.current = false;

      alert(
        error.response?.data
          ?.message ||
          "Gagal menyimpan jawaban."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // =====================================================
  // WAKTU HABIS
  // =====================================================
  async function handleTimeUp() {
    if (
      done ||
      submitting ||
      submitLockRef.current
    ) {
      return;
    }

    stopTimer();

    /*
     * Jika siswa belum menjawab soal terakhir,
     * jawaban soal tersebut tidak ditambahkan.
     *
     * Backend tetap menghitung berdasarkan
     * jawaban yang sudah dikirim.
     */

    const finalAnswers = [
      ...answers,
    ];

    alert(
      "Waktu kuis telah habis. Jawaban akan dikumpulkan."
    );

    await submitQuiz(
      finalAnswers
    );
  }

  // =========================
  // START QUIZ
  // =========================
  async function startQuiz() {
    console.log(
      "selectedQuiz =",
      selectedQuiz
    );

    console.log(
      "quizList =",
      quizList
    );

    if (!selectedStudent) {
      setError(
        "Pilih siswa terlebih dahulu"
      );

      return;
    }

    if (
      quizList.length > 1 &&
      !selectedQuiz
    ) {
      setError(
        "Pilih kuis terlebih dahulu"
      );

      return;
    }

    const siswa =
      students.find(
        (item) =>
          item.nis ===
          selectedStudent
      );

    if (!siswa) {
      setError(
        "Siswa tidak ditemukan"
      );

      return;
    }

    // =========================
    // AMBIL KUIS
    // =========================
    const kuisDipilih =
      quizList.find(
        (item) =>
          item.id_kuis ==
          selectedQuiz
      );

    if (!kuisDipilih) {
      setError(
        "Kuis tidak ditemukan."
      );

      return;
    }

    console.log(
      "KUIS DIPILIH:",
      kuisDipilih
    );

    setJudulKuis(
      kuisDipilih.judul
    );

    // =========================
    // AMBIL DURASI
    // =========================
    const durasi =
      Number(
        kuisDipilih.durasi
      ) || 0;

    console.log(
      "DURASI KUIS:",
      durasi,
      "menit"
    );

    setNis(
      siswa.nis
    );

    setNama(
      siswa.nama
    );

    setAnswers([]);
    setCorrectAnswers(0);
    setIdx(0);
    setSelected(null);
    setDone(false);
    setNilaiAkhir(0);

    submitLockRef.current = false;

    await fetchQuestions(
      selectedQuiz
    );

    setError("");
    setStarted(true);

    // =========================
    // MULAI TIMER
    // =========================
    startTimer(durasi);
  }

  // =========================
  // NEXT QUESTION
  // =========================
  async function handleNext() {
    if (
      selected === null
    ) {
      return;
    }

    if (
      submitting ||
      submitLockRef.current
    ) {
      return;
    }

    // =========================
    // KONVERSI INDEX
    // KE HURUF
    // =========================
    const jawabanHuruf =
      letters[selected];

    console.log(
      "Jawaban dipilih:",
      jawabanHuruf
    );

    console.log(
      "Jawaban benar:",
      current.answer
    );

    // =========================
    // SIMPAN JAWABAN
    // =========================
    const newAnswers = [
      ...answers,
      {
        id_detail_kuis:
          current.id_detail_kuis,

        jawaban_siswa:
          jawabanHuruf,
      },
    ];

    setAnswers(
      newAnswers
    );

    // =========================
    // HITUNG BENAR
    // =========================
    let newCorrect =
      correctAnswers;

    if (
      jawabanHuruf ===
      current.answer
    ) {
      newCorrect +=
        Number(
          current.poin || 0
        );

      setCorrectAnswers(
        newCorrect
      );
    }

    setSelected(null);

    // =========================
    // SOAL BERIKUTNYA
    // =========================
    if (
      idx + 1 <
      questions.length
    ) {
      setIdx(
        idx + 1
      );

      return;
    }

    // =========================
    // SOAL TERAKHIR
    // =========================
    await submitQuiz(
      newAnswers
    );
  }

  // =========================
  // RESET
  // =========================
  function reset() {
    stopTimer();

    setIdx(0);
    setSelected(null);
    setCorrectAnswers(0);
    setDone(false);
    setStarted(false);
    setSubmitting(false);

    setAnswers([]);
    setQuestions([]);
    setNilaiAkhir(0);

    setSelectedStudent("");
    setSelectedQuiz("");

    setNis("");
    setNama("");
    setJudulKuis("");

    setDurasiMenit(0);
    setWaktuTersisa(0);

    setError("");

    submitLockRef.current = false;

    fetchQuizList();
  }

  // =========================
  // LOADING
  // =========================
  if (
    started &&
    loading
  ) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-semibold">
          Memuat soal...
        </p>
      </div>
    );
  }

  // =========================
  // SOAL KOSONG
  // =========================
  if (
    started &&
    !loading &&
    questions.length === 0
  ) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-500">
          Soal tidak ditemukan
        </p>
      </div>
    );
  }

  return (
    <section
      id="kuis"
      className="py-24 bg-brand-secondary/5"
    >
      <div className="max-w-4xl mx-auto px-6">

        {/* =========================
            HEADING
        ========================= */}
        <div className="text-center mb-10">
          <span className="inline-block text-brand-secondary font-bold text-sm uppercase tracking-widest mb-3">
            Kuis Interaktif
          </span>

          <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink">
            Siap Uji Pengetahuanmu?
          </h2>
        </div>

        {/* =========================
            CARD
        ========================= */}
        <div className="bg-card rounded-[32px] p-6 sm:p-12 shadow-xl border border-brand-secondary/10">

          {/* =================================================
              FORM PILIH SISWA
          ================================================= */}
          {!started ? (
            <div className="max-w-xl mx-auto">

              <h3 className="font-display text-2xl font-bold text-ink mb-6 text-center">
                Pilih Siswa
              </h3>

              <div className="space-y-5">

                {/* =========================
                    SISWA
                ========================= */}
                <div>
                  <label className="block text-sm font-bold text-ink mb-2">
                    Daftar Siswa
                  </label>

                  <div className="relative">
                    <select
                      value={
                        selectedStudent
                      }
                      onChange={(e) =>
                        setSelectedStudent(
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-4 rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                    >
                      <option value="">
                        Pilih Nama
                      </option>

                      {students.map(
                        (student) => (
                          <option
                            key={
                              student.id_siswa
                            }
                            value={
                              student.nis
                            }
                          >
                            {student.nis} -{" "}
                            {student.nama}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* KUIS KOSONG */}
                  {quizList.length ===
                    0 && (
                    <p className="text-red-500 text-sm mt-2">
                      Belum ada kuis yang aktif.
                    </p>
                  )}

                  {/* ERROR */}
                  {error && (
                    <p className="text-red-500 text-sm mt-2">
                      {error}
                    </p>
                  )}
                </div>

                {/* =========================
                    PILIH KUIS
                ========================= */}
                {showQuizSelection && (
                  <div>
                    <label className="block text-sm font-bold text-ink mb-2">
                      Pilih Kuis
                    </label>

                    <select
                      value={
                        selectedQuiz
                      }
                      onChange={(e) =>
                        setSelectedQuiz(
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-4 rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                    >
                      <option value="">
                        Pilih Kuis
                      </option>

                      {quizList.map(
                        (quiz) => (
                          <option
                            key={
                              quiz.id_kuis
                            }
                            value={
                              quiz.id_kuis
                            }
                          >
                            {quiz.judul}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                )}

                {/* =========================
                    INFO DURASI
                ========================= */}
                {selectedQuiz && (
                  <div className="flex items-center gap-3 rounded-2xl bg-brand-secondary/10 border border-brand-secondary/20 px-4 py-3">
                    <Clock className="w-5 h-5 text-brand-secondary shrink-0" />

                    <div>
                      <p className="text-xs font-semibold text-ink-soft">
                        Durasi Kuis
                      </p>

                      <p className="font-bold text-brand-secondary">
                        {Number(
                          quizList.find(
                            (quiz) =>
                              quiz.id_kuis ==
                              selectedQuiz
                          )?.durasi
                        ) || 0}{" "}
                        menit
                      </p>
                    </div>
                  </div>
                )}

                {/* =========================
                    BUTTON MULAI
                ========================= */}
                <button
                  onClick={
                    startQuiz
                  }
                  disabled={
                    !selectedStudent ||
                    loading ||
                    quizList.length ===
                      0 ||
                    (
                      quizList.length >
                        1 &&
                      !selectedQuiz
                    )
                  }
                  className="w-full bg-brand-secondary text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand-secondary/30 disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-transform"
                >
                  Mulai Kuis
                </button>
              </div>
            </div>

          ) : !done ? (

            <>
              {/* =========================
                  JUDUL KUIS
              ========================= */}
              <div className="mb-6 p-5 bg-brand-secondary/10 border border-brand-secondary/20 rounded-2xl text-center">

                <p className="text-sm font-semibold text-brand-secondary uppercase tracking-wide">
                  Kuis
                </p>

                <h3 className="text-xl sm:text-2xl font-bold text-ink mt-1">
                  {judulKuis}
                </h3>
              </div>

              {/* =========================
                  INFO SISWA + TIMER
              ========================= */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">

                <div>
                  <p className="font-bold text-ink text-lg">
                    {nama}
                  </p>

                  <p className="text-sm text-ink-soft">
                    NISN: {nis}
                  </p>
                </div>

                <div className="flex items-center gap-5">

                  {/* =========================
                      TIMER
                  ========================= */}
                  {durasiMenit > 0 && (
                    <div
                      className={`text-right ${
                        waktuTersisa <= 60
                          ? "text-red-600"
                          : "text-ink"
                      }`}
                    >
                      <div className="flex items-center justify-end gap-2 text-xs text-ink-soft mb-1">
                        <Clock className="w-4 h-4" />

                        <span>
                          Waktu
                        </span>
                      </div>

                      <div
                        className={`font-mono text-xl sm:text-2xl font-bold ${
                          waktuTersisa <= 60
                            ? "animate-pulse"
                            : ""
                        }`}
                      >
                        {formatTime(
                          waktuTersisa
                        )}
                      </div>
                    </div>
                  )}

                  {/* =========================
                      PROGRESS
                  ========================= */}
                  <div className="text-right shrink-0">

                    <div className="flex items-center justify-between gap-4 text-xs text-ink-soft mb-1">
                      <span>
                        Progress
                      </span>

                      <span>
                        {idx + 1}/
                        {questions.length}
                      </span>
                    </div>

                    <div className="w-28 sm:w-36 h-2 bg-muted rounded-full overflow-hidden">

                      <div
                        className="h-full bg-brand-accent rounded-full transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* =========================
                  QUESTION
              ========================= */}
              <div className="space-y-6">

                {/* =========================
                    PERTANYAAN
                ========================= */}
                <div className="p-5 sm:p-6 bg-bg-soft rounded-2xl">

                  <p className="text-sm font-bold text-brand-secondary mb-2">
                    Soal {idx + 1}
                  </p>

                  {/* TEKS PERTANYAAN */}
                  {current.q && (
                    <p className="text-base sm:text-lg font-medium text-ink leading-relaxed">
                      {current.q}
                    </p>
                  )}

                  {/* GAMBAR PERTANYAAN */}
                  {current.gambar_pertanyaan && (
                    <div className="mt-4 flex justify-center">
                      <img
                        src={
                          current.gambar_pertanyaan
                        }
                        alt={`Gambar soal ${
                          idx + 1
                        }`}
                        className="max-h-80 max-w-full rounded-2xl object-contain border border-border shadow-sm"
                        onError={(e) => {
                          console.error(
                            "Gambar pertanyaan gagal dimuat:",
                            current.gambar_pertanyaan
                          );

                          e.currentTarget.style.display =
                            "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* =========================
                    OPTIONS
                ========================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                  {current.options?.map(
                    (opt, i) => {
                      const optionText =
                        opt?.text || "";

                      const optionImage =
                        opt?.image ||
                        null;

                      return (
                        <button
                          key={
                            letters[i]
                          }
                          type="button"
                          onClick={() =>
                            setSelected(
                              i
                            )
                          }
                          className={`p-4 text-left border-2 rounded-2xl font-medium transition-all ${
                            selected === i
                              ? "border-brand-secondary bg-brand-secondary/10 text-ink"
                              : "border-border hover:border-brand-secondary/50 hover:bg-brand-secondary/5 text-ink"
                          }`}
                        >

                          {/* LABEL + TEKS */}
                          <div className="flex items-start">

                            <span className="font-display font-bold text-brand-secondary mr-2 shrink-0">
                              {letters[i]}.
                            </span>

                            {optionText && (
                              <span className="leading-relaxed">
                                {optionText}
                              </span>
                            )}
                          </div>

                          {/* GAMBAR PILIHAN */}
                          {optionImage && (
                            <div className="mt-4 flex justify-center">
                              <img
                                src={
                                  optionImage
                                }
                                alt={`Gambar pilihan ${
                                  letters[i]
                                }`}
                                className="max-h-52 max-w-full rounded-xl object-contain border border-border"
                                onError={(e) => {
                                  console.error(
                                    `Gambar pilihan ${letters[i]} gagal dimuat:`,
                                    optionImage
                                  );

                                  e.currentTarget.style.display =
                                    "none";
                                }}
                              />
                            </div>
                          )}
                        </button>
                      );
                    }
                  )}
                </div>

                {/* =========================
                    BUTTON NEXT
                ========================= */}
                <div className="pt-2 flex justify-end">

                  <button
                    onClick={
                      handleNext
                    }
                    disabled={
                      selected ===
                        null ||
                      submitting
                    }
                    className="bg-brand-secondary text-white px-8 sm:px-10 py-3 rounded-xl font-bold shadow-lg shadow-brand-secondary/30 disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-transform"
                  >
                    {submitting
                      ? "Menyimpan..."
                      : idx + 1 ===
                        questions.length
                      ? "Selesai"
                      : "Lanjut"}
                  </button>
                </div>
              </div>
            </>

          ) : (

            /* =========================
                RESULT
            ========================= */
            <div className="text-center py-8 animate-fade-up">

              {/* ICON */}
              <div className="size-24 mx-auto bg-brand-primary/10 rounded-full flex items-center justify-center mb-6">
                <Trophy className="size-12 text-brand-primary" />
              </div>

              {/* TITLE */}
              <h3 className="font-display text-3xl font-bold text-ink mb-2">
                {judulKuis} Selesai 🎉
              </h3>

              {/* NAMA */}
              <p className="text-lg font-bold text-ink">
                {nama}
              </p>

              {/* NIS */}
              <p className="text-ink-soft mb-6">
                NIS: {nis}
              </p>

              {/* NILAI */}
              <p className="text-ink-soft mb-3">
                Kamu mendapat nilai
              </p>

              <div className="font-display text-6xl font-bold text-brand-primary mb-3">
                {nilaiAkhir}
              </div>

              {/* BUTTON */}
              <button
                onClick={
                  reset
                }
                className="inline-flex gap-2 bg-brand-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-primary/30 hover:-translate-y-0.5 transition-transform"
              >
                Selesai
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
