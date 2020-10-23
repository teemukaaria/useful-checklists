import { Ref, watchEffect } from 'vue';

export const useBlurOnClick = (elemRef: Ref<HTMLElement | null>) => {
  const stop = watchEffect(() => {
    if (elemRef.value) {
      const onMouseDown = () => {
        if (!elemRef.value) return;
        elemRef.value.blur();
        elemRef.value.removeAttribute('tabindex');
        elemRef.value.style.outline = 'none';
      };
      elemRef.value.onmousedown = onMouseDown;

      const onMouseUp = () => {
        if (!elemRef.value) return;
        elemRef.value.blur();
        elemRef.value.setAttribute('tabindex', '0');
        elemRef.value.style.outline = '';
      };
      elemRef.value.onmouseup = onMouseUp;
      elemRef.value.onmouseleave = onMouseUp;
      stop();
    }
  });
};
