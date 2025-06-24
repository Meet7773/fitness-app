import React, { useState } from 'react';
import { Calculator, HeartPulse, Flame, User, Zap } from 'lucide-react';

export default function CalculatorsPage() {
    // BMI Calculator State
    const [bmiInputs, setBmiInputs] = useState({ height: '', weight: '' });
    const [bmiResult, setBmiResult] = useState(null);

    // Calorie Calculator State
    const [calorieInputs, setCalorieInputs] = useState({
        age: '',
        gender: 'male',
        height: '',
        weight: '',
        activityLevel: '1.2',
        goal: 'maintain',
    });
    const [calorieResult, setCalorieResult] = useState(null);

    // BMI Calculation
    const calculateBmi = () => {
        const heightM = Number(bmiInputs.height) / 100;
        const weightKg = Number(bmiInputs.weight);
        if (!heightM || !weightKg || heightM <= 0 || weightKg <= 0) {
            setBmiResult(null);
            return;
        }
        const bmi = weightKg / (heightM * heightM);
        let category = '';
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi < 24.9) category = 'Normal weight';
        else if (bmi < 29.9) category = 'Overweight';
        else category = 'Obesity';
        setBmiResult({ value: bmi.toFixed(1), category });
    };

    // Calorie Calculation
    const calculateCalories = () => {
        const { age, gender, height, weight, activityLevel, goal } = calorieInputs;
        const ageNum = Number(age);
        const heightNum = Number(height);
        const weightNum = Number(weight);
        if (!ageNum || !heightNum || !weightNum || ageNum <= 0 || heightNum <= 0 || weightNum <= 0) {
            setCalorieResult(null);
            return;
        }
        // Mifflin-St Jeor Equation
        let bmr = gender === 'male'
            ? 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5
            : 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
        let calories = bmr * Number(activityLevel);
        if (goal === 'lose') calories -= 500;
        else if (goal === 'gain') calories += 500;
        setCalorieResult(Math.round(calories));
    };

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="bg-gray-800 rounded-2xl p-6 mb-8">
                <h2 className="text-3xl font-bold flex items-center gap-3 mb-4">
                    <Calculator className="text-cyan-400" /> Fitness Calculators
                </h2>
                <p className="text-gray-300">Use these tools to estimate your BMI and daily calorie needs.</p>
            </div>

            {/* BMI Calculator */}
            <div className="bg-gray-800 rounded-xl p-6 max-w-xl mx-auto">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                    <HeartPulse className="text-pink-400" /> BMI Calculator
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-400 mb-1">Height (cm)</label>
                        <input
                            type="number"
                            name="height"
                            value={bmiInputs.height}
                            onChange={e => setBmiInputs({ ...bmiInputs, height: e.target.value })}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            min="0"
                            placeholder="e.g. 170"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Weight (kg)</label>
                        <input
                            type="number"
                            name="weight"
                            value={bmiInputs.weight}
                            onChange={e => setBmiInputs({ ...bmiInputs, weight: e.target.value })}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            min="0"
                            placeholder="e.g. 65"
                        />
                    </div>
                </div>
                <button
                    onClick={calculateBmi}
                    className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-6 py-2 rounded-lg mt-2"
                >
                    Calculate BMI
                </button>
                {bmiResult && (
                    <div className="mt-6 bg-gray-700/50 p-4 rounded-lg text-center">
                        <p className="text-lg font-semibold text-cyan-400">BMI: {bmiResult.value}</p>
                        <p className="text-gray-300">Category: <span className="font-bold">{bmiResult.category}</span></p>
                    </div>
                )}
            </div>

            {/* Calorie Calculator */}
            <div className="bg-gray-800 rounded-xl p-6 max-w-xl mx-auto">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                    <Flame className="text-orange-400" /> Calorie Calculator
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-400 mb-1">Age</label>
                        <input
                            type="number"
                            name="age"
                            value={calorieInputs.age}
                            onChange={e => setCalorieInputs({ ...calorieInputs, age: e.target.value })}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            min="0"
                            placeholder="e.g. 25"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Gender</label>
                        <select
                            name="gender"
                            value={calorieInputs.gender}
                            onChange={e => setCalorieInputs({ ...calorieInputs, gender: e.target.value })}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Height (cm)</label>
                        <input
                            type="number"
                            name="height"
                            value={calorieInputs.height}
                            onChange={e => setCalorieInputs({ ...calorieInputs, height: e.target.value })}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            min="0"
                            placeholder="e.g. 170"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Weight (kg)</label>
                        <input
                            type="number"
                            name="weight"
                            value={calorieInputs.weight}
                            onChange={e => setCalorieInputs({ ...calorieInputs, weight: e.target.value })}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            min="0"
                            placeholder="e.g. 65"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Activity Level</label>
                        <select
                            name="activityLevel"
                            value={calorieInputs.activityLevel}
                            onChange={e => setCalorieInputs({ ...calorieInputs, activityLevel: e.target.value })}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                        >
                            <option value="1.2">Sedentary (little or no exercise)</option>
                            <option value="1.375">Lightly active (1-3 days/week)</option>
                            <option value="1.55">Moderately active (3-5 days/week)</option>
                            <option value="1.725">Very active (6-7 days/week)</option>
                            <option value="1.9">Super active (hard exercise & physical job)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Goal</label>
                        <select
                            name="goal"
                            value={calorieInputs.goal}
                            onChange={e => setCalorieInputs({ ...calorieInputs, goal: e.target.value })}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                        >
                            <option value="maintain">Maintain Weight</option>
                            <option value="lose">Lose Weight</option>
                            <option value="gain">Gain Weight</option>
                        </select>
                    </div>
                </div>
                <button
                    onClick={calculateCalories}
                    className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 py-2 rounded-lg mt-2"
                >
                    Calculate Calories
                </button>
                {calorieResult && (
                    <div className="mt-6 bg-gray-700/50 p-4 rounded-lg text-center">
                        <p className="text-lg font-semibold text-orange-400">Estimated Calories: {calorieResult} kcal/day</p>
                    </div>
                )}
            </div>
        </div>
    );
}
