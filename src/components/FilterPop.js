import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import "../App.css";

const FilterPopup = ({ isOpen, onClose, availableTags, availableIngredients, onFiltersChange }) => {
    const [includedItems, setIncludedItems] = useState([]);
    const [excludedItems, setExcludedItems] = useState([]);

    const [availableTagsState, setAvailableTagsState] = useState(availableTags);
    const [availableIngredientsState, setAvailableIngredientsState] = useState(availableIngredients);

    const [includedTags, setIncludedTags] = useState([]);
    const [excludedTags, setExcludedTags] = useState([]);
    const [includedIngredients, setIncludedIngredients] = useState([]);
    const [excludedIngredients, setExcludedIngredients] = useState([]);

    const [isLoading, setIsTagsIngredientsLoading] = useState(true);
    const [currentBin, setCurrentBin] = useState("a");
    const [binLimits, setBinLimits] = useState({});


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

    const calculateBinLimits = () => {
        const bins = {
            "a": [0, -1],
            "b": [-1, -1],
            "c": [-1, -1],
            "d": [-1, -1],
            "e": [-1, -1],
            "f": [-1, -1],
            "g": [-1, -1],
            "h": [-1, -1],
            "i": [-1, -1],
            "j": [-1, -1],
            "k": [-1, -1],
            "l": [-1, -1],
            "m": [-1, -1],
            "n": [-1, -1],
            "o": [-1, -1],
            "p": [-1, -1],
            "q": [-1, -1],
            "r": [-1, -1],
            "s": [-1, -1],
            "t": [-1, -1],
            "u": [-1, -1],
            "v": [-1, -1],
            "w": [-1, -1],
            "x": [-1, -1],
            "y": [-1, -1],
            "z": [-1, -1],
        };

        // Because c is the most common first letter, we can optimize the loop by breaking it when we reach c so that we don't need to loop through c

        // Loop through the available ingredients and update the bins
        for (let i = 0; i < availableIngredients.length && i >= 0; i++) {

            const firstLetter = availableIngredients[i][0].toLowerCase();

            if (bins[firstLetter][0] === -1) {
                bins[firstLetter][0] = i;
            }
            if (firstLetter !== "c") {
                bins[firstLetter][1] = i;
            }

            // if the first letter is c, break the loop
            if (firstLetter === "c") {
                break;
            }
        }

        for (let i = availableIngredients.length - 1; i >= 0; i--) {
            const lastLetter = availableIngredients[i][0].toLowerCase();
            
            if (bins[lastLetter][1] === -1) {
                bins[lastLetter][1] = i;
            }

            if (lastLetter !== "c") {
                bins[lastLetter][0] = i;
            }

            // if the first letter is c, break the loop
            if (lastLetter === 'c') {
                break;
            }
        }

        return bins;
    };

    // Update the skip, bin limits, and current bin when the available ingredients change
    useEffect(() => {
        if (!isOpen) return; // Don't run if the popup is closed
        setBinLimits(calculateBinLimits()); // Calculate the bin limits
        setCurrentBin("a"); // Reset to the first bin
    }, [availableIngredients, isOpen]);

    // Update available tags and ingredients when the popup is opened
    useEffect(() => {
        if (isOpen) {
            setIsTagsIngredientsLoading(true); // Start loading when the modal opens
            if (Object.keys(binLimits).length === 0) {
                setBinLimits(calculateBinLimits());
            }

            let currentBinnedIngredients = [];
            let filteredIngredients = [];
            const keys = Object.keys(binLimits);
            let currentIndex = keys.indexOf(currentBin);

            while (currentIndex < keys.length) {
                currentBinnedIngredients = binLimits[keys[currentIndex]] ? availableIngredients.slice(binLimits[keys[currentIndex]][0], binLimits[keys[currentIndex]][1] + 1) : [];
                filteredIngredients = currentBinnedIngredients.filter(ingredient => !includedItems.includes(ingredient) && !excludedItems.includes(ingredient));

                if (currentBinnedIngredients.length > 0 && filteredIngredients.length === 0) {
                    // disable the button if there are no ingredients in the bin
                    binLimits[keys[currentIndex]] = [-1, -1];
                }

                if (filteredIngredients.length > 0) {
                    setCurrentBin(keys[currentIndex]);
                    break;
                }
                currentIndex++;
            }

            // Filter out included and excluded items from available tags/ingredients
            const filteredTags = availableTags.filter(tag => !includedItems.includes(tag) && !excludedItems.includes(tag));

            setAvailableTagsState(filteredTags);
            setAvailableIngredientsState(filteredIngredients);
            setIsTagsIngredientsLoading(false); // Stop loading when the modal opens
        }
    }, [includedItems, excludedItems, currentBin, binLimits]);

    // Helper function to insert an item in sorted order
    const insertInSortedOrder = (array, item) => {
        const newArray = [...array, item]; // Create a new array including the item
        newArray.sort(); // Sort the array alphabetically
        return newArray;
    };


    if (!isOpen) return null; // Don't render anything if not open

    // Add include/exclude a tag
    const addTag = (item, type) => {
        if (type === "include") {
            let temp = [...includedTags, item];
            onFiltersChange(temp, excludedTags, includedIngredients, excludedIngredients);

            setIncludedItems([...includedItems, item]); // Add to included
            // Remove from available tags
            setAvailableTagsState(availableTagsState.filter((i) => i !== item));
            // Add to included tags
            setIncludedTags([...includedTags, item]);
        } else if (type === "exclude") {
            let temp = [...excludedTags, item];
            onFiltersChange(includedTags, temp, includedIngredients, excludedIngredients);

            setExcludedItems([...excludedItems, item]); // Add to excluded
            // Remove from available tags
            setAvailableTagsState(availableTagsState.filter((i) => i !== item));
            // Add to excluded tags
            setExcludedTags([...excludedTags, item]);
        }

    };

    // Add include/exclude an ingredient
    const addIngredient = (item, type) => {
        if (type === "include") {
            let temp = [...includedIngredients, item];
            onFiltersChange(includedTags, excludedTags, temp, excludedIngredients);


            setIncludedItems([...includedItems, item]); // Add to included
            // Remove from available ingredients
            setAvailableIngredientsState(availableIngredientsState.filter((i) => i !== item));
            // Add to included ingredients
            setIncludedIngredients([...includedIngredients, item]);
        } else if (type === "exclude") {
            let temp = [...excludedIngredients, item];
            onFiltersChange(includedTags, excludedTags, includedIngredients, temp);

            setExcludedItems([...excludedItems, item]); // Add to excluded
            // Remove from available ingredients
            setAvailableIngredientsState(availableIngredientsState.filter((i) => i !== item));
            // Add to excluded ingredients
            setExcludedIngredients([...excludedIngredients, item]);
        }
    };

    // Remove an item from included/excluded
    const removeItem = (item, type) => {
        if (type === "include") {
            setIncludedItems(includedItems.filter((i) => i !== item)); // Remove from included

            // check if the item is a tag or ingredient
            if (includedTags.includes(item)) {
                let temp = includedTags.filter((i) => i !== item);
                onFiltersChange(temp, excludedTags, includedIngredients, excludedIngredients);

                setIncludedTags(includedTags.filter((i) => i !== item)); // Remove from included tags
                setAvailableTagsState(insertInSortedOrder(availableTagsState, item)); // Add to available tags
            } else {
                let temp = includedIngredients.filter((i) => i !== item);
                onFiltersChange(includedTags, excludedTags, temp, excludedIngredients);

                setIncludedIngredients(includedIngredients.filter((i) => i !== item)); // Remove from included ingredients
                setAvailableIngredientsState(insertInSortedOrder(availableIngredientsState, item)); // Add to available ingredients
            }
        } else if (type === "exclude") {
            setExcludedItems(excludedItems.filter((i) => i !== item)); // Remove from excluded

            // check if the item is a tag or ingredient
            if (excludedTags.includes(item)) {
                let temp = excludedTags.filter((i) => i !== item);
                onFiltersChange(includedTags, temp, includedIngredients, excludedIngredients);

                setExcludedTags(excludedTags.filter((i) => i !== item)); // Remove from excluded tags
                setAvailableTagsState(insertInSortedOrder(availableTagsState, item)); // Add to available tags
            } else {
                let temp = excludedIngredients.filter((i) => i !== item);
                onFiltersChange(includedTags, excludedTags, includedIngredients, temp);

                setExcludedIngredients(excludedIngredients.filter((i) => i !== item)); // Remove from excluded ingredients
                setAvailableIngredientsState(insertInSortedOrder(availableIngredientsState, item)); // Add to available ingredients
            }
        }
    };

    return (
        <div className="filter-popup-background">
            <div className="filter-popup">
                <h3>FILTERS</h3>

                {/* Included/Excluded Section */}
                <div className="included-excluded-section custom-scroll">
                    <div className="included-items" >
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
                <div className="columns custom-scroll">
                    <div className="tags-column">
                        <h4>TAGS</h4>
                        {!isLoading ? (
                            availableTagsState.length > 0 ? (
                                availableTagsState.map((tag, index) => (
                                    <div key={index} className="tag-item">
                                        <button className="include" onClick={() => addTag(tag, "include")}>
                                            +
                                        </button>
                                        <span>{tag}</span>
                                        <button className="exclude" onClick={() => addTag(tag, "exclude")}>
                                            -
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <span className="no-items">No tags available</span>
                            )
                        ) : (
                            <span className="no-items">Loading...</span>
                        )}

                    </div>

                    <div className="column-separator"></div>

                    <div className="ingredients-column">
                        <h4>INGREDIENTS</h4>
                        {!isLoading ? (
                            availableIngredientsState.length > 0 ? (
                                <>
                                    {availableIngredientsState.map((ingredient, index) => (
                                        <div key={index} className="ingredient-item">
                                            <button className="include" onClick={() => addIngredient(ingredient, "include")}>
                                                +
                                            </button>
                                            <span>{ingredient}</span>
                                            <button className="exclude" onClick={() => addIngredient(ingredient, "exclude")}>
                                                -
                                            </button>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <span className="no-items">No ingredients available</span>
                            )
                        ) : (
                            <span className="no-items">Loading...</span>
                        )}
                    </div>
                        {/* show buttons to navigate between bins */}
                        <div className="bin-buttons">
                            {Object.keys(binLimits).map((bin, index) => (
                                <a className={`${currentBin === bin ? 'active' : ''} ${(binLimits[bin][0] === -1 || binLimits[bin][1] === -1) ? 'disabled' : ''}`}
                                    key={index}
                                    onClick={() => setCurrentBin(bin)}
                                >
                                    {bin}
                                </a>
                            ))}
                        </div>

                </div>
                <IoMdClose className='x-button' onClick={onClose}></IoMdClose>
            </div>
        </div>
    );
};

export default FilterPopup;
