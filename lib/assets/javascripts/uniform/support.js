// Capitalizes all the words and replaces some characters in the string to
// create a nicer looking title. titleize is meant for creating pretty output.
//
// export function titleize(value: string): string
export function titleize(value) {
    return humanize(underscore(value)).replace(/\b('?[a-z])/g, (m) => m.toUpperCase());
}

// Capitalizes the first word and turns underscores into spaces and strips a
// trailing "_id", if any. Like titleize, this is meant for creating pretty
// output.
//
// export function humanize(value: string): string
export function humanize(value) {
    return capitalize(value.toLowerCase()
        .replace(/_id$/, '')
        .replace(/_/g, ' ')
        .replace(/([a-z\d]*)/g, (m) => m.toLowerCase()));
}

// Makes an underscored, lowercase form from the expression in the string.
//
// Changes '.' to '/' to convert namespaces to paths.
//
// Examples:
// 
//     "ActiveModel".underscore         # => "active_model"
//     "ActiveModel.Errors".underscore # => "active_model/errors"
//
// As a rule of thumb you can think of underscore as the inverse of camelize,
// though there are cases where that does not hold:
//
//     "SSLError".underscore().camelize() # => "SslError"
//
// export function underscore(value: string): string
export function underscore(value) {
    let result = value.replace('.', '/');
    result = result.replace(/([A-Z\d]+)([A-Z][a-z])/g, "$1_$2");
    result = result.replace(/([a-z\d])([A-Z])/g, "$1_$2");
    return result.replace('-', '_').toLowerCase();
}

// Converts the first character to uppercase
//
// export function capitalize(value: string): string
export function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}