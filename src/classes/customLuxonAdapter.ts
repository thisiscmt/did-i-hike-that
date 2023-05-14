import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime, Info } from 'luxon';

const weekStart = (region: string, language: string) => {
    const regionSat = 'AEAFBHDJDZEGIQIRJOKWLYOMQASDSY'.match(/../g);
    const regionSun =
        'AGARASAUBDBRBSBTBWBZCACNCODMDOETGTGUHKHNIDILINJMJPKEKHKRLAMHMMMOMTMXMZNINPPAPEPHPKPRPTPYSASGSVTHTTTWUMUSVEVIWSYEZAZW'.match(
            /../g
        );
    const languageSat = ['ar', 'arq', 'arz', 'fa'];
    const languageSun =
        'amasbndzengnguhehiidjajvkmknkolomhmlmrmtmyneomorpapssdsmsnsutatethtnurzhzu'.match(
            /../g
        );

    return region
        ? regionSun && regionSun.includes(region)
            ? 'sun'
            : regionSat && regionSat.includes(region)
                ? 'sat'
                : 'mon'
        : languageSun && languageSun.includes(language)
            ? 'sun'
            : languageSat.includes(language)
                ? 'sat'
                : 'mon';
};

const weekStartLocale = (locale: string) => {
    const parts = locale.match(
        /^([a-z]{2,3})(?:-([a-z]{3})(?=$|-))?(?:-([a-z]{4})(?=$|-))?(?:-([a-z]{2}|\d{3})(?=$|-))?/i
    );
    return weekStart((parts && parts[4]) || '', (parts && parts[1]) || '');
};

export class CustomLuxonAdapter extends AdapterLuxon {
    getWeekdays = () => {
        // need to copy the existing, and use Info to preserve localization
        const days = [...Info.weekdaysFormat('narrow', { locale: this.locale })];
        const sundayStart = weekStartLocale(this.locale) === 'sun';
        if (sundayStart) {
            // remove Sun from end of list and move to start of list
            days.unshift(days.pop() || '');
        }
        return days;
    };

    getWeekArray = (date: DateTime) => {
        const sundayStart = weekStartLocale(this.locale) === 'sun';
        const endDate = date
            .endOf('month')
            // if a month ends on sunday, luxon will consider it already the end of the week
            // but we need to get the _entire_ next week to properly lay that out
            // so we add one more day to cover that before getting the end of the week
            .plus({ days: sundayStart ? 1 : 0 })
            .endOf('week');
        const startDate = date
            .startOf('month')
            .startOf('week')
            // must subtract 1, because startOf('week') will be Mon, but we want weeks to start on Sun
            // this is the basis for every day in a our calendar
            .minus({ days: sundayStart ? 1 : 0 });

        const { days } = endDate.diff(startDate, 'days').toObject();

        const weeks: DateTime[][] = [];
        new Array(Math.round(days || 0))
            .fill(0)
            .map((_, i) => i)
            .map((day) => startDate.plus({ days: day }))
            .forEach((v, i) => {
                if (i === 0 || (i % 7 === 0 && i > 6)) {
                    weeks.push([v]);
                    return;
                }

                weeks[weeks.length - 1].push(v);
            });

        // a consequence of all this shifting back/forth 1 day is that you might end up with a week
        // where all the days are actually in the previous or next month.
        // this happens when the first day of the month is Sunday (Dec 2019 or Mar 2020 are examples)
        // or the last day of the month is Sunday (May 2020 or Jan 2021 is one example)
        // so we're only including weeks where ANY day is in the correct month to handle that
        return weeks.filter((w) => w.some((d) => d.month === date.month));
    };
}

