import React, { useEffect } from "react";
import { useState } from "react";
import { FormGroup, Checkbox, FormControlLabel } from "@mui/material";
import "./Home.css";
import "./shared.css";

function Home() {
  let [worldDominationCounter, setWorldDominationCounter] = useState(0);
  let [wakeUpCounter, setWakeUpCounter] = useState(0);
  let [worldDomination, setWorldDomination] = useState(false);
  let [wakeUp, setWakeUp] = useState(true);
  let [message, setMessage] = useState("");

  const compute_message = (
    wakeUp,
    worldDomination,
    wakeUpCounter,
    worldDominationCounter
  ) => {
    /*TODO clean this up, maybe a map? */
    if (wakeUp) {
      if (worldDomination) {
        if (worldDominationCounter === 1) {
          setMessage("Well that was pretty easy");
        } else if (worldDominationCounter === 3) {
          setMessage("Even easier the second time");
        } else if (worldDominationCounter === 5) {
          setMessage("They don't seem to be stopping us");
        } else if (worldDominationCounter === 7) {
          setMessage(
            "With my evil goals accomplished, I don't know what to do now"
          );
        } else if (worldDominationCounter === 9) {
          setMessage("Maybe I'll just take a nap");
        } else if (worldDominationCounter === 11) {
          setMessage("zzzzz");
        }
      } else {
        if (wakeUpCounter === 0) {
          setMessage(
            "While I work on step 2, feel free to mess around on the website. I recommend trying out Monster Chess"
          );
        } else if (wakeUpCounter === 2) {
          setMessage("Did I just fall asleep in class???");
        } else if (wakeUpCounter === 4) {
          setMessage("What's going on? I never fall asleep during the day?");
        } else if (wakeUpCounter === 6) {
          setMessage("This can't be natural");
        } else if (wakeUpCounter === 8) {
          setMessage("WHAT IS GOING ON???");
        } else if (wakeUpCounter === 10) {
          setMessage("Wait maybe someone's on my website");
        } else if (wakeUpCounter === 12) {
          setMessage("I hope you're having fun");
        } else if (wakeUpCounter === 14) {
          setMessage(
            "You made me fall asleep in the middle of a chem exam I hope you know"
          );
        } else {
          setMessage(
            "Yup I fell asleep again. I bet you feel proud of yourself"
          );
        }
      }
    } else {
      if (worldDomination) {
        setMessage("I feel like we're skipping something here...");
      } else {
        setMessage("zzzzz");
      }
    }
  };

  const toggleWakeUp = () => {
    compute_message(
      !wakeUp,
      worldDomination,
      wakeUpCounter + 1,
      worldDominationCounter
    );
    setWakeUpCounter(wakeUpCounter + 1);
    setWakeUp(!wakeUp);
  };

  const toggleWorldDomination = () => {
    compute_message(
      wakeUp,
      !worldDomination,
      wakeUpCounter,
      worldDominationCounter + 1
    );
    setWorldDominationCounter(worldDominationCounter + 1);
    setWorldDomination(!worldDomination);
  };

  useEffect(() => {
    compute_message(
      wakeUp,
      worldDomination,
      wakeUpCounter,
      worldDominationCounter
    );
  }, []);

  return (
    <div className="main-box">
      <h1>You seem to have found my website</h1>
      <p>That's good!</p>
      <p>You can help with my plans to take over the world</p>
      <p>Currently the plan looks like this:</p>
      <FormGroup className="centered-box">
        <div className="plan-list">
          <FormControlLabel
            control={<Checkbox checked={wakeUp} onClick={toggleWakeUp} />}
            label="Step 1: Wake up"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={worldDomination}
                onClick={toggleWorldDomination}
              />
            }
            label="Step 2: Take over the world"
          />
        </div>
      </FormGroup>
      <p>{message}</p>
    </div>
  );
}

export default Home;
