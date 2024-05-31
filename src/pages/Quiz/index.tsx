import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Help from "../../components/help";
import { addAnswer, fetchQuiz, selectAnswer } from "../../redux/slice";
import { RootState } from "../../redux/store";
import "./style.scss";

function Quiz() {
  const [countdown, setCountdown] = useState(10);
  const [questionCount, setQuestionCount] = useState(0);
  const navigate = useNavigate();
  const { category } = useParams();
  const quiz = useSelector((state: RootState) => state.quiz.quiz);
  const selectedAnswer = useSelector(
    (state: RootState) => state.quiz.selectedAnswer
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchQuiz());

    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) =>
        prevCountdown < 2 ? 10 : prevCountdown - 1
      );
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [dispatch]);

  const selectedQuiz = useMemo(() => quiz?.[category], [quiz, category]);

  useEffect(() => {
    const questionInterval = setInterval(() => {
      setQuestionCount((prevCount) => {
        if (prevCount < selectedQuiz?.length - 1) {
          return prevCount + 1;
        } else {
          // alert("time out");
          navigate("/result");
          clearInterval(questionInterval); // Stop the interval
          return prevCount; // No increment needed, we've reached the limit
        }
      });
    }, 10000);

    return () => clearInterval(questionInterval); // Cleanup interval on component unmount
  }, [selectedQuiz]);
  return (
    <div className="Quiz app">
      <Help />
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
              (answer: { text: string; isCorrect: boolean }) => {
                return (
                  <button
                    key={answer.text}
                    className={
                      selectedAnswer.text == answer.text
                        ? "answer active"
                        : "answer"
                    }
                    onClick={() => {
                      dispatch(selectAnswer(answer));
                    }}
                  >
                    {answer.text}
                  </button>
                );
              }
            )}
          <button
            className="next"
            onClick={() => {
              dispatch(addAnswer());
              setCountdown(10);
              questionCount < 9
                ? setQuestionCount(questionCount + 1)
                : navigate("/result");
            }}
          >
            next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
