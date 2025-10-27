import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../../styles/Pagination.css';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) {
        return null; // Não mostra paginação se houver apenas 1 página
    }

    const handlePageClick = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        onPageChange(pageNumber);
    };

    // Gera os números das páginas (simplificado, sem "...")
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="pagination-container">
            <button
                className="pagination-arrow"
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <FaChevronLeft />
            </button>
            
            {pageNumbers.map(number => (
                <button
                    key={number}
                    className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                    onClick={() => handlePageClick(number)}
                >
                    {number}
                </button>
            ))}
            
            <button
                className="pagination-arrow"
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <FaChevronRight />
            </button>
        </nav>
    );
};

export default Pagination;