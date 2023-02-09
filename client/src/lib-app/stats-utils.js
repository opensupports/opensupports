import React from 'react';
import API from 'lib-app/api-call';
import i18n from 'lib-app/i18n';
import StatCard from 'app-components/stat-card';
import { Bar, HorizontalBar } from 'react-chartjs-2';
import date from 'lib-app/date';

export default {
    renderStatistics({showStatCards, showStatsByHours, showStatsByDays, ticketData}) {
        const primaryBlueWithTransparency = (alpha) => `rgba(32, 184, 197, ${alpha})`;
        const ticketsByHoursChartData = {
            labels: Array.from(Array(24).keys()),
            datasets: [
                {
                    label: 'Created Tickets by Hour',
                    backgroundColor: primaryBlueWithTransparency(0.2),
                    borderColor: primaryBlueWithTransparency(1),
                    borderWidth: 1,
                    hoverBackgroundColor: primaryBlueWithTransparency(0.4),
                    hoverBorderColor: primaryBlueWithTransparency(1),
                    data: ticketData.created_by_hour
                }
            ]
        };

        const primaryGreenWithTransparency = (alpha) => `rgba(130, 202, 156, ${alpha})`;
        const ticketsByWeekdayChartData = {
            labels: [
                i18n('MONDAY'),
                i18n('TUESDAY'),
                i18n('WEDNESDAY'),
                i18n('THURSDAY'),
                i18n('FRIDAY'),
                i18n('SATURDAY'),
                i18n('SUNDAY')
            ],
            datasets: [
                {
                    label: 'Created Tickets by Weekday',
                    backgroundColor: primaryGreenWithTransparency(0.2),
                    borderColor: primaryGreenWithTransparency(1),
                    borderWidth: 1,
                    hoverBackgroundColor: primaryGreenWithTransparency(0.4),
                    hoverBorderColor: primaryGreenWithTransparency(1),
                    data: ticketData.created_by_weekday
                }
            ]
        };

        return (
            <div>
                {showStatCards ? this.renderStatCards(ticketData) : null}
                {
                    showStatsByHours ?
                        <Bar options={this.getStatsOptions('y')} data={ticketsByHoursChartData} legend={{onClick: null}} /> :
                        null
                }
                {
                    showStatsByDays ?
                        <HorizontalBar options={this.getStatsOptions('x')} data={ticketsByWeekdayChartData} legend={{onClick: null}} /> :
                        null
                }
            </div>
        );
    },

    getInitialDateRange() {
        let firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);
        firstDayOfMonth.setHours(0);
        firstDayOfMonth.setMinutes(0);
        let todayAtNight = new Date();
        todayAtNight.setHours(23);
        todayAtNight.setMinutes(59);

        return {
            startDate: date.getFullDate(firstDayOfMonth),
            endDate: date.getFullDate(todayAtNight)
        };
    },

    getStatsOptions(axis) {
        return {
            scales: {
                [`${axis}Axes`]: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        };
    },

    getSelectedTagIds(rawForm, tags) {
        return tags.filter(tag => _.includes(rawForm.tags, tag.name)).map(tag => tag.id);
    },

    renderStatCards(ticketData) {
        const {created, open, closed, instant, reopened} = ticketData;

        return (
            <div className="admin-panel-stats__card-list">
                <StatCard label={i18n('CREATED')} description={i18n('CREATED_DESCRIPTION')} value={created} isPercentage={false} />
                <StatCard label={i18n('OPEN')} description={i18n('OPEN_DESCRIPTION')} value={open} isPercentage={false} />
                <StatCard label={i18n('CLOSED')} description={i18n('CLOSED_DESCRIPTION')} value={closed} isPercentage={false} />
                <StatCard label={i18n('INSTANT')} description={i18n('INSTANT_DESCRIPTION')} value={100*instant / closed} isPercentage={true} />
                <StatCard label={i18n('REOPENED')} description={i18n('REOPENED_DESCRIPTION')} value={100*reopened / created} isPercentage={true} />
            </div>
        );
    },

    getDateRangeFromPeriod(periodIndex) {
        let daysInPeriod = 0;
        switch (periodIndex) {
            case 0:
                daysInPeriod = 7;
                break;
            case 1:
                daysInPeriod = 30;
                break;
            case 2:
                daysInPeriod = 90;
                break;
            case 3:
                daysInPeriod = 365;
                break;
        }
        const d = new Date();
        d.setDate(d.getDate() - daysInPeriod);

        const startDate = date.getFullDate(d);
        const endDate = date.getCurrentFullDate();
        return {
            startDate,
            endDate
        };
    },

    retrieveStats({ rawForm, tags, departments}) {
        const { dateRange } = rawForm;
        const dateRangeProp = dateRange && {dateRange: "[" + dateRange.startDate.toString() + "," + dateRange.endDate.toString() + "]"};
        
        return API.call({
            path: '/system/get-stats',
            data: {
                ...dateRangeProp,
                departments: departments ? JSON.stringify(departments) : "[" + rawForm.departments.map(department => department.id) + "]",
                owners: "[" + rawForm.owners.map(owner => owner.id) + "]",
                tags: tags ? "[" + this.getSelectedTagIds(rawForm, tags) + "]" : "[]"
            }
        });
    }
}
