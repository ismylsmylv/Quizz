import { FaBalanceScaleLeft } from "react-icons/fa";
import { IoCallSharp, IoPeopleSharp } from "react-icons/io5";
import "./style.scss";
import { useState } from "react";
import { selectHelp, selectedHelp } from "../../redux/slice";
import { useDispatch, useSelector } from "react-redux";
type Props = {};

function Help({ publicDecide, phoneDecide }: Props) {
  const [helpType, sethelpType] = useState("");
  const dispatch = useDispatch();
  const prevHelp = useSelector((state) => state.quiz.prevHelp);
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
    <div className="Help">
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
                help.value == "people" ? publicDecide() : phoneDecide();
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
      <div className="info">{helpType}</div>
    </div>
  );
}

export default Help;
