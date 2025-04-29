import React, { useState } from "react";
import "./Question.css";

export default function Question({
  question,
  options,
  onAnswer,
  questionIndex,
  totalQuestions,
}) {
  const [userChoice, setUserChoice] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [hasChecked, setHasChecked] = useState(false);
  const [rightAnswer, setRightAnswer] = useState(null);
  const [hint, setHint] = useState("");

  const pickOption = (optionIndex) => {
    if (hasChecked) return;
    
    setUserChoice(optionIndex);
    setFeedback("");
  };

  const verifyAnswer = () => {
    if (userChoice === null) {
      setFeedback("Hey, you need to pick an answer first!");
      return;
    }

    setHasChecked(true);
    const chosenOption = options[userChoice];
    const correctIndex = options.findIndex(opt => opt.correct);
    
    setRightAnswer(correctIndex);
    setHint(chosenOption.explanation);
  };

  const goNext = () => {
    if (!hasChecked) {
      setFeedback("Don't forget to check your answer first!");
      return;
    }

    setFeedback("");
    const chosenOption = options[userChoice];
    const optionId = chosenOption.id !== undefined ? chosenOption.id : userChoice;

    onAnswer(optionId);
    setUserChoice(null);
    setHasChecked(false);
    setRightAnswer(null);
    setHint("");
  };

  const getOptionStyle = (index) => {
    if (!hasChecked) return userChoice === index ? "selected" : "";
    
    if (index === rightAnswer) return "correct";
    if (index === userChoice && index !== rightAnswer) return "incorrect";
    return "";
  };

  return (
    <div className="question-container">
      <div className="question-count">
        Question {questionIndex} of {totalQuestions}
      </div>
      <h2 className="question-text">{question}</h2>
      <div className="options-container">
        {options.map((option, index) => (
          <div
            key={index}
            className={`option ${getOptionStyle(index)}`}
            onClick={() => pickOption(index)}
          >
            <input
              type="radio"
              id={`option-${index}`}
              name="option"
              value={index}
              checked={userChoice === index}
              onChange={() => pickOption(index)}
              className="option-input"
              disabled={hasChecked}
            />
            <label htmlFor={`option-${index}`} className="option-label">
              {option.text}
            </label>
          </div>
        ))}
      </div>

      {hint && hasChecked && (
        <div className="explanation">
          <p>{hint}</p>
        </div>
      )}

      {feedback && <div className="error-message">{feedback}</div>}

      <div className="next-button-container">
        {!hasChecked ? (
          <button
            className="check-button"
            onClick={verifyAnswer}
            aria-label="Check Answer"
          >
            Check
          </button>
        ) : (
          <button
            className="next-button"
            onClick={goNext}
            aria-label={questionIndex === totalQuestions ? "Finish" : "Next"}
          >
            {questionIndex === totalQuestions ? "Finish" : "Next"}
          </button>
        )}
      </div>
    </div>
  );
}
