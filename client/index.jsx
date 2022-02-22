import * as ReactDOM from "react-dom";
import * as React from "react";
import {Link, Routes, Route, BrowserRouter} from "react-router-dom";
import {useEffect, useState} from "react";

function Frontpage(){

    useEffect(async () => {
        await fetch("/api");
    }, [])


return <div>
    <h1>Start quiz</h1>
    <ul>
        <li><Link to={"/random"}>Answer question</Link></li>
        <li><Link to={"/score"}>Check score</Link></li>
    </ul>
</div>
}

 function Answer() {
    const [question, setQuestion] = useState();
    const [loading, setLoading] = useState(true)
     const [error, setError] = useState();

 useEffect(async () => {
        setLoading(true)
        try{
            const res = await fetch("/api/random");
            setQuestion(await res.json())
        }catch (error) {
            setError(error)
        }finally {
            setLoading(false)
        }


    }, [])

    async function handleClick(e, data) {
        e.preventDefault();
        await fetch("/api/answer", {
            method: "post",
            body: JSON.stringify({answer: data, question}),
            headers: {
                "content-type": "application/json"
            },
        })

        await ans();
    }


    async function ans(){
        const res = await fetch("/api/random");
        setQuestion(await res.json())
    }


    if (loading){
        return <p>Loading...</p>
    }

    if(error){
        return <p>{error.toString()}</p>
    }

        return <div>
            <h1>{question.question}</h1>
            <ul>
                {
                    Object.keys(question.answers)
                        .filter((q) => question.answers[q] != null)
                        .map((q) => {
                            return <div key={q}>
                                <button onClick={(e) => handleClick(e, q)}>{question.answers[q]}</button>
                            </div>
                        })
                }
            </ul>
            <div>
                <Link to={"/score"}>Check score</Link>
            </div>
        </div>;
}




function Score() {
    const [answered, setAnswered] = useState();
    const [correct, setCorrect] = useState();

    useEffect(async ()=>{
        const res = await fetch("/api/score")
        const {correct, answered} = await res.json()
        setAnswered(answered);
        setCorrect(correct);
    }, [])

    return <div>
        <h1>Score</h1>
        {answered && correct ?  <p>You have answered: {answered} questions, and {correct} are correct.</p> : <p>You have not started quiz</p>}
        <ul>
            <li><Link to={"/random"}>Next question</Link></li>
            <li><Link to={"/"}>Close Quiz</Link></li>
        </ul>
    </div>
}

function App(){
    return <div>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Frontpage/>}></Route>
                <Route path="/random" element={<Answer/>}></Route>
                <Route path="/score" element={<Score/>}></Route>
            </Routes>
        </BrowserRouter>
    </div>
}

ReactDOM.render(
    <App/>,
    document.getElementById("root")
)