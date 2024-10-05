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
    const [currentBin, setCurrentBin] = useState("A-C");
    const [skip, setSkip] = useState(Math.max(1, Math.floor(availableIngredients.length / 50)));


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
        if (availableIngredients.length === 0) return {};
        const bins = {
            "A-C": [0, 0],
            "D-L": [0, 0],
            "M-R": [0, 0],
            "S-Z": [0, availableIngredients.length - 1],
        };

        let curr = "A-C"; 
        let backtracking = false;
        for (let i = 0; i <availableIngredients.length && i >=0 ; backtracking ? i-- : i+=skip) {

            if (availableIngredients[i] === undefined) {
                continue;
            }

            const firstLetter = availableIngredients[i][0].toUpperCase();

            if (firstLetter >= "A" && firstLetter <= "C" ) {
                if (backtracking && curr === "A-C") {
                    backtracking = false;
                    bins["A-C"][1] = i;
                    bins["D-L"][0] = i+1;
                    curr = "D-L";
                }
                bins["A-C"][1] = i;
            } else if (firstLetter >= "D" && firstLetter <= "L") {
                if (curr === "A-C") {
                    backtracking = true;
                }

                if (backtracking && curr === "D-L") {
                    backtracking = false;
                    bins["D-L"][1] = i;
                    bins["M-R"][0] = i+1;
                    curr = "M-R";
                }
                bins["D-L"][1] = i;
            } else if (firstLetter >= "M" && firstLetter <= "R") {
                if (curr === "D-L") {
                    backtracking = true;
                }

                if (backtracking && curr === "M-R") {
                    backtracking = false;
                    bins["M-R"][1] = i;
                    bins["S-Z"][0] = i+1;
                    curr = "S-Z";
                }
                bins["M-R"][1] = i;
            } else if (firstLetter >= "S" && firstLetter <= "Z") {
                if (curr === "M-R") {
                    backtracking = true;
                }
            }
        }
        console.log(bins);
        return bins;
    }

    const [binLimits, setBinLimits] = useState(calculateBinLimits());


    // Update the skip, bin limits, and current bin when the available ingredients change
    useEffect(() => {
        if (!isOpen) return; // Don't run if the popup is closed
        setSkip(Math.max(1, Math.floor(availableIngredients.length / 50))); // Update skip
        setBinLimits(calculateBinLimits()); // Update bin limits
        setCurrentBin("A-C"); // Reset to the first bin
    }, [availableIngredients, isOpen]);

    // Update available tags and ingredients when the popup is opened
    useEffect(() => {
        if (isOpen) {
            setIsTagsIngredientsLoading(true); // Start loading when the modal opens

            const currentBinnedIngredients = binLimits[currentBin] ? availableIngredients.slice(binLimits[currentBin][0], binLimits[currentBin][1] + 1) : [];
            // Filter out included and excluded items from available tags/ingredients
            const filteredTags = availableTags.filter(tag => !includedItems.includes(tag) && !excludedItems.includes(tag));
            const filteredIngredients = currentBinnedIngredients.filter(ingredient => !includedItems.includes(ingredient) && !excludedItems.includes(ingredient));

            setAvailableTagsState(filteredTags);
            setAvailableIngredientsState(filteredIngredients);
            setIsTagsIngredientsLoading(false); // Stop loading when the modal opens
        }
    }, [isOpen, availableTags, availableIngredients, includedItems, excludedItems, currentBin]);

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
                                {/* show buttons to navigate between bins */}
                                <div className="bin-buttons">
                                    {Object.keys(binLimits).map((bin, index) => (
                                        <button 
                                            key={index} 
                                            onClick={() => setCurrentBin(bin)}
                                            disabled={binLimits[bin][0] === binLimits[bin][1]}
                                        >
                                            {bin}
                                        </button>
                                    ))}
                                </div>
                                </>
                            ) : (
                                <span className="no-items">No ingredients available</span>
                            )
                        ) : (
                            <span className="no-items">Loading...</span>
                        )}
                    </div>
                </div>
                <IoMdClose className='x-button' onClick={onClose}></IoMdClose>
            </div>
        </div>
    );
};

export default FilterPopup;
