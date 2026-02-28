import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
    children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
    const location = useLocation();
    const [displayChildren, setDisplayChildren] = useState(children);
    const [transitionStage, setTransitionStage] = useState<'enter' | 'exit'>('enter');
    const prevLocation = useRef(location.pathname);

    useEffect(() => {
        if (location.pathname !== prevLocation.current) {
            setTransitionStage('exit');

            const timeout = setTimeout(() => {
                setDisplayChildren(children);
                setTransitionStage('enter');
                prevLocation.current = location.pathname;
                // Scroll to top on page change
                window.scrollTo(0, 0);
            }, 150); // Exit duration

            return () => clearTimeout(timeout);
        } else {
            setDisplayChildren(children);
        }
    }, [location.pathname, children]);

    return (
        <div
            className={`page-transition ${transitionStage === 'enter' ? 'page-enter' : 'page-exit'
                }`}
        >
            {displayChildren}
        </div>
    );
}
