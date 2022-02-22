import express from "express";
import path from "path";
import { randomQuestion, isCorrectAnswer, Questions } from "./questions.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.get("/api", (req, res) => {
  if (req.signedCookies.score){
    res.clearCookie("score");
  }
  res.sendStatus(200);
});

app.get("/api/random", (req, res) => {
  const { id, question, answers } = randomQuestion();
  res.json({ id, question, answers });
});

app.post("/api/answer", (req, res) => {
  const { answer, question } = req.body;
  const chosenQuestion = Questions.find((q) => q.id == question.id);
  const result = isCorrectAnswer(chosenQuestion, answer);

  if (!chosenQuestion) {
    return res.sendStatus(404);
  }

  const score = req.signedCookies.score
    ? JSON.parse(req.signedCookies.score)
    : { answered: 0, correct: 0 };
  score.answered += 1;

  if (result) {
    score.correct += 1;
    res.cookie("score", JSON.stringify(score), {signed:true});
    res.send("correct");
  } else {
    res.cookie("score", JSON.stringify(score), {signed:true});
    res.send("incorrect");
  }
});

app.get("/api/score", (req, res) => {

      if(req.signedCookies.score){
          const {correct, answered} = JSON.parse(req.signedCookies.score);
          res.json({correct, answered})
      }else{
        res.sendStatus(200);
      }

});

app.use(express.static("../client/dist"));
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    res.sendFile(path.resolve("../client/dist/index.html"));
  } else {
    next();
  }
});

const server = app.listen(process.env.PORT || 4000, () => {
  console.log(`server running on: http://localhost:${server.address().port}`);
});
