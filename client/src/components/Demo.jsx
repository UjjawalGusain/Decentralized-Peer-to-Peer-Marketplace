import React from "react";

const Demo = () => {
  return (
    <div className="bg-[#F9FAFB] min-h-screen flex flex-col items-center py-10 px-4">
      <div className="max-w-5xl w-full bg-white shadow-md rounded-2xl p-6 border border-slate-200">
        {/* Header */}
        <h1 className="text-3xl font-bold text-slate-800 text-center mb-4">
          Product Demo
        </h1>
        <p className="text-center text-slate-600 mb-6">
          Experience a quick walkthrough of our platform’s features below.  
          You can also open it in a new tab for a full-screen view.
        </p>

        {/* Demo Link */}
        <div className="text-center mb-8">
          <a
            href="https://app.supademo.com/embed/cmh8noarq10dy6133414zlie4"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
          >
            🔗 View Full Demo
          </a>
        </div>

        {/* Embedded Demo */}
        <div
          className="relative w-full overflow-hidden rounded-xl shadow-sm"
          style={{
            boxSizing: "content-box",
            maxHeight: "80vh",
            aspectRatio: "2.07",
            padding: "40px 0",
          }}
        >
          <iframe
            src="https://app.supademo.com/embed/cmh8noarq10dy6133414zlie4?v_email=EMAIL&embed_v=2&utm_source=embed"
            loading="lazy"
            title="Product Demo"
            allow="clipboard-write"
            frameBorder="0"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full rounded-xl"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Demo;
