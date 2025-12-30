// src/components/ProfileImage.jsx
import React from 'react';

const imageStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '10px',
    border: '2px solid #3498DB', // Sky Blue border
};

const ProfileImage = ({ imageUrl }) => {
    // Use the stored URL or a placeholder if none is uploaded
    const src = imageUrl || 'https://via.placeholder.com/40/2C3E50/FFFFFF?text=P';

    return (
        <img 
            src={src} 
            alt="User Profile" 
            style={imageStyle} 
        />
    );
};

export default ProfileImage;