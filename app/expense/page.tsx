"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import { Trash2 } from "lucide-react";

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
        <div className="min-h-screen bg-yellow-400 p-10">
            <h1 className="text-3xl font-bold text-black text-center">Bumblebee Expense Tracker</h1>
            <Card className="mt-6 bg-black text-yellow-300 p-6 rounded-xl shadow-lg">
                <CardContent>
                    <div className="flex gap-4">
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
                    <Table className="mt-6 w-full border border-yellow-500">
                        <thead>
                        <tr className="bg-yellow-600 text-black">
                            <th className="p-2">Description</th>
                            <th className="p-2">Amount</th>
                            <th className="p-2">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {expenses.map((expense) => (
                            <tr key={expense.id} className="border-t border-yellow-500 text-yellow-300">
                                <td className="p-2">{expense.description}</td>
                                <td className="p-2">${expense.amount}</td>
                                <td className="p-2">
                                    <Button variant="ghost" onClick={() => deleteExpense(expense.id)}>
                                        <Trash2 className="text-red-500" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ExpenseTracker;
