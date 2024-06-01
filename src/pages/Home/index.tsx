import { useNavigate } from "react-router-dom";
import Categories from "../../components/categories";
import GuyImg from "./../../assets/img/guy2.png";
import "./style.scss";
import { categories } from "../../components/categories";
function Home() {
  const navigate = useNavigate();

  return (
    <div className="home app">
      <div className="logo">Quizz</div>
      <div className="starter">
        <div className="left">
          <div className="head">Your daily Quiz</div>
          <div className="subHead">Answer to random topic each day</div>
          <button
            className="start"
            onClick={() => {
              const random = Math.floor(Math.random() * categories.length);
              console.log(random, categories[random]);
              navigate(`/quiz/${categories[random].name}`);
            }}
          >
            start now
          </button>
        </div>
        <div className="right">
          <img src={GuyImg} alt="" className="guy" />
        </div>
      </div>
      <Categories />
    </div>
  );
}

export default Home;
