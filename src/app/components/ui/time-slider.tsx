"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "./utils";

interface TimeSliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
    formatLabel?: (value: number) => string;
    label?: string; // "Pickup Time" or "Dropoff Time" shown inside tooltip?
}

function TimeSlider({
    className,
    defaultValue,
    value,
    min = 0,
    max = 100,
    formatLabel,
    label,
    ...props
}: TimeSliderProps) {
    const _values = React.useMemo(
        () =>
            Array.isArray(value)
                ? value
                : Array.isArray(defaultValue)
                    ? defaultValue
                    : [min, max],
        [value, defaultValue, min, max],
    );

    return (
        <SliderPrimitive.Root
            data-slot="slider"
            defaultValue={defaultValue}
            value={value}
            min={min}
            max={max}
            className={cn(
                "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50",
                className,
            )}
            {...props}
        >
            <SliderPrimitive.Track
                data-slot="slider-track"
                className={cn(
                    "bg-gray-100 relative grow overflow-hidden rounded-full h-1.5 w-full",
                )}
            >
                <SliderPrimitive.Range
                    data-slot="slider-range"
                    className={cn(
                        "bg-brand absolute h-full",
                    )}
                />
            </SliderPrimitive.Track>
            {Array.from({ length: _values.length }, (_, index) => (
                <SliderPrimitive.Thumb
                    data-slot="slider-thumb"
                    key={index}
                    className="border-2 border-brand bg-white ring-offset-white block w-6 h-6 shrink-0 rounded-full shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing"
                >
                    {/* Tooltip */}
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center min-w-[80px] z-50">
                        <span className="font-bold text-brand text-xs whitespace-nowrap">
                            {formatLabel ? formatLabel(_values[index]) : _values[index]}
                        </span>
                        {label && (
                            <span className="text-[10px] text-gray-400 font-medium mt-0.5 whitespace-nowrap">
                                {label}
                            </span>
                        )}
                        {/* Arrow */}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-gray-100"></div>
                    </div>
                </SliderPrimitive.Thumb>
            ))}
        </SliderPrimitive.Root>
    );
}

export { TimeSlider };
