export default function(emit) {
  const onBlurHandler = (event) => {
    emit('blur', event);
  };

  const onChangeHandler = (event) => {
    emit('change', event);
  };

  const onFocusHandler = (event) => {
    emit('focus', event);
  };

  const onKeyDownHandler = (event) => {
    emit('keydown', event);
  };

  const onKeyPressHandler = (event) => {
    emit('keypress', event);
  };

  const onKeyUpHandler = (event) => {
    emit('keyup', event);
  };
  
  const onClickHandler = (event) => {
    emit('click', event);
  };

  return {
    onBlurHandler,
    onChangeHandler,
    onFocusHandler,
    onKeyDownHandler,
    onKeyPressHandler,
    onKeyUpHandler,
    onClickHandler,
  }
}

