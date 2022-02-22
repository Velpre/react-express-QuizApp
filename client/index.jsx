import * as ReactDOM from "react-dom";
import * as React from "react";
import { Link, Routes, Route, BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import {fetchJSON, postJSON, useLodaer} from "./http.jsx";

function Frontpage() {
  const { loading, error, data, reload } = useLodaer(
    async () => await fetchJSON("/api")
  );

  if (loading) {
    return <p>Loading...</p>;
  }

    if(error){
    return <p>{error.toString()}</p>
    }

  return (
    <div>
      <h1>Start quiz</h1>
      <ul>
        <li>
          <Link to={"/random"}>Answer question</Link>
        </li>
        <li>
          <Link to={"/score"}>Check score</Link>
        </li>
      </ul>
    </div>
  );
}

function Answer() {
  const {
    loading,
    error,
    data: question,
    reload,
  } = useLodaer(async () => await fetchJSON("/api/random"));

  async function handleClick(e, userAnswer) {
    e.preventDefault();
    await postJSON("/api/answer", userAnswer, question )
    await reload();
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error.toString()}</p>;
  }

  return (
    <div>
      <h1>{question.question}</h1>
      <ul>
        {Object.keys(question.answers)
          .filter((q) => question.answers[q] != null)
          .map((q) => {
            return (
              <div key={q}>
                <button onClick={(e) => handleClick(e, q)}>
                  {question.answers[q]}
                </button>
              </div>
            );
          })}
      </ul>
      <div>
        <Link to={"/score"}>Check score</Link>
      </div>
    </div>
  );
}

function Score() {
  const { loading, error, data, reload } = useLodaer(
    async () => await fetchJSON("/api/score")
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error.toString()}</p>;
  }

  return (
    <div>
      <h1>Score</h1>
      {data ? (
        <p>
          You have answered: {data.answered} questions, and {data.correct} are
          correct.
        </p>
      ) : (
        <p>You have not started quiz</p>
      )}
      <ul>
        <li>
          <Link to={"/random"}>Next question</Link>
        </li>
        <li>
          <Link to={"/"}>Close Quiz</Link>
        </li>
      </ul>
    </div>
  );
}

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Frontpage />}></Route>
          <Route path="/random" element={<Answer />}></Route>
          <Route path="/score" element={<Score />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
