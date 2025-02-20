import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Convert Prisma object to JS Object
export const convertToPlainObj = <T>(value: T): T => {
    return JSON.parse(JSON.stringify(value))
}

// Format number with decimals
export const formatDecimals = (num: number): string => {
    const [int, decimal] = num.toString().split('.')
    return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`
}

export const formatError = (error: any) => {
    if (error.name === 'ZodError') {
        const fieldErrors = Object.keys(error.errors).map(
            field => error.errors[field].message,
        )
        return fieldErrors.join('. ')
    } else if (
        error.name === 'PrismaClientKnownRequestError' &&
        error.code === 'P2002'
    ) {
        const field = error.meta?.target ? error.meta?.target[0] : 'Field'
        return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
    } else {
        return typeof error.message === 'string'
            ? error.message
            : JSON.stringify(error.message)
    }
}

export const roundPrice = (price: number | string) => {
    switch (typeof price) {
        case 'number':
            return Math.round((price + Number.EPSILON) * 100) / 100
        case 'string':
            return Math.round((Number(price) + Number.EPSILON) * 100) / 100
        default:
            throw new Error('Invalid price ')
    }
}

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-CA', {
    currency: 'CAD',
    style: 'currency',
    minimumFractionDigits: 2,
})

export const formatCurrency = (amount: number | string | null) => {
    switch (typeof amount) {
        case 'number':
            return CURRENCY_FORMATTER.format(amount)
        case 'string':
            return CURRENCY_FORMATTER.format(Number(amount))
        default:
            return 'NaN'
    }
}
