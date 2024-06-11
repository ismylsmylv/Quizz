import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { FaBalanceScaleLeft } from "react-icons/fa";
import { IoCallSharp, IoPeopleSharp } from "react-icons/io5";
import "./style.scss";
import { useState } from "react";
import { selectHelp, selectedHelp } from "../../redux/slice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
type Props = {
  publicDecide: never;
  phoneDecide: never;
  eliminate: never;
};
interface State {
  quiz: State;
  prevHelp: object[];
}
function Help({ publicDecide, phoneDecide, eliminate }: Props) {
  const [helpType, sethelpType] = useState("");
  const dispatch = useDispatch();
  const prevHelp = useSelector((state: State) => state.quiz.prevHelp);

  const navigate = useNavigate();
  const helps = [
    {
      value: "half",
      icon: <FaBalanceScaleLeft size={30} color="#31304D" />,
      info: "Eliminate two incorrect options",
    },
    {
      value: "call",
      icon: <IoCallSharp size={30} color="#31304D" />,
      info: "Make a call to friend",
    },
    {
      value: "people",
      icon: <IoPeopleSharp size={30} color="#31304D" />,
      info: "Ask viewers",
    },
  ];
  return (
    <div className="helpCont">
      <div className="Help">
        <div
          className="back"
          onClick={() => {
            navigate("/");
          }}
        >
          <MdOutlineKeyboardArrowLeft size={25} color="#31304D" />
        </div>
        <div className="helps">
          {helps.map((help) => {
            return (
              <button
                disabled={prevHelp.find((elem) => elem == help.value)}
                className="help"
                key={help.value}
                onMouseEnter={() => {
                  sethelpType(help.info);
                }}
                onMouseLeave={() => {
                  sethelpType("");
                }}
                onClick={() => {
                  help.value == "people"
                    ? publicDecide()
                    : help.value == "call"
                    ? phoneDecide()
                    : help.value == "half"
                    ? eliminate()
                    : null;
                  //  : console.log(help);
                  dispatch(selectHelp(help.value));
                  dispatch(selectedHelp(help.value));
                }}
              >
                {help.icon}
              </button>
            );
          })}
        </div>
        <div></div>
      </div>
      <div className="info">{helpType}</div>
    </div>
  );
}

export default Help;
