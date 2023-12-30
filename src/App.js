import React, { useState, useEffect } from "react";
import "./App.css";
import Registration from "./components/Registration/Registration";
import AttemptUpdate from "./components/AttemptUpdate/AttemptUpdate";
import MainBoard from "./components/MainBoard/MainBoard";

function App() {
    const [lifters, setLifters] = useState(
        () => JSON.parse(localStorage.getItem("lifters")) || []
    );
    const [currentLifterIndex, setCurrentLifterIndex] = useState(
        () => JSON.parse(localStorage.getItem("currentLifterIndex")) || 0
    );
    const [competitionStarted, setCompetitionStarted] = useState(
        () => JSON.parse(localStorage.getItem("competitionStarted")) || false
    );
    const [currentAttempt, setCurrentAttempt] = useState(
        () => localStorage.getItem("currentAttempt") || ""
    );
    const [selectedLifters, setSelectedLifters] = useState(
        () => JSON.parse(localStorage.getItem("selectedLifters")) || []
    );
    const [showRegistration, setShowRegistration] = useState(
        () => JSON.parse(localStorage.getItem("showRegistration")) || true
    );

    useEffect(() => {
        localStorage.setItem("lifters", JSON.stringify(lifters));
        localStorage.setItem(
            "currentLifterIndex",
            JSON.stringify(currentLifterIndex)
        );
        localStorage.setItem(
            "competitionStarted",
            JSON.stringify(competitionStarted)
        );
        localStorage.setItem("currentAttempt", currentAttempt);
        localStorage.setItem(
            "selectedLifters",
            JSON.stringify(selectedLifters)
        );
        localStorage.setItem(
            "showRegistration",
            JSON.stringify(showRegistration)
        );
    }, [
        lifters,
        currentLifterIndex,
        competitionStarted,
        currentAttempt,
        selectedLifters,
        showRegistration,
    ]);

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === "lifters") {
                setLifters(JSON.parse(event.newValue));
            } else if (event.key === "currentLifterIndex") {
                setCurrentLifterIndex(JSON.parse(event.newValue));
            } else if (event.key === "competitionStarted") {
                setCompetitionStarted(JSON.parse(event.newValue));
            } else if (event.key === "currentAttempt") {
                setCurrentAttempt(event.newValue);
            } else if (event.key === "selectedLifters") {
                setSelectedLifters(JSON.parse(event.newValue));
            } else if (event.key === "showRegistration") {
                setShowRegistration(JSON.parse(event.newValue));
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const addLifter = (newLifterData) => {
        setLifters([...lifters, newLifterData]);
    };

    const handleAttemptUpdate = (index, attempt, value) => {
        setLifters(
            lifters.map((lifter, i) => {
                if (i === index) {
                    return { ...lifter, [attempt]: value };
                }
                return lifter;
            })
        );
    };

    const handleCompleteAttempt = (status) => {
        if (status === "good" || status === "no") {
            nextLifter();
        }
    };

    const toggleLifterSelection = (index) => {
        setSelectedLifters((prevSelected) => {
            if (prevSelected.includes(index)) {
                return prevSelected.filter((i) => i !== index);
            } else {
                return [...prevSelected, index];
            }
        });
    };

    const deleteSelectedLifters = () => {
        setLifters(lifters.filter((_, i) => !selectedLifters.includes(i)));
        setSelectedLifters([]);
    };

    const sortLiftersForAttempt = (attempt) => {
        const sortedLifters = [...lifters].sort((a, b) => {
            const weightA = a[attempt] || 0;
            const weightB = b[attempt] || 0;
            return weightA - weightB;
        });
        setLifters(sortedLifters);
        setCurrentLifterIndex(0);
    };

    const nextLifter = () => {
        if (currentLifterIndex === lifters.length - 1) {
            const nextAttempt = getNextAttempt(currentAttempt);
            setCurrentAttempt(nextAttempt);
            sortLiftersForAttempt(nextAttempt);
        } else {
            setCurrentLifterIndex(currentLifterIndex + 1);
        }
    };

    const getNextAttempt = (current) => {
        const attemptsOrder = [
            "squat1",
            "squat2",
            "squat3",
            "bench1",
            "bench2",
            "bench3",
            "deadlift1",
            "deadlift2",
            "deadlift3",
        ];
        const currentIndex = attemptsOrder.indexOf(current);
        return currentIndex >= 0 && currentIndex < attemptsOrder.length - 1
            ? attemptsOrder[currentIndex + 1]
            : null;
    };

    const currentLifter =
        competitionStarted && currentAttempt
            ? lifters[currentLifterIndex]
            : null;

    const startCompetition = () => {
      setCompetitionStarted(true);
      setShowRegistration(false);
      setCurrentAttempt("squat1");
      sortLiftersForAttempt("squat1");
    };

    const resetCompetition = () => {
      const initialLifters = [];
      const initialCurrentLifterIndex = 0;
      const initialCompetitionStarted = false;
      const initialCurrentAttempt = "";
      const initialSelectedLifters = [];
      const initialShowRegistration = true; // Make sure this is set to true
      const initialLiftStatus = {};
  
      setLifters(initialLifters);
      setCurrentLifterIndex(initialCurrentLifterIndex);
      setCompetitionStarted(initialCompetitionStarted);
      setCurrentAttempt(initialCurrentAttempt);
      setSelectedLifters(initialSelectedLifters);
      setShowRegistration(initialShowRegistration); // This should show the Registration component
  
      localStorage.setItem("lifters", JSON.stringify(initialLifters));
      localStorage.setItem("currentLifterIndex", JSON.stringify(initialCurrentLifterIndex));
      localStorage.setItem("competitionStarted", JSON.stringify(initialCompetitionStarted));
      localStorage.setItem("currentAttempt", initialCurrentAttempt);
      localStorage.setItem("selectedLifters", JSON.stringify(initialSelectedLifters));
      localStorage.setItem("showRegistration", JSON.stringify(initialShowRegistration));
      localStorage.setItem("liftStatus", JSON.stringify(initialLiftStatus));

  };

    return (
      <div className="app-container">
            <div className={competitionStarted ? 'vertical-layout' : 'horizontal-layout'}>
                {showRegistration && <Registration onRegister={addLifter} />}
    
                {/* Buttons for starting and resetting the competition */}

                <div className="control-and-attempt">
                    {/* Always display AttemptUpdate */}
                    <AttemptUpdate
                        lifters={lifters}
                        onAttemptUpdate={handleAttemptUpdate}
                        onToggleLifterSelection={toggleLifterSelection}
                        onDeleteSelectedLifters={deleteSelectedLifters}
                        selectedLifters={selectedLifters}
                        currentLifterIndex={currentLifterIndex}
                        currentAttempt={currentAttempt}
                        onCompleteAttempt={handleCompleteAttempt}
                        competitionStarted={competitionStarted}
                        startCompetition={startCompetition}
                        resetCompetition={resetCompetition}
                        />
                </div>
    
                {/* Conditionally display MainBoard when competition has started */}
                {competitionStarted && (
                    <div className="control-and-mainboard">
                        <MainBoard
                            currentLifter={currentLifter}
                            currentAttempt={currentAttempt}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
