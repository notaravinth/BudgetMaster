const GroceryItem = require('../models/GroceryList');

// Get all grocery items
const getGroceryList = async (req, res) => {
  try {
    const items = await GroceryItem.find({})
      .sort({ category: 1, createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new item
const addGroceryItem = async (req, res) => {
  try {
    const item = new GroceryItem(req.body);
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update item (toggle completed or modify)
const updateGroceryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await GroceryItem.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete item
const deleteGroceryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await GroceryItem.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGroceryList,
  addGroceryItem,
  updateGroceryItem,
  deleteGroceryItem
}; 