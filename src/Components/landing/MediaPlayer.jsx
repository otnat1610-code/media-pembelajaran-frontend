import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Clock,
  Maximize,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Settings,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import axiosInstance from "../../config/axios";

export default function MediaSection() {
  const [videos, setVideos] = useState([]);
  const [index, setIndex] = useState(0);

  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState("00:00");
  const [currentTime, setCurrentTime] = useState("00:00");
  const [progress, setProgress] = useState(0);

  // AUDIO
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  // PLAYBACK SPEED
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // SEEK ANIMATION
  const [seekEffect, setSeekEffect] = useState(null);

  const [showControls, setShowControls] = useState(true);
  const hideTimeout = useRef(null);

  const videoRef = useRef(null);

  // =========================
  // FETCH VIDEO
  // =========================
  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await axiosInstance.get("/video");

      const active = res.data.filter(
        (v) => v.status_video === "aktif"
      );

      setVideos(active);
      setIndex(0);
    } catch (err) {
      console.error(err);
    }
  };

  const video = videos[index];

  // =========================
  // FORMAT TIME
  // =========================
  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return "00:00";

    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);

    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // =========================
  // RESET PLAYER
  // =========================
  const resetPlayer = () => {
    setPlaying(false);
    setProgress(0);
    setCurrentTime("00:00");
    setDuration("00:00");

    setVolume(1);
    setMuted(false);
    setPlaybackRate(1);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.volume = 1;
      videoRef.current.muted = false;
      videoRef.current.playbackRate = 1;
    }
  };

  // =========================
  // CHANGE VIDEO
  // =========================
  const changeVideo = (newIndex) => {
    resetPlayer();
    setIndex(newIndex);
  };

  const nextVideo = () => {
    if (videos.length <= 1) return;

    changeVideo((index + 1) % videos.length);
  };

  const prevVideo = () => {
    if (videos.length <= 1) return;

    changeVideo(
      (index - 1 + videos.length) % videos.length
    );
  };

  // =========================
  // PLAY / PAUSE
  // =========================
  const toggle = async () => {
    const v = videoRef.current;

    if (!v) return;

    try {
      if (v.paused) {
        await v.play();

        setPlaying(true);
        showVideoControls();
      } else {
        v.pause();

        setPlaying(false);
        setShowControls(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // SEEK +10 / -10
  // =========================
  const seekVideo = (seconds) => {
    const v = videoRef.current;

    if (!v) return;

    const newTime = Math.min(
      Math.max(v.currentTime + seconds, 0),
      v.duration || 0
    );

    v.currentTime = newTime;

    setCurrentTime(formatTime(newTime));

    if (v.duration > 0) {
      setProgress(
        (newTime / v.duration) * 100
      );
    }

    // Animasi indikator
    setSeekEffect(seconds > 0 ? "forward" : "backward");

    setTimeout(() => {
      setSeekEffect(null);
    }, 600);

    showVideoControls();
  };

  // =========================
  // DOUBLE TAP
  // =========================
  const lastTap = useRef(0);

  const handleDoubleTap = (e) => {
    const now = Date.now();

    const rect =
      e.currentTarget.getBoundingClientRect();

    const x =
      e.clientX - rect.left;

    const width = rect.width;

    // Cek double tap
    if (now - lastTap.current < 300) {

      // Sisi kiri = mundur
      if (x < width / 2) {
        seekVideo(-10);
      }

      // Sisi kanan = maju
      else {
        seekVideo(10);
      }
    }

    lastTap.current = now;
  };

  // =========================
  // MUTE
  // =========================
  const toggleMute = () => {
    const v = videoRef.current;

    if (!v) return;

    if (v.muted) {
      v.muted = false;

      if (v.volume === 0) {
        v.volume = 0.5;
        setVolume(0.5);
      }

      setMuted(false);
    } else {
      v.muted = true;
      setMuted(true);
    }

    showVideoControls();
  };

  // =========================
  // VOLUME
  // =========================
  const handleVolumeChange = (e) => {
    const value = Number(e.target.value);
    const v = videoRef.current;

    if (!v) return;

    v.volume = value;

    setVolume(value);

    if (value === 0) {
      v.muted = true;
      setMuted(true);
    } else {
      v.muted = false;
      setMuted(false);
    }

    showVideoControls();
  };

  // =========================
  // PLAYBACK SPEED
  // =========================
  const changePlaybackSpeed = (speed) => {
    const v = videoRef.current;

    if (!v) return;

    v.playbackRate = speed;

    setPlaybackRate(speed);
    setShowSpeedMenu(false);

    showVideoControls();
  };

  // =========================
  // FULLSCREEN
  // =========================
  const handleFullscreen = () => {
    const v = videoRef.current;

    if (v?.requestFullscreen) {
      v.requestFullscreen();
    }
  };

  // =========================
  // TIME UPDATE
  // =========================
  const handleTimeUpdate = () => {
    const v = videoRef.current;

    if (!v) return;

    if (!isNaN(v.duration) && v.duration > 0) {
      const percent =
        (v.currentTime / v.duration) * 100;

      setProgress(percent);
    }

    setCurrentTime(
      formatTime(v.currentTime)
    );
  };

  // =========================
  // LOADED METADATA
  // =========================
  const handleLoadedMetadata = () => {
    const v = videoRef.current;

    if (!v) return;

    setDuration(
      formatTime(v.duration)
    );

    if (v.duration > 0) {
      setProgress(
        (v.currentTime / v.duration) * 100
      );
    }

    setCurrentTime(
      formatTime(v.currentTime)
    );

    v.volume = volume;
    v.muted = muted;
    v.playbackRate = playbackRate;
  };

  // =========================
  // SHOW CONTROLS
  // =========================
  const showVideoControls = () => {
    setShowControls(true);

    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }

    if (playing) {
      hideTimeout.current = setTimeout(() => {
        setShowControls(false);
        setShowSpeedMenu(false);
      }, 2000);
    }
  };

  // =========================
  // AUTO NEXT
  // =========================
  const handleEnded = () => {
    setPlaying(false);
    setShowControls(true);

    nextVideo();
  };

  if (!video) {
    return (
      <section className="py-24 text-center">
        <p>Tidak ada video aktif</p>
      </section>
    );
  }

  return (
    <section
      id="mediaplayer"
      className="py-16 bg-card scroll-mt-24"
    >
      <div className="max-w-4xl mx-auto px-6">

        <div className="text-center mb-4">
          <h2 className="text-2xl md:text-3xl font-bold">
            Video Pembelajaran
          </h2>
        </div>

        <div className="bg-black rounded-2xl p-3 relative shadow-xl">

          {/* VIDEO AREA */}
          <div
            className="relative aspect-video"
            onMouseMove={showVideoControls}
            onMouseEnter={showVideoControls}
            onMouseLeave={() => {
              if (playing) {
                setShowControls(false);
                setShowSpeedMenu(false);
              }
            }}
            onClick={handleDoubleTap}
          >

            {/* VIDEO */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover rounded-xl"
              preload="auto"
              src={`${import.meta.env.VITE_API_URL}/video/stream/${video.id_vidpem}`}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              onLoadedData={() =>
                console.log("LOADED DATA")
              }
              onCanPlay={() =>
                console.log("CAN PLAY")
              }
            />

            {/* ========================= */}
            {/* SEEK EFFECT */}
            {/* ========================= */}

            {seekEffect === "backward" && (
              <div className="
                absolute
                left-[25%]
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                pointer-events-none
                flex flex-col
                items-center
                justify-center
                text-white
                animate-pulse
              ">
                <div className="
                  bg-black/60
                  rounded-full
                  p-4
                ">
                  <RotateCcw size={32} />
                </div>

                <span className="
                  text-sm
                  font-semibold
                  mt-1
                ">
                  -10 detik
                </span>
              </div>
            )}

            {seekEffect === "forward" && (
              <div className="
                absolute
                right-[25%]
                top-1/2
                translate-x-1/2
                -translate-y-1/2
                pointer-events-none
                flex flex-col
                items-center
                justify-center
                text-white
                animate-pulse
              ">
                <div className="
                  bg-black/60
                  rounded-full
                  p-4
                ">
                  <RotateCw size={32} />
                </div>

                <span className="
                  text-sm
                  font-semibold
                  mt-1
                ">
                  +10 detik
                </span>
              </div>
            )}

            {/* ========================= */}
            {/* PLAY BUTTON */}
            {/* ========================= */}

            <div
              className={`
                absolute inset-0
                flex items-center
                justify-center
                transition-all
                duration-300
                ${
                  showControls
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-90 pointer-events-none"
                }
              `}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggle();
                }}
                className="
                  bg-white/95
                  hover:bg-white
                  shadow-xl
                  p-5
                  rounded-full
                  transition-all
                  duration-300
                  hover:scale-110
                  active:scale-95
                "
              >
                {playing ? (
                  <Pause
                    size={34}
                    className="text-black"
                  />
                ) : (
                  <Play
                    size={34}
                    className="text-black ml-1"
                  />
                )}
              </button>
            </div>

            {/* ========================= */}
            {/* SEEK BUTTONS */}
            {/* ========================= */}

            <button
              onClick={(e) => {
                e.stopPropagation();
                seekVideo(-10);
              }}
              className={`
                absolute
                left-[28%]
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                bg-black/60
                hover:bg-black/80
                text-white
                rounded-full
                p-3
                transition-all
                duration-300
                hover:scale-110
                z-20
                ${
                  showControls
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }
              `}
              title="Mundur 10 detik"
            >
              <RotateCcw size={25} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                seekVideo(10);
              }}
              className={`
                absolute
                right-[28%]
                top-1/2
                translate-x-1/2
                -translate-y-1/2
                bg-black/60
                hover:bg-black/80
                text-white
                rounded-full
                p-3
                transition-all
                duration-300
                hover:scale-110
                z-20
                ${
                  showControls
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }
              `}
              title="Maju 10 detik"
            >
              <RotateCw size={25} />
            </button>

            {/* ========================= */}
            {/* BOTTOM CONTROLS */}
            {/* ========================= */}

            <div
              className={`
                absolute
                bottom-0
                left-0
                w-full
                px-3
                pb-2
                transition-all
                duration-300
                ${
                  showControls
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2 pointer-events-none"
                }
              `}
            >

              {/* SEEK BAR */}
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onClick={(e) =>
                  e.stopPropagation()
                }
                onMouseDown={() => {
                  if (videoRef.current) {
                    videoRef.current.pause();
                  }
                }}
                onChange={(e) => {
                  const v = videoRef.current;

                  if (!v) return;

                  const value =
                    Number(e.target.value);

                  const newTime =
                    (value / 100) * v.duration;

                  v.currentTime = newTime;

                  setProgress(value);

                  setCurrentTime(
                    formatTime(newTime)
                  );
                }}
                onMouseUp={() => {
                  if (
                    videoRef.current &&
                    playing
                  ) {
                    videoRef.current.play();
                  }
                }}
                className="
                  w-full
                  accent-red-500
                  cursor-pointer
                  mb-2
                "
              />

              {/* CONTROL BUTTONS */}
              <div className="
                flex
                items-center
                justify-between
              ">

                {/* LEFT */}
                <div className="
                  flex
                  items-center
                  gap-2
                ">

                  {/* PLAY */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle();
                    }}
                    className="
                      text-white
                      hover:text-red-400
                    "
                  >
                    {playing ? (
                      <Pause size={22} />
                    ) : (
                      <Play size={22} />
                    )}
                  </button>

                  {/* MUTE */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="
                      text-white
                      hover:text-red-400
                    "
                  >
                    {muted || volume === 0 ? (
                      <VolumeX size={22} />
                    ) : (
                      <Volume2 size={22} />
                    )}
                  </button>

                  {/* VOLUME */}
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={
                      muted
                        ? 0
                        : volume
                    }
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                    onChange={handleVolumeChange}
                    className="
                      w-20
                      accent-red-500
                    "
                  />

                  {/* TIME */}
                  <span className="
                    text-white
                    text-xs
                    ml-1
                  ">
                    {currentTime} / {duration}
                  </span>

                </div>

                {/* RIGHT */}
                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  {/* SPEED */}
                  <div className="relative">

                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        setShowSpeedMenu(
                          (prev) => !prev
                        );

                        showVideoControls();
                      }}
                      className="
                        flex
                        items-center
                        gap-1
                        text-white
                        hover:text-red-400
                        text-sm
                      "
                    >
                      <Settings size={19} />

                      <span>
                        {playbackRate}x
                      </span>
                    </button>

                    {/* SPEED MENU */}
                    {showSpeedMenu && (
                      <div
                        className="
                          absolute
                          bottom-9
                          right-0
                          bg-black/95
                          border
                          border-white/20
                          rounded-lg
                          shadow-xl
                          overflow-hidden
                          min-w-[100px]
                        "
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                      >

                        <div className="
                          px-3
                          py-2
                          text-xs
                          text-white/50
                          border-b
                          border-white/10
                        ">
                          Kecepatan
                        </div>

                        {[
                          0.5,
                          0.75,
                          1,
                          1.25,
                          1.5,
                          1.75,
                          2,
                        ].map((speed) => (
                          <button
                            key={speed}
                            onClick={() =>
                              changePlaybackSpeed(
                                speed
                              )
                            }
                            className={`
                              block
                              w-full
                              text-left
                              px-3
                              py-2
                              text-sm
                              text-white
                              hover:bg-white/10
                              ${
                                playbackRate === speed
                                  ? "bg-red-500/30 text-red-400"
                                  : ""
                              }
                            `}
                          >
                            {speed}x
                          </button>
                        ))}

                      </div>
                    )}

                  </div>

                  {/* FULLSCREEN */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFullscreen();
                    }}
                    className="
                      text-white
                      hover:text-red-400
                    "
                  >
                    <Maximize size={20} />
                  </button>

                </div>

              </div>
            </div>

            {/* VIDEO SLIDER */}
            {videos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevVideo();
                  }}
                  className={`
                    absolute
                    left-2
                    top-1/2
                    -translate-y-1/2
                    bg-white
                    p-2
                    rounded-full
                    shadow-lg
                    transition-all
                    duration-300
                    hover:scale-110
                    z-30
                    ${
                      showControls
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }
                  `}
                >
                  <ChevronLeft />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextVideo();
                  }}
                  className={`
                    absolute
                    right-2
                    top-1/2
                    -translate-y-1/2
                    bg-white
                    p-2
                    rounded-full
                    shadow-lg
                    transition-all
                    duration-300
                    hover:scale-110
                    z-30
                    ${
                      showControls
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }
                  `}
                >
                  <ChevronRight />
                </button>
              </>
            )}

          </div>

          {/* INFO */}
          <div className="
            text-white
            mt-4
            space-y-3
          ">

            <div className="
              flex
              items-center
              gap-2
              text-sm
              text-white/70
            ">
              <Clock size={16} />

              <span>
                {currentTime} / {duration}
              </span>
            </div>

            <h3 className="
              text-2xl
              font-bold
              leading-snug
            ">
              {video.judul}
            </h3>

            <p className="
              text-white/70
              text-sm
              leading-relaxed
            ">
              {video.deskripsi}
            </p>

          </div>

        </div>
      </div>
    </section>
  );
}
