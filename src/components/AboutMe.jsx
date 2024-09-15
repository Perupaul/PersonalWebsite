import React from "react";
import "./shared.css";
import pdf from "../assets/ResumeFall2024.pdf";

/*Pretty fancy right? I'm sure most of the people looking at 
                this website have seen a lot of websites from a lot of capable computer scientists that show off how skilled
                they are with React and have a nice list of hire-able skills. But lists of skills are boring.*/
function AboutMe() {
  return (
    <div className="main-box">
      <h1>Hello!</h1>
      <p className="left-align">
        My name is Paul George. It's a pleasure to meet you. I'm a senior in
        computer science and physics at the University of Nebraska-Lincoln. In
        other words I'm a nerd. Proud of it too.
      </p>
      <p className="left-align">
        But I'm not the basement-dwelling type of nerd. I like roundnet way too
        much to be in a basement all day after work. Now, you're probably
        wondering what on earth "roundnet" is. You've probably heard of it under
        the name Spikeball.
      </p>
      <p className="left-align">
        Yup, spikeball. You're on a website made by a computer scientist and
        he's talking about that silly trampoline game. Well let me tell ya, that
        silly trampoline game is really fun.
      </p>
      <p className="left-align">
        Don't worry though, I do still like traditional nerdy activities like
        chess and board games, so you can rest assured that I am a true nerd. If
        you're curious about my previous nerdy activities or are a person who's
        in charge of hiring people, you should look at my{" "}
        <a href={pdf} target="_blank" rel="noreferrer" className="link">
          resume
        </a>
        .
      </p>
    </div>
  );
}

export default AboutMe;
