import React, { useEffect, useState } from "react";
import "../App.css";

const FilterPopup = ({ isOpen, onClose, availableTags, availableIngredients, onFiltersChange }) => {
    const [includedItems, setIncludedItems] = useState([]);
    const [excludedItems, setExcludedItems] = useState([]);
    
    const [availableTagsState, setAvailableTagsState] = useState(availableTags);
    const [availableIngredientsState, setAvailableIngredientsState] = useState(availableIngredients);

    // Close the popup when the Esc key is pressed
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose(); // Call the onClose function when Esc is pressed
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown); // Add event listener when modal is open
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown); // Clean up the event listener
        };
    }, [isOpen, onClose]);

    // Update available tags and ingredients when the popup is opened
    useEffect(() => {
        if (isOpen) {
            // Filter out included and excluded items from available tags/ingredients
            const filteredTags = availableTags.filter(tag => !includedItems.includes(tag) && !excludedItems.includes(tag));
            const filteredIngredients = availableIngredients.filter(ingredient => !includedItems.includes(ingredient) && !excludedItems.includes(ingredient));

            setAvailableTagsState(filteredTags);
            setAvailableIngredientsState(filteredIngredients);
        }
    }, [isOpen, availableTags, availableIngredients, includedItems, excludedItems]);

    // Helper function to insert an item in sorted order
    const insertInSortedOrder = (array, item) => {
        const newArray = [...array, item]; // Create a new array including the item
        newArray.sort(); // Sort the array alphabetically
        return newArray;
    };


    if (!isOpen) return null; // Don't render anything if not open

    // Add include/exclude an item
    const addItem = (item, type) => {
        if (type === "include") {

            setIncludedItems([...includedItems, item]); // Add to included
            // Remove from available tags/ingredients
            if (availableTags.includes(item)) {
                setAvailableTagsState(availableTagsState.filter((i) => i !== item));
            } else {
                setAvailableIngredientsState(availableIngredientsState.filter((i) => i !== item));
            }
        } else if (type === "exclude") {

            setExcludedItems([...excludedItems, item]); // Add to excluded
            // Remove from available tags/ingredients
            if (availableTags.includes(item)) {
                setAvailableTagsState(availableTagsState.filter((i) => i !== item));
            } else {
                setAvailableIngredientsState(availableIngredientsState.filter((i) => i !== item));
            }
        }
    };

    // Remove an item from included/excluded
    const removeItem = (item, type) => {
        if (type === "include") {
            setIncludedItems(includedItems.filter((i) => i !== item));
            // Add back to available tags/ingredients in sorted order
            if (availableTags.includes(item)) {
                setAvailableTagsState(prevTags => insertInSortedOrder(prevTags, item));
            } else if (availableIngredients.includes(item)) {
                setAvailableIngredientsState(prevIngredients => insertInSortedOrder(prevIngredients, item));
            } else {
                // just remove from included items
            }
        } else if (type === "exclude") {
            setExcludedItems(excludedItems.filter((i) => i !== item));
            // Add back to available tags/ingredients in sorted order
            if (availableTags.includes(item)) {
                setAvailableTagsState(prevTags => insertInSortedOrder(prevTags, item));
            } else if (availableIngredients.includes(item)) {
                setAvailableIngredientsState(prevIngredients => insertInSortedOrder(prevIngredients, item));
            } else {
                // just remove from excluded items
            }
        }
    };

    return (
        <div className="filter-popup">
            <h3>Filter</h3>

            {/* Included/Excluded Section */}
            <div className="included-excluded-section">
                <div className="included-items">
                    {includedItems.length > 0 ? (
                        includedItems.map((item, index) => (
                            <span key={index} className="included-item" onClick={() => removeItem(item, "include")}>
                                {item}
                            </span>
                        ))
                    ) : (
                        <span className="no-items">No items included</span>
                    )}
                </div>
                <div className="excluded-items">
                    {excludedItems.length > 0 ? (
                        excludedItems.map((item, index) => (
                            <span key={index} className="excluded-item" onClick={() => removeItem(item, "exclude")}>
                                {item}
                            </span>
                        ))
                    ) : (
                        <span className="no-items">No items excluded</span>
                    )}
                </div>
            </div>

            {/* Two Columns: Tags and Ingredients */}
            <div className="columns">
                <div className="tags-column">
                    <h4>Tags</h4>
                    {availableTagsState.length > 0 ? (
                        availableTagsState.map((tag, index) => (
                            <div key={index} className="tag-item">
                                <button onClick={() => addItem(tag, "include")}>
                                    +
                                </button>
                                <span>{tag}</span>
                                <button onClick={() => addItem(tag, "exclude")}>
                                    -
                                </button>
                            </div>
                        ))
                    ) : (
                        <span className="no-items">No tags available</span>
                    )}
                </div>

                <div className="ingredients-column">
                    <h4>Ingredients</h4>
                    {availableIngredientsState.length > 0 ? (
                        availableIngredientsState.map((ingredient, index) => (
                            <div key={index} className="ingredient-item">
                                <button onClick={() => addItem(ingredient, "include")}>
                                    +
                                </button>
                                <span>{ingredient}</span>
                                <button onClick={() => addItem(ingredient, "exclude")}>
                                    -
                                </button>
                            </div>
                        ))
                    ) : (
                        <span className="no-items">No ingredients available</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilterPopup;
