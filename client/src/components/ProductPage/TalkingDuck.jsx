import React, { useEffect, useState } from "react";

const TalkingDuck = () => {
  const [visible, setVisible] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);

  const message =
    "Hey guys! This is me Bill. Thank you for visiting our site! One teeny tiny request, why not sell your old items here? Someone might be able to use it!";

  // Split into words but keep sentence punctuation
  const words = message.split(" ");

  // Helper: group words into sentences
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

  // useEffect(() => {
  //   setVisible(true);
  //   const hideTimer = setTimeout(() => setVisible(false), 10000);
  //   return () => clearTimeout(hideTimer);
  // }, []);

  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setWordIndex((prev) => {
        if (prev < words.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 300); // show a new word every 100ms

    return () => clearInterval(interval);
  }, [visible]);

  // Determine how many words to show from each sentence
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
      className={`fixed bottom-[-20px] right-0 m-4 w-56 h-80 pointer-events-none transform transition-transform duration-700 ${
        visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="relative w-full h-full">
        <div className="absolute top-[-100px] left-[-100px] text-black bg-opacity-50 rounded px-2 py-1 select-none pointer-events-auto transition-opacity duration-500">
          {renderedSentences}
        </div>

        <img
          src="./talking_ducky.png"
          alt="Decoration"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default TalkingDuck;
