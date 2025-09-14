import React from "react";

 const LogoWordmark = () => {
  return (
    <h1 className="mb-6 text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
      {/* inspi */}
      <span className="text-[#fffff] font-bold">
        <span className="relative inline-block">
          i
          <span className="absolute -top-1 md:-top-2 left-1/2 -translate-x-1/2 text-[#25B7ED] text-base sm:text-lg md:text-3xl">
            •
          </span>
        </span>
        nsp
        <span className="relative inline-block">
          i
          <span className="absolute -top-1 left-1/2 md:-top-2 -translate-x-1/2 text-[#25B7ED] text-base sm:text-lg md:text-3xl">
            •
          </span>
        </span>
      </span>

      {/* Te */}
      <span className="text-[#25B7ED] font-bold">Te</span>

      {/* ch */}
      <span className="text-[#fffff] font-bold">ch</span>

      {/* Tagline */}
      <span className="block mt-2 text-lg font-semibold text-transparent sm:text-xl md:text-2xl lg:text-3xl bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
        Online Tools
      </span>
    </h1>
  );
};

export default LogoWordmark;
