import React, { useState, useEffect } from 'react';
import './AttemptUpdate.css';
import hideIcon from "../../icons/hide.png"
import thumbUp from '../../icons/thumb-up-button.png';
import thumbDown from '../../icons/thumb-down-button.png';

function AttemptUpdate({ 
    lifters = [], 
    onAttemptUpdate, 
    onToggleLifterSelection, 
    onDeleteSelectedLifters, 
    selectedLifters = [],
    currentLifterIndex,
    currentAttempt,
    onCompleteAttempt, 
    competitionStarted,
    startCompetition,
    resetCompetition
}) {
    
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
    
        if (newValue > 1000) {
            newValue = 1000;
        }
    
        if (!isNaN(newValue)) {
            onAttemptUpdate(index, attempt, newValue);
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

    const [liftStatus, setLiftStatus] = useState(() => {
        const savedLiftStatus = localStorage.getItem('liftStatus');
        return savedLiftStatus ? JSON.parse(savedLiftStatus) : {};
    });

    useEffect(() => {
    localStorage.setItem('liftStatus', JSON.stringify(liftStatus));
    }, [liftStatus]);

    useEffect(() => {
    const handleStorageChange = (event) => {
        if (event.key === 'liftStatus') {
        setLiftStatus(JSON.parse(event.newValue));
        }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
    }, []);

    const [isTableVisible, setIsTableVisible] = useState(true);

    const toggleTableVisibility = () => {
        setIsTableVisible(!isTableVisible);
    };

    const handleReset = () => {
        setLiftStatus({});
        localStorage.setItem('liftStatus', JSON.stringify({}));
    };

    return (
        <div className="attempt-update-container">
            {selectedLifters.length > 0 && (
                <button onClick={onDeleteSelectedLifters}>Delete Selected</button>
            )}
            {!competitionStarted && (
                    <button onClick={startCompetition}>Start Competition</button>
                )}

            {competitionStarted && (
                            <button onClick={() => {
                                resetCompetition();
                                handleReset();
                            }}>Reset Competition</button>
                        )}

            {/* Hide icon, always visible */}
            <div className="hide-icon-container" onClick={toggleTableVisibility}>
                <div className="icon-background">
                    <img src={hideIcon} alt="Hide Table" />
                </div>
            </div>
            {isTableVisible && (
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
            )}
        </div>
    );       
}

export default AttemptUpdate;

