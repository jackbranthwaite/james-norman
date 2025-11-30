import { useEffect, RefObject } from 'react';
import { gsap } from 'gsap';

type LineRefs = {
  topLeft?: RefObject<SVGPathElement | null>;
  topRight?: RefObject<SVGPathElement | null>;
  bottomLeft?: RefObject<SVGPathElement | null>;
  bottomRight?: RefObject<SVGPathElement | null>;
};

type Anchors = {
  topLeft: { x: number; y: number };
  topRight: { x: number; y: number };
  bottomLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
};

export function useParallaxSVG(options: {
  svgRef: RefObject<SVGSVGElement | null>;
  groupRef: RefObject<SVGGElement | null>;
  lineRefs?: LineRefs;
  centerRect: { x: number; y: number; width: number; height: number };
  sensitivity?: number; // default 12
  clamp?: number; // default 50
  margin?: number; // default 6
  viewBox?: { width: number; height: number };
  anchors?: Anchors; // overrides inferred / default anchors
  debugTextRef?: RefObject<SVGTextElement | null>;
}) {
  const {
    svgRef,
    groupRef,
    lineRefs,
    centerRect,
    sensitivity = 12,
    clamp = 50,
    margin = 6,
    viewBox,
    anchors: anchorsOverride,
    debugTextRef,
  } = options;

  useEffect(() => {
    if (!svgRef.current || !groupRef.current) return;

    const svg = svgRef.current;
    const group = groupRef.current;
    const animationState = { x: 0, y: 0 };

    // Determine viewBox dimensions dynamically if not provided
    let viewWidth = viewBox?.width;
    let viewHeight = viewBox?.height;
    if ((!viewWidth || !viewHeight) && svg.viewBox && svg.viewBox.baseVal) {
      viewWidth = svg.viewBox.baseVal.width;
      viewHeight = svg.viewBox.baseVal.height;
    }
    // Fallback defaults (original tablet) if still missing
    if (!viewWidth) viewWidth = 1004;
    if (!viewHeight) viewHeight = 333;

    // Infer anchors from provided override, existing path d attributes, or viewBox corners
    const inferAnchors = (): Anchors => {
      if (anchorsOverride) return anchorsOverride;
      const parseEndpoint = (
        ref?: RefObject<SVGPathElement | null>
      ): { x: number; y: number } | null => {
        const el = ref?.current;
        if (!el) return null;
        const d = el.getAttribute('d');
        if (!d) return null;
        const match = d.match(/L\s*([0-9.+-]+)\s+([0-9.+-]+)/);
        if (!match) return null;
        return { x: parseFloat(match[1]), y: parseFloat(match[2]) };
      };
      const topLeft = parseEndpoint(lineRefs?.topLeft) || { x: 0, y: 0 };
      const topRight = parseEndpoint(lineRefs?.topRight) || {
        x: viewWidth!,
        y: 0,
      };
      const bottomLeft = parseEndpoint(lineRefs?.bottomLeft) || {
        x: 0,
        y: viewHeight!,
      };
      const bottomRight = parseEndpoint(lineRefs?.bottomRight) || {
        x: viewWidth!,
        y: viewHeight!,
      };
      return { topLeft, topRight, bottomLeft, bottomRight };
    };
    const anchors = inferAnchors();

    const { x: cx, y: cy, width: cw, height: ch } = centerRect;

    const updatePositions = (x: number, y: number) => {
      const maxRight = viewWidth - (cx + cw) - margin;
      const maxLeft = -(cx - margin);
      const maxDown = viewHeight - (cy + ch) - margin;
      const maxUp = -(cy - margin);
      const clampedX = Math.max(maxLeft, Math.min(maxRight, x));
      const clampedY = Math.max(maxUp, Math.min(maxDown, y));

      group.setAttribute('transform', `translate(${clampedX}, ${clampedY})`);

      if (lineRefs?.topLeft?.current) {
        const newX = cx + clampedX;
        const newY = cy + clampedY;
        lineRefs.topLeft.current.setAttribute(
          'd',
          `M${newX} ${newY}L${anchors.topLeft.x} ${anchors.topLeft.y}`
        );
      }
      if (lineRefs?.topRight?.current) {
        const newX = cx + cw + clampedX;
        const newY = cy + clampedY;
        lineRefs.topRight.current.setAttribute(
          'd',
          `M${newX} ${newY}L${anchors.topRight.x} ${anchors.topRight.y}`
        );
      }
      if (lineRefs?.bottomLeft?.current) {
        const newX = cx + clampedX;
        const newY = cy + ch + clampedY;
        lineRefs.bottomLeft.current.setAttribute(
          'd',
          `M${newX} ${newY}L${anchors.bottomLeft.x} ${anchors.bottomLeft.y}`
        );
      }
      if (lineRefs?.bottomRight?.current) {
        const newX = cx + cw + clampedX;
        const newY = cy + ch + clampedY;
        lineRefs.bottomRight.current.setAttribute(
          'd',
          `M${newX} ${newY}L${anchors.bottomRight.x} ${anchors.bottomRight.y}`
        );
      }

      if (debugTextRef?.current) {
        debugTextRef.current.textContent = `translate: (${clampedX.toFixed(
          1
        )}, ${clampedY.toFixed(1)})`;
      }
    };

    let initialised = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseX = e.clientX - rect.left - centerX;
      const mouseY = e.clientY - rect.top - centerY;

      const rawX = mouseX / sensitivity;
      const rawY = mouseY / sensitivity;

      const maxRight = viewWidth - (cx + cw) - margin;
      const maxLeft = -(cx - margin);
      const maxDown = viewHeight - (cy + ch) - margin;
      const maxUp = -(cy - margin);

      const clampXMax = Math.min(clamp, Math.max(0, maxRight));
      const clampXMin = Math.max(-clamp, Math.min(0, maxLeft));
      const clampYMax = Math.min(clamp, Math.max(0, maxDown));
      const clampYMin = Math.max(-clamp, Math.min(0, maxUp));

      const targetX = Math.max(clampXMin, Math.min(clampXMax, rawX));
      const targetY = Math.max(clampYMin, Math.min(clampYMax, rawY));

      if (!initialised) {
        gsap.killTweensOf(animationState);
        animationState.x = targetX;
        animationState.y = targetY;
        updatePositions(animationState.x, animationState.y);
        initialised = true;
        return;
      }

      gsap.to(animationState, {
        x: targetX,
        y: targetY,
        duration: 0.6,
        ease: 'power2.out',
        onUpdate: () => updatePositions(animationState.x, animationState.y),
      });
    };

    const handleMouseLeave = () => {
      gsap.to(animationState, {
        x: 0,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        onUpdate: () => updatePositions(animationState.x, animationState.y),
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    svg.addEventListener('mouseleave', handleMouseLeave);
    svg.addEventListener('mouseenter', () => {
      initialised = false;
    });
    updatePositions(0, 0);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      svg.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [
    svgRef,
    groupRef,
    lineRefs,
    centerRect,
    sensitivity,
    clamp,
    margin,
    viewBox,
    anchorsOverride,
    debugTextRef,
  ]);
}
