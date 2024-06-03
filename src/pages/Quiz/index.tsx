import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Help from "../../components/help";
import { addAnswer, fetchQuiz, selectAnswer } from "../../redux/slice";
import { AppDispatch, RootState } from "../../redux/store";
import "./style.scss";

function Quiz() {
  const [countdown, setCountdown] = useState(100);
  const [questionCount, setQuestionCount] = useState(0);
  const [publicPercent, setpublicPercent] = useState([]);
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
  function publicDecide() {
    const percents = [40, 30, 20, 10];
    shuffle(percents);
    setpublicPercent(percents);
    console.log(percents);
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

  const selectedQuiz = useMemo(() => quiz?.[category], [quiz, category]);
  return (
    <div className="Quiz app">
      <Help publicDecide={publicDecide} />
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
              (answer: { text: string; isCorrect: boolean }, index) => {
                return (
                  <button
                    key={answer.text}
                    className={
                      // countdown <= 5 && countdown > 1 && answer.isCorrect
                      //   ? "answer correct"
                      //   : countdown <= 3 &&
                      //     countdown > 0 &&
                      //     !answer.isCorrect &&
                      //     selectedAnswer.text == answer.text
                      //   ? "answer incorrect"
                      //   :
                      selectedAnswer.text == answer.text
                        ? "answer active"
                        : "answer"
                    }
                    onClick={() => {
                      // sethasAnswerSelected(true);
                      dispatch(selectAnswer(answer));
                    }}
                  >
                    {answer.text}
                    {publicPercent[index]}
                  </button>
                );
              }
            )}
          <button
            // disabled={!hasAnswerSelected}
            className="next"
            onClick={() => {
              dispatch(addAnswer());

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
