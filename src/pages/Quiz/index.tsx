import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Help from "../../components/help";
import { addAnswer, fetchQuiz, selectAnswer } from "../../redux/slice";
import { AppDispatch } from "../../redux/store";
import "./style.scss";
interface QuizState {
  selectedAnswer: { text: string };
  answers: { text: string }[];
  help: { text: string };
  quiz: QuizType;
}
interface QuizType {
  id: number;
  title: string;
  questions: string[];
}
interface RootState {
  quiz: QuizState;
}

function Quiz() {
  const location = useLocation();
  window.onbeforeunload = function () {
    return "Data will be lost if you leave the page, are you sure?";
  };
  if (location.pathname.substr(1, 4) === "quiz") {
    window.onbeforeunload;
  }

  const [countdown, setCountdown] = useState(100 as number);
  const [questionCount, setQuestionCount] = useState(0);
  const [helpPercent, setHelpPercent] = useState([]);
  const [eliminatedIndexes, setEliminatedIndexes] = useState<number[]>([]);

  const navigate = useNavigate();
  const { category } = useParams();
  const quiz: QuizType = useSelector((state: RootState) => state.quiz.quiz);
  const selectedAnswer: { text: string } = useSelector(
    (state: RootState) => state.quiz.selectedAnswer
  );

  const answers: { text: string }[] = useSelector(
    (state: RootState) => state.quiz.answers
  );

  const help: { text: string } = useSelector(
    (state: RootState) => state.quiz.help
  );

  const dispatch = useDispatch() as AppDispatch;

  function shuffle(array: number[]) {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  }

  function generateRandomNumbersSummingTo100(count: number) {
    const numbers = Array.from({ length: count - 1 }, () => Math.random());
    numbers.push(0, 1);
    numbers.sort((a, b) => a - b);
    const result = [];
    for (let i = 1; i < numbers.length; i++) {
      result.push(Math.round((numbers[i] - numbers[i - 1]) * 100));
    }
    return result;
  }

  function shuffle100(arr: number[]) {
    const index100 = arr.indexOf(100);
    if (index100 !== -1) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      [arr[index100], arr[randomIndex]] = [arr[randomIndex], arr[index100]];
    }
    return arr;
  }

  function publicDecide() {
    const percents = generateRandomNumbersSummingTo100(4);
    shuffle(percents as number[]);
    setHelpPercent(percents as never[]);
    console.log(percents);
  }

  function phoneDecide() {
    const percents = [0, 100, 0, 0];
    shuffle100(percents);
    setHelpPercent(percents as never[]);
    console.log(percents);
  }

  function eliminate() {
    if (selectedQuiz && selectedQuiz[questionCount]) {
      const correctAnswerIndex = selectedQuiz[questionCount].answers.findIndex(
        (answer: { isCorrect: boolean }) => answer.isCorrect
      );

      const incorrectIndexes = selectedQuiz[questionCount].answers
        .map((answer: { isCorrect: boolean }, index: number) => ({
          answer,
          index,
        }))
        .filter(({ answer }) => !answer.isCorrect)
        .map(({ index }) => index);

      shuffle(incorrectIndexes);
      const halfIndexes = [correctAnswerIndex, incorrectIndexes[0]];
      setEliminatedIndexes(halfIndexes);
    }
  }

  const selectedQuiz = useMemo(
    () => quiz?.[category as string[]],
    [quiz, category]
  );

  useEffect(() => {
    dispatch(fetchQuiz());

    if (countdown <= 0) {
      navigate(`/result/${category}`);
    }

    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown: number) =>
        prevCountdown > 0 ? prevCountdown - 1 : 0
      );
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [questionCount, category, navigate, countdown]);

  return (
    <div className="Quiz app">
      <Help
        publicDecide={publicDecide as never}
        phoneDecide={phoneDecide as never}
        eliminate={eliminate as never}
      />
      <div className="content">
        <div className="infos">
          <div className="info">
            Question {questionCount + 1} of {selectedQuiz?.length}
          </div>

          <div id="countdown">
            <div id="countdown-number">{countdown}</div>
            <svg>
              <circle r="18" cx="20" cy="20"></circle>
            </svg>
          </div>
        </div>
        <div className="form">
          <div className="question">
            {selectedQuiz && selectedQuiz[questionCount].question}
          </div>
          {selectedQuiz &&
            selectedQuiz[questionCount].answers.map(
              (answer: { text: string; isCorrect: boolean }, index: number) => {
                const isEliminated = eliminatedIndexes.includes(index);
                return (
                  <button
                    key={answer.text}
                    className={
                      selectedAnswer.text === answer.text ||
                      answers.some((elem) => elem.text === answer.text)
                        ? "answer active"
                        : "answer"
                    }
                    onClick={() => {
                      dispatch(selectAnswer(answer));
                      // console.log(answers);
                    }}
                    // disabled={correctIndex !== index}
                    style={{
                      opacity: isEliminated ? "0" : "1",
                      color: isEliminated ? "white" : "",
                    }}
                  >
                    <div className="text">{answer.text}</div>
                    <div
                      className="answerOverlay"
                      style={{ opacity: helpPercent[index] / 100 || 0 }}
                    ></div>
                  </button>
                );
              }
            )}
          <button
            className="next"
            onClick={() => {
              dispatch(addAnswer());
              setHelpPercent([]);
              setEliminatedIndexes([]);
              if (questionCount < 9) {
                setQuestionCount(questionCount + 1);
              } else {
                navigate(`/result/${category}`);
              }
            }}
          >
            {questionCount === 9 ? "complete" : "next"}
          </button>

          <button
            className="previous"
            onClick={() => {
              // dispatch(addAnswer());
              if (questionCount > 0) {
                setQuestionCount(questionCount - 1);
              }
            }}
          >
            {questionCount > 0 && "previous"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
