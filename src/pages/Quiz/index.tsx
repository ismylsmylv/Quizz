import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Help from "../../components/help";
import { addAnswer, fetchQuiz, selectAnswer } from "../../redux/slice";
import { AppDispatch, RootState } from "../../redux/store";
import "./style.scss";

function Quiz() {
  const location = useLocation();

  window.onbeforeunload = function () {
    return "Data will be lost if you leave the page, are you sure?";
  };
  if (location.pathname.substr(1, 4) == "quiz") {
    window.onbeforeunload;
  }
  const [countdown, setCountdown] = useState(100 as number);
  const [questionCount, setQuestionCount] = useState(0);
  const [helpPercent, setHelpPercent] = useState([]);
  const [correctIndex, setCorrectIndex] = useState(undefined);
  const navigate = useNavigate();
  const { category } = useParams();
  const quiz = useSelector((state: RootState) => state.quiz.quiz);
  const [halfIndex, sethalfIndex] = useState(0);
  const selectedAnswer: { text: string } = useSelector(
    (state: RootState | { text: string } | any) => state.quiz.selectedAnswer
  );

  const help: { text: string } = useSelector(
    (state: RootState | { text: string } | any) => state.quiz.help
  );
  const dispatch = useDispatch() as AppDispatch;
  function shuffle(array: number[]) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  }

  function generateRandomNumbersSummingTo100(count: number) {
    // Generate (count - 1) random numbers between 0 and 100
    const numbers = Array.from({ length: count - 1 }, () => Math.random());

    // Add 0 and 1 to the array and sort it
    numbers.push(0, 1);
    numbers.sort((a, b) => a - b);

    // Calculate the differences between successive numbers and multiply by 100
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
    console.log("halfed");
  }
  const selectedQuiz = useMemo(() => quiz?.[category as any], [quiz, category]);
  useEffect(() => {
    if (selectedQuiz && selectedQuiz[questionCount]) {
      const correctAnswerIndex = selectedQuiz[questionCount].answers.findIndex(
        (answer) => answer.isCorrect
      );
      setCorrectIndex(correctAnswerIndex);
    }
    dispatch(fetchQuiz());
    if (countdown <= 0) {
      navigate(`/result/${category}`);
    }
    const countdownInterval = setInterval(() => {
      setCountdown(
        (prevCountdown: number) => prevCountdown > 0 && prevCountdown - 1
      );
    }, 1000);
    return () => clearInterval(countdownInterval);
  }, [dispatch, countdown, selectedQuiz, questionCount]);

  return (
    <div className="Quiz app">
      <Help
        publicDecide={publicDecide}
        phoneDecide={phoneDecide}
        eliminate={eliminate}
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
                return (
                  <button
                    key={answer.text}
                    className={
                      selectedAnswer.find(
                        (elem: { text: string }) => elem.text == answer.text
                      )
                        ? "answer active"
                        : "answer"
                    }
                    onClick={() => {
                      dispatch(selectAnswer(answer));
                    }}
                    disabled={correctIndex == index}
                  >
                    <div
                      className="text"
                      style={{
                        color: helpPercent[index] == 100 ? "white" : "#31304D",
                      }}
                    >
                      {answer.text}
                    </div>
                    <div
                      className="answerOverlay"
                      style={{ opacity: helpPercent[index] / 100 }}
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

              if (questionCount < 9) {
                setQuestionCount(questionCount + 1);
              } else {
                navigate(`/result/${category}`);
              }
            }}
          >
            {questionCount == 9 ? "complete" : "next"}
          </button>

          <button
            className="previous"
            onClick={() => {
              dispatch(addAnswer());
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
