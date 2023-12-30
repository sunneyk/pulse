import React, { useState, useEffect } from 'react';
import hideIcon from "../../icons/hide.png"
import './MainBoard.css';

function calculatePlates(attemptWeight) {
    const plates = [
        { weight: 25, color: 'red' },
        { weight: 20, color: 'blue' },
        { weight: 15, color: 'yellow' },
        { weight: 10, color: 'green' },
        { weight: 5, color: 'white' },
        { weight: 2.5, color: 'black' },
        { weight: 1.25, color: 'silver' },
    ];

    let weightToLoad = attemptWeight - 25; // subtracting bar and collar
    let platesNeeded = [];

    plates.forEach(plate => {
        const count = Math.floor(weightToLoad / (2 * plate.weight));
        if (count > 0) {
        platesNeeded.push({ ...plate, count });
        weightToLoad -= count * 2 * plate.weight;
        }
    });

    return platesNeeded;
}

function MainBoard({ currentLifter, currentAttempt }) {
    const attemptWeight = currentLifter ? currentLifter[currentAttempt] : 25; 
    const platesNeeded = calculatePlates(attemptWeight);

    const [isContentVisible, setIsContentVisible] = useState(true);

    const toggleContentVisibility = () => {
        setIsContentVisible(!isContentVisible);
    };

    return (
        <div className="mainboard-container">
            <div className="hide-icon-container" onClick={toggleContentVisibility}>
                <div className="icon-background">
                    <img src={hideIcon} alt="Hide Content" />
                </div>
            </div>
            {isContentVisible && (
                <>
                    <h2>Current Lifter</h2>
        {currentLifter ? (
            <div className="mainboard-lifter-info">
            <p>{currentLifter.name}</p>
            <p>{currentAttempt.toUpperCase().replace(/(\d)/g, ' $1')}: {attemptWeight} kg</p>
            <p>{currentLifter.sex}'s {currentLifter.weightClass} kg</p>
            <p>Age: {currentLifter.age}</p>
            <div className="barbell">
            <div className="barbell-end"></div>
            {platesNeeded.map((plate, index) => (
            <React.Fragment key={index}>
                {[...Array(plate.count)].map((_, idx) => (
                <div key={idx} className={`plate ${plate.color}`}></div>
                ))}
            </React.Fragment>
            ))}
            <div className="bar"></div>
            <div className="collar"></div>
        </div>
            </div>
        ) : (
            <p>No lifter on the platform</p>
        )}
                </>
            )}
        
        
        </div>
    );
}

export default MainBoard;
