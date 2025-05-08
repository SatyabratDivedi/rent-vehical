'use client'
import React from 'react';

interface ButtonProps {
  radius: number;
  value: string;
  px: number;
  py: number;
}

const HoverButton = ({ radius, value, px, py }: ButtonProps) => {
  
  return (
    <button className='btn3d bg-primary border-2 border-foreground' style={{ borderRadius: `${radius}px`, paddingInline: `${px}rem`, paddingBlock: `${py}rem` }}>
      {value}
    </button>
  );
};

export default HoverButton;
