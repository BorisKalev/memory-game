import { useState, useRef, useEffect } from "react";
import shuffle from "../shuffle";
import pokemon1 from "../assets/pokemon1.png";
import pokemon2 from "../assets/pokemon2.png";
import pokemon3 from "../assets/pokemon3.png";
import pokemon4 from "../assets/pokemon4.png";
import pokemon5 from "../assets/pokemon5.png";

const items = [1, 2, 3, 4, 5];
let allItems = shuffle([...items, ...items]);
const defaultState = { index: null, value: null };
const images = {
  1: pokemon1,
  2: pokemon2,
  3: pokemon3,
  4: pokemon4,
  5: pokemon5,
};

export default function MemoryGame() {
  const [firstCard, setFirstCard] = useState(defaultState);
  const [secondCard, setSecondCard] = useState(defaultState);
  const [remainingCards, setRemainingCards] = useState(items);
  const [movesUsed, setMovesUsed] = useState(0);
  const [backEndData, setBackEndData] = useState([]);

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => {
        setBackEndData(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  const timer = useRef();

  const handleOnClick = (index, value) => {
    clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      setFirstCard(defaultState);
      setSecondCard(defaultState);
    }, 1500);

    /*
    we haven't clicked on any card yet or when both first and second card is flipped
    but they are not the same
    */
    if (
      firstCard.index === null ||
      (firstCard.index !== null && secondCard.index !== null)
    ) {
      setSecondCard(defaultState);
      setFirstCard({ index, value });
      setMovesUsed((moves) => moves + 1);
    } else if (secondCard.index === null && firstCard.index !== index) {
      /*
    when the first is selected but not the second
    */
      setSecondCard({ index, value });
      setMovesUsed((moves) => moves + 1 - 1);

      if (firstCard.value === value) {
        setRemainingCards(remainingCards.filter((card) => card !== value));
      }
    }
  };

  const resetGame = () => {
    setRemainingCards(items);
    setFirstCard(defaultState);
    setSecondCard(defaultState);
    setMovesUsed(0);
    allItems = shuffle([...items, ...items]);
  };

  return (
    <>
      <h3>
        {remainingCards.length > 0 ? "Remaining Cards : " : "Victory!"}
        {remainingCards.map((card, index) => {
          return (
            <img key={index} src={images[card]} id="remaining-card-images" />
          );
        })}
      </h3>
      <div className="cardsContainer">
        {allItems.map((item, index) => {
          return (
            <div
              key={index}
              className={`cards ${
                (firstCard.index === index ||
                  secondCard.index === index ||
                  !remainingCards.includes(item)) &&
                "flipped"
              }`}
              onClick={() => handleOnClick(index, item)}
            >
              <div className="backSide"></div>
              <img src={images[item]} alt={`pokemon${item}`} id="card-images" />
            </div>
          );
        })}
      </div>
      <h4>Moves used : {movesUsed}</h4>
      {remainingCards.length === 0 ? (
        <button onClick={resetGame} className="reset-btn">
          Reset Game
        </button>
      ) : (
        ""
      )}

      {typeof backEndData.bestScore === "undefined" ? (
        <p></p>
      ) : (
        backEndData.bestScore.map((score, i) => {
          <p key={i}>{score}</p>;
        })
      )}
    </>
  );
}
