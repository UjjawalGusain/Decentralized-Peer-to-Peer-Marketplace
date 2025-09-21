import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6 py-12 relative overflow-visible">
      
      {/* Yellow blurred cloud shape behind */}
      <div
  className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-[#FEC010] rounded-full opacity-10 z-10"
  style={{
    boxShadow: "0 0 100px 50px rgba(254, 192, 16, 0.6)"
  }}
  aria-hidden="true"
></div>

      
      <h1 className="text-4xl font-bold font-inter text-[#FEC010] mb-6 relative z-10">Welcome to Quak'r!</h1>

      <div className="max-w-3xl text-gray-700 text-md leading-relaxed font-sans text-center relative z-10">
        <p className="mb-4 italic">
          Quak'r is a little marketplace with a big heart — where folks come to trade,
          swap, and share without all the fuss.
        </p>

        <p className="mb-4">
          Just like a friendly quack on a quiet pond, we keep things simple, fun,
          and a little bit quirky.
        </p>

        <p className="mb-4">
          Built by <a target="_blank" href="https://github.com/UjjawalGusain" className="underline hover:text-amber-400">Ujjawal Gusain</a>, a software engineer who loves code, chess,
          and making things that just work.
        </p>

        <p className="mb-4">
          Here, you get to connect directly with people, no middlemen, no headaches,
          just honest trades and good vibes.
        </p>

        <h2 className="text-2xl font-semibold font-inter text-[#FEC010] mt-10 mb-4">That's Me!</h2>
        <p>
          Hey there! I'm Ujjawal — your friendly neighborhood coder who dreamed up Quak'r
          to make sure buying and selling feels easy, safe, and maybe even a little fun.
        </p>

        <p className="mt-10 text-gray-400 text-sm">
          © {new Date().getFullYear()} Quak'r. Keep it quirky.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
