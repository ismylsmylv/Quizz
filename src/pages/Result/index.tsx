import { useNavigate } from "react-router-dom";
import "./style.scss";
import { IoIosTrophy } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { IoIosCloseCircle } from "react-icons/io";
import { useEffect, useState } from "react";
import { RootState } from "../../redux/store";
import { clearAnswers, clearSelectAnswer } from "../../redux/slice";
type Props = {};

function Result({}: Props) {
  const navigate = useNavigate();
  const answers = useSelector((state: RootState) => state.quiz.answers);
  const [result, setresult] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    const countAnswers = answers.filter((element) => element.isCorrect).length;
    setresult(countAnswers);
  }, []);
  return (
    <div className="Result app">
      <div className="messageBox">
        <div className="head">Results</div>
        <div className="trophy">
          {result > 5 ? (
            <IoIosTrophy color="#F3BC5C" size={50} />
          ) : (
            <IoIosCloseCircle color="red" size={50} />
          )}

          <div className="text">
            you
            {result > 5 ? " won" : " lost"}!
          </div>
        </div>
        <div className="points">{result} points</div>
        <div className="controls">
          <button
            className="homeBtn"
            onClick={() => {
              navigate("/");
            }}
          >
            homepage
          </button>

          <button
            className="againBtn"
            onClick={() => {
              dispatch(clearAnswers());
              dispatch(clearSelectAnswer());
              navigate("/quiz/math");
            }}
          >
            play again
          </button>
        </div>
      </div>
    </div>
  );
}

export default Result;
