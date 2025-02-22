"use client"

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const ExpenseTracker = () => {
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({ description: "", amount: "" });

    useEffect(() => {
        fetch("https://api.example.com/expenses") // Replace with your API
            .then((res) => res.json())
            .then((data) => setExpenses(data))
            .catch((err) => console.error("Error fetching expenses", err));
    }, []);

    const addExpense = async () => {
        if (!newExpense.description || !newExpense.amount) return;
        const expense = { ...newExpense, id: Date.now() };
        setExpenses([...expenses, expense]);
        setNewExpense({ description: "", amount: "" });
        // Post to API
        await fetch("https://api.example.com/expenses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expense),
        });
    };

    const deleteExpense = async (id) => {
        setExpenses(expenses.filter((expense) => expense.id !== id));
        // Delete from API
        await fetch(`https://api.example.com/expenses/${id}`, { method: "DELETE" });
    };

    return (
        <div className="flex items-center justify-center min-h-screen  p-10">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="w-96 bg-gold-3 text-black p-6 rounded-xl shadow-lg">
                    <CardContent>
                        <h1 className="text-2xl font-bold text-center mb-4">Transactions</h1>
                        <div className="flex flex-col gap-4">
                            <Input
                                placeholder="Description"
                                value={newExpense.description}
                                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                            />
                            <Input
                                type="number"
                                placeholder="Amount"
                                value={newExpense.amount}
                                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                            />
                            <Button onClick={addExpense} className="bg-yellow-500 hover:bg-yellow-600 text-black">Add</Button>
                        </div>

                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default ExpenseTracker;