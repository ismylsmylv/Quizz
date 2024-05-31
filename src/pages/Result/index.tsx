import { useNavigate } from "react-router-dom";
import "./style.scss";
import { IoIosTrophy } from "react-icons/io";
import { useSelector } from "react-redux";

import { useEffect, useState } from "react";
import { RootState } from "../../redux/store";
type Props = {};

function Result({}: Props) {
  const navigate = useNavigate();
  const answers = useSelector((state: RootState) => state.quiz.answers);
  const [result, setresult] = useState(0);
  useEffect(() => {
    const countAnswers = answers.filter((element) => element.isCorrect).length;
    setresult(countAnswers);
  }, []);
  return (
    <div className="Result app">
      <div className="messageBox">
        <div className="head">Results</div>
        <div className="trophy">
          <IoIosTrophy color="#F3BC5C" size={50} />
          <div className="text">you won!</div>
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
