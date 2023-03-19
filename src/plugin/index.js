import { plugin } from 'tailwindcss/plugin';
import styles from './styles';
import buttons from './buttons';
import pagination from './pagination';
import inputs from './inputs';
import spinners from './spinners';
import alerts from './alerts';
import toasts from './toasts';

export default plugin(
  ({ addComponents, theme }) => {
    addComponents(styles);
    addComponents(buttons(theme));
    addComponents(pagination(theme));
    addComponents(inputs(theme));
    addComponents(spinners(theme));
    addComponents(alerts(theme));
    addComponents(toasts(theme));
  },
  {}
);