import { format } from 'date-fns';

export default function useDates() {
    function formatDate(date: string) {
        return format(new Date(date), 'PPpp')
    }

    return {formatDate}
}