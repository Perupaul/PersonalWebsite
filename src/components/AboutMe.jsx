import React, { useState, useEffect } from "react";
import "./shared.css";
import "./AboutMe.css";
import resumePdf from "../assets/ResumeFall2024.pdf";
import jugglingGif from "../assets/jugglingPans.gif";
import mePicture from "../assets/MeBackground.jpg";

/*Pretty fancy right? I'm sure most of the people looking at 
                this website have seen a lot of websites from a lot of capable computer scientists that show off how skilled
                they are with React and have a nice list of hire-able skills. But lists of skills are boring.*/
function AboutMe() {
  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const [isMobile, setIsMobile] = useState(width <= 768);

  const message1 =
    "My name is Paul George. It's a pleasure to meet you. I'm a senior in computer science and physics at the University of Nebraska-Lincoln. In other words I'm a nerd. Proud of it too.";

  const message2 =
    "But I'm not the basement-dwelling type of nerd. I like roundnet way too much to be in a basement all day after work. Now, you're probably wondering what on earth \"roundnet\" is. You've probably heard of it under the name Spikeball.";

  const message3 =
    "Yup, spikeball. You're on a website made by a computer scientist and he's talking about that silly trampoline game. Well let me tell ya, that silly trampoline game is really fun.";

  const message4 =
    "I have a lot of fun being silly and doing challenging things. As such I am \"that guy\" on UNL campus who rides a unicycle to classes. Someone had to do it. If you're going to get into clown activities, I don't recommend starting with juggling pans.";

  const message5 =
    "Don't worry though, I do still like traditional nerdy activities like chess and board games, so you can rest assured that I am a true nerd. If you're curious about my previous nerdy activities or are a person who's in charge of hiring people, you should look at my ";

  const resumeLink = (
    <a href={resumePdf} target="_blank" rel="noreferrer" className="link">
      resume
    </a>
  );

  if (!isMobile) {
    return (
      <div className="main-box">
        <h1>Hello!</h1>
        <div className="horizontal-flex-top">
          <img
            src={mePicture}
            style={{ width: "25rem", height: "17rem" }}
            alt="An extremely flattering image of me"
          />
          <div className="padding-left">
            <p className="left-align no-top-margin">{message1}</p>
            <p className="left-align">{message2}</p>
            <p className="left-align">{message3}</p>
          </div>
        </div>
        <div className="horizontal-flex-top">
          <div className="padding-right">
            <p className="left-align no-top-margin">{message4}</p>
            <p className="left-align">
              {message5}
              {resumeLink}.
            </p>
          </div>
          <img
            src={jugglingGif}
            style={{ width: "15rem", height: "18rem" }}
            alt="Juggling pans"
          />
        </div>
      </div>
    );
  } else {
    // isMobile
    return (
      <div className="main-box-mobile">
        <h1>Hello!</h1>
        <img
          src={mePicture}
          style={{ width: width - 20, height: ((width - 20) * 2) / 3 }}
          alt="An extremely flattering image of me"
        />
        <p className="left-align ">{message1}</p>
        <p className="left-align">{message2}</p>
        <p className="left-align">{message3}</p>
        <p className="left-align">{message4}</p>
        <p className="left-align">
          {message5}
          {resumeLink}.
        </p>

        <img
          src={jugglingGif}
          style={{ width: width - 80, height: ((width - 80) * 6) / 5 }}
          alt="Juggling pans"
          className="padding-bottom"
        />
      </div>
    );
  }
}

export default AboutMe;
