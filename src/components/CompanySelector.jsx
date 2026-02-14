import React, { useState, useEffect, useRef } from 'react';
import { companies } from '../data/companies';
import '../css/Components.css'; // Assuming we can use existing CSS for basic styles

const CompanySelector = ({ value, onChange, placeholder }) => {
    const [inputValue, setInputValue] = useState(value || '');
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const wrapperRef = useRef(null);

    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleInputChange = (e) => {
        const val = e.target.value;
        setInputValue(val);

        // Filter companies
        if (val.trim()) {
            const filtered = companies.filter(c =>
                c.name.toLowerCase().includes(val.toLowerCase())
            );
            setFilteredCompanies(filtered);
            setShowDropdown(true);

            // Check for exact match to use official logo, otherwise fallback
            const exactMatch = companies.find(c => c.name.toLowerCase() === val.toLowerCase());
            const logo = exactMatch ? exactMatch.logo : `https://ui-avatars.com/api/?name=${encodeURIComponent(val)}&background=random&color=fff&size=128`;

            onChange(val, logo);
        } else {
            setShowDropdown(false);
            onChange(val, null);
        }
    };

    const handleSelectCompany = (company) => {
        setInputValue(company.name);
        onChange(company.name, company.logo);
        setShowDropdown(false);
    };

    return (
        <div className="company-selector-wrapper" ref={wrapperRef}>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => {
                    if (inputValue.trim()) {
                        setFilteredCompanies(companies.filter(c => c.name.toLowerCase().includes(inputValue.toLowerCase())));
                        setShowDropdown(true);
                    }
                }}
                placeholder={placeholder || "Company Name"}
            />

            {showDropdown && filteredCompanies.length > 0 && (
                <ul className="company-dropdown">
                    {filteredCompanies.map((company, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelectCompany(company)}
                            className="company-item"
                        >
                            <img
                                src={company.logo}
                                alt={company.name}
                            />
                            <span>{company.name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CompanySelector;
