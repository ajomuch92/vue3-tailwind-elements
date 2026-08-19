import { ref } from 'vue';
import type { TeOptions } from '../types';

const options = ref<TeOptions>({});

const useOptions = () => {
  const setOptions = (_options: TeOptions) => {
    options.value = structuredClone(_options);
  };

  return { options, setOptions };
};

export default useOptions;
