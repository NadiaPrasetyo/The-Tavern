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
            "A-C": [0, -1],
            "D-L": [-1, -1],
            "M-R": [-1, -1],
            "S-Z": [-1, availableIngredients.length - 1],
        };

        for (let i = 0; i < availableIngredients.length && i >= 0; i ++) {

            const firstLetter = availableIngredients[i][0].toUpperCase();

            if (firstLetter >= "A" && firstLetter <= "C") {
                bins["A-C"][1] = i;
            } else if (firstLetter >= "D" && firstLetter <= "L") {
                if (bins["D-L"][0] === -1) {
                    bins["D-L"][0] = i;
                }
                bins["D-L"][1] = i;
            } else if (firstLetter >= "M" && firstLetter <= "R") {
                if (bins["M-R"][0] === -1) {
                    bins["M-R"][0] = i;
                }
                bins["M-R"][1] = i;
            } else if (firstLetter >= "S" && firstLetter <= "Z") {
                bins["S-Z"][0] = i;
                break;
            }
        }
        return bins;
    };

    // Update the skip, bin limits, and current bin when the available ingredients change
    useEffect(() => {
        if (!isOpen) return; // Don't run if the popup is closed
        setBinLimits(calculateBinLimits()); // Calculate the bin limits
        setCurrentBin("A-C"); // Reset to the first bin
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
                                    {/* show buttons to navigate between bins */}
                                    <div className="bin-buttons">
                                        {Object.keys(binLimits).map((bin, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentBin(bin)}
                                                disabled={binLimits[bin][0] === -1 || binLimits[bin][1] === -1}
                                            >
                                                {bin}
                                            </button>
                                        ))}
                                    </div>
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
                </div>
                <IoMdClose className='x-button' onClick={onClose}></IoMdClose>
            </div>
        </div>
    );
};

export default FilterPopup;
