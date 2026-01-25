import { useCallback, useEffect, useRef, useState } from "react";

interface Position {
	x: number;
	y: number;
}

const MIN_SCALE = 0.25;
const MAX_SCALE = 4;
const ZOOM_SENSITIVITY = 0.001;

export const usePanning = (svgWidth: number, svgHeight: number) => {
	const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
	const [scale, setScale] = useState(1);
	const [initialized, setInitialized] = useState(false);
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	const isDragging = useRef(false);

	const containerRef = useCallback((node: HTMLDivElement | null) => {
		setContainer(node);
	}, []);

	useEffect(() => {
		if (!initialized && typeof window !== "undefined") {
			setPosition({
				x: window.innerWidth / 2 - svgWidth / 2,
				y: window.innerHeight / 2 - svgHeight / 2,
			});
			setInitialized(true);
		}
	}, [svgWidth, svgHeight, initialized]);

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		isDragging.current = true;
	}, []);

	const handleMouseMove = useCallback((e: React.MouseEvent) => {
		if (!isDragging.current) return;
		setPosition((prev) => ({
			x: prev.x + e.movementX,
			y: prev.y + e.movementY,
		}));
	}, []);

	const handleMouseUp = useCallback(() => {
		isDragging.current = false;
	}, []);

	const handleMouseLeave = useCallback(() => {
		isDragging.current = false;
	}, []);

	useEffect(() => {
		if (!container) return;

		const handleWheel = (e: WheelEvent) => {
			e.preventDefault();
			const delta = -e.deltaY * ZOOM_SENSITIVITY;
			const mouseX = e.clientX;
			const mouseY = e.clientY;

			setScale((prevScale) => {
				const newScale = Math.min(
					MAX_SCALE,
					Math.max(MIN_SCALE, prevScale + delta * prevScale),
				);
				const scaleRatio = newScale / prevScale;

				setPosition((prevPos) => ({
					x: mouseX - (mouseX - prevPos.x) * scaleRatio,
					y: mouseY - (mouseY - prevPos.y) * scaleRatio,
				}));

				return newScale;
			});
		};

		container.addEventListener("wheel", handleWheel, { passive: false });
		return () => container.removeEventListener("wheel", handleWheel);
	}, [container]);

	return {
		position,
		scale,
		containerRef,
		handlers: {
			onMouseDown: handleMouseDown,
			onMouseMove: handleMouseMove,
			onMouseUp: handleMouseUp,
			onMouseLeave: handleMouseLeave,
		},
	};
};
