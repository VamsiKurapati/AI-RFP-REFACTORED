import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { bgColor, statusBgMap, statusDotMap } from './constants';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const CalendarComponent = ({ events, onNavigate, date, view, onView }) => {
    const [openDropdownDate, setOpenDropdownDate] = useState(null);

    const CustomEvent = ({ event }) => {
        return (
            <div className="flex items-center gap-1">
                <span className={`inline-block w-2 h-2 rounded-full ${statusDotMap[event.status]}`}></span>
                <span className="text-xs font-medium truncate">{event.title}</span>
            </div>
        );
    };

    const CustomDateCell = ({ value, events: dayEvents }) => {
        const dateKey = moment(value).format('YYYY-MM-DD');
        const sortedEvents = dayEvents.sort((a, b) => {
            const priority = { 'Deadline': 1, 'Submitted': 2, 'In Progress': 3, 'Won': 4, 'Rejected': 5 };
            return (priority[a.status] || 6) - (priority[b.status] || 6);
        });
        const isEmpty = sortedEvents.length === 0;
        const isDropdownOpen = openDropdownDate === dateKey;

        // Check if this is a rightmost cell to prevent dropdown overflow
        const dayOfWeek = moment(value).day();
        const isRightmostCell = dayOfWeek >= 4;

        return (
            <div
                className={`relative h-full w-full min-h-[56px] min-w-[56px] p-1 sm:min-h-[80px] sm:min-w-[80px] sm:p-2 ${isEmpty ? 'bg-[#F3F4F6]' : bgColor[sortedEvents[0]?.status]} border border-[#E5E7EB] flex flex-col justify-start items-start transition`}
                style={{ fontSize: '12px' }}
            >
                <div className="absolute top-1 left-2 text-[18px] text-[#9CA3AF] font-medium">{moment(value).date()}</div>
                {sortedEvents.length > 0 && (
                    <>
                        {/* Show the most important event */}
                        <div className="absolute bottom-6 left-2 mb-1 flex flex-col items-start w-full">
                            <span className="font-medium text-[13px] sm:text-[17px] line-clamp-4 w-full pr-2">{sortedEvents[0].title}</span>
                            <span className={`flex items-center gap-1 mt-1 px-2 py-[2px] rounded-full text-[10px] sm:text-xs font-medium ${statusBgMap[sortedEvents[0].status]}`}>
                                <span className={`inline-block w-2 h-2 rounded-full ${statusDotMap[sortedEvents[0].status]}`}></span>
                                {sortedEvents[0].status}
                            </span>
                        </div>
                        {/* Show "+X more" if more events */}
                        {sortedEvents.length > 1 && (
                            <div
                                className="absolute bottom-1 left-2 text-[10px] sm:text-[11px] text-[#2563EB] cursor-pointer font-medium"
                                onClick={() => setOpenDropdownDate(isDropdownOpen ? null : dateKey)}
                            >
                                {isDropdownOpen ? 'Hide' : `+${sortedEvents.length - 1} more`}
                            </div>
                        )}
                        {/* Dropdown with all events */}
                        {isDropdownOpen && (
                            <div className={`absolute z-[9999] top-0 p-3 w-64 h-full rounded-lg border border-[#E5E7EB] shadow-lg overflow-y-auto custom-scrollbar ${isRightmostCell
                                ? 'right-full mr-2'
                                : 'left-full ml-2'
                                }`}
                                style={{
                                    background: "linear-gradient(135deg, rgb(100, 149, 237) 30%, rgb(147, 112, 219) 100%)"
                                }}>
                                <div className="text-sm font-medium text-white mb-3">All Events for {moment(value).format('MMM DD, YYYY')}</div>
                                {sortedEvents.map((ev, i) => (
                                    <div key={i} className="flex flex-col justify-between items-start mb-3 last:mb-0 p-2 bg-gray-50 rounded custom-scrollbar">
                                        <span className="font-medium text-sm mb-1 break-words">{ev.title}</span>
                                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusBgMap[ev.status]}`}>
                                            <span className={`inline-block w-2 h-2 rounded-full ${statusDotMap[ev.status]}`}></span>
                                            {ev.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-4 mb-6">
            <h2 className="text-xl font-semibold text-[#111827] mb-4">Calendar View</h2>
            <div className="h-[600px]">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    components={{
                        event: CustomEvent,
                        dateCellWrapper: CustomDateCell,
                    }}
                    onNavigate={onNavigate}
                    date={date}
                    view={view}
                    onView={onView}
                    views={['month']}
                    popup
                />
            </div>
        </div>
    );
};

export default CalendarComponent;
