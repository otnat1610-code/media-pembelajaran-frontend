import { Check } from "lucide-react";
import aboutImg from "../../assets/about-illustration.jpg";

const points = [
{
dot: "bg-brand-accent/20 text-brand-accent",
text: "Materi sejarah Kerajaan Hindu, Buddha, dan Islam di Indonesia.",
},
{
dot: "bg-brand-secondary/20 text-brand-secondary",
text: "Animasi, ilustrasi, dan narasi yang menarik.",
},
{
dot: "bg-brand-primary/20 text-brand-primary",
text: "Dilengkapi kuis interaktif sebagai sarana evaluasi hasil belajar siswa.",
},
];

export default function AboutSection() {
return ( <section id="tentang" className="py-24 bg-card"> <div className="max-w-7xl mx-auto px-6"> <div className="flex flex-col md:flex-row gap-16 items-center">

```
      {/* Image */}
      <div className="w-full md:w-1/2">
        <div className="relative">
          <div
            className="absolute -inset-6 bg-brand-primary/10 rounded-[40px] blur-2xl"
            aria-hidden="true"
          />

          <img
            src={aboutImg}
            alt="Ilustrasi candi dan motion graphic sejarah Indonesia"
            loading="lazy"
            className="relative w-full aspect-square object-cover rounded-3xl shadow-xl"
          />
        </div>
      </div>

      {/* Content */}
      <div className="w-full md:w-1/2 space-y-6">
        <span className="inline-block text-brand-primary font-bold text-sm uppercase tracking-widest">
          Tentang Sistem
        </span>

        <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink leading-tight">
          Mengenal Sejarah Kerajaan Indonesia Melalui Motion Graphic
        </h2>

        <p className="text-ink-soft text-lg leading-relaxed">
          Media pembelajaran interaktif yang dirancang untuk membantu siswa
          kelas IV SDN Tambahrejo 02 mempelajari sejarah kerajaan di
          Indonesia dengan cara yang lebih menarik, mudah dipahami, dan
          menyenangkan.
        </p>

        <p className="text-ink-soft text-lg leading-relaxed">
          Materi yang disajikan dalam sistem ini mengacu pada Buku IPAS
          Kelas IV Bab 5 Semester 2. Materi membahas sejarah kerajaan
          Hindu, Buddha, dan Islam di Indonesia yang dikemas melalui
          motion graphic, ilustrasi, dan narasi agar lebih mudah dipahami
          oleh siswa.
        </p>

        <div className="grid grid-cols-1 gap-3">
          {points.map((p) => (
            <div
              key={p.text}
              className="flex items-start gap-4 p-4 bg-bg-soft rounded-2xl"
            >
              <div
                className={`size-8 rounded-full flex items-center justify-center shrink-0 ${p.dot}`}
              >
                <Check className="size-4" strokeWidth={3} />
              </div>

              <p className="font-medium text-ink">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
</section>
```

);
}
