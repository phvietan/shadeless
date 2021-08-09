import dayjs from 'dayjs';
import 'dayjs/locale/vi'; // import locale

dayjs.locale('vi'); // use locale

export function dateToString (d: Date): string {
  return dayjs(d).format('DD-MM-YYYY');
}
