import React, { useState } from 'react';
import './Registration.css';

function Registration({ onRegister }) {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        sex: '',
        bodyWeight: '',
        weightClass: '',
        squat1: '',
        bench1: '',
        deadlift1: ''
    });

    const [errors, setErrors] = useState({ squat1: '', bench1: '', deadlift1: '' });


    const weightClasses = {
        MX: ['44', '48', '52', '56', '60', '67.5', '75', '82.5', '90', '100', '110', '125', '140', '140+'],
        Men: ['52', '56', '60', '67.5', '75', '82.5', '90', '100', '110', '125', '140', '140+'],
        Women: ['44', '48', '52', '56', '60', '67.5', '75', '82.5', '90', '100', '100+']
    };
    
    const determineWeightClass = (sex, bodyWeight) => {
        const classes = weightClasses[sex];
        let weightClass = classes[classes.length - 1]; 
    
        for (let i = 0; i < classes.length; i++) {
            if (bodyWeight <= parseFloat(classes[i])) {
                weightClass = classes[i];
                break;
            }
        }
    
        return weightClass;
    };
    
    const isValidIncrement = (value) => value % 2.5 === 0;
    const roundDownValue = (value) => Math.floor(value / 2.5) * 2.5;


    const handleChange = (e) => {
        const { name, value } = e.target;
        
        const newFormData = { ...formData, [name]: value };

        if (name === 'sex' || name === 'bodyWeight') {
            const newWeightClass = determineWeightClass(newFormData.sex, newFormData.bodyWeight);
            newFormData.weightClass = newWeightClass;
        }

        if (['squat1', 'bench1', 'deadlift1'].includes(name)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: isValidIncrement(parseFloat(value)) ? '' : 'Values must be in 2.5 kg increments'
            }));
        }

        setFormData(newFormData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let newFormData = {...formData};
        let showAlert = false;

        ['squat1', 'bench1', 'deadlift1'].forEach(lift => {
            if (!isValidIncrement(parseFloat(newFormData[lift]))) {
                newFormData[lift] = roundDownValue(parseFloat(newFormData[lift]));
                showAlert = true;
            }
        });

        if (showAlert) {
            alert('One or more of your openers was invalid and has been rounded down to a valid value.');
        }

        onRegister(newFormData);
        setFormData(newFormData);
    };

    return (
        <div className="registration-container">
            <h2>Register Lifter</h2>
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Age:</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Sex:</label>
                    <select name="sex" value={formData.sex} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Men">Male</option>
                        <option value="Women">Female</option>
                        <option value="MX">MX</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Body Weight:</label>
                    <input type="number" name="bodyWeight" value={formData.bodyWeight} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Weight Class:</label>
                    <input type="text" name="weightClass" value={formData.weightClass} readOnly />
                </div>
                <div className="form-group">
                    <label>Squat 1:</label>
                    <input type="number" name="squat1" value={formData.squat1} onChange={handleChange} />
                    {errors.squat1 && <div className="error-text">{errors.squat1}</div>}
                </div>
                <div className="form-group">
                    <label>Bench 1:</label>
                    <input type="number" name="bench1" value={formData.bench1} onChange={handleChange} />
                    {errors.bench1 && <div className="error-text">{errors.bench1}</div>}
                </div>
                <div className="form-group">
                    <label>Deadlift 1:</label>
                    <input type="number" name="deadlift1" value={formData.deadlift1} onChange={handleChange} />
                    {errors.deadlift1 && <div className="error-text">{errors.deadlift1}</div>}
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Registration;

