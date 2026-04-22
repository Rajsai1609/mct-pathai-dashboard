export function VideoDemoSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-3">
            Product Demo
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            See MCT PathAI in Action
          </h2>
          <p className="text-slate-400">See how it works</p>
        </div>

        <div
          style={{
            position: "relative",
            paddingBottom: "56.25%",
            height: 0,
            overflow: "hidden",
            maxWidth: "900px",
            margin: "0 auto",
            borderRadius: "12px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          }}
        >
          <iframe
            src="https://www.youtube.com/embed/2bnLf-qEMRg?rel=0&modestbranding=1"
            title="MCT PathAI Product Demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </div>
    </section>
  );
}
