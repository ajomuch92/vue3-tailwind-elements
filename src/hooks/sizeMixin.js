import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

export default function() {
  const sizeType = ref('');
  const xxlBreakpoint = ref(1536);
  const xlBreakpoint = ref(1280);
  const lBreakpoint = ref(1024);
  const mBreakpoint = ref(768);
  const smBreakpoint = ref(640);
  const windowWidth = ref(undefined);
  const windowHeight = ref(undefined);
  const orientation = ref('');

  const inRange = (minValue, maxValue, value) => {
    return minValue <= value && value < maxValue;
  };

  const isMobile = computed(() => ['sm', 'xsm'].includes(sizeType.value));

  const isTablet = computed(() => sizeType.value === 'm');

  const isDesktop = computed(() => ['xxl', 'xl', 'l'].includes(sizeType.value));

  const resizeHandler = () => {
    const { innerWidth, innerHeight } = window;
    windowWidth.value = innerWidth;
    windowHeight.value = innerHeight;
    orientation.value = window.screen.orientation.type.split('-')[0];
    const xxlResult = innerWidth >= xxlBreakpoint.value;
    const xlResult = inRange(xlBreakpoint.value, xxlBreakpoint.value, innerWidth);
    const lResult = inRange(lBreakpoint.value, xlBreakpoint.value, innerWidth);
    const mResult = inRange(mBreakpoint.value, lBreakpoint.value, innerWidth);
    const smResult = inRange(smBreakpoint.value, mBreakpoint.value, innerWidth);
    const xsmResult = innerWidth < smBreakpoint.value;
    if (xxlResult) {
      sizeType.value = 'xxl';
    } else if (xlResult) {
      sizeType.value = 'xl';
    } else if (lResult) {
      sizeType.value = 'l';
    } else if (mResult) {
      sizeType.value = 'm';
    } else if (smResult) {
      sizeType.value = 'sm';
    } else if (xsmResult) {
      sizeType.value = 'xsm';
    }
  }

  onMounted(() => {
    window.addEventListener('resize', resizeHandler);
  });
  
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler);
  });

  return {
    sizeType,
    xxlBreakpoint,
    xlBreakpoint,
    lBreakpoint,
    mBreakpoint,
    smBreakpoint,
    windowWidth,
    windowHeight,
    orientation,
    isMobile,
    isTablet,
    isDesktop,
  };
};
