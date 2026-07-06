import React, { useState } from 'react';

export const Avatar = ({ src, name, size = 'sm' }) => {
    const [error, setError] = useState(false);
    const initial = (name || '?')[0].toUpperCase();

    const sizeClass = size === 'xs' ? 'avatar-xs' : size === 'sm' ? 'avatar-sm' : 'avatar';
    const fallbackClass = size === 'xs' ? 'avatar-fallback-xs' : size === 'sm' ? 'avatar-fallback-sm' : 'avatar-fallback-lg';

    if (!src || error) {
        return <span className={`${fallbackClass} avatar-fallback`} title={name}>{initial}</span>;
    }

    return (
        <img
            className={sizeClass}
            src={src}
            alt={name}
            onError={() => setError(true)}
        />
    );
};
