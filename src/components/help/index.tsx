import { FaBalanceScaleLeft } from "react-icons/fa";
import { IoCallSharp, IoPeopleSharp } from "react-icons/io5";
import "./style.scss";
import { useState } from "react";
type Props = {};

function Help({}: Props) {
  const [helpType, sethelpType] = useState("");
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
            <div
              className="help"
              key={help.value}
              onMouseEnter={() => {
                sethelpType(help.info);
              }}
              onMouseLeave={() => {
                sethelpType("");
              }}
            >
              {help.icon}
            </div>
          );
        })}
      </div>
      <div className="info">{helpType}</div>
    </div>
  );
}

export default Help;
