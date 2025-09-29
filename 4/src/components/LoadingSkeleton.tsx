'use client';

import React from 'react';

interface LoadingSkeletonProps {
    className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className = '' }) => {
    return (
        <div className={`animate-pulse ${className}`}>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
    );
};

export default LoadingSkeleton;
