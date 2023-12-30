import React, { useState } from 'react';
import './LifterBoard.css'; // Assuming combined CSS of MainBoard and AttemptUpdate
import thumbUp from '../../icons/thumb-up-button.png';
import thumbDown from '../../icons/thumb-down-button.png';

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

    let weightToLoad = attemptWeight - 25;
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


function LifterBoard({
    lifters, 
    onAttemptUpdate, 
    onToggleLifterSelection, 
    onDeleteSelectedLifters, 
    selectedLifters,
    currentLifterIndex,
    currentAttempt,
    onCompleteAttempt, 
    competitionStarted
}) {
    const [liftStatus, setLiftStatus] = useState({});

    const attemptsOrder = [
        'squat1', 'squat2', 'squat3', 
        'bench1', 'bench2', 'bench3', 
        'deadlift1', 'deadlift2', 'deadlift3'
    ];    

    const currentAttemptIndex = attemptsOrder.indexOf(currentAttempt);

    const updateLiftStatus = (index, attempt, event) => {
        if (!competitionStarted) {
            return;
        }

        const attemptsOrder = ['squat1', 'squat2', 'squat3', 'bench1', 'bench2', 'bench3', 'deadlift1', 'deadlift2', 'deadlift3'];
        const currentAttemptIndex = attemptsOrder.indexOf(currentAttempt);
        const attemptIndex = attemptsOrder.indexOf(attempt);

        if (attemptIndex > currentAttemptIndex) {
            return;
        }

        if (lifters[index][attempt]) {
            const rect = event.currentTarget.getBoundingClientRect();
            const isLeftSide = (event.clientX - rect.left) < rect.width / 2;
            const newStatus = isLeftSide ? 'good' : 'no';

            if (liftStatus[`${index}-${attempt}`] !== newStatus) {
                setLiftStatus({ ...liftStatus, [`${index}-${attempt}`]: newStatus });
                if (index === currentLifterIndex && attempt === currentAttempt) {
                    onCompleteAttempt(newStatus);
                }
            }
        }
    };

    const handleKeyDown = (e, index, attempt) => {
        if (e.key === 'Tab') {
        e.preventDefault();
        const nextIndex = (index + 1) % lifters.length;
        const nextInputId = `input-${attempt}-${nextIndex}`;
        document.getElementById(nextInputId)?.focus();
        }
    };

    const handleInputChange = (index, attempt, value) => {
        let newValue = value === '' ? '' : parseFloat(value);
        if (newValue > 1000) newValue = 1000;
        if (!isNaN(newValue)) {
            const updatedLifter = { ...lifters[index] };
            updatedLifter[attempt] = { ...updatedLifter[attempt], value: newValue };
            onAttemptUpdate(index, updatedLifter);
        }
    };
    
    const handleInputBlur = (index, attempt, value) => {
        let newValue = value === '' ? '' : parseFloat(value);
    
        // Round down to nearest 2.5 increment and cap at 1000
        if (!isNaN(newValue) && newValue !== '') {
            newValue = Math.floor(newValue / 2.5) * 2.5;
            newValue = Math.min(newValue, 1000);
        }
    
        if (!isNaN(newValue)) {
            onAttemptUpdate(index, attempt, newValue);
        }
    };    

    const calculateTotal = (lifter) => {
        const lifts = ['squat', 'bench', 'deadlift'];
        let total = 0;
    
        lifts.forEach(lift => {
            let bestAttempt = 0;
            for (let i = 1; i <= 3; i++) {
                const attempt = `${lift}${i}`;
                if (liftStatus[`${lifter.index}-${attempt}`] === 'good') {
                    bestAttempt = Math.max(bestAttempt, parseFloat(lifter[attempt]) || 0);
                }
            }
            total += bestAttempt;
        });
    
        return total;
    };  

    const currentLifter = lifters[currentLifterIndex];
    const attemptWeight = currentLifter ? currentLifter[currentAttempt] : 25; 
    const platesNeeded = calculatePlates(attemptWeight);

    return (
        <div className="lifter-board-container">
            {/* MainBoard's lifter and attempt display */}
            <div className="mainboard-container">
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
            </div>

            {/* AttemptUpdate's table and attempt management */}
            <div className="attempt-update-container">
            <h2>Attempt Update</h2>
            {selectedLifters.length > 0 && (
                <button onClick={onDeleteSelectedLifters}>Delete Selected</button>
            )}
            <table className="attempt-update-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Squat 1</th>
                        <th>Squat 2</th>
                        <th>Squat 3</th>
                        <th>Bench 1</th>
                        <th>Bench 2</th>
                        <th>Bench 3</th>
                        <th>Deadlift 1</th>
                        <th>Deadlift 2</th>
                        <th>Deadlift 3</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {lifters.map((lifter, index) => (
                        <tr key={index}>
                            <td>
                                <div className="custom-checkbox">
                                    <input
                                        id={`checkbox-${index}`}
                                        type="checkbox"
                                        checked={selectedLifters.includes(index)}
                                        onChange={() => onToggleLifterSelection(index)}
                                    />
                                    <label htmlFor={`checkbox-${index}`}></label>
                                </div>
                            </td>
                            <td>{lifter.name}</td>
                            {['squat1', 'squat2', 'squat3', 'bench1', 'bench2', 'bench3', 'deadlift1', 'deadlift2', 'deadlift3'].map(attempt => {
                                const attemptIndex = attemptsOrder.indexOf(attempt);
                                const isCurrentAttempt = attemptIndex === currentAttemptIndex;
                                const attemptHasValue = lifter[attempt] && lifter[attempt] !== '';
                                const showHoverIcons = competitionStarted && (isCurrentAttempt ? attemptHasValue : attemptIndex < currentAttemptIndex);
                                return (
                                    <td key={attempt} 
                                        style={{ backgroundColor: liftStatus[`${index}-${attempt}`] === 'good' ? 'green' : liftStatus[`${index}-${attempt}`] === 'no' ? 'red' : 'none' }}
                                        onClick={(e) => updateLiftStatus(index, attempt, e)}>
                                        <input
                                            id={`input-${attempt}-${index}`}
                                            type="number"
                                            value={lifter[attempt] || ''}
                                            onChange={(e) => handleInputChange(index, attempt, e.target.value)}
                                            onBlur={(e) => handleInputBlur(index, attempt, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, index, attempt)}
                                        />
                                        {showHoverIcons && (
                                            <div className="hover-icons">
                                                <img src={thumbUp} alt="Good Lift" className="left-icon" />
                                                <img src={thumbDown} alt="No Lift" className="right-icon" />
                                            </div>
                                        )}
                                    </td>
                                );
                            })}
                            <td>{calculateTotal({...lifter, index})}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
}

export default LifterBoard;
