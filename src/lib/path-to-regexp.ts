// This is path-to-regexp form https://github.com/pillarjs/path-to-regexp
// With small changes to work nicely with the current setup (angular2 and ts)
//
// This is a temporary solution. Adding path-to-regexp as a dependency is ideal.

/**
 * Match matching groups in a regular expression.
 */
const MATCHING_GROUP_REGEXP = /\((?!\?)/g;

/**
 * Normalize the given path string,
 * returning a regular expression.
 *
 * An empty array should be passed,
 * which will contain the placeholder
 * key names. For example "/user/:id" will
 * then contain ["id"].
 *
 * @param  {String|RegExp|Array} path
 * @param  {Array} keys
 * @param  {Object} options
 * @return {RegExp}
 * @api private
 */

export function pathtoRegexp(path: any, keys: any, options: any): any {
    options = options || {};
    keys = keys || [];
    const strict = options.strict;
    const end = options.end !== false;
    const flags = options.sensitive ? '' : 'i';
    let extraOffset = 0;
    const keysOffset = keys.length;
    let i = 0;
    let name = 0;
    let m: any;

    if (path instanceof RegExp) {
        while (m = MATCHING_GROUP_REGEXP.exec(path.source)) {
            keys.push({
                name: name++,
                optional: false,
                offset: m.index
            });
        }

        return path;
    }

    if (Array.isArray(path)) {
        // Map array parts into regexps and return their source. We also pass
        // the same keys and options instance into every generation to get
        // consistent matching groups before we join the sources together.
        path = path.map(function (value: any) {
            return pathtoRegexp(value, keys, options).source;
        });

        return new RegExp('(?:' + path.join('|') + ')', flags);
    }

    path = ('^' + path + (strict ? '' : path[path.length - 1] === '/' ? '?' : '/?'))
        .replace(/\/\(/g, '/(?:')
        .replace(/([\/\.])/g, '\\$1')
        .replace(/(\\\/)?(\\\.)?:(\w+)(\(.*?\))?(\*)?(\?)?/g, function (match, slash, format, key, capture, star, optional, offset) {
            slash = slash || '';
            format = format || '';
            capture = capture || '([^\\/' + format + ']+?)';
            optional = optional || '';

            keys.push({
                name: key,
                optional: !!optional,
                offset: offset + extraOffset
            });

            const result = ''
                + (optional ? '' : slash)
                + '(?:'
                + format + (optional ? slash : '') + capture
                + (star ? '((?:[\\/' + format + '].+?)?)' : '')
                + ')'
                + optional;

            extraOffset += result.length - match.length;

            return result;
        })
        .replace(/\*/g, function (star, index) {
            let len = keys.length

            while (len-- > keysOffset && keys[len].offset > index) {
                keys[len].offset += 3; // Replacement length minus asterisk length.
            }

            return '(.*)';
        });

    // This is a workaround for handling unnamed matching groups.
    while (m = MATCHING_GROUP_REGEXP.exec(path)) {
        let escapeCount = 0;
        let index = m.index;

        while (path.charAt(--index) === '\\') {
            escapeCount++;
        }

        // It's possible to escape the bracket.
        if (escapeCount % 2 === 1) {
            continue;
        }

        if (keysOffset + i === keys.length || keys[keysOffset + i].offset > m.index) {
            keys.splice(keysOffset + i, 0, {
                name: name++, // Unnamed matching groups must be consistently linear.
                optional: false,
                offset: m.index
            });
        }

        i++;
    }

    // If the path is non-ending, match until the end or a slash.
    path += (end ? '$' : (path[path.length - 1] === '/' ? '' : '(?=\\/|$)'));

    return new RegExp(path, flags);
};
