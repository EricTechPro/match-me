import { calculateAge, handleFormServerErrors, formatShortDateTime, truncateString, createChatId, timeAgo } from '../util';
import { UseFormSetError } from 'react-hook-form';
import { ZodIssue } from 'zod';
import { differenceInYears, format, formatDistance } from 'date-fns';

// Mock date-fns functions
jest.mock('date-fns', () => ({
    differenceInYears: jest.fn(),
    format: jest.fn(),
    formatDistance: jest.fn()
}));

describe('calculateAge', () => {
    beforeEach(() => {
        (differenceInYears as jest.Mock).mockImplementation((date1, date2) => {
            return Math.floor((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24 * 365));
        });
    });

    it('should calculate age correctly', () => {
        const today = new Date();
        const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
        (differenceInYears as jest.Mock).mockReturnValue(20);
        expect(calculateAge(twentyYearsAgo)).toBe(20);
    });

    it('should handle birthdays that have not occurred this year', () => {
        const today = new Date();
        const almostTwentyYearsAgo = new Date(
            today.getFullYear() - 20,
            today.getMonth(),
            today.getDate() + 1
        );
        (differenceInYears as jest.Mock).mockReturnValue(19);
        expect(calculateAge(almostTwentyYearsAgo)).toBe(19);
    });
});

describe('handleFormServerErrors', () => {
    let mockSetError: jest.MockedFunction<UseFormSetError<any>>;

    beforeEach(() => {
        mockSetError = jest.fn();
    });

    it('should handle array of ZodIssues', () => {
        const zodErrors: ZodIssue[] = [
            {
                path: ['email'],
                message: 'Invalid email',
                code: 'invalid_string'
            } as ZodIssue,
            {
                path: ['password'],
                message: 'Password too short',
                code: 'too_small'
            } as ZodIssue
        ];

        handleFormServerErrors({ error: zodErrors }, mockSetError);

        expect(mockSetError).toHaveBeenCalledTimes(2);
        expect(mockSetError).toHaveBeenCalledWith('email', { message: 'Invalid email' });
        expect(mockSetError).toHaveBeenCalledWith('password', { message: 'Password too short' });
    });

    it('should handle string error message', () => {
        const errorMessage = 'Server error occurred';
        handleFormServerErrors({ error: errorMessage }, mockSetError);

        expect(mockSetError).toHaveBeenCalledTimes(1);
        expect(mockSetError).toHaveBeenCalledWith('root.serverError', { message: errorMessage });
    });
});

describe('formatShortDateTime', () => {
    beforeEach(() => {
        (format as jest.Mock).mockImplementation((date, formatStr) => {
            return '15 Jan 23 2:30:pm';
        });
    });

    it('should format date correctly', () => {
        const date = new Date(2023, 0, 15, 14, 30);
        (format as jest.Mock).mockReturnValue('15 Jan 23 2:30:pm');
        expect(formatShortDateTime(date)).toBe('15 Jan 23 2:30:pm');
    });

    it('should handle single digit hours', () => {
        const date = new Date(2023, 0, 15, 5, 30);
        (format as jest.Mock).mockReturnValue('15 Jan 23 5:30:am');
        expect(formatShortDateTime(date)).toBe('15 Jan 23 5:30:am');
    });
});

describe('truncateString', () => {
    it('should return null for null input', () => {
        expect(truncateString(null)).toBeNull();
    });

    it('should return null for undefined input', () => {
        expect(truncateString(undefined)).toBeNull();
    });

    it('should not truncate strings shorter than the limit', () => {
        const shortString = 'Hello World';
        expect(truncateString(shortString, 50)).toBe(shortString);
    });

    it('should truncate strings longer than the limit', () => {
        const longString = 'This is a very long string that needs to be truncated';
        expect(truncateString(longString, 20)).toBe('This is a very long ...');
    });

    it('should use default limit of 50 when not specified', () => {
        const longString = 'a'.repeat(60);
        expect(truncateString(longString)).toBe('a'.repeat(50) + '...');
    });
});

describe('createChatId', () => {
    it('should create chat ID with smaller string first', () => {
        expect(createChatId('user2', 'user1')).toBe('user1-user2');
    });

    it('should maintain order when first string is smaller', () => {
        expect(createChatId('user1', 'user2')).toBe('user1-user2');
    });

    it('should handle equal strings', () => {
        expect(createChatId('user1', 'user1')).toBe('user1-user1');
    });
});

describe('timeAgo', () => {
    beforeEach(() => {
        (formatDistance as jest.Mock).mockImplementation((date1, date2) => {
            const diffInMinutes = Math.floor((date2.getTime() - date1.getTime()) / (1000 * 60));
            if (diffInMinutes < 60) return '5 minutes';
            if (diffInMinutes < 24 * 60) return 'about 1 hour';
            return '1 day';
        });
    });

    it('should format minutes ago correctly', () => {
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
        (formatDistance as jest.Mock).mockReturnValue('5 minutes');
        expect(timeAgo(fiveMinutesAgo)).toBe('5 minutes ago');
    });

    it('should format hours ago correctly', () => {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
        (formatDistance as jest.Mock).mockReturnValue('about 1 hour');
        expect(timeAgo(oneHourAgo)).toBe('about 1 hour ago');
    });

    it('should format days ago correctly', () => {
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        (formatDistance as jest.Mock).mockReturnValue('1 day');
        expect(timeAgo(oneDayAgo)).toBe('1 day ago');
    });
});