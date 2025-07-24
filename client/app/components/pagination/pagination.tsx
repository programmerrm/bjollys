import React from 'react';
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';

export const Pagination: React.FC<{
    totalPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}> = ({ totalPage, currentPage, onPageChange }) => {
    return (
        <ResponsivePagination
            current={currentPage}
            total={totalPage}
            onPageChange={onPageChange}
        />
    );
}
