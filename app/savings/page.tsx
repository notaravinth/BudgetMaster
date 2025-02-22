"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SavingsGoals = () => {
    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState({ name: "", target: "", saved: 0 });
    const [contributionAmounts, setContributionAmounts] = useState({});

    const addGoal = () => {
        if (newGoal.name && newGoal.target) {
            setGoals([
                ...goals,
                {
                    ...newGoal,
                    id: Date.now(),
                    contributions: [{ date: new Date().toLocaleDateString(), amount: 0 }],
                },
            ]);
            setNewGoal({ name: "", target: "", saved: 0 });
        }
    };

    const addContribution = (goalId) => {
        const amount = contributionAmounts[goalId] || 0;
        if (amount > 0) {
            setGoals((prevGoals) =>
                prevGoals.map((goal) =>
                    goal.id === goalId
                        ? {
                            ...goal,
                            saved: goal.saved + amount,
                            contributions: [...goal.contributions, { date: new Date().toLocaleDateString(), amount }],
                        }
                        : goal
                )
            );
            setContributionAmounts((prev) => ({ ...prev, [goalId]: "" }));
        }
    };

    return (
        <div className="p-6 bg-yellow-100 text-gray-800 border-4 border-yellow-500 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-4 text-yellow-700">Savings Goals</h1>
            <div className="mb-4 flex flex-col md:flex-row gap-2">
                <input
                    type="text"
                    placeholder="Goal Name"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                    className="mr-2 p-2 border border-yellow-500 rounded bg-yellow-50"
                />
                <input
                    type="number"
                    placeholder="Target Amount"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: Number(e.target.value) })}
                    className="mr-2 p-2 border border-yellow-500 rounded bg-yellow-50"
                />
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded" onClick={addGoal}>Add Goal</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((goal) => (
                    <Card key={goal.id} className="p-4 border-2 border-yellow-500 bg-yellow-50 shadow-md">
                        <CardContent>
                            <h2 className="text-xl font-semibold text-yellow-700">{goal.name}</h2>
                            <p>🎯 Target: ${goal.target}</p>
                            <p>💰 Saved: ${goal.saved}</p>
                            <div className="my-2">
                                {goal.contributions.length > 0 ? (
                                    <LineChart width={300} height={200} data={goal.contributions}>
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <CartesianGrid strokeDasharray="3 3" stroke="#fbbf24" />
                                        <Line type="monotone" dataKey="amount" stroke="#f59e0b" />
                                    </LineChart>
                                ) : (
                                    <p className="text-gray-500">No contributions yet</p>
                                )}
                            </div>
                            <input
                                type="number"
                                placeholder="Enter amount"
                                value={contributionAmounts[goal.id] || ""}
                                onChange={(e) => setContributionAmounts({ ...contributionAmounts, [goal.id]: Number(e.target.value) })}
                                className="p-2 border border-yellow-500 rounded bg-yellow-50 w-full mt-2"
                            />
                            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mt-2" onClick={() => addContribution(goal.id)}>Add Contribution</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SavingsGoals;

