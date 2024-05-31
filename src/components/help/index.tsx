import { FaBalanceScaleLeft } from "react-icons/fa";
import { IoCallSharp, IoPeopleSharp } from "react-icons/io5";
import "./style.scss";
type Props = {};

function Help({}: Props) {
  const helps = [
    { value: "half", icon: <FaBalanceScaleLeft size={30} color="#31304D" /> },
    { value: "call", icon: <IoCallSharp size={30} color="#31304D" /> },
    { value: "people", icon: <IoPeopleSharp size={30} color="#31304D" /> },
  ];
  return (
    <div className="Help">
      {helps.map((help) => {
        return (
          <div className="help" key={help.value}>
            {help.icon}
          </div>
        );
      })}
    </div>
  );
}

export default Help;
