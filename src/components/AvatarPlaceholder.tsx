import Image from 'next/image';
import React from 'react';

const AvatarPlaceholder = () => {
    return (
        <div className="relative w-full h-full">
            <Image
                src="/profile.jpg"
                alt="Edward Magejo"
                fill
                sizes="(max-width: 768px) 192px, 512px"
                className="object-cover"
            />
        </div>
    );
};

export default AvatarPlaceholder;
