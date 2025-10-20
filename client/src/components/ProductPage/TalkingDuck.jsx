import React, { useEffect, useState } from "react";

const TalkingDuck = () => {
  const [visible, setVisible] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);

  // Messages
  const fullMessage =
    "Hey guys! This is me Bill. Thanks for visiting! Why not sell your old items here? Someone might use them!";
  const shortMessage =
    "Hi! I'm Bill. Thanks for visiting! Sell your old items here!";

  // Split into words
  const words = fullMessage.split(" ");

  // Group into sentences
  const sentences = [];
  let currentSentence = [];
  words.forEach((word) => {
    currentSentence.push(word);
    if (/[.!?]$/.test(word)) {
      sentences.push(currentSentence);
      currentSentence = [];
    }
  });
  if (currentSentence.length > 0) sentences.push(currentSentence);

  // Typing animation
  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setWordIndex((prev) => {
        if (prev < words.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [visible]);

  // Determine words to render
  let wordsCounted = 0;
  const renderedSentences = sentences.map((sentence, i) => {
    const remaining = wordIndex - wordsCounted;
    const sentenceWords = sentence.slice(0, Math.max(0, remaining + 1));
    wordsCounted += sentence.length;
    return sentenceWords.length > 0 ? (
      <div key={i}>{sentenceWords.join(" ")}</div>
    ) : null;
  });

  return (
    <div
      className={`fixed bottom-0 right-0 m-4 pointer-events-none transform transition-transform duration-700
        ${visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        w-20 h-20 md:w-56 md:h-80`}
    >
      <div className="relative w-full h-full flex items-end justify-end">
        {/* Small and medium screens */}
        <div className="md:hidden relative w-full h-full flex items-center justify-center pointer-events-auto ">
          {/* Duck background */}
          <div className="absolute inset-0 bg-white rounded-full shadow-lg "></div>

          {/* Speech bubble */}
          <div className="absolute bottom-full right-0 mb-1 bg-white bg-opacity-90 border border-gray-300 rounded-xl px-2 py-1 shadow-lg text-[9px] sm:text-[11px] max-w-[150px] sm:max-w-[180px] pointer-events-auto select-none leading-snug">
            {shortMessage}
          </div>

          <img
            src="./talking_ducky.png"
            alt="Talking Duck"
            className="relative w-12 h-12 object-contain"
          />
        </div>

        {/* Large screens */}
        <div className="hidden md:flex relative w-full h-full items-center justify-center pointer-events-auto">
          <img
            src="./talking_ducky.png"
            alt="Talking Duck"
            className="w-full h-full object-contain"
          />
          <div className="absolute top-[-100px] left-[-100px] text-black bg-opacity-50 rounded px-2 py-1 select-none pointer-events-auto transition-opacity duration-500 text-sm ">
            {renderedSentences}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalkingDuck;
