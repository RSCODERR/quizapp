import "./App.css";
import React, { useState, useEffect } from "react";
import Question from "./Question";

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [data, setData] = useState(null);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);

  const SHUFFLE_TIMES = 10;

  useEffect(() => {
    if (isStarted) {
      setLoading(true);
      fetch("/data.json")
        .then((response) => response.json())
        .then((data) => {
          setData(data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error loading quiz data:", error);
          setLoading(false);
        });
    }
  }, [isStarted]);

  const checkAnswer = (optionId) => {
    if (data[currentQuestion]["options"][optionId].correct === true)
      setScore(score + 1);
    if (currentQuestion === data.length - 1) {
      setIsSubmitted(true);
      return;
    }
    setCurrentQuestion(currentQuestion + 1);
  };

  const shuffle = (options, should) => {
    const optionsCopy = [...options];

    if (should) {
      for (let i = 0; i < SHUFFLE_TIMES; i++) {
        let idx1 = Math.round(Math.random() * 1000) % optionsCopy.length;
        let idx2 = Math.round(Math.random() * 1000) % optionsCopy.length;
        let temp = optionsCopy[idx1];
        optionsCopy[idx1] = optionsCopy[idx2];
        optionsCopy[idx2] = temp;
      }
    }
    return optionsCopy;
  };

  const restartQuiz = () => {
    setIsStarted(false);
    setIsSubmitted(false);
    setScore(0);
    setCurrentQuestion(0);
    setData(null);
  };

  const getProgressPercentage = () => {
    if (!data) return 0;
    return (currentQuestion / data.length) * 100;
  };

  return (
    <div className="quiz-container">
      {!isStarted ? (
        <div className="start-screen">
          <h1 className="quiz-title">CRAZY!!! JavaScript Quiz</h1>
          <p>
            Test your JS knowledge with this quiz.
          </p>
          <button className="start-button" onClick={() => setIsStarted(true)}>
            Start Quiz
          </button>
        </div>
      ) : (
        <>
          <div className="quiz-header">
            <h1 className="quiz-title">CRAZY!!! JavaScript Quiz</h1>
            <div className="score-display">Score: {score}</div>
          </div>

          {loading ? (
            <div className="loading">Loading questions...</div>
          ) : isSubmitted ? (
            <div className="completion-screen">
              <h2 className="completion-title">Quiz Completed!</h2>
              <p className="score-result">
                Your score: <strong>{score}</strong> out of{" "}
                <strong>{data.length}</strong>
                {score === data.length && " - Perfect Score! 🎉"}
              </p>
              <button className="restart-button" onClick={restartQuiz}>
                Take Quiz Again
              </button>
            </div>
          ) : data !== null && currentQuestion < data.length ? (
            <>
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <Question
                question={data[currentQuestion].question}
                options={shuffle(
                  data[currentQuestion].options,
                  data[currentQuestion].shuffle,
                )}
                onAnswer={checkAnswer}
                questionIndex={currentQuestion + 1}
                totalQuestions={data.length}
              />
            </>
          ) : (
            <div>Loading your quiz...</div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
