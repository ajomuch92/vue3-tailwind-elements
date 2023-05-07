import { ref } from "vue";

const options = ref({});

const useOptions = () => {
  const setOptions = (_options) => {
    options.value = structuredClone(_options);
  }

  return {
    options,
    setOptions,
  }
}

export default useOptions;