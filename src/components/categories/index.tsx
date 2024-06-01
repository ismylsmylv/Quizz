import { BsBuildingsFill } from "react-icons/bs";
import { IoPlanet, IoStatsChart, IoTennisballOutline } from "react-icons/io5";
import { PiMathOperationsFill } from "react-icons/pi";
import { SlChemistry } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import "./style.scss";
const categories = [
  { name: "sports", icon: <IoTennisballOutline size={30} color="#484742" /> },
  { name: "chemistry", icon: <SlChemistry size={30} color="#484742" /> },
  { name: "economics", icon: <IoStatsChart size={30} color="#484742" /> },
  { name: "astronomy", icon: <IoPlanet size={30} color="#484742" /> },
  { name: "math", icon: <PiMathOperationsFill size={30} color="#484742" /> },
  {
    name: "architecture",
    icon: <BsBuildingsFill size={30} color="#484742" />,
  },
];
function Categories() {
  const navigate = useNavigate();

  return (
    <div className="Categories">
      <div className="head">
        <div className="text">explore quizzes</div>
        <button className="more">view all</button>
      </div>
      <div className="cards">
        {categories.map((category) => {
          return (
            <div
              className="card"
              onClick={() => {
                console.log(category.name);
                navigate("/quiz/" + category.name);
              }}
              key={category.name}
            >
              {category.icon}
              <div className="name">{category.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export { categories };
export default Categories;
