const ResultCalculator = {
  calculate(targetText, typedText, secondsUsed) {
    let correctCharacters = 0;
    const comparedLength = typedText.length;

    for (let i = 0; i < comparedLength; i++) {
      if (typedText[i] === targetText[i]) {
        correctCharacters++;
      }
    }

    const mistakes = comparedLength - correctCharacters;
    const minutes = secondsUsed / 60;
    const wpm = minutes > 0 ? Math.round((correctCharacters / 5) / minutes) : 0;
    const accuracy = comparedLength > 0
      ? Math.round((correctCharacters / comparedLength) * 100)
      : 100;

    return { wpm, accuracy, mistakes, correctCharacters };
  }
};
