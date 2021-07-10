import "./App.css";
import { useState, useEffect } from "react";
import { FacebookShareButton } from "react-share";
import sound from "./sound.wav";
const url = "https://stormy-earth-76420.herokuapp.com/api";

const audio = new Audio(sound);

const getLocal = () => {
  const value = localStorage.getItem("voted");
  return value ? JSON.parse(value) : "";
};

const getWidth = (total, self) => {
  if (self === 0) return;
  return Math.ceil((self / total) * 100) + "%";
};

function App() {
  const [totalVoteCount, setTotalVoteCount] = useState(0);
  const [brazilsVote, setBrazilsVote] = useState(0);
  const [argentinasVote, setArgentinasVote] = useState(0);
  const [voted, setVoted] = useState(false);
  const [team, setTeam] = useState("");

  useEffect(() => {
    fetch(`${url}/counts`)
      .then((res) => res.json())
      .then((json) => {
        setTotalVoteCount(json.counts);
      });
    fetch(`${url}/counts/brazil`)
      .then((res) => res.json())
      .then((json) => {
        setBrazilsVote(json.counts);
      });
    fetch(`${url}/counts/argentina`)
      .then((res) => res.json())
      .then((json) => {
        setArgentinasVote(json.counts);
      });

    document.body.style.backgroundImage = `url('bg.jpg')`;
    if (getLocal()) {
      setVoted(true);
      setTeam(getLocal());
    }
  }, []);

  const getEmoji = (yes) => {
    if (!voted) return;
    return yes ? "😚" : "😩";
  };

  const handleTeam = (tm) => {
    fetch(`${url}/counts`, { method: "POST" })
      .then((res) => res.json())
      .then((json) => {
        setTotalVoteCount(json.counts);
      });

    if (tm === "bra") {
      setBrazilsVote(brazilsVote + 1);
      fetch(`${url}/counts/brazil`, { method: "POST" })
        .then((res) => res.json())
        .then((json) => {
          setTotalVoteCount(json.counts);
        });
    } else {
      setArgentinasVote(argentinasVote + 1);
      fetch(`${url}/counts/argentina`, { method: "POST" })
        .then((res) => res.json())
        .then((json) => {
          setTotalVoteCount(json.counts);
        });
    }

    setTotalVoteCount(totalVoteCount + 1);
    setTeam(tm);
    localStorage.setItem("voted", JSON.stringify(tm));
    audio.play();
    setVoted(true);
  };

  return (
    <div className="container" id="main">
      <h2>
        Total Votes: <span>{totalVoteCount}</span>
      </h2>

      <div className="box-items">
        <div className="item ">
          <img src="/argentina.png" alt="" />
          <p>
            <span style={{ width: getWidth(totalVoteCount, argentinasVote) }} className="overlay">
              {argentinasVote}
            </span>
          </p>
        </div>
        <div className="item">
          <img src="/brazil.png" alt="" />
          <p>
            <span style={{ width: getWidth(totalVoteCount, brazilsVote) }} className="overlay">
              {brazilsVote}
            </span>
          </p>
        </div>
      </div>

      <div className="vote-container">
        <button onClick={() => handleTeam("arg")} className={voted ? "voted" : ""}>
          <img src="/argentina.png" alt="" />
          <span>{getEmoji(team === "arg")}</span>
        </button>
        <button onClick={() => handleTeam("bra")} className={voted ? "voted" : ""}>
          <img src="/brazil.png" alt="" />
          <span>{getEmoji(team === "bra")}</span>
        </button>
      </div>

      <FacebookShareButton
        {...{
          url: `#main`,
          network: "Facebook",
          text: "Give it a try - react-custom-share component",
          longtext:
            "Social sharing buttons for React. Use one of the build-in themes or create a custom one from the scratch.",
        }}
      >
        <span style={{ color: "blue", textTransform: "capitalize" }}>share with friends</span>
      </FacebookShareButton>
    </div>
  );
}

export default App;
