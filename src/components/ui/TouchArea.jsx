import React, { useRef, useState, useCallback } from 'react';

const TouchArea = ({ 
  onTouchStart, 
  onTouchMove, 
  onTouchEnd, 
  children, 
  className = "",
  disabled = false 
}) => {
  const touchAreaRef = useRef(null);
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = useCallback((e) => {
    if (disabled) return;
    
    e.preventDefault();
    setIsPressed(true);
    
    if (onTouchStart) {
      onTouchStart(e);
    }
  }, [onTouchStart, disabled]);

  const handleTouchMove = useCallback((e) => {
    if (disabled) return;
    
    e.preventDefault();
    
    if (onTouchMove) {
      onTouchMove(e);
    }
  }, [onTouchMove, disabled]);

  const handleTouchEnd = useCallback((e) => {
    if (disabled) return;
    
    e.preventDefault();
    setIsPressed(false);
    
    if (onTouchEnd) {
      onTouchEnd(e);
    }
  }, [onTouchEnd, disabled]);

  // Também suporta mouse para testes no desktop
  const handleMouseDown = useCallback((e) => {
    if (disabled) return;
    
    setIsPressed(true);
    
    // Simula touch event
    const simulatedEvent = {
      ...e,
      touches: [{
        clientX: e.clientX,
        clientY: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY
      }],
      timeStamp: Date.now()
    };
    
    if (onTouchStart) {
      onTouchStart(simulatedEvent);
    }
  }, [onTouchStart, disabled]);

  const handleMouseMove = useCallback((e) => {
    if (disabled || !isPressed) return;
    
    // Simula touch event
    const simulatedEvent = {
      ...e,
      touches: [{
        clientX: e.clientX,
        clientY: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY
      }],
      timeStamp: Date.now()
    };
    
    if (onTouchMove) {
      onTouchMove(simulatedEvent);
    }
  }, [onTouchMove, disabled, isPressed]);

  const handleMouseUp = useCallback((e) => {
    if (disabled) return;
    
    setIsPressed(false);
    
    // Simula touch event
    const simulatedEvent = {
      ...e,
      changedTouches: [{
        clientX: e.clientX,
        clientY: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY
      }],
      timeStamp: Date.now()
    };
    
    if (onTouchEnd) {
      onTouchEnd(simulatedEvent);
    }
  }, [onTouchEnd, disabled]);

  const baseClassName = `
    touch-none select-none user-select-none
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${isPressed ? 'scale-95' : 'scale-100'}
    transition-transform duration-150
    ${className}
  `;

  return (
    <div
      ref={touchAreaRef}
      className={baseClassName}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Para casos onde o mouse sai da área
      style={{
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        KhtmlUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      {children}
    </div>
  );
};

export default TouchArea;
