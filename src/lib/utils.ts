export const stringToBoolean = (value: string) => {
    switch (value.toLowerCase()) {
        case 'true':
            return true;

        case 'false':
            return false;

        default:
            return null;
    }
};

export const formatShortCurrency = ({
    num,
    locale,
    currency,
}: {
    num: number;
    locale: 'en-US' | 'id-ID';
    currency: 'USD' | 'IDR';
}) => {
    return num.toLocaleString(locale, {
        notation: 'compact',
        compactDisplay: 'short',
        currency,
        style: 'currency',
    });
};

export const formatPrice = ({
    price,
    currency = 'USD',
}: {
    price: number;
    currency?: string;
}) => {
    return price?.toLocaleString('en-US', {
        currency,
        style: 'currency',
    });
};

export function kFormatter(num: number): string {
    return Math.abs(num) > 999
        ? Math.sign(num) * Number((Math.abs(num) / 1000).toFixed(1)) + 'K'
        : Math.sign(num) * Math.abs(num) + '';
}
