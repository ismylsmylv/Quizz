import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Help from "../../components/help";
import { addAnswer, fetchQuiz, selectAnswer } from "../../redux/slice";
import { AppDispatch, RootState } from "../../redux/store";
import "./style.scss";

function Quiz() {
  const [countdown, setCountdown] = useState(100 as number);
  const [questionCount, setQuestionCount] = useState(0);
  const [helpPercent, setHelpPercent] = useState([]);
  const [halfCount, sethalfCount] = useState();
  // const [hasAnswerSelected, sethasAnswerSelected] = useState(false);
  const navigate = useNavigate();
  const { category } = useParams();
  const quiz = useSelector((state: RootState) => state.quiz.quiz);
  const selectedAnswer: { text: string } = useSelector(
    (state: RootState | { text: string } | any) => state.quiz.selectedAnswer
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
  useEffect(() => {
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
  }, [dispatch, countdown]);

  const selectedQuiz = useMemo(() => quiz?.[category as any], [quiz, category]);
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
                    // disabled={!answer.isCorrect}
                    key={answer.text}
                    style={
                      {
                        // backgroundColor: `#4bf542${helpPercent?.[index] / 100}`,
                      }
                    }
                    className={
                      // countdown <= 5 && countdown > 1 && answer.isCorrect
                      //   ? "answer correct"
                      //   : countdown <= 3 &&
                      //     countdown > 0 &&
                      //     !answer.isCorrect &&
                      //     selectedAnswer.text == answer.text
                      //   ? "answer incorrect"
                      //   :
                      selectedAnswer.find((elem) => elem.text == answer.text)
                        ? "answer active"
                        : "answer"
                    }
                    onClick={() => {
                      // sethasAnswerSelected(true);
                      dispatch(selectAnswer(answer));
                    }}
                  >
                    <div
                      className="text"
                      style={{
                        color: helpPercent[index] == 100 ? "white" : "#31304D",
                      }}
                    >
                      {" "}
                      {answer.text}
                    </div>
                    {/* {helpPercent[index]} */}
                    <div
                      className="answerOverlay"
                      style={{ opacity: helpPercent[index] / 100 }}
                    ></div>
                  </button>
                );
              }
            )}
          <button
            // disabled={!hasAnswerSelected}
            className="next"
            onClick={() => {
              dispatch(addAnswer());
              setHelpPercent([]);

              if (questionCount < 9) {
                // sethasAnswerSelected(false);
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
